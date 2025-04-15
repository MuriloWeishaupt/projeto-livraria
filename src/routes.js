import express from "express";
import userController from "./controllers/userController.js";

const route = express();

route.use("/user", userController);



export default route;