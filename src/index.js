import express from "express";
import { AppDataSource } from "./database/data-source.js";
import cors from "cors";
import routes from "./routes.js";

const server = express();

server.use(cors({ origin: "*" }));
server.use(express.json());

server.use("/", routes);

AppDataSource.initialize().then(() => {
    console.log("Banco de dados conectado com sucesso!");
});

server.listen(3000, () => {
    console.log("Servidor está ok 🐭");
});
