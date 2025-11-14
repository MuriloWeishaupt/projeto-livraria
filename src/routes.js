import express from "express";
import userController from "./controllers/userController.js";
import authorController from "./controllers/authorController.js";
import publisher from "./controllers/publisherController.js";
import category from "./controllers/categoryController.js";
import book from "./controllers/bookController.js";
import login from "./controllers/loginController.js";
import upload from "./controllers/uploadController.js";
import { authenticate } from "./utils/jwt.js";

const routes = express.Router();

routes.use("/login", login);
routes.use("/user", userController);
routes.use("/author", authorController);
routes.use("/publisher", publisher);
routes.use("/category", category);
routes.use("/book", book);
routes.use("/user/upload", authenticate, upload);
 
export default routes;
