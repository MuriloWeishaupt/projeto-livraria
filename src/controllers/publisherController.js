import express, { request, response } from "express";
import publisher from "../entities/publisher.js";
import { AppDataSource } from "../database/data-source.js";
import { Like } from "typeorm";

const routes = express.Router();
const publisherRepository = AppDataSource.getRepository(publisher);

routes.get("/", async (request, response) => {
    const publishers = await publisherRepository.find();
    response.status(200).send({"message": publishers})
});

routes.get("/:nameFound", async (request, response) => {
    const {nameFound} = request.params;
    const publisherFound = await publisherRepository.findBy({cnpj:Like(`%${nameFound}%`)})
    return response.status(200).send({"reponse": publisherFound})
});

routes.post("/", async (request,response) =>{

    const {publisher_name, cnpj, email} = request.body;

    if(publisher_name.length < 1){
        return response.status(400).send({"response":"Campo name deve ter pelo menos 1 caractere."});
    }
    if(!email.includes("@") || !email.includes(".") || email.length < 5){
        return response.status(400).send({"response":"Formato de email invalido"});
    }
    if(cnpj.length < 6){
        return response.status(400).send({"response":"Senha deve ter no mínimo 6 caracteres"});
    }
    
    try {
        const newPublisher = publisherRepository.create({publisher_name, email, cnpj, });
        await publisherRepository.save(newPublisher);
    }
    catch(error) {
        return response.status(500).send({"erro": error})
    }
        

    return response.status(201).send({"response":" Editora cadastrada com sucesso"});
    
});

routes.put("/", async (request, response) => {
    const {id, publisher_name, cnpj, email} = request.body;

    if(publisher_name.length < 1){
        return response.status(400).send({"response":"Campo name deve ter pelo menos 1 caractere."});
    }
    if(!email.includes("@") || !email.includes(".") || email.length < 5){
        return response.status(400).send({"response":"Formato de email invalido"});
    }
    if(cnpj.length < 6){
        return response.status(400).send({"response":"Senha deve ter no mínimo 6 caracteres"});
    }

    await publisherRepository.update({id}, {publisher_name, cnpj, email});
    return response.status(201).send({"response": "Editora atualizada com susesso!"})
    

})

export default routes