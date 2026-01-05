const tabla = document.getElementById('tabla-repuestos');
const codigo = document.getElementById('codigo');
const marca = document.getElementById('marca');
const producto = document.getElementById('producto');
const color = document.getElementById('color');
const precioVenta = document.getElementById('precioVenta');
const precioCosto = document.getElementById('precioCosto');
const stock = document.getElementById('stock');
const modalNuevoRepuesto = (document.getElementById('modalNuevoRepuesto'));
const modalNuevoRepuestoInstancia = new bootstrap.Modal(modalNuevoRepuesto);
const modalEliminar = new bootstrap.Modal(document.getElementById('modalEliminar'));
const resultado = document.getElementById('resultado');
const resultadoModal = document.getElementById('resultadoModal');
const inputBuscar = document.getElementById('inputBuscar');
const btnBuscar = document.getElementById('btnBuscar');
const formularioRepuesto = document.getElementById('formulario-nuevo-repuesto');
let repuestoAEliminar = null;
const esNumericoPuro = (str) => /^\d+$/.test(str);

function mostrarRepuestosEnTabla(datos) {
    let cadenaBody = '';
    if (tabla.getElementsByTagName('thead').length === 0) {
        const thead = `<thead>
                    <tr>
                        <th>Código</th>
                        <th>Producto</th>
                        <th>Marca</th>
                        <th>Color</th>
                        <th>Precio Venta</th>
                        <th>Precio Costo</th>
                        <th>Stock</th>
                        <th>Acciones</th>
                    </tr>
                   </thead>`;
        tabla.insertAdjacentHTML('afterbegin', thead);
    }

    if (datos && datos.length > 0) {
        for (let repuesto of datos) {
            cadenaBody += `<tr>
                <td>${repuesto.codigo}</td>
                <td>${repuesto.producto}</td>
                <td>${repuesto.marca}</td>
                <td>${repuesto.color}</td>
                <td>$${repuesto.precioVenta}</td>
                <td>$${repuesto.precioCosto}</td>
                <td>${repuesto.stock}</td>
                <td>
                    <a href="/html/repuesto-editar.html?codigo=${repuesto.codigo}" class="btn btn-outline-primary">Modificar</a>
                    <button class="btn btn-outline-danger" onclick="eliminarRepuesto(${repuesto.codigo})">Eliminar</button>
                </td>
            </tr>`;
        }
    } else {

        cadenaBody += `<tr><td colspan="8" class="text-center">No se encontraron repuestos.</td></tr>`;
    }
    let tbody = tabla.querySelector('tbody');
    if (!tbody) {

        tbody = document.createElement('tbody');
        tabla.appendChild(tbody);
    }
    tbody.innerHTML = cadenaBody;
}

async function cargarRepuestos() {
    try {
        const respuesta = await fetch('http://localhost:8080/html/repuestos');
        const datos = await respuesta.json();
        mostrarRepuestosEnTabla(datos);

    } catch (error) {
        console.error('Error al cargar los repuestos:', error);
        mostrarRepuestosEnTabla([]);
    }
}

cargarRepuestos();


