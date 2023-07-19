const fs = require('fs')

class ProductManager {
    constructor(nombreDeArchivo) {
        this.path = nombreDeArchivo
    }

    async addProduct(product) {
        try {
            const productosPrev = await this.getProduct();
            if(!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock ){
                return "Faltan valores"
            }
            const code = productosPrev.find(elemento => elemento.code === product.code) 
            if(code){
                return "Codigo repetido"
            }
           
           let id
           if (productosPrev.length == 0) {
               id = 1
           } else {
            // productosPrev[productosPrev.length - 1]  = OBTENEMOS EL ULTIMO OBJETO DEL ARRAY
               id = productosPrev[productosPrev.length - 1].id + 1
           }
            productosPrev.push({...product, id})
            await fs.promises.writeFile(this.path, JSON.stringify(productosPrev,null,2))
            return "Se agrego el producto"
        } catch (error) {
            return console.log(error);
        }
    }

    async getProduct() {
        try {
            if (fs.existsSync(this.path)) {
                const infoProducto = await fs.promises.readFile(this.path, 'utf-8')
                return JSON.parse(infoProducto)
            } else {
                return []
            }
        }catch (error) {
            return error
        }
    }

    async getProductById(id){
        try{
        const productosPrev = await this.getProduct();
        const product = productosPrev.find(elemento => elemento.id === id )
        if(product != null){
            return product
        }
        return "No se encontro un producto con el id "+ id
    }
    catch(error)   
        {
            return error
        }
    }

    async deleteProduct(id){
        try {
            const productosPrev = await this.getProduct();
            if(!productosPrev.length){
                return "No hay objetos para borrar"
            }
            const indice = productosPrev.findIndex( elemento => elemento.id === id )
            if(indice != -1){
               productosPrev.splice(indice, 1)
               await fs.promises.writeFile(this.path, JSON.stringify(productosPrev,null,2))
            return "Se borro el objeto"
            }
            return "No existe el objeto para borrar"
        } catch (error) {
            return error
        }

    }

    async updateProduct(id, product){
            try {
                const productosPrev = await this.getProduct();
                const indice = productosPrev.findIndex( elemento => elemento.id === id )
                if(indice === -1){
                    return "Objeto no encontrado"
                }
                
                productosPrev[indice] = {...productosPrev[indice],...product}

                await fs.promises.writeFile(this.path, JSON.stringify(productosPrev,null,2))
                return "Producto modificado"

            } catch (error) {
                return error
            }
    }
}

const producto1 = {
    title: 'Cuaderno',
    description: 'tapa dura 300 hojas',
    price: '500',
    thumbnail: '',
    code:'152',
    stock:'56'
}
const producto2 = {
    title: 'Libreta',
    description: 'Tapa blanda 200 hojas',
    price: '250',
    thumbnail: '1',
    code:'115',
    stock:'86'
}
const producto3 = {
    title: 'Birome Magic',
    description: 'Con borra tinta',
    price: '200',
    thumbnail: '',
    code:'52',
    stock:'306'
}
const mod = {
    title: 'Birome Magic',
    description: 'Con borra tinta',
    price: '200',
    thumbnail: '',
    code:'52',
    stock:'306'
}
async function prueba() {
    const manager = new ProductManager('productos.json')
    console.log(await manager.addProduct(producto2))
    console.log(await manager.addProduct(producto3))
    const productos = await manager.getProduct()
    console.log(productos);
    console.log(await manager.getProductById(5))
    console.log(await manager.deleteProduct(1));
    console.log(await manager.updateProduct(2, mod))
}

prueba()