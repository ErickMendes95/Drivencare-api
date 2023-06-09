import bcrypt from "bcrypt";
import userRepositories from "../repositories/userRepositories";
import {v4 as uuidV4} from "uuid";
import errors from "../errors/index.js"

async function create({name,email,password}){
    const {rowCount} = await userRepositories.findByEmail(email);
    if (rowCount) throw errors.duplicatedEmailError(email);

    const hashPassword = await bcrypt.hash(password,10);
    await userRepositories.create({name, email, password: hashPassword})
}

async function signin({email,password}){
    const {
        rowCount,
        rows: [user],
    } = await userRepositories.findByEmail(email);
    if (!rowCount) throw errors.invalidCredentialsError();

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw errors.invalidCredentialsError();

    const token = uuidV4();
    await userRepositories.createSession({token,userId: user.id});

    return token
}

async function searchDoctor({doctor,specialty,city}){
    const {
        rowCount,
        rows
    } = await userRepositories.findDoctor(doctor, specialty,city);
    if (!rowCount) throw errors.notFoundError();

    return rows
}

export default {
    create,
    signin,
    searchDoctor
}