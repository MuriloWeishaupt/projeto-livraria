import express, { request, response } from "express";
import user from "../entities/user.js";
import { AppDataSource } from "../database/data-source.js";
import { Timestamp } from "typeorm";
import { Like, IsNull } from 'typeorm'

const routes = express.Router();
const userRepository = AppDataSource.getRepository(user);

routes.get("/",  async (request, response) => {  
    const users = await userRepository.findBy({deleteAt: IsNull()});  
    response.status(200).send({"message": users})
});

routes.get("/:nameFound", async (request, response) => {  
    const {nameFound} = request.params;  
    const userFound = await userRepository.findBy({name:Like(`%${nameFound}%`)})
    return response.status(200).send({"response":userFound})
});



//Adicionar Usuário
routes.post("/", async (request,response) =>{

    const {name, email, password,typeUser} = request.body;

    if(name.length < 1){
        return response.status(400).send({"response":"Campo name deve ter pelo menos 1 caractere."});
    }
    if(!email.includes("@") || !email.includes(".") || email.length < 5){
        return response.status(400).send({"response":"Formato de email invalido"});
    }
    if(password.length < 6){
        return response.status(400).send({"response":"Senha deve ter no mínimo 6 caracteres"});
    }
    if(typeUser !== "admin" && typeUser !== "comum"){
        return response.status(400).send({"response":"O campo deve ser preenchido como 'admin' ou 'comum'"});
    }


    try {
        const newUser = userRepository.create({name, email, password, typeUser});
        await userRepository.save(newUser);
    }
    catch(error) {
        return response.status(500).send({"erro": error})
    }
        

    return response.status(201).send({"response":"Usuário cadastrado com sucesso"});
    
});

//Atualizar usuário
routes.put("/", async (request, response) => {
    const {id, name, email, password, typeUser} = request.body;

    if (typeof id != "number") {
        response.status(400).send({"response": "Campo id deve ser numérico"})
    }


    if(name.length < 1){
        return response.status(400).send({"response":"Campo name deve ter pelo menos 1 caractere."});
    }
    if(!email.includes("@") || !email.includes(".") || email.length < 5){
        return response.status(400).send({"response":"Formato de email invalido"});
    }
    if(password.length < 6){
        return response.status(400).send({"response":"Senha deve ter no mínimo 6 caracteres"});
    }
    if(typeUser !== "admin" && typeUser !== "comum"){
        return response.status(400).send({"response":"O campo deve ser preenchido como 'admin' ou 'comum'"});
    }

    await userRepository.update({id}, {name, email, password, typeUser});
    return response.status(201).send({"response": "Usuário Atualizado com sucesso!"})
})


routes.delete("/:id", async (request, response) => {
    const { id} = request.params;
    if (isNaN(id)) {
        response.status(400).send({"response": "ID não é um valor numérico!"});
    }

    await userRepository.update({id}, {deleteAt: () => "CURRENT_TIMESTAMP"});
    return response.status(200).send({"response": "Usuário excluído com sucesso!"})

})




export default routes;