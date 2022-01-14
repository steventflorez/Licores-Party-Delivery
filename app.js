
const productos = [

    {
        id: 0,
        nombre: "Gin Bombay Sapphire 750 cc",
        precio: 55000,
        img: 1
    },

    {
        id: 1,
        nombre: "Ron Malibu 750cc",
        precio: 35000,
        img: 2
    },

    {
        id: 2,
        nombre: "Bailey's Original Cream 375 cc",
        precio: 40000,
        img: 3
    },

    {
        id: 3,
        nombre: "Aperol 750cc",
        precio: 28000,
        img: 4
    },

    {
        id: 4,
        nombre: "Fernet Branca 750cc",
        precio: 30000,
        img: 5
    },

    {
        id: 5,
        nombre: "Whisky Jonnie Walker 700cc",
        precio: 90000,
        img: 6
    },

    {
        id: 6,
        nombre: "Vodka Smirnof 700 cc",
        precio: 42000,
        img: 7
    },

    {
        id: 7,
        nombre: "Vodka Absolut Original 1400cc",
        precio: 60000,
        img: 8
    },

    {
        id: 8,
        nombre: "Aguardiente Tapa azul 375cc",
        precio: 30000,
        img: 9
    }
];

//cantidad de artivulos para confirmar y agregar al carrito
let cantidadArticulos = {
    subtotal:0,
    precioTotal: 0,
    cantidad: 1
}
//carrito

let carrito = []

class articuloNew{
    constructor(id,nombre, subtotal, total , cantidad){
        this.id = id,
        this.nombre = nombre,
        this.subtotal = subtotal,
        this.total = total,
        this.cantidad = cantidad
    }
}

class UI {

    static recorrerArticulos (articulos){
        
        articulos.forEach((articulo) => this.mostrarArticulos(articulo));
    }

    static mostrarArticulos(articulo){
        const container = document.querySelector('#container_productos');
        const div = document.createElement('div');
        div.className = 'col-lg-4';
        div.innerHTML = `
        <div class="card border-primary mb-3" style="max-width: 20rem;">
            <div class="card-header card-title"> <h5>${articulo.nombre}</h5></div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-6">
                            <img src="/img/pngocean.com (${articulo.img}).png" alt="" style="width: 150px;">
                        </div>
                        <div class="col-6">
                              <div class="text-warning text-center  precio" style="margin-top: 60px; font-size: 30px">$${articulo.precio}</div>
                              <span class="d-none">${articulo.id}</span>
                              <div  style="margin-top: 70px;"><button type="button" class="btn btn-outline-success agregar">Agregar al carrito</button></div>
                        </div>
                    </div>
                </div>
        </div>`;
        container.appendChild(div);
        

    }


    static cargarInformacionModal (id){
        
        if(id.classList.contains('agregar')) {
            const articulo = productos[id.parentElement.previousElementSibling.textContent];
            document.querySelector('#ArticuloCelect').textContent = articulo.nombre;
            cantidadArticulos.subtotal = articulo.precio;
            cantidadArticulos.precioTotal = articulo.precio;
            cantidadArticulos.cantidad = 1;
            document.querySelector('#total').textContent = `$${cantidadArticulos.precioTotal}`;
            document.querySelector('#cantidad').textContent = cantidadArticulos.cantidad;
            Datos.preArticulo(articulo, 1, cantidadArticulos.precioTotal);
            this.showModal()
            
        }
    }
    static recargarInformacionModal(){
        document.querySelector('#total').textContent = `$${cantidadArticulos.precioTotal}` ;
        document.querySelector('#cantidad').textContent =  cantidadArticulos.cantidad;

    }

    static showModal(){
        let ventana = document.querySelector('#ventanaModal');
        ventana.classList.toggle("d-block")
    }


}

class Datos  {
    static total (operacion){
        
        if(operacion){
            cantidadArticulos.cantidad++
            cantidadArticulos.precioTotal = cantidadArticulos.subtotal * cantidadArticulos.cantidad;
            Datos.articuloFinal(cantidadArticulos.cantidad, cantidadArticulos.precioTotal);
           
        }else{
            cantidadArticulos.cantidad--
            cantidadArticulos.precioTotal = cantidadArticulos.subtotal * cantidadArticulos.cantidad;
            Datos.articuloFinal(cantidadArticulos.cantidad, cantidadArticulos.precioTotal);
        }
        UI.recargarInformacionModal()
        if(cantidadArticulos.cantidad == 0 ){
            document.querySelector('#cantidad').textContent = 1;
            UI.showModal()
        }
    }

    static preArticulo(articulo, cantidad , total){
        let pre = new articuloNew(articulo.id, articulo.nombre, articulo.precio, total, cantidad);
        localStorage.setItem('preArticulo', JSON.stringify(pre));
    }
    //aqui preparamos el articulo para ser enviado a la canasta
    static articuloFinal(cantidad , total){
        let preArticulo = JSON.parse(localStorage.getItem('preArticulo'));
        preArticulo.cantidad = cantidad;
        preArticulo.total = total;
        localStorage.setItem('preArticulo', JSON.stringify(preArticulo));
    }

    static buscar (){
        let encontrado = false;
        let preArticulo = JSON.parse(localStorage.getItem('preArticulo'));
        
        if(carrito.length == 0){
            Datos.agregarArticuloCarrito()
            
        }else {
            
            carrito.forEach((articulo, index) =>{
                
                if(articulo.id == preArticulo.id){
                     Datos.modificarArticulo(index);
                     
                     encontrado = true;
                    }  
            })

            if(encontrado == false){
                Datos.agregarArticuloCarrito()
            }
        }
        
    }
    static modificarArticulo(i){
        let preArticulo = JSON.parse(localStorage.getItem('preArticulo'));
        carrito[i].total += preArticulo.total;
        carrito[i].cantidad += preArticulo.cantidad;
        localStorage.setItem('carrito', JSON.stringify(carrito));
        console.log(carrito)
        UI.showModal();
    }

    static agregarArticuloCarrito(){
        let preArticulo = JSON.parse(localStorage.getItem('preArticulo'));
        carrito.push(preArticulo);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        console.log(carrito)
        UI.showModal();
        document.querySelector('#contador').textContent = carrito.length;
    }
}

//ponemos los articulos al iniciar 
document.addEventListener('DOMContentLoaded', UI.recorrerArticulos(productos));

//cargamos la informacion a la ventana de confirmacion con el boton de añadir articulo
document.querySelector('#container_productos').addEventListener('click', (e) => {
    UI.cargarInformacionModal(e.target);
});

//cerramos Modal

document.querySelector('#cerrarModal').addEventListener('click', () => UI.showModal());
document.querySelector('#cloceModal').addEventListener('click', () => UI.showModal());

//sumar y restar cantidad de articulo seleccionado
document.querySelector('#suma').addEventListener('click', () => Datos.total(true));
document.querySelector('#resta').addEventListener('click', () => Datos.total(false));

//confirmar articulo

document.querySelector('#confirmar').addEventListener('click', () => Datos.buscar());
