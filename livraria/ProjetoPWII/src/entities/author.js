import { EntitySchema } from "typeorm";

const author = new EntitySchema({
    name: "Author",
    tableName: "author",
    columns: {
        id: {primary: true, type: "int", generated: "increment"},
        name_author: {type: "varchar", length: 45, nullable: false},
        nasc_author: {type: "datetime"},
        nationality: {type: "varchar", length: 45},
        createAt: {type: "datetime", nullable: false, default: () =>
            "CURRENT_TIMESTAMP"},
        deleteAt: {type: "datetime", nullable: true}   
    }
});

export default author