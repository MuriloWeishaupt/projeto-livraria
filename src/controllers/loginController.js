import express, { request, response } from 'express';
import user from '../entities/user.js';
import { AppDataSource } from '../database/data-source.js';
import { IsNull } from 'typeorm';
import route from '../routes.js';

const routes = express.Router();
const userRepository = AppDataSource.getRepository(user);

routes.post("/", async (request, response) => {
    const {email, password} = request.body;

    if (!email.includes("@")) {
        return response.status(400).send({"response": "O email informado é inválido!" })
    }

    if (password.length < 6) {
        return response.status(400).send({"response": "A senha deve conter pelo menos 6 caracteres."})
    }

    const user = await userRepository.findOneBy({
        email, password, deleteAt: IsNull()
    });

    if (!user) {
        return response.status(401).send({"response": "usuário ou senha inválida"})
    }

    return response.status(200).send({"response:": "Login efetuado com sucesso!"})

    console.log(">>>>>>>>>", user)
})


export default routes;