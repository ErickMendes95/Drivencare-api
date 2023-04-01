import connectionDb from "../config/database.js"

async function create({name, email, password}){
    await connectionDb.query(
        `
            INSERT INTO users (name, email, password)
            VALUES ($1,$2,$3)

        `,
        [name, email, password]
    );
}

async function findByEmail(email){
    await connectionDb.query(
        `
            SELECT * FROM users WHERE email=$1
        `,
        [email]
    );
}

async function findSessionByToken(token){
    await connectionDb.query(
        `
            SELECT * FROM session WHERE token=$1
        `,
        [token]
    );
}

async function findUserById(sessionId){
    await connectionDb.query(
        `
            SELECT * FROM users WHERE "userId"=$1
        `,
        [sessionId]
    );
}

async function searchDoctor(doctor,specialty,city){
    await connectionDb.query(
        `
        SELECT doctor.name, doctor.specialty, doctor.phone, 
            city.name as city, state.name as state, country.name as country
        FROM doctor
        JOIN city 
            ON doctor."cityId" = city.id
        JOIN state 
            ON city."stateId" = state.id
        JOIN country 
            ON state."countryId" = country.id
        WHERE 
                doctor.name = COALESCE($1,doctor.name)
            AND doctor.specialty = COALESCE($2, doctor.specialty)
            AND city.name = COALESCE($3,city.name)
        `,[`%${doctor}%`,specialty,city]
    )
}
export default {
    create,
    findByEmail,
    findSessionByToken,
    findUserById,
    searchDoctor,
}