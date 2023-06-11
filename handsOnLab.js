const fs = require("fs");
const crypto = require("crypto");

class ManagerUser {

    constructor(filename) {
        this.filename = filename;
        this.format = "utf-8";
    }

    createUser = async (name, lastname, age, course, password) => {

        const user = { name, lastname, age, course };

        user.salt = crypto.randomBytes(128).toString("base64");
        user.password = crypto.createHmac('sha256', user.salt).update(password).digest('hex'); // encritpa la password

        const list = await this.getUsers();
        list.push(user);

        await fs.promises.writeFile(this.filename, JSON.stringify(list));

    }

    getUsers = async () => {
        try {
            const data = await fs.promises.readFile(this.filename, { encoding: this.format });
            const dataObj = JSON.parse(data);


            return dataObj;
        } catch (error) {
            console.log("Hubo un error al leer el archivo");
            return [];
        }

    };
};

async function run() {
    const manager = new ManagerUser("users.json");
    await manager.createUser("Jorge", "Rangel", 30, "Node.js");

    console.log(await manager.getUsers())
};

run();