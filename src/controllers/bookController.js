import express from "express";
import Book from "../entities/book.js";
import Category from "../entities/category.js";
import { AppDataSource } from "../database/data-source.js";
import { Like, IsNull } from "typeorm";
import publisher from "../entities/publisher.js";

const route = express.Router();

const bookRepository = AppDataSource.getRepository(Book);
const categoryRepository = AppDataSource.getRepository(Category);
const editorRepository = AppDataSource.getRepository(publisher);


route.post("/", async (request, response) => {
    const { book_name, publication, pages, price, editorId, categoryId } = request.body;

    if (!book_name || book_name.trim().length < 1) {
        return response.status(400).send({ "response": "Campo 'book_name' é obrigatório." });
    }

    try {
        const editor = await editorRepository.findOneBy({
            id: editorId,
            deletedAt: IsNull()
        });

        if (!editor) {
            return response.status(400).send({ "response": "Editora informada não encontrada." });
        }

        const category = await categoryRepository.findOneBy({
            id: categoryId,
            deletedAt: IsNull()
        });

        if (!category) {
            return response.status(400).send({ "response": "Categoria informada não encontrada." });
        }

        const newBook = bookRepository.create({
            book_name,
            publication,
            pages,
            price,
            editor,
            category
        });

        await bookRepository.save(newBook);

        return response.status(201).send({ "response": "Livro cadastrado com sucesso." });

    } catch (err) {
        return response.status(500).send({ "error": err.message });
    }
});


route.put("/", async (request, response) => {
    const { id, book_name, publication, pages, price, categoryId, editorId } = request.body;

    if (!id || isNaN(id)) {
        return response.status(400).send({ "response": "O campo 'id' precisa ser numérico." });
    }

    try {
        const book = await bookRepository.findOne({
            where: { id, deletedAt: IsNull() }
        });

        if (!book) {
            return response.status(404).send({ "response": "Livro não encontrado." });
        }


        let category = book.category;
        if (categoryId) {
            category = await categoryRepository.findOneBy({
                id: categoryId,
                deletedAt: IsNull()
            });
            if (!category) {
                return response.status(400).send({ "response": "Categoria não encontrada." });
            }
        }


        let editor = book.editor;
        if (editorId) {
            editor = await editorRepository.findOneBy({
                id: editorId,
                deletedAt: IsNull()
            });
            if (!editor) {
                return response.status(400).send({ "response": "Editora não encontrada." });
            }
        }

        await bookRepository.update(
            { id },
            {
                book_name,
                publication,
                pages,
                price,
                category,
                editor
            }
        );

        return response.status(200).send({ "response": "Livro atualizado com sucesso." });

    } catch (err) {
        return response.status(500).send({ "error": err.message });
    }
});


route.delete('/:id', async (request, response) => {
    const { id } = request.params;

    if (isNaN(id)) {
        return response.status(400).send({ "response": "O id precisa ser numérico" });
    }

    await bookRepository.update({ id }, { deletedAt: () => "CURRENT_TIMESTAMP" });

    return response.status(200).send({ "response": "Livro removido com sucesso." });
});


route.get("/", async (request, response) => {
    const books = await bookRepository.find({
        where: { deletedAt: IsNull() },
        relations: ["category", "editor"]
    });

    return response.status(200).send({ "response": books });
});

route.get("/:nameFound", async (request, response) => {
    const { nameFound } = request.params;

    const books = await bookRepository.find({
        where: {
            book_name: Like(`%${nameFound}%`),
            deletedAt: IsNull()
        },
        relations: ["category", "editor"]
    });

    return response.status(200).send({ "response": books });
});

export default route;
