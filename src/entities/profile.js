import { EntitySchema } from "typeorm";

const profile = new EntitySchema({
    name: "profile",
    tableName: "profiles",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true
        },
        url_photo_profile: {
            type: "varchar",
            length: 255,
            nullable: false
        },
    },
        relations: {
            user: {type: "many-to-many", target: "user", nullable: false},
        },
});

export default profile;