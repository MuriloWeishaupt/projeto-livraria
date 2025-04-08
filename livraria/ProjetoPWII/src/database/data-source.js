import "reflect-metadata";
import { DataSource } from "typeorm";
import user from "../entities/user.js";
import author from "../entities/author.js"

const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    username: "root",
    port: 3306,
    password: "",
    database: "livraria",
    entities: ["src/entities/*.js"], 
    migrations: ["src/database/migrations/*.cjs"],
});

export { AppDataSource };