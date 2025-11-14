import "reflect-metadata";
import { DataSource } from "typeorm";
import user from "../entities/user.js";
import author from "../entities/author.js";
import book from "../entities/book.js";
import publisher from "../entities/publisher.js";
import category from "../entities/category.js";
import profile from "../entities/profile.js";

const AppDataSource = new DataSource({
    type: "mysql",
    host: "interchange.proxy.rlwy.net",
    port: 25588,
    username: "root",
    password: "cryzGzDeaiExwqmtKulTPEuesyUlISyF",
    database: "railway",
    entities: [user, author, book, publisher, category, profile],
    migrations: ["src/database/migrations/*.cjs"],
});

export { AppDataSource };
