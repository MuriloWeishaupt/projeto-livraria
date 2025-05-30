import express from "express";
import userController from "./controllers/userController.js";
import authorController from "./controllers/authorController.js";
import publisher from "./controllers/publisherController.js";
import category from "./controllers/categoryController.js"
import book from "./controllers/bookController.js"


const route = express();

route.use("/user", userController);
route.use("/author", authorController);
route.use("/publisher", publisher);
route.use("/category", category)
route.use("/book", book)




export default route;