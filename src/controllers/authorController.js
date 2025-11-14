import express, { request, response } from "express";
import author from "../entities/author.js";
import { AppDataSource } from "../database/data-source.js";
import { Like } from "typeorm";

const routes = express.Router();
const authorRepository = AppDataSource.getRepository(author);

routes.get("/", async (request, response) => {
    const authors = await authorRepository.find();
    response.status(200).send({"message": authors})
});

routes.post("/", async (request, response) => {
    const {name_author, nasc_author, nationality} = request.body;

    if (name_author.length < 1) {
        return response.status(400).send({"response": "campo name_author deve ter pelo menos 1 caractere"});
    }

    if (nasc_author.length < 1) {
        return response.status(400).send({"response": "campo nasc_author deve ter pelo menos 1 caractere"});
    }

    if (nationality.length < 1) {
        return response.status(400).send({"response": "campo nationality deve ter pelo menos 1 caractere"});
    }


try {
    const newAuthor = authorRepository.create({name_author, nasc_author, nationality})
    await authorRepository.save(newAuthor);
} catch (error) {
    return response.status(500).send({"erro": error})
}

    return response.status(201).send({"response": "Autor cadastrado com sucesso"});

});

routes.get("/:nameFound", async (request, response) => {  
    const {nameFound} = request.params;  
    const authorFound = await authorRepository.findBy({name_author:Like(`%${nameFound}%`)})
    return response.status(200).send({"response":authorFound})
});



export default routes;