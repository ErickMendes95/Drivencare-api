import userServices from "../services/userServices"

async function create(req,res,next){
    const {name, email,password} = req.body;
    try {
        await userServices.create({name, email,password});
        return res.sendStatus(201);
    } catch (error) {
        next(error)
    }
}

async function signin(req,res,next){
    const {email,password} = req.body;
    try {
        const token = await userServices.signin({email,password});
        return res.send({token});
    } catch (error) {
        next(error)
    }
}

async function searchDoctor(req,res,next){
    const {doctor,specialty,city} = req.body;

    if(!doctor && !specialty && !city){
        return res.send("Pelo menos um dos parâmetros é obrigatório")
    }

    try {
        const doctors = await userServices.searchDoctor({doctor,specialty,city})
        return res.send({doctors})
    } catch (error) {
        next(error)
    }
}

export default{
    create,
    signin
}