const tabla = document.getElementById('tabla-bicicletas');
const cliente = document.getElementById('cliente');
const marca = document.getElementById('marca');
const modelo = document.getElementById('modelo');
const color = document.getElementById('color');
const rodado = document.getElementById('rodado');
const fechaIngreso = document.getElementById('fechaIngreso');
const fechaEgreso = document.getElementById('fechaEgreso');
const modalNuevaBiciElemento = document.getElementById('modalNuevaBici');
const modalNuevaBiciInstancia = new bootstrap.Modal(modalNuevaBiciElemento);
const modalEliminar = new bootstrap.Modal(document.getElementById('modalEliminar'));
const resultado = document.getElementById('resultado');
const resultadoModal = document.getElementById('resultadoModal');
const inputBuscar = document.getElementById('inputBuscar');
const btnBuscar = document.getElementById('btnBuscar');
let bicicletaAEliminar = null;
const esNumericoPuro = (str) => /^\d+$/.test(str);
const formularioBicicleta = document.getElementById('formulario-nueva-bici');
let listasYaCargadas = false; //boolean para evitar la carga repetitiva de las listas en el form


function mostrarBicicletasEnTabla(datos) {
    let cadenaBody = '';
    if (tabla.getElementsByTagName('thead').length === 0) {
        const thead = `<thead>
                    <tr>
                        <th>Id</th>
                        <th>Cliente</th>
                        <th>Marca</th>
                        <th>Modelo</th>
                        <th>Rodado</th>
                        <th>Acciones</th>
                    </tr>
                   </thead>`;
        tabla.insertAdjacentHTML('afterbegin', thead);
    }

    if (datos && datos.length > 0) {
        for (let bicicleta of datos) {
            cadenaBody += `<tr>
                <td>${bicicleta.id}</td>
                <td>${bicicleta.cliente.nombre} ${bicicleta.cliente.apellido}</td>
                <td>${bicicleta.marca}</td>
                <td>${bicicleta.modelo}</td>
                <td>${bicicleta.rodado}</td>
                <td>
                    <a href="/html/bicicleta-editar.html?id=${bicicleta.id}" class="btn btn-outline-primary">Modificar</a>
                    <button class="btn btn-outline-danger" onclick="eliminarBicicleta(${bicicleta.id})">Eliminar</button>
                </td>
            </tr>`;
        }
    } else {

        cadenaBody += `<tr><td colspan="6" class="text-center">No se encontraron bicicletas.</td></tr>`;
    }
    let tbody = tabla.querySelector('tbody');
    if (!tbody) {

        tbody = document.createElement('tbody');
        tabla.appendChild(tbody);
    }
    tbody.innerHTML = cadenaBody;
}


async function cargarBicicletas() {
    try {
        const respuesta = await fetch('http://localhost:8080/html/bicicletas');
        const datos = await respuesta.json();
        mostrarBicicletasEnTabla(datos);

    } catch (error) {
        console.error('Error al cargar las bicicletas:', error);
        mostrarBicicletasEnTabla([]);
    }
}


cargarBicicletas();


async function buscarBicicleta(evento) {
    if (evento) evento.preventDefault();

    const query = inputBuscar.value.trim();

    if (query === '') {
        cargarBicicletas();
        return;
    }

    const esNumerico = esNumericoPuro(query);
    let urlAPI = '';
    let mensajeAlerta = '';

    if (esNumerico) {
        urlAPI = `http://localhost:8080/html/bicicletas/${query}`;
    } else {
        urlAPI = `http://localhost:8080/html/bicicletas/buscar/marca/${encodeURIComponent(query)}`;
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
            resultado.innerHTML = `<div class="alert alert-info w-50 mx-auto mt-3">No se encontraron bicicletas que coincidan con "${query}".</div>`;
        } else {
            resultado.innerHTML = `<div class="alert alert-info w-50 mx-auto mt-3">Se encontraron ${resultados.length} resultados con "${query}".</div>`;
        }

        mostrarBicicletasEnTabla(resultados);

    } catch (error) {
        if (!mensajeAlerta) {
            mensajeAlerta = `<div class="alert alert-danger w-50 mx-auto mt-3">Error al buscar: ${error.message}</div>`;
        }

        mostrarBicicletasEnTabla([]);
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


btnBuscar.addEventListener('click', buscarBicicleta);


inputBuscar.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        buscarBicicleta(e);
    }
});


