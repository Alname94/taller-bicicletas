const resultado = document.getElementById('resultado');
const inputBuscar = document.getElementById('inputBuscar');
const btnBuscar = document.getElementById('btnBuscar');
const btnModificar = document.getElementById('btnModificar');
const repuestosTabla = document.getElementById('tabla-repuestos');
const repuestosAgregados = document.getElementById('tabla-repuestos-agregados');
const esNumericoPuro = (str) => /^\d+$/.test(str);

async function cargarPresupuesto() {
    const params = new URLSearchParams(window.location.search);
    const numero = params.get("numero"); 

    if (!numero) {
        alert("No se recibió un número válido.");
        window.location.href = "/html/presupuestos.html";
        return;
    }

    try {
        const response = await fetch(`/html/presupuestos/${numero}`);

        if (!response.ok) {
            throw new Error("Presupuesto no encontrado");
        }

        const presupuesto = await response.json();
        const presupuestoNumero = presupuesto.numero;
        window.currentPresupuesto = presupuestoNumero;
        cargarRepuestosAgregados(presupuestoNumero);

        document.getElementById("numero").value = presupuesto.numero || "";
        document.getElementById("fecha").value = presupuesto.fecha || "";
        document.getElementById("cliente").value = presupuesto.cliente.id|| "";
        document.getElementById("bicicleta").value = presupuesto.bicicleta.id || "";
        document.getElementById("valorTotal").value = presupuesto.valorTotal || "";
        document.getElementById("descripcion").value = presupuesto.descripcion || "";
    
    } catch (error) {
        alert("Error cargando los datos del presupuesto: " + error.message);
    }
}

cargarPresupuesto();


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


cargarRepuestos();


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





async function agregarRepuesto(repuestoCodigo) {
    const presupuesto = window.currentPresupuesto;
    const inputCantidad = document.getElementById(`cantidad-${repuestoCodigo}`);
    const cantidad = parseInt(inputCantidad?.value, 10);
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

    const datosDetalle = {
        id:{
            presupuestoNumero: presupuesto,
            repuestoCodigo: repuestoCodigo
        },
        cantidadAgregada: cantidad
    };

    try {
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

        // Recargamos la lista con el ID del presupuesto para ver el detalle recién agregado
        cargarRepuestosAgregados(presupuesto);
        cargarRepuestos();
        cargarPresupuesto();

    } catch (error) {
        console.error('Error al crear el detalle:', error);
        resultado.innerHTML = `<div class="alert alert-danger w-50 mx-auto mt-3">
                                 ${error.message}
                               </div>`;
    }

    setTimeout(() => resultado.innerHTML = '', 5000);
}


async function quitarRepuesto(repuestoCodigo) {
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

        //Recargar listas
        cargarRepuestosAgregados(presupuestoNumero);
        cargarRepuestos();
        cargarPresupuesto();

    } catch (error) {
        console.error('Error al eliminar el detalle:', error);
        resultado.innerHTML = `<div class="alert alert-danger w-50 mx-auto mt-3">
                                 Error al eliminar: ${error.message}
                               </div>`;
    }

    setTimeout(() => resultado.innerHTML = '', 5000);
}


document.getElementById('btnModificar').addEventListener('click', async (evento) =>{
    evento.preventDefault();
    const presupuestoNumero = document.getElementById('numero').value;
    const clienteId = document.getElementById('cliente').value;
    const bicicletaId = document.getElementById('bicicleta').value;
    const datos ={
        numero: presupuestoNumero,
        fecha: document.getElementById('fecha').value,
        cliente:{
            id: clienteId
        },
        bicicleta:{
            id: bicicletaId
        },
        valorTotal: document.getElementById('valorTotal').value,
        descripcion: document.getElementById('descripcion').value?.trim() ?? ''        
    };
    try {
        const respuesta = await fetch(`http://localhost:8080/html/presupuestos/editar/${presupuestoNumero}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        if (!respuesta.ok) {
            const mensajeError = await respuesta.text();
            throw new Error(mensajeError);
        }
        resultado.innerHTML = `<div class="alert alert-success w-50 mx-auto mt-3">
                                  Datos modificados correctamente
                               </div>`;
    } catch (error) {
        resultado.innerHTML = `<div class="alert alert-danger w-50 mx-auto mt-3">
                                  Error al modificar los datos
                               </div>`;
    }

    setTimeout(() => resultado.innerHTML = '', 5000);
});



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