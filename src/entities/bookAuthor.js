import { EntitySchema } from "typeorm";

const bookAuthor = new EntitySchema({
    name: 'bookAuthor',
    tableName: "bookAuthor",
    columns: {
        authorId: {primary: true, type: Number, generated: true},
        bookId: {primary: true, type: Number, generated: false},
        createdAt: {type: "datetime", nullable: false, default: () => "CURRENT_TIMESTAMP"},
        deletedAt: {type: "datetime", nullable: true}
    },

    relations: {
        author: {type: "many-to-one", target: "author", nullable: false},
        book: {type: "many-to-one", target: "book", nullable: false}
    },
})

export default bookAuthor