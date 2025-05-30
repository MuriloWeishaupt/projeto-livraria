import express, { request, response } from "express";
import category from "../entities/category.js";
import { AppDataSource } from "../database/data-source.js";
import { Timestamp } from "typeorm";
import { Like, IsNull } from 'typeorm'

const routes = express.Router();
const categoryRepository = AppDataSource.getRepository(category);

routes.get("/",  async (request, response) => {  
    const categories = await categoryRepository.findBy({deletedAt: IsNull()});  
    response.status(200).send({"message": categories})
});

routes.get("/:nameFound", async (request, response) => {  
    const {nameFound} = request.params;  
    const categoryFound = await categoryRepository.findBy({name:Like(`%${nameFound}%`)})
    return response.status(200).send({"response":categoryFound})
});



//Adicionar Categoria
routes.post("/", async (request,response) =>{

    const {name_category} = request.body;

    if(name_category.length < 1){
        return response.status(400).send({"response":"Campo name_category deve ter pelo menos 1 caractere."});
    }



    try {
        const newCategory = categoryRepository.create({name_category});
        await categoryRepository.save(newCategory);
    }
    catch(error) {
        return response.status(500).send({"erro": error})
    }
        

    return response.status(201).send({"response":"Categoria cadastrada com sucesso"});
    
});

//Atualizar Categoria
routes.put("/", async (request, response) => {
    const {id, name_category} = request.body;

    if (typeof id != "number") {
        response.status(400).send({"response": "Campo id deve ser numérico"})
    }

    if(name_category.length < 1){
        return response.status(400).send({"response":"Campo name_category deve ter pelo menos 1 caractere."});
    }

    await categoryRepository.update({id}, {name_category});
    return response.status(201).send({"response": "Categoria Atualizada com sucesso!"})
})


routes.delete("/:id", async (request, response) => {
    const { id } = request.params;
    if (isNaN(id)) {
        response.status(400).send({"response": "ID não é um valor numérico!"});
    }

    await categoryRepository.update({id}, {deletedAt: () => "CURRENT_TIMESTAMP"});
    return response.status(200).send({"response": "Categoria excluída com sucesso!"})

})




export default routes;