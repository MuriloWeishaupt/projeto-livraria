import express, { request, response } from 'express';
import user from '../entities/user.js';
import { AppDataSource } from '../database/data-source.js';
import { IsNull } from 'typeorm';

const routes = express.Router();
const userRepository = AppDataSource.getRepository(user);

routes.post("/", async (request, response) => {
    const {email, password} = request.body;

    if (!email.includes("@")) {
        return response.status(400).send({"response": "O email informado é inválido!" })
    }
})
