const cards = document.getElementById('cards');
const items = document.getElementById('items');
const footer = document.getElementById('footer');
const templateCard = document.getElementById('templateCard').content;
const templateCarritoVacio = document.getElementById('template-carrito-vacio');
const templateCarrito = document.getElementById('template-carrito').content;
const templateTotalCarrito = document.getElementById('template-total-carrito').content;
const fragment = document.createDocumentFragment(); //= Creamos un fragmento para guardar informaciones momentaneas de cada vuelta de los productos. Evitando reflow
const btnCarritoSumar = document.getElementById('btn-carrito-sumar');
const btnCarritoRumar = document.getElementById('btn-carrito-restar');

let carrito = {}; //= Creamos un objeto vacio.

//=Ese evento dispara cuando todo el contenido HTML es cargado, accedendo al contenido json
document.addEventListener("DOMContentLoaded", () => {
    fetchData();

    if (localStorage.getItem("carrito")) { //= Consultamos si hay algo en el local starge
        carrito = JSON.parse(localStorage.getItem("carrito")); //= Caso haya, parseamos la inforacion

        imprimirCarrito(); //= Imprimimos el carrito con la info actualizada
    }
})

//= Agregamos a las cards el envento click, pero luego validamos para que solo funcione el evento en el boton.
cards.addEventListener('click', (e) => {
    agregarCarrito(e);
})

//= Agrego evento al contenedor items pero luego valido para que solo funcione en un botones en especifico (sumar y restar)
items.addEventListener('click', (e) => {
    btnCarritoAccion(e);
})

//! FUNCION PARA VALIDAR SI EL EVENTO OCURRIO EN BOTON
const agregarCarrito = (e) => {
    if (e.target.classList.contains('btn-comprar')) { //=si el lugar que el evento fue ejecutado, tiene la clase pasada, se ejecuta el bloque abajo
    infoCarrito(e.target.parentElement); //= Llamamos la funcion que tiene como trabajo pasar todo el elemento padre de donde fue ejecutada.
    Toastify({
        text: "Producto Agregado 🍻",
        duration: 2000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
        background: "linear-gradient(to right, #fdf522, #ffbd52)",
        },
        onClick: function(){} // Callback after click
    }).showToast();
    } //= caso no, se frena el evento
    e.stopPropagation();
}

//! CAPTURACION DE DATOS
//= Esa funcion, accede a la "base de datos" de los productos 
const fetchData = async () => { //= Es una funcion asincrona, espera la consulta en la bas de datos
    try { //= El try tiene el uso parecido con el resolve, ejecuta caso no haya errores
        const response = await fetch('productos.json'); //=LLamamos a la base de datos y guadramos esse acceso en una variable.
        const data = await response.json(); //= Guardamos en una variable la respuesta del servidor con los datos de la base
        mostrarProductoCarrito(data);
    } catch (error) { //=Caso haya algun error en esa consulta de datos, va a ser tirado un error en consola.
        console.log(error) //TODO: manipular ese error
    }
}
//! FIN CAPTURACION DE DATOS


//! FUNCTION PARA MOSTRAR LA GRILLA DE PRODUCTOS EN HTML
const mostrarProductoCarrito = (data) => {
    data.forEach(producto => { //= Para cada vuelta, la variable DATA guarda la info del PRODUCTO imprimiendo el bloque abajo
        templateCard.querySelector('.titulo-producto').textContent = producto.nombre; //= Pasamos el nombre del producto
        templateCard.querySelector('.precio-producto').textContent = producto.precio; //= Pasamos el precio del producto
        templateCard.querySelector('.img-producto').setAttribute('src', producto.img); //= Pasamos el img del producto
        templateCard.querySelector('.btn-comprar').dataset.id = producto.id; //= Agregamos de manera dinamica un id para cada elemento boton. Asi sabemos especificamente cual boton fue apretado y no necesitamos crear un evento click diferente a cada uno de los botones

        //= Clonamos la info del templateCard
        const clone = templateCard.cloneNode(true);
        fragment.appendChild(clone); //= Insertamos esa data en el fragmento creado a principio
    });

        cards.appendChild(fragment); //=Insertamos el fragmento en el contenedor seleccionado
};


//! FUNCION PARA AGARRAR LAS INFORMACIONES DEL PRODUCTO ANTES DE MANDAR AL CARRITO
const infoCarrito = (objeto) => { //.El parametro de la funcion es el objeto recibido desde el evento click (objeto de donde fue clicado)
    const producto = { //= De esa manera, tenemos los productos individualizados, trayendo la informacion requerida abajo. Es una forma de mostrar de manera dinamica. Cada vuelta ejecutada, la informacion es guardada en la variable PRODUCTO.
        id: objeto.querySelector('.btn-comprar').dataset.id, //. Toma el ID del boton que fue apretado
        nombre: objeto.querySelector('.titulo-producto').textContent,
        precio: objeto.querySelector('.precio-producto').textContent,
        cantidad: 1 //.Arranca con 1 unidad
    }
    
    if (carrito.hasOwnProperty(producto.id)) { //= Chequeo si el producto ya esta en el carrito.
        producto.cantidad = carrito[producto.id].cantidad + 1; //= Caso si, accedemos a la cantidad de ese id y sumamos 1
    }  {
        //= Caso de que el producto no este en el carrito, es el objeto producto al carrito, guardamos las informaciones en sus respectivos Ids y si existe, lo reescribimos
        carrito[producto.id] = {...producto};
        imprimirCarrito();
    }
}