async function crearBicicleta() {
    modalNuevaBiciInstancia.show();
    if (!listasYaCargadas) {
        cargarClientesSelect();
        cargarRodadosSelect();
        listasYaCargadas=true;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const boton = document.getElementById('btnNuevaBici');
    if (boton) {
        boton.addEventListener('click', crearBicicleta);
    }
    modalNuevaBiciElemento.addEventListener('hidden.bs.modal', function () {
        formularioBicicleta.reset();
    });
});

//función para obtener todos los clientes en el form
async function cargarClientesSelect() {
    try {
        const urlClientes = 'http://localhost:8080/html/clientes';
        const respuesta = await fetch(urlClientes);

        if (!respuesta.ok) {
            throw new Error(`Error en la petición: ${respuesta.status}`);
        }

        const clientes = await respuesta.json();

        clientes.forEach(clienteSelect => {
            const nuevaOpcion = document.createElement('option');
            nuevaOpcion.value = clienteSelect.id;
            nuevaOpcion.textContent = `${clienteSelect.id} - ${clienteSelect.nombre} ${clienteSelect.apellido}`;
            cliente.appendChild(nuevaOpcion);
        });

    } catch (error) {
        console.error('Error al cargar clientes en el select:', error);
        cliente.innerHTML = '<option value="">Error al cargar clientes</option>';
    }
}

//carga los rodados en un select del form de nueva bicicleta
async function cargarRodadosSelect() {
    try {
        const urlRodados = 'http://localhost:8080/html/rodados';
        const respuesta = await fetch(urlRodados);

        if (!respuesta.ok) {
            throw new Error(`Error en la petición: ${respuesta.status}`);
        }

        const rodados = await respuesta.json();

        rodados.forEach(rodadoSelect => {
            const nuevaOpcion = document.createElement('option');
            nuevaOpcion.value = rodadoSelect;
            nuevaOpcion.textContent = `${rodadoSelect}`;
            rodado.appendChild(nuevaOpcion);
        });

    } catch (error) {
        console.error('Error al cargar rodados en el select:', error);
        rodado.innerHTML = '<option value="">Error al cargar rodados</option>';
    }
}


document.getElementById('btnGuardarBicicleta').addEventListener('click', async (evento) => {
    evento.preventDefault();
    const clienteId = document.getElementById('cliente').value;
    const datos = {
        cliente: {
            id: clienteId //de esta forma se recibe solo el id y no el cliente completo, lo cual generaría un error
        },
        marca: (document.getElementById('marca') || {}).value?.trim() ?? '',
        modelo: (document.getElementById('modelo') || {}).value?.trim() ?? '',
        color: (document.getElementById('color') || {}).value?.trim() ?? '',
        rodado: (document.getElementById('rodado')).value,
        fechaIngreso: (document.getElementById('fechaIngreso')).value,
        fechaEgreso: (document.getElementById('fechaEgreso')).value
    };
    try {
        const respuesta = await fetch('http://localhost:8080/html/bicicletas/crear', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        if (!respuesta.ok) {
            const mensajeError = await respuesta.text();
            throw new Error(mensajeError);
        }
        resultado.innerHTML = `<div class="alert alert-success w-50 mx-auto mt-3">
                                  Bicicleta creada correctamente
                               </div>`;

        document.querySelector('#formulario-nueva-bici').reset();
        modalNuevaBiciInstancia.hide();
        cargarBicicletas();

    } catch (error) {
        resultadoModal.innerHTML = `<div class="alert alert-danger w-50 mx-auto mt-3">
                                  Error al crear la bicicleta
                               </div>`;
    }

    setTimeout(() => resultado.innerHTML = '', 3000);
    setTimeout(() => resultadoModal.innerHTML = '', 3000);
});


async function eliminarBicicleta(id) {
    bicicletaAEliminar = id;
    modalEliminar.show();
}

document.getElementById('btnConfirmarEliminar').addEventListener('click', async () => {
    if (bicicletaAEliminar !== null) {
        const respuesta = await fetch(`http://localhost:8080/html/bicicletas/borrar/${bicicletaAEliminar}`, {
            method: 'DELETE'
        });

        modalEliminar.hide();

        if (respuesta.ok) {
            resultado.innerHTML = `
            <div class="alert alert-success w-50 mx-auto mt-3">
                Bicicleta eliminada correctamente
            </div>`;
            cargarBicicletas();
        } else {
            resultado.innerHTML = `
            <div class="alert alert-danger w-50 mx-auto mt-3">
                Error al eliminar la bicicleta
            </div>`;
        }
        setTimeout(() => resultado.innerHTML = '', 3000);
        bicicletaAEliminar = null;
    }
});