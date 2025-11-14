import express, { request, response } from 'express';
import user from '../entities/user.js';
import { AppDataSource } from '../database/data-source.js';
import { IsNull } from 'typeorm';
import route from '../routes.js';
import { generateToken } from '../utils/jwt.js';
import generateNewPassword from '../utils/login.js';
import nodemailer from "nodemailer";


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
        email, password, deletedAt: IsNull()
    });

    if (!user) {
        return response.status(401).send({"response": "usuário ou senha inválida"})
    }

    const token = generateToken({user: user.name, email: user.email, typeUser: user.typeUser});

    console.log(">>>>>>>>>", user)

    return response.status(200).json({"message": "Login efetuado com sucesso!", token});

    
})


routes.put("/reset", async (request, response) => {
    const {email} = request.body;

    const user = await userRepository.findOneBy({email, deletedAt: IsNull()});

    if (!user) {
        return response.status(400).send({"response": "Email inválido!"})
    }

    const newPassword = generateNewPassword();

    await userRepository.update({email}, {password: newPassword})

    function sendEmail() {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "email com .end",
                pass: "senha com .env"

            }
        })
    }

    return response.status(200).send({"response": "Senha enviada para o email cadastrado"})

})


export default routes;