//! FUNCION IMPRIMIR ESQUELETO DEL CARRITO
const imprimirCarrito = () => {
    items.innerHTML = ''; //= Limpiamos los items para que a cada click, no tome items anteriores
    Object.values(carrito).forEach(producto => { //= El metpdp Object.values() accede a las keys y valores guardando en un nuevo array. En ese caso, desde el array carrito.
        
        templateCarrito.querySelector('img').setAttribute('src', producto.img)
        templateCarrito.querySelectorAll('td')[0].textContent = producto.nombre;
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad;
        templateCarrito.querySelector('#TemplateCarritoPrecio').textContent = producto.precio;  
        templateCarrito.querySelector('.btn-carrito-sumar').dataset.id = producto.id;
        templateCarrito.querySelector('.btn-carrito-restar').dataset.id = producto.id;
        templateCarrito.querySelector('#valorTotalCarrito').textContent = producto.cantidad * producto.precio;

        const clone = templateCarrito.cloneNode(true); //= Clonamos toda la info del template y guardamos en una variable

        fragment.appendChild(clone); //= Insertamos ese clone en el fragment
    })
        items.appendChild(fragment); //= Insertamos el fragment en el elemento HTML

        localStorage.setItem('carrito',JSON.stringify(carrito)); //= Consulto si tenemos algo guardado en storage

        imprimirTotalCarrito(); //= Mandamos imprimir el total del carrito
}


//! FUNCION IMPRIMIR TOTAL CARRITO (FOOTER)

const imprimirTotalCarrito = () => {
    footer.innerHTML = '';
    if (Object.keys(carrito).length === 0) { //= Si no existe ningun elemento en ese objeto, es decir no el carrito esta vacio, ejecturamos el bloque abajo, volviendo a imprimir el elemento HTML.
        footer.innerHTML = `
                            <th scope="row" colspan="5">Carrito vacio - Estas listo para esa experiencia?
                            </th>`

        return; //= Retornamos para que haya un cierre de la funcion.
    } 
    
    //= De esa manera, puedo acceder a la suma total de productos, contando cuantos valores el objeto carrito carga
    //= Cada vuela, el acumulador suma 1 y guarda su valor en el objeto cantidad.
    const sumaCantidad = Object.values(carrito).reduce((acumulador,{cantidad}) => acumulador +  cantidad, 0); //.Si quiero que me devuelva un entero, uso ,0 si fuera un string ,{0}
    
    //= Hago lo mismo para sumar todos los precios de pantalla. Accedo a los valores de cantidad y precio del objeto carrito ejecuto el bloque
    const sumaPrecio = Object.values(carrito).reduce((acumulador, {cantidad, precio}) => acumulador + precio * cantidad,0);


    //= Seleccionamos el elemento HTML y mandamos info de  la suma de cantidad
    templateTotalCarrito.querySelector('td').textContent = sumaCantidad;

    //= Seleccionamos el elemento HTML y mandamos la suma de precio
    templateTotalCarrito.querySelector('span').textContent = sumaPrecio;
    
    //= Clano la informacion de todo el total de carrito y guardo en una variable.
    const clone = templateTotalCarrito.cloneNode(true);

    fragment.appendChild(clone); //= Inserto el clone en el fragment

    footer.appendChild(fragment); //= Inserto el fragmento en el template footer

    //. Vaciar carrito
    const btnVaciar = document.getElementById('vaciarCarrito'); //= Selecciono el boton y pongo un evento
    btnVaciar.addEventListener('click', () => {

        swal({
            title: "Estas seguro que deseas vaciar el carrito?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                swal("Carrito vacio", {
                icon: "success",
                }),
            carrito = {},
            imprimirCarrito() //= Al hacer click el carrito es borrado y es llamada la funcion para imprimir esqueleto del carrito vacio.
            ;
            } else {
                swal("Su carrito sigue intácto");
                imprimirCarrito();
            }
        });
        imprimirCarrito(); 
    })
}

//! BOTONES DE SUMAR Y RESTAR CARRITO

const btnCarritoAccion = (e) => {
    //.Sumar productos
    if (e.target.classList.contains('btn-carrito-sumar')) { //=Si el click tiene esa clase
        const producto = carrito[e.target.dataset.id] //= Accedemos objeto carrito, buscando por un index vinculado al dataset
        
        producto.cantidad = carrito[e.target.dataset.id].cantidad + 1; //= Recibimos la informacion del carrito .Accedemos a su cantidad. Preguntamos cuanto tiene y sumamos 1.

        carrito[e.target.dataset.id] = {...producto} //= El resultado es una copia del array obj producto.

        imprimirCarrito(); //= Volvemos a mandar imprimir el carrito con las infos actualizadas

        Toastify({
            text: "Producto Agregado 🍻",
            duration: 2000,
            destination: "https://github.com/apvarun/toastify-js",
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
            background: "linear-gradient(to right, #fdf522, #ffbd52)",
            },
            onClick: function(){} // Callback after click
        }).showToast();

    }
   //.Restar productos 
    if (e.target.classList.contains('btn-carrito-restar')) { //= Todo exactamente igual al anterior pero restando una unidad
        const producto = carrito[e.target.dataset.id];
        producto.cantidad = carrito[e.target.dataset.id].cantidad - 1;
        carrito[e.target.dataset.id] = {...producto}

        Toastify({
            text: "Producto Eliminado 👀",
            duration: 2000,
            destination: "https://github.com/apvarun/toastify-js",
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
            background: "linear-gradient(to right, #ffbd52, #fdf522)",
            },
            onClick: function(){} // Callback after click
        }).showToast();

        if (producto.cantidad === 0) { //= Cuando la cantidad de ese ID del producto es 0, el elemento es eliminado del objeto carrito. Eso evita que la cantidad sea negativa.
            delete carrito[e.target.dataset.id];
        }

        imprimirCarrito(); //=Volvemos a imprimir el carrito con las informaciones actualizadas
    }
}




