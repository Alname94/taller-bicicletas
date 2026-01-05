const formulario = document.getElementById("formulario-nuevo-presupuesto");
const fecha = document.getElementById('fecha');
const cliente = document.getElementById('cliente');
const bicicleta = document.getElementById('bicicleta');
const valorTotal = document.getElementById('valorTotal');
const descripcion = document.getElementById('descripcion');
const resultado = document.getElementById('resultado');
const inputBuscar = document.getElementById('inputBuscar');
const btnBuscar = document.getElementById('btnBuscar');
const repuestosTabla = document.getElementById('tabla-repuestos');
const repuestosAgregados = document.getElementById('tabla-repuestos-agregados');
const btnCrearPresupuesto = document.getElementById('btnCrearPresupuesto');
const esNumericoPuro = (str) => /^\d+$/.test(str);

function mostrarRepuestosEnTabla(datos) {
    let cadenaBody = '';
    if (repuestosTabla.getElementsByTagName('thead').length === 0) {
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
        repuestosTabla.insertAdjacentHTML('afterbegin', thead);
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
                    <div class="input-group">
                        <input type="number" id="cantidad-${repuesto.codigo}" class="form-control" 
                            value="1" min="1" max="${repuesto.stock}" style="max-width: 80px;">
                        <button class="btn btn-outline-success" 
                            onclick="agregarRepuesto(${repuesto.codigo})">
                            <i class="fas fa-plus"></i> Agregar
                        </button>
                </div>
                </td>
            </tr>`;
        }
    } else {

        cadenaBody += `<tr><td colspan="8" class="text-center">No se encontraron repuestos.</td></tr>`;
    }
    let tbody = repuestosTabla.querySelector('tbody');
    if (!tbody) {

        tbody = document.createElement('tbody');
        repuestosTabla.appendChild(tbody);
    }
    tbody.innerHTML = cadenaBody;
}


async function cargarRepuestos() {
    try {
        const respuesta = await axios.get('http://localhost:8080/html/repuestos');
        const datos = respuesta.data;
        mostrarRepuestosEnTabla(datos);

    } catch (error) {
        console.error('Error al cargar los repuestos:', error);
        mostrarRepuestosEnTabla([]);
    }
}



function mostrarRepuestosAgregados(datos) {
    let cadenaBody = '';
    if (repuestosAgregados.getElementsByTagName('thead').length === 0) {
        const thead = `<thead>
                    <tr>
                        <th>Código</th>
                        <th>Producto</th>
                        <th>Marca</th>
                        <th>Color</th>
                        <th>Precio Venta</th>
                        <th>Cantidad</th>
                        <th>Acciones</th>
                    </tr>
                   </thead>`;
        repuestosAgregados.insertAdjacentHTML('afterbegin', thead);
    }

    if (datos && datos.length > 0) {
        for (let repuestoAgregado of datos) {
            cadenaBody += `<tr>
                <td>${repuestoAgregado.id.repuestoCodigo}</td>
                <td>${repuestoAgregado.repuesto.producto}</td>
                <td>${repuestoAgregado.repuesto.marca}</td>
                <td>${repuestoAgregado.repuesto.color}</td>
                <td>$${repuestoAgregado.repuesto.precioVenta}</td>
                <td>${repuestoAgregado.cantidadAgregada}</td>
                <td>
                    <button class="btn btn-outline-danger" onclick="quitarRepuesto(${repuestoAgregado.id.repuestoCodigo})">Eliminar</button>
                </td>
            </tr>`;
        }
    } else {

        cadenaBody += `<tr><td colspan="8" class="text-center">No hay repuestos agregados.</td></tr>`;
    }
    let tbody = repuestosAgregados.querySelector('tbody');
    if (!tbody) {

        tbody = document.createElement('tbody');
        repuestosAgregados.appendChild(tbody);
    }
    tbody.innerHTML = cadenaBody;
}

async function cargarRepuestosAgregados(presupuestoNumero) {
    try {
        const respuesta = await axios.get(`http://localhost:8080/html/detalles/buscar/${presupuestoNumero}`);
        const datos = respuesta.data;
        mostrarRepuestosAgregados(datos);

    } catch (error) {
        console.error('Error al cargar los repuestos:', error);
        mostrarRepuestosAgregados([]);
    }
}



document.getElementById('btnCrearPresupuesto').addEventListener('click', async (evento) => {
    evento.preventDefault();
    const clienteId = document.getElementById('cliente').value;
    const bicicletaId = document.getElementById('bicicleta').value;
    const datos = {
        fecha: (document.getElementById('fecha') || {}).value?.trim() ?? '',
        cliente: {
            id: clienteId
        },
        bicicleta: {
            id: bicicletaId
        },
        valorTotal: (document.getElementById('valorTotal') || {}).value?.trim() ?? '',
        descripcion: (document.getElementById('descripcion') || {}).value?.trim() ?? ''
    };
    try {
        const respuesta = await fetch('http://localhost:8080/html/presupuestos/crear', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        if (!respuesta.ok) {
            const mensajeError = await respuesta.text();
            throw new Error(mensajeError);
        }

        const presupuestoCreado = await respuesta.json();
        const presupuestoNumero = presupuestoCreado.numero;

        // Guardar el ID en una variable global o campo oculto
        window.currentPresupuesto = presupuestoNumero;
        console.log('Presupuesto creado. N°:', presupuestoNumero);

        resultado.innerHTML = `<div class="alert alert-success w-50 mx-auto mt-3">
                                  Presupuesto N° ${presupuestoNumero} creado correctamente.
                               </div>`;

        cargarRepuestosAgregados(presupuestoNumero);
        cargarRepuestos();

    } catch (error) {
        resultado.innerHTML = `<div class="alert alert-danger w-50 mx-auto mt-3">
                                  ${error.message}
                                </div>`;
    }

    setTimeout(() => resultado.innerHTML = '', 4000);
});


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
};

