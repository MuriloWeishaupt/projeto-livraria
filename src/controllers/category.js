import express, { request, response } from "express";
import user from "../entities/user.js";
import { AppDataSource } from "../database/data-source.js";

const routes = express.Router();
const categoryRepository = AppDataSource.getRepository(user);

routes.get("/",  async (request, response) => {  
    const categories = await categoryRepository.find();  
    response.status(200).send({"message": categories})
});

routes.get("/:nameFound", async (request, response) => {  
    const {nameFound} = request.params;  
    const categoryFound = await categoryRepository.findBy({name:Like(`%${categoryFound}%`)})
    return response.status(200).send({"response":categoryFound})
});



routes.post("/", async (request,response) =>{

    const {name, email, password,typeUser} = request.body;

    if(name.length < 1){
        return response.status(400).send({"response":"Campo name deve ter pelo menos 1 caractere."});
    }
    if(!email.includes("@") || !email.includes(".") || email.length < 5){
        return response.status(400).send({"response":"Formato de email invalido"});
    }
  


    try {
        const newUser = categoryRepository.create({name, email, password, typeUser});
        await categoryRepository.save(newUser);
    }
    catch(error) {
        return response.status(500).send({"erro": error})
    }
        

    return response.status(201).send({"response":"Usuário cadastrado com sucesso"});

});

routes.put("/", async (request, response) => {
    const {id, name_category} = request.body;

    if(name_category.length < 1){
        return response.status(400).send({"response":"Campo name deve ter pelo menos 1 caractere."});
    }
    if(!email.includes("@") || !email.includes(".") || email.length < 5){
        return response.status(400).send({"response":"Formato de email invalido"});
    }

    await categoryRepository.update({id}, {name_category});
    return response.status(201).send({"response": "Categoria atualizada com sucesso!"})
    
   

})





export default routes;