const tabla = document.getElementById('tabla-clientes');
const nombre = (document.getElementById('nombre') || {}).value?.trim() ?? '';
const apellido = (document.getElementById('apellido') || {}).value?.trim() ?? '';
const telefono = (document.getElementById('telefono') || {}).value?.trim() ?? '';
const email = (document.getElementById('email') || {}).value?.trim() ?? '';
const modalNuevoCliente = new bootstrap.Modal(document.getElementById('modalNuevoCliente'));
const modalEliminar = new bootstrap.Modal(document.getElementById('modalEliminar'));
const resultado = document.getElementById('resultado');
const resultadoModal = document.getElementById('resultadoModal');
const esNumericoPuro = (str) => /^\d+$/.test(str); //verifica si el string contiene solo números
const inputBuscar = document.getElementById('inputBuscar');
const btnBuscar = document.getElementById('btnBuscar');
let clienteAEliminar = null;
document.getElementById("dni").addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, ""); // elimina todo lo que no sea número
});

// Función para renderizar la tabla, para luego cargarle todos los clientes o los resultados de la búsqueda
function mostrarClientesEnTabla(datos) {
    let cadenaBody = ''; //variable para el contenido del tbody

    // Primero, construye el encabezado (<thead>) de la tabla
    // Si la tabla está vacía, se crea el encabezado. Si no, solo el body.
    if (tabla.getElementsByTagName('thead').length === 0) {
        const thead = `<thead>
                    <tr>
                        <th>Id</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Dni</th>
                        <th>Acciones</th>
                    </tr>
                   </thead>`;
        tabla.insertAdjacentHTML('afterbegin', thead); // se inserta el thead antes de cualquier contenido existente
    }
    //los datos de la petición fetch, recibidos como parámetro
    if (datos && datos.length > 0) {
        for (let cliente of datos) {
            cadenaBody += `<tr>
                <td>${cliente.id}</td>
                <td>${cliente.nombre}</td>
                <td>${cliente.apellido}</td>
                <td>${cliente.dni}</td>
                <td>
                    <a href="/html/cliente-editar.html?id=${cliente.id}" class="btn btn-outline-primary">Modificar</a>
                    <button class="btn btn-outline-danger" onclick="eliminarCliente(${cliente.id})">Eliminar</button>
                </td>
            </tr>`;
        }
    } else {
        // Mensaje si la tabla está vacía (ej. después de una búsqueda fallida)
        cadenaBody += `<tr><td colspan="5" class="text-center">No se encontraron clientes.</td></tr>`;
    }
    let tbody = tabla.querySelector('tbody');
    if (!tbody) {
        // Si no existe, lo creamos y con appendChild se adjunta a la tabla
        tbody = document.createElement('tbody');
        tabla.appendChild(tbody);
    }
    tbody.innerHTML = cadenaBody; //reemplazamos el contenido del tbody por los datos obtenidos
}

// ***
async function cargarClientes() {
    try {
        const respuesta = await fetch('http://localhost:8080/html/clientes');
        const datos = await respuesta.json();

        // Llamamos a la función de renderizado con todos los datos
        mostrarClientesEnTabla(datos);

    } catch (error) {
        console.error('Error al cargar los clientes:', error);
        mostrarClientesEnTabla([]); // Muestra tabla vacía en caso de error
    }
}

//  *Llamada inicial para cargar la tabla*
cargarClientes();


