import express from "express";
import User from "../entities/user.js";
import { AppDataSource } from "../database/data-source.js";
import {Like, IsNull} from "typeorm";
import {authenticate} from "../utils/jwt.js";

const route = express.Router();
const userRepository = AppDataSource.getRepository(User);

route.get("/",  async (request, response) => {
     const users = await userRepository.findBy({deletedAt: IsNull()});
     return response.status(200).send({"response":users});
});

route.get("/profile", authenticate, async (req, res) => {
    try {
        const userId = req.userId;

        const repo = AppDataSource.getRepository(User);

        const user = await repo.findOne({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        return res.json({
            user,
            profilePhoto: user.profilePhoto || null,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Erro ao buscar perfil." });
    }
});

route.get("/:nameFound", async (request, response) => {
     const {nameFound} = request.params;
     const userFound = await userRepository.findBy({name: Like (`%${nameFound}%`)});
     return response.status(200).send({"response":userFound})
});

route.post("/", async (request, response) => {

   const {name, email, password, typeUser} = request.body;

   if(name.length < 1) {
    return response.status(400).send({"response": "Campo 'name' deve ter pelo menos um caractere."});
   }

   if(!email.includes("@")){
        return response.status(400).send({"response": "Campo 'email' está no padrão incorreto."});
   }

   if(password.length < 6){
        return response.status(400).send({"response": "A senha deve conter pelo menos 6 caracteres."})
   }

   if(typeUser.toLowerCase() != "admin" && typeUser.toLowerCase() != "comum"){
        return response.status(400).send({"response": 'O tipo de usuário deve ser "admin" ou "comum".'})
   }

   try {
     const newUser = userRepository.create({name, email, password, typeUser});
     await userRepository.save(newUser);
     return response.status(201).send({"response":"Usuário cadastrado com sucesso."});
   } catch(err) {
     return response.status(500).send({"response": err});
   }
});

route.put("/", async (request, response) => {
    try {
        const { id, name, email, password, typeUser } = request.body;

        const numericId = Number(id);
        if (isNaN(numericId)) {
            return response.status(400).send({ response: "O campo 'id' precisa ser numérico." });
        }

        if (!name || name.length < 1) {
            return response.status(400).send({ response: "Campo 'name' deve ter pelo menos um caractere." });
        }

        if (!email || !email.includes("@")) {
            return response.status(400).send({ response: "Campo 'email' está no padrão incorreto." });
        }

        if (typeUser.toLowerCase() !== "admin" && typeUser.toLowerCase() !== "comum") {
            return response.status(400).send({ response: 'O tipo de usuário deve ser "admin" ou "comum".' });
        }

        const updateData = { name, email, typeUser };

        if (password && password.length > 0) {
            if (password.length < 6) {
                return response.status(400).send({ response: "A senha deve conter pelo menos 6 caracteres." });
            }
            updateData.password = password;
        }

        await userRepository.update({ id: numericId }, updateData);

        return response.status(200).send({ response: "Usuário atualizado com sucesso." });

    } catch (err) {
        console.log(err);
        return response.status(500).send({ error: "Erro interno ao atualizar o usuário.", details: err });
    }
});

route.delete('/:id', async (request, response) => {
     const {id} = request.params;

     if(isNaN(id)) {
          return response.status(400).send({"response": "O id precisa ser numérico"});
     }

     await userRepository.update({id}, {deletedAt: () => "CURRENT_TIMESTAMP"});

     return response.status(200).send({"response": "Usuário removido com sucesso."});

});





export default route;
