import express from "express";
import User from "../entities/user.js";
import Upload from "../entities/profile.js";
import {AppDataSource} from "../database/data-source.js";
import {IsNull} from "typeorm";
import multer from "multer";
import cloudinary from "../helpers/cloudinary.js";
import fs from "fs";

const route = express.Router();
const userRepository = AppDataSource.getRepository(User);
const uploadRepository = AppDataSource.getRepository(Upload);

const upload = multer({ dest: "./src/upload/" });

route.post("/", upload.single("uploads"), async (request, response) => {
    try {
        if (!request.file) {
            return response.status(400).send({"error": "Imagem não enviada"});
        }

        const user = await userRepository.findOneBy({
            email: request.user.email, 
            deletedAt: IsNull()
        });
        
        if(!user) {
            return response.status(401).send({"response":"Falha no upload. Refaça seu login."});
        }
        
        const result = await cloudinary.uploader.upload(request.file.path);
        const urlUpload = result.secure_url

        const profile = uploadRepository.create({url_photo_profile: urlUpload, user });
        await uploadRepository.save(profile);

        fs.unlinkSync(request.file.path);

        response.send({"response": "Imagem salva com sucesso!", urlUpload});
    } catch (error) {
        console.error(error);
        response.status(500).send({"error": "Erro ao fazer upload para o Cloudinary"});
    }
});

export default route;