async function buscarCliente(evento) {
    if (evento) evento.preventDefault();

    const query = inputBuscar.value.trim();

    if (query === '') {
        // Si la búsqueda está vacía, idealmente vuelve a cargar todos los clientes
        cargarClientes();
        return;
    }

    const esNumerico = esNumericoPuro(query);
    let urlAPI = ''; //variable que contendrá alguno de los endpoint
    let mensajeAlerta = ''; // Variable para almacenar el mensaje

    //determinamos el endpoint a llamar
    if (esNumerico) {
        if (query.length === 8) {
            urlAPI = `http://localhost:8080/html/clientes/buscar/dni/${query}`;
        } else {
            // Intentamos por ID. Si ID falla, el servidor devolverá 404, y JS lo manejará.
            urlAPI = `http://localhost:8080/html/clientes/${query}`;
        }
    } else {
        // Búsqueda por Nombre (Containing)
        urlAPI = `http://localhost:8080/html/clientes/buscar/nombre/${encodeURIComponent(query)}`;
    }

    // ejecutamos la petición
    try {
        const respuesta = await fetch(urlAPI);

        // Si el servidor responde con 404 o cualquier otro error
        if (!respuesta.ok) {
            // Leemos el JSON (si el backend lo envía) o solo el status
            const mensaje = respuesta.status === 404 ?
                `No se encontraron resultados para "${query}".` :
                `Error de conexión: Status ${respuesta.status}`;

            resultado.innerHTML = `<div class="alert alert-info w-50 mx-auto mt-3">${mensaje}</div>`;
            throw new Error(mensaje); // Lanzamos un error controlado para el catch
        }

        const data = await respuesta.json();

        // Normalizamos la data a un array, ya que ID/DNI devuelven un objeto y Nombre un array
        const resultados = Array.isArray(data) ? data : (data ? [data] : []);

        if (resultados.length === 0) {
            resultado.innerHTML = `<div class="alert alert-info w-50 mx-auto mt-3">No se encontraron clientes que coincidan con "${query}".</div>`;
        }else {
            resultado.innerHTML = `<div class="alert alert-info w-50 mx-auto mt-3">Se encontraron ${resultados.length} resultados con "${query}".</div>`;
        }

        // Renderizar los resultados en la misma tabla
        mostrarClientesEnTabla(resultados);

    } catch (error) {
        // Este catch captura errores de red Y el error que lanzamos en el if (!respuesta.ok)
        if (!mensajeAlerta) { // Si ya se definió un mensaje de alerta (404), no lo sobrescribimos con el error genérico
            mensajeAlerta = `<div class="alert alert-danger w-50 mx-auto mt-3">Error al buscar: ${error.message}</div>`;
        }
        
        mostrarClientesEnTabla([]);
        console.error("Error de búsqueda:", error);
    }
    if (mensajeAlerta) {
        // Establecemos el mensaje de alerta (sea éxito, no encontrado, o error)
        resultado.innerHTML = mensajeAlerta;
    }    
    setTimeout(() => {
        // Verifica que el elemento exista antes de intentar modificarlo
        if (resultado) {
            resultado.innerHTML = '';
        }
    }, 3000);
}

//agregamos la función para buscar al botón buscar
btnBuscar.addEventListener('click', buscarCliente);

//si queremos realizar la búsqueda presionando "enter"
inputBuscar.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        buscarCliente(e);
    }
});



// Función y evento para mostrar el modal con el form para crear un cliente
async function crearCliente() {
    modalNuevoCliente.show();
}

document.addEventListener('DOMContentLoaded', () => {
    const boton = document.getElementById('btnNuevoCliente');
    if (boton) {
        boton.addEventListener('click', crearCliente);
    }
});



//Evento para confirmar la creación del cliente
document.getElementById('btnGuardarCliente').addEventListener('click', async (evento) => {
    evento.preventDefault();
    const datos = {
        nombre: (document.getElementById('nombre') || {}).value?.trim() ?? '',
        apellido: (document.getElementById('apellido') || {}).value?.trim() ?? '',
        dni: (document.getElementById('dni') || {}).value,
        telefono: (document.getElementById('telefono') || {}).value?.trim() ?? '',
        email: (document.getElementById('email') || {}).value?.trim() ?? ''
    };
    try {
        const respuesta = await fetch('http://localhost:8080/html/clientes/crear', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        if (!respuesta.ok) {
            const mensajeError = await respuesta.text();
            throw new Error(mensajeError);
        }
        resultado.innerHTML = `<div class="alert alert-success w-50 mx-auto mt-3">
                                  Cliente creado correctamente
                               </div>`;

        document.querySelector('#formulario-nuevo-cliente').reset();
        modalNuevoCliente.hide();
        cargarClientes();

    } catch (error) {
        resultadoModal.innerHTML = `<div class="alert alert-danger w-50 mx-auto mt-3">
                                  ${error.message}
                               </div>`;
    }

    setTimeout(() => resultado.innerHTML = '', 3000);
    setTimeout(() => resultadoModal.innerHTML = '', 3000);
});


// Función y evento para eliminar un cliente
async function eliminarCliente(id) {
    clienteAEliminar = id;
    modalEliminar.show();
}

document.getElementById('btnConfirmarEliminar').addEventListener('click', async () => {
    if (clienteAEliminar !== null) {
        const respuesta = await fetch(`http://localhost:8080/html/clientes/borrar/${clienteAEliminar}`, {
            method: 'DELETE'
        });

        modalEliminar.hide();

        if (respuesta.ok) {
            resultado.innerHTML = `
            <div class="alert alert-success w-50 mx-auto mt-3">
                Cliente eliminado correctamente
            </div>`;
            cargarClientes();
        } else {
            resultado.innerHTML = `
            <div class="alert alert-danger w-50 mx-auto mt-3">
                Error al eliminar el cliente
            </div>`;
        }
        setTimeout(() => resultado.innerHTML = '', 3000);
        clienteAEliminar = null;
    }
});