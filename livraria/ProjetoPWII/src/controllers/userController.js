import express, { request, response } from "express";

const routes = express.Router();

routes.get("/", (request, response) => {    
    response.status(200).send("Deu tudo certo!🐭")
});

routes.post("/", (request,response) =>{

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

    return response.status(201).send({"response":"Usuario cadastrado com sucesso"});
    
});

export default routes;