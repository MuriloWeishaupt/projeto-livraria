import "reflect-metadata";
import { DataSource } from "typeorm";
import user from "../entities/user.js";
import author from "../entities/author.js";

const AppDataSource = new DataSource({
    type: "mysql",
    host: "interchange.proxy.rlwy.net",
    port: 25588,
    username: "root",
    password: "cryzGzDeaiExwqmtKulTPEuesyUlISyF",
    database: "railway",
    entities: ["src/entities/*.js"],
    migrations: ["src/database/migrations/*.cjs"],
});

export { AppDataSource };