cargarClientesSelect();

//solo obtiene las bicicletas asociadas al cliente seleccionado previamente
//para evitar inconsistencias 
async function cargarBicicletasSelect(clienteId) {
    try {
        const urlBicicletas = `http://localhost:8080/html/bicicletas/buscar/cliente/${clienteId}`;
        const respuesta = await fetch(urlBicicletas);

        if (!respuesta.ok) {
            throw new Error(`Error en la petición: ${respuesta.status}`);
        }

        bicicleta.innerHTML = '';

        const bicicletas = await respuesta.json();

        bicicletas.forEach(bicicletaSelect => {
            const nuevaOpcion = document.createElement('option');
            nuevaOpcion.value = bicicletaSelect.id;
            nuevaOpcion.textContent = `${bicicletaSelect.id} - ${bicicletaSelect.marca} ${bicicletaSelect.modelo}`;
            bicicleta.appendChild(nuevaOpcion);
        });

    } catch (error) {
        console.error('Error al cargar clientes en el select:', error);
        bicicleta.innerHTML = '<option value="">Error al cargar bicicletas</option>';
    }
};

//acá cargamos la lista de bicicletas luego de seleccionar el cliente
cliente.addEventListener('change', (e) => {
    const clienteSeleccionado = e.target.value;
    if (clienteSeleccionado) {
        cargarBicicletasSelect(clienteSeleccionado);
    } else {
        bicicleta.innerHTML = '<option value="">Seleccione primero un cliente</option>';
    }
});


async function agregarRepuesto(repuestoCodigo) {
    const presupuesto = window.currentPresupuesto; //el número de presupuesto asociado a la variable global
    const inputCantidad = document.getElementById(`cantidad-${repuestoCodigo}`);
    const cantidad = parseInt(inputCantidad?.value, 10); //el ? garantiza que se intente acceder a .value solo si inputCantidad existe. El 10 indica base decimal para hacer la conversión
    const resultado = document.getElementById('resultado');

    if (!presupuesto) {
        console.error('ERROR: No hay un presupuesto activo (ID no definido).');
        resultado.innerHTML = `<div class="alert alert-danger w-50 mx-auto mt-3">
                                 Debe crear un presupuesto primero.
                               </div>`;
        return;
    }

    if (isNaN(cantidad) || cantidad <= 0) {
        resultado.innerHTML = `<div class="alert alert-warning w-50 mx-auto mt-3">
                                 Ingrese una cantidad válida.
                               </div>`;
        return;
    }

    //Preparar los datos del Detalle
    const datosDetalle = {
        id:{
            presupuestoNumero: presupuesto,
            repuestoCodigo: repuestoCodigo
        },
        cantidadAgregada: cantidad
    };

    try {
        //Petición POST para crear el Detalle
        const respuesta = await fetch('http://localhost:8080/html/detalles/crear', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosDetalle)
        });

        if (!respuesta.ok) {
            const mensajeError = await respuesta.text();
            throw new Error(mensajeError || 'Error al agregar el repuesto al presupuesto.');
        }

        resultado.innerHTML = `<div class="alert alert-success w-50 mx-auto mt-3">
                                 Repuesto ${repuestoCodigo} agregado correctamente.
                               </div>`;

        // Recargamos la lista con el ID del presupuesto para ver el detalle(repuesto) recién agregado
        cargarRepuestosAgregados(presupuesto);

    } catch (error) {
        console.error('Error al crear el detalle:', error);
        resultado.innerHTML = `<div class="alert alert-danger w-50 mx-auto mt-3">
                                 ${error.message}
                               </div>`;
    }

    setTimeout(() => resultado.innerHTML = '', 3000);
};


async function quitarRepuesto(repuestoCodigo) {
    // Obtenemos el ID del presupuesto activo
    const presupuestoNumero = window.currentPresupuesto;
    const resultado = document.getElementById('resultado');

    if (!presupuestoNumero) {
        console.error('ERROR: No hay un presupuesto activo para eliminar el repuesto.');
        resultado.innerHTML = `<div class="alert alert-danger w-50 mx-auto mt-3">
                                 Debe crear un presupuesto antes de eliminar repuestos.
                               </div>`;
        setTimeout(() => resultado.innerHTML = '', 3000);
        return;
    }

    try {
        //Construir la URL con ambos PathVariables
        const url = `http://localhost:8080/html/detalles/borrar/${presupuestoNumero}/${repuestoCodigo}`;
        
        console.log(`Intentando eliminar detalle: Presupuesto N° ${presupuestoNumero}, Repuesto Código ${repuestoCodigo}`);

        const respuesta = await fetch(url, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!respuesta.ok) {
            const mensajeError = await respuesta.text();
            throw new Error(mensajeError || 'Error al eliminar el repuesto del presupuesto.');
        }

        resultado.innerHTML = `<div class="alert alert-success w-50 mx-auto mt-3">
                                 Repuesto ${repuestoCodigo} eliminado correctamente.
                               </div>`;

        //Recargar la lista
        cargarRepuestosAgregados(presupuestoNumero);

    } catch (error) {
        console.error('Error al eliminar el detalle:', error);
        resultado.innerHTML = `<div class="alert alert-danger w-50 mx-auto mt-3">
                                 Error al eliminar: ${error.message}
                               </div>`;
    }

    setTimeout(() => resultado.innerHTML = '', 3000);
};


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
};


btnBuscar.addEventListener('click', buscarRepuesto);
