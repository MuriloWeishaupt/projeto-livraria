import express from "express";
import authorBook from "../entities/bookAuthor.js"; 
import { AppDataSource } from "../database/data-source.js";
import { IsNull } from "typeorm";

const routes = express.Router();
const authorBookRepository = AppDataSource.getRepository(authorBook);


routes.get("/", async (req, res) => {
  try {
    const list = await authorBookRepository.findBy({ deletedAt: IsNull() });
    res.status(200).json({ data: list });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


routes.post("/", async (req, res) => {
  const { authorId, bookId } = req.body;

  if (typeof authorId !== "number" || typeof bookId !== "number") {
    return res.status(400).json({ error: "authorId e bookId devem ser números" });
  }

  try {
    const newRelation = authorBookRepository.create({ authorId, bookId });
    await authorBookRepository.save(newRelation);
    res.status(201).json({ message: "Relação autor-livro criada com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


routes.delete("/:authorId/:bookId", async (req, res) => {
  const { authorId, bookId } = req.params;

  if (isNaN(authorId) || isNaN(bookId)) {
    return res.status(400).json({ error: "IDs devem ser numéricos" });
  }

  try {
    await authorBookRepository.update(
      { authorId: Number(authorId), bookId: Number(bookId) },
      { deletedAt: () => "CURRENT_TIMESTAMP" }
    );
    res.status(200).json({ message: "Relação autor-livro excluída com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default routes;
