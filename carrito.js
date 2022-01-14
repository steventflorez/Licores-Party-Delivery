

let total = 0;


class pedido{
    constructor(nombre, direccion, telefono, resumen){
        this.nombre = nombre,
        this.direccion = direccion,
        this.telefono = telefono,
        this.resumen = resumen
        
    }
}

class Datos{
    static traerCarrito(){
        let carrito ;
        if(localStorage.getItem('carrito') == null){
            carrito = []
        }else{
            carrito = JSON.parse(localStorage.getItem('carrito'));
        }

        return carrito;
    }
    static total(articulo, operacion){
        if(operacion == 'suma'){
            total += articulo.total
        return total
        }else{
            
            
            total -= articulo.total 
            console.log(total)
            return total
        }
        
    }
    static removerArticulos(id){
        const articulos = Datos.traerCarrito();
       
        articulos.forEach((articulo, index) =>{
            
            if(articulo.id == id){
                articulos.splice(index, 1);
                localStorage.setItem('carrito', JSON.stringify(articulo));
                document.querySelector('#total').textContent = `$${Datos.total(articulo, 'resta')}` ;

                
            }

        });

        
        
    }
    static crearPedido(){
        let nombre = document.querySelector('#nombre').value;
        let direccion = document.querySelector('#direccion').value;
        let telefono = document.querySelector('#telefono').value;
        let carrito = JSON.parse(localStorage.getItem('carrito'));
        let orden = new pedido(nombre, direccion, telefono, carrito);
        UI.datosModal(orden);

        

    }
    static reinicio() {
        //localStorage.remove('carrito');
        
    }

    
}

class UI {
    static mostrarCarrito(){
        const carrito = Datos.traerCarrito();
        carrito.forEach((articulo) => UI.agregarArticuloLista(articulo));

    }

    static agregarArticuloLista(articulo){

        const lista = document.querySelector('#carritoList');

        const fila = document.createElement('tr');
        fila.innerHTML = `
        <th scope="row" >${articulo.nombre}</th>
        <td>${articulo.cantidad}</td>
        <td>$${articulo.subtotal}</td>
        <td>$${articulo.total}</td>
        <span class = "d-none">${articulo.id}</span>
        <td><a href="#" > <i class="fa fa fa-trash-o text-danger delete" style="font-size: 24px;"></i></a></td>`;

        lista.appendChild(fila);
        
        document.querySelector('#total').textContent = `$${Datos.total(articulo, 'suma')}` ;

    }
    static eliminarArticulo(e){
        if(e.classList.contains('delete')){
            e.parentElement.parentElement.parentElement.remove();
            
        }
    }

    static showModal(){
        let ventana = document.querySelector('#ventanaModal');
        ventana.classList.toggle("d-block")
    }

    static datosModal(orden){
        document.querySelector('#nombreModal').textContent = orden.nombre;
        document.querySelector('#direccionModal').textContent = orden.direccion;
    }
    
}

//carga de la pagina

document.addEventListener('DOMContentLoaded', UI.mostrarCarrito() );

//remover Articulo

document.querySelector('#carritoList').addEventListener('click', (e)=>{
    console.log(e.target.parentElement.parentElement.previousElementSibling.textContent)
    UI.eliminarArticulo(e.target);
    Datos.removerArticulos(e.target.parentElement.parentElement.previousElementSibling.textContent);
})

//evento de submit

document.querySelector('#userForm').addEventListener('submit', (e)=> {
    
    e.preventDefault();
    UI.showModal();
    Datos.crearPedido();
    Datos.reinicio();
    setTimeout( function(){
        window.location.href = "index.html"
    },5000);
})

