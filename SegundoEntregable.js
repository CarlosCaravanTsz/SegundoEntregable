// Carlos Eduardo Caravantes Reynoso

const fs = require('fs');

class ProductManager {

    #products;
    #path

    // DEFINIMOS CONSTRUCTOR
    constructor(path) {
        this.#products = [];
        this.#path = path;
        this.format = 'utf-8';
    };

    // METODO GET_PRODUCTS
    getProducts = async () => {

        try {

            // Leemos de manera asincrona el archivo, lo parseamos y lo  mostramos
            const products = await fs.promises.readFile(this.#path, { encoding: this.format });
            this.products = JSON.parse(products);
            console.log(this.products);
        }
        catch (error) {
            console.log("Hubo un error al leer el archivo");
        }
    };

    // METODO PARA GENERAR LOS IDs AUTOINCREMENTALES
    getNextId = () => {
        const count = this.#products.length;
        const nextId = (count > 0) ? this.#products[count - 1].id + 1 : 1;
        return nextId
    }


    // METODO PARA AGREGAR PRODUCTOS NUEVOS
    addProduct = async (title, description, price, thumbnail, code, stock) => {

        // Validacion de parametros (completitud)
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            let status = { error: "ERROR: Faltan datos para agregar el producto" };
            console.log(status);
            return status;
        }

        // Validamos que exista el path de manera scinrona para evitar condiciones de carrera
        this.#products = fs.existsSync(this.#path) ? JSON.parse(fs.readFileSync(this.#path, { encoding: this.format })) : [];

        // Validacion x codigo ingresado
        if (this.#products.find(product => product.code === code)) {
            let status = { error: "ERROR: Codigo de producto ya existente" };
            console.log(status);
            return status;
        }

        // Creamos el nuevo producto
        const newProduct = {
            id: this.getNextId(),
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };

        // Agregamos el nuevo producto
        this.#products.push(newProduct);

        // Persistencia del cambio y Log
        fs.promises.writeFile(this.#path, JSON.stringify(this.#products));

        let status = { success: 'Producto agregado con exito' };
        console.log(status);

        return status;

    };

    // METODO PARA RETORNAR UN PRODUCTO POR ID
    getProductById = async (id) => {

        // Lectura del archivo y parsing
        let products = await fs.promises.readFile(this.#path, { encoding: this.format });
        this.#products = JSON.parse(products);

        // Validacion de existencia del producto y retorno si existe
        if (this.#products.find(product => product.id === id)) {
            console.log('Producto encontrado', this.#products.find(product => product.id === id));
        } else console.log({ error: 'Producto no encontrado' });
    };

    // METODO PARA BORRAR UN PRODUCTO X ID
    deleteProduct = async(id) => {

    // Validacion del path y lectura del archivo sincronapara evitar condiciones de carerra 
        this.#products = fs.existsSync(this.#path) ? JSON.parse(fs.readFileSync(this.#path, { encoding: this.format })) : [];

        // Buscamos el index del producto que tenga el id que buscamos
        const idx = this.#products.findIndex(product => product.id === id);

        // Validacion de existencia y eliminado
        if (idx >= 0) {
            this.#products.splice(idx, 1)
        }
        else {
            console.log({ error: 'Error: No existen elementos con ese ID' });
            return { status: 'Error: no existen elementos con ese ID' }
        }

        // Persistencia y Log
        fs.promises.writeFile(this.#path, JSON.stringify(this.#products));

        let status = { status: 'Producto eliminado exitosamente' }
        console.log(status);

    };

    // METODO PARA ACTUALIZAR UN PRODUCTO X ID Y CAMPOS
    updateProduct = async (id, obj) => {

        // Lectura del archivo de manera sincrona para evitar condiciones de carrera
        this.#products = fs.existsSync(this.#path) ? JSON.parse(fs.readFileSync(this.#path, { encoding: this.format })) : [];

        // Obtenemos el id del producto que buscamos
        const idx = this.#products.findIndex(product => product.id === id);

        // Validacion del Id
        if (idx < 0) {
            console.log({ error: 'Error: No existen elementos con ese ID' });
            return { status: 'Error: no existen elementos con ese ID' }
        }

        // Validacion de si los campos del objeto enviado coinciden con los campos de los Productos
        if (!Object.keys(obj).every((key) => Object.keys(this.#products[0]).includes(key))) {
            console.log({ error: 'Los campos a modificar no coinciden con el esquema' });
            return { status: 'Los campos a modificar no coinciden con el esquema' }
        }


        // Actualizacion de los campos
        for (const key of Object.keys(obj)) {
            this.#products[idx][key] = obj[key]
            console.log('PRODUCTO: ', this.#products[idx][key] , '\nOBJ NUEVO: ', obj[key])
        }

        // Persistencia y Log
        fs.promises.writeFile(this.#path, JSON.stringify(this.#products));
        let status = { status: 'Producto actualizado exitosamente' }
        console.log(status);

    }

};




// TESTING: DESCOMENTAR LAS SENTENCIAS PARA PROBAR 1 FEATURE A LA VEZ


// Creando el Product Manager
let manager = new ProductManager('products.txt');


//manager.addProduct('Producto 1', 'Descripcion 1', 200, 'https://cdn3.iconfinder.com/data/icons/education-209/64/bus-vehicle-transport-school-124.png', '001',10);

//manager.getProducts();

//manager.getProductById(2);

//manager.deleteProduct(4)

//manager.updateProduct(2, { thumbnail: 'imagen descarga' })

//manager.updateProduct(3, { title: 'Coca Cola', description: 'Soda de cola', price: 10000, thumbnail: 'coca.png', stock: 1000 });