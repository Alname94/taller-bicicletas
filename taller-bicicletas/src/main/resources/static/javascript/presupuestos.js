const tabla = document.getElementById('tabla-presupuestos');
const numero = document.getElementById('numero');
const fecha = document.getElementById('fecha');
const cliente = document.getElementById('cliente');
const bicicleta = document.getElementById('bicicleta');
const valorTotal = document.getElementById('valorTotal');
const descripcion = document.getElementById('descripcion');
const modalEliminar = new bootstrap.Modal(document.getElementById('modalEliminar'));
const resultado = document.getElementById('resultado');
const inputBuscar = document.getElementById('inputBuscar');
const btnBuscar = document.getElementById('btnBuscar');
let presupuestoAEliminar = null;
const esNumericoPuro = (str) => /^\d+$/.test(str);

function mostrarPresupuestosEnTabla(datos) {
    let cadenaBody = '';
    if (tabla.getElementsByTagName('thead').length === 0) {
        const thead = `<thead>
                    <tr>
                        <th>Número</th>
                        <th>Fecha</th>
                        <th>Cliente</th>
                        <th>Bicicleta</th>
                        <th>Valor Total</th>
                        <th>Acciones</th>
                    </tr>
                   </thead>`;
        tabla.insertAdjacentHTML('afterbegin', thead);
    }

    if (datos && datos.length > 0) {
        for (let presupuesto of datos) {
            cadenaBody += `<tr>
                <td>${presupuesto.numero}</td>
                <td>${presupuesto.fecha}</td>
                <td>${presupuesto.cliente.nombre} ${presupuesto.cliente.apellido}</td>
                <td>${presupuesto.bicicleta.marca} ${presupuesto.bicicleta.modelo}</td>
                <td>$${presupuesto.valorTotal}</td>
                <td>
                    <a href="/html/presupuesto-editar.html?numero=${presupuesto.numero}" class="btn btn-outline-primary">Modificar</a>
                    <button class="btn btn-outline-danger" onclick="eliminarPresupuesto(${presupuesto.numero})">Eliminar</button>
                </td>
            </tr>`;
        }
    } else {

        cadenaBody += `<tr><td colspan="8" class="text-center">No se encontraron presupuestos.</td></tr>`;
    }
    let tbody = tabla.querySelector('tbody');
    if (!tbody) {

        tbody = document.createElement('tbody');
        tabla.appendChild(tbody);
    }
    tbody.innerHTML = cadenaBody;
}

async function cargarPresupuestos() {
    try {
        const respuesta = await fetch('http://localhost:8080/html/presupuestos');
        const datos = await respuesta.json();
        mostrarPresupuestosEnTabla(datos);

    } catch (error) {
        console.error('Error al cargar los presupuestos:', error);
        mostrarPresupuestosEnTabla([]);
    }
}

cargarPresupuestos();


async function buscarPresupuesto(evento) {
    if (evento) evento.preventDefault();

    const query = inputBuscar.value.trim();

    if (query === '') {
        cargarPresupuestos();
        return;
    }

    const esNumerico = esNumericoPuro(query);
    let urlAPI = '';
    let mensajeAlerta = '';

    if (esNumerico) {
        urlAPI = `http://localhost:8080/html/presupuestos/${query}`;
    } else {
        urlAPI = `http://localhost:8080/html/presupuestos/buscar/${encodeURIComponent(query)}`;
    }

    // ejecutamos la petición
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
            resultado.innerHTML = `<div class="alert alert-info w-50 mx-auto mt-3">No se encontraron presupuestos que coincidan con "${query}".</div>`;
        } else {
            resultado.innerHTML = `<div class="alert alert-info w-50 mx-auto mt-3">Se encontraron ${resultados.length} resultados con "${query}".</div>`;
        }

        mostrarPresupuestosEnTabla(resultados);

    } catch (error) {
        if (!mensajeAlerta) {
            mensajeAlerta = `<div class="alert alert-danger w-50 mx-auto mt-3">Error al buscar: ${error.message}</div>`;
        }

        mostrarPresupuestosEnTabla([]);
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


btnBuscar.addEventListener('click', buscarPresupuesto);


inputBuscar.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        buscarPresupuesto(e);
    }
});



async function eliminarPresupuesto(numero) {
    presupuestoAEliminar = numero;
    modalEliminar.show();
}

document.getElementById('btnConfirmarEliminar').addEventListener('click', async () => {
    if (presupuestoAEliminar !== null) {
        const respuesta = await fetch(`http://localhost:8080/html/presupuestos/borrar/${presupuestoAEliminar}`, {
            method: 'DELETE'
        });

        modalEliminar.hide();

        if (respuesta.ok) {
            resultado.innerHTML = `
            <div class="alert alert-success w-50 mx-auto mt-3">
                Repuesto eliminado correctamente
            </div>`;
            cargarPresupuestos();
        } else {
            resultado.innerHTML = `
            <div class="alert alert-danger w-50 mx-auto mt-3">
                Error al eliminar. Puede haber repuestos asociados a este presupuesto.
            </div>`;
        }
        setTimeout(() => resultado.innerHTML = '', 5000);
        presupuestoAEliminar = null;
    }
});
