import { EntitySchema } from "typeorm";

const category = new EntitySchema({
    name: "category",
    tableName: "category",
    columns: {
        id: { primary: true, type: "int", generated: "increment" },

        name_category: { 
            type: "varchar", 
            length: 45, 
            nullable: false 
        },

        createdAt: {
            type: "datetime",
            nullable: false,
            default: () => "CURRENT_TIMESTAMP"
        },

        deletedAt: {
            type: "datetime",
            nullable: true
        }
    }
});

export default category;