async function buscarRepuesto(evento) {
    if (evento) evento.preventDefault();

    const query = inputBuscar.value.trim();

    if (query === '') {
        cargarRepuestos();
        return;
    }

    const esNumerico = esNumericoPuro(query);
    let urlAPI = '';
    let mensajeAlerta = '';

    if (esNumerico) {
        urlAPI = `http://localhost:8080/html/repuestos/${query}`;
    } else {
        urlAPI = `http://localhost:8080/html/repuestos/buscar/${encodeURIComponent(query)}`;
    }

    try {
        const respuesta = await fetch(urlAPI);

        if (!respuesta.ok) {
            const mensaje = respuesta.status === 404 ?
                `No se encontraron resultados para "${query}".` :
                `Error de conexión: Status ${respuesta.status}`;

            resultado.innerHTML = `<div class="alert alert-info w-50 mx-auto mt-3">${mensaje}</div>`;
            throw new Error(mensaje);
        }

        const data = await respuesta.json();

        const resultados = Array.isArray(data) ? data : (data ? [data] : []);

        if (resultados.length === 0) {
            resultado.innerHTML = `<div class="alert alert-info w-50 mx-auto mt-3">No se encontraron repuestos que coincidan con "${query}".</div>`;
        } else {
            resultado.innerHTML = `<div class="alert alert-info w-50 mx-auto mt-3">Se encontraron ${resultados.length} resultados con "${query}".</div>`;
        }

        mostrarRepuestosEnTabla(resultados);

    } catch (error) {
        if (!mensajeAlerta) {
            mensajeAlerta = `<div class="alert alert-danger w-50 mx-auto mt-3">Error al buscar: ${error.message}</div>`;
        }

        mostrarRepuestosEnTabla([]);
        console.error("Error de búsqueda:", error);
    }
    if (mensajeAlerta) {
        resultado.innerHTML = mensajeAlerta;
    }
    setTimeout(() => {
        if (resultado) {
            resultado.innerHTML = '';
        }
    }, 3000);
}


btnBuscar.addEventListener('click', buscarRepuesto);


inputBuscar.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        buscarRepuesto(e);
    }
});


async function crearRepuesto() {
    modalNuevoRepuestoInstancia.show();
}

document.addEventListener('DOMContentLoaded', () => {
    const boton = document.getElementById('btnNuevoRepuesto');
    if (boton) {
        boton.addEventListener('click', crearRepuesto);
    }
    modalNuevoRepuesto.addEventListener('hidden.bs.modal', function () {
        formularioRepuesto.reset();
    });
});


document.getElementById('btnGuardarRepuesto').addEventListener('click', async (evento) => {
    evento.preventDefault();
    const datos = {
        codigo: (document.getElementById('codigo') || {}).value?.trim() ?? '',
        producto: (document.getElementById('producto') || {}).value?.trim() ?? '',
        marca: (document.getElementById('marca') || {}).value?.trim() ?? '',
        color: (document.getElementById('color') || {}).value?.trim() ?? '',
        precioVenta: (document.getElementById('precioVenta') || {}).value?.trim() ?? '',
        precioCosto: (document.getElementById('precioCosto') || {}).value?.trim() ?? '',
        stock: (document.getElementById('stock') || {}).value?.trim() ?? ''
    };
    try {
        const respuesta = await fetch('http://localhost:8080/html/repuestos/crear', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        if (!respuesta.ok) {
            const mensajeError = await respuesta.text();
            throw new Error(mensajeError);
        }
        resultado.innerHTML = `<div class="alert alert-success w-50 mx-auto mt-3">
                                  Repuesto creado correctamente
                               </div>`;

        document.querySelector('#formulario-nuevo-repuesto').reset();
        modalNuevoRepuestoInstancia.hide();
        cargarRepuestos();

    } catch (error) {
        resultadoModal.innerHTML = `<div class="alert alert-danger w-50 mx-auto mt-3">
                                        Error al crear el repuesto
                                    </div>`;
    }

    setTimeout(() => resultado.innerHTML = '', 3000);
    setTimeout(() => resultadoModal.innerHTML = '', 3000);
});


async function eliminarRepuesto(id) {
    repuestoAEliminar = id;
    modalEliminar.show();
}

document.getElementById('btnConfirmarEliminar').addEventListener('click', async () => {
    if (repuestoAEliminar !== null) {
        const respuesta = await fetch(`http://localhost:8080/html/repuestos/borrar/${repuestoAEliminar}`, {
            method: 'DELETE'
        });

        modalEliminar.hide();

        if (respuesta.ok) {
            resultado.innerHTML = `
            <div class="alert alert-success w-50 mx-auto mt-3">
                Repuesto eliminado correctamente
            </div>`;
            cargarRepuestos();
        } else {
            resultado.innerHTML = `
            <div class="alert alert-danger w-50 mx-auto mt-3">
                Error al eliminar el repuesto
            </div>`;
        }
        setTimeout(() => resultado.innerHTML = '', 3000);
        repuestoAEliminar = null;
    }
});
