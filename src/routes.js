import express from "express";
import userController from "./controllers/userController.js";
import authorController from "./controllers/authorController.js";
import publisher from "./controllers/publisherController.js";

const route = express();

route.use("/user", userController);
route.use("/author", authorController);
route.use("/publisher", publisher);



export default route;