/** Logica de las clases JS **
 * 
 * Clase Persona -> Nos va a servir como un modelo de 
 * datos de la App, va a ser instanseable, es decir, 
 * voy a tener que crear objetos de esta clase Persona
 * 
 * Clase UI -> Nos va a permitir manipular los objetos
 * del documento, es decir, manipular el DOM. Y los 
 * mensajes en la vista, es decir, la parte que el 
 * usuario visualiza (El FrontEnd).
 * 
 * Clase Datos -> Nos va a servir para gestionar el
 * almacenamiento de los libros dentro del localStorage
 * Lo que vamos a hacer es crear un arreglo, el cual va a
 * almacenar datos, luego ese arreglo lo vamos a convertir
 * en datos JSON para luego guardarlos en el localStorage.
 * 
 */

//Definicion de las clases

class Libro {
    constructor(titulo, autor, isbn) {
        this.titulo = titulo;
        this.autor = autor;
        this.isbn = isbn;
    }
}

class UI {
    //Aca queremos usar sus metodos de forma directa
    //por lo tanto indicamos que sean del tipo estatico
    //antes del nombre de la funcion o del metodo
    static mostrarLibros() {
        //consulta a la clase datos y los va a traer de alli
        const libros = Datos.traerLibros();
        //Recorro el arreglo y le envio a la funcion anonima tipo flecha
        //el libro que es un elemento del arreglo y ese elemento del arreglo
        //lo envio como parametro al metodo agregarLibroLista
        libros.forEach((libro) => UI.agregarLibroLista(libro));
    }

    static agregarLibroLista(libro) {
        const lista = document.querySelector('#libro-list');

        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${libro.titulo}</td>
            <td>${libro.autor}</td>
            <td>${libro.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;
        //inserto la fila dentro del documento
        lista.appendChild(fila);
    }

    static eliminarLibro(el) {
        if (el.classList.contains('delete')) {
            //el elemento seria el enlace creado arriba
            //Selecciona el elemento padre del elemento padre del enlace td creado
            //el cual seria la fila completa
            el.parentElement.parentElement.remove();
            //Elimino del localStorage
        }
    }

    //En el parametro className envio la clase de bootstrap
    static mostrarAlerta(mensaje, className) {
        const div = document.createElement('div');
        //Utilizando los `` agregamos la clase en el div
        div.className = `alert alert-${className}`;
        //Al div le agregamos el hijo que seria el mensaje 
        div.appendChild(document.createTextNode(mensaje));

        const container = document.querySelector('.container');
        const form = document.querySelector('#libro-form');
        //Dentro del container va a insertar antes del formulario
        //el objeto div
        container.insertBefore(div, form);
        //Muestro el mensaje y lo elimuno despues de 3 segundos
        setTimeout(() => document.querySelector('.alert').remove(), 1000);
    }

    static limpiarCampos() {
        document.querySelector('#titulo').value = '';
        document.querySelector('#autor').value = '';
        document.querySelector('#isbn').value = '';
    }
}

class Datos {
    //Tambien de tipo static
    //traerLibros va a consultar al localStorage 
    //si existen libros y los va a traer 
    static traerLibros() {
        let libros;
        //Pregunto si existe un item con el nombre libros almacenado
        if (localStorage.getItem('libros') === null) {
            libros = [];
        } else {
            libros = JSON.parse(localStorage.getItem('libros'));
        }
        return libros;
    }

    static agregarLibro(libro) {
        const libros = Datos.traerLibros();
        libros.push(libro);
        localStorage.setItem('libros', JSON.stringify(libros));
    }

    static removerLibro(isbn) {
        const libros = Datos.traerLibros();
        console.log(isbn);

        libros.forEach((libro, index) => {
            if (libro.isbn === isbn) {
                libros.splice(index, 1);
            }
        });
        localStorage.setItem('libros', JSON.stringify(libros));
    }

    //Agrego un metodo que vi en los comentarios
    static existeLibro(isbn) {
        const libros = this.traerLibros();
        let existe = false;
        libros.forEach(libro => {
            if (libro.isbn === isbn) {
                existe = true;
            }
        })
        return existe;
    }
}

//Carga de la pagina
document.addEventListener('DOMContentLoaded', UI.mostrarLibros);

//Evento para agregar libros a la coleccion
//Controla el evento submit
document.querySelector('#libro-form').addEventListener('submit', (e) => {
    e.preventDefault();
    //Obtener los valores de los campos
    const titulo = document.querySelector('#titulo').value;
    const autor = document.querySelector('#autor').value;
    const isbn = document.querySelector('#isbn').value;

    //Valido que los 3 campos esten ingresados
    //Eso significa que si no es asi, no se ingresara ningun libro
    //si alguno de los campos está vacio
    if (titulo === '' || autor === '' || isbn === '') {
        //Para darle un poco de estilo a estos mensajes se pueden usar
        //parametros de los estilos de bootstrap poniendo en UI la clase
        UI.mostrarAlerta('Por favor ingrese todos los datos', 'danger');
    } else if (Datos.existeLibro(isbn)) {
        UI.mostrarAlerta('El ISBN del libro ya existe', 'danger');
    } else {
        const libro = new Libro(titulo, autor, isbn);
        Datos.agregarLibro(libro);
        UI.agregarLibroLista(libro);
        UI.mostrarAlerta('Libro agregado a la colección', 'success');
        UI.limpiarCampos();
    }
});

document.querySelector('#libro-list').addEventListener('click', (e) => {
    UI.eliminarLibro(e.target);
    Datos.removerLibro(e.target.parentElement.previousElementSibling.textContent);
    UI.mostrarAlerta('Libro eliminado', 'success');
});