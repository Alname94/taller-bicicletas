async function cargarRepuesto() {
    const params = new URLSearchParams(window.location.search); //localiza los parámetros dentro de la URL y crea el el objeto
    const codigo = params.get("codigo"); //buscamos el codigo

    if (!codigo) {
        alert("No se recibió un código válido.");
        window.location.href = "/html/repuestos.html";
        return;
    }

    try {
        const response = await fetch(`/html/repuestos/${codigo}`);

        if (!response.ok) {
            throw new Error("Repuesto no encontrado");
        }

        const repuesto = await response.json();

        document.getElementById("codigo").value = repuesto.codigo || "";
        document.getElementById('producto').value = repuesto.producto|| "";
        document.getElementById("marca").value = repuesto.marca || "";
        document.getElementById("color").value = repuesto.color || "";
        document.getElementById('precioVenta').value = repuesto.precioVenta || "";
        document.getElementById("precioCosto").value = repuesto.precioCosto || "";
        document.getElementById("stock").value = repuesto.stock || "";
    
    } catch (error) {
        alert("Error cargando los datos del repuesto: " + error.message);
    }
}

cargarRepuesto();


document.getElementById('btnModificar').addEventListener('click', async (evento) => {
    evento.preventDefault();
    const codigoRepuesto = (document.getElementById('codigo') || {}).value?.trim() ?? '';
    const datos = {
        codigo: codigoRepuesto,
        producto: (document.getElementById('producto') || {}).value?.trim() ?? '',
        marca: (document.getElementById('marca') || {}).value?.trim() ?? '',
        color: (document.getElementById('color') || {}).value?.trim() ?? '',
        precioVenta: (document.getElementById('precioVenta') || {}).value?.trim() ?? '',
        precioCosto: (document.getElementById('precioCosto') || {}).value?.trim() ?? '',
        stock: (document.getElementById('stock') || {}).value?.trim() ?? ''
    };
    try {
        const respuesta = await fetch(`http://localhost:8080/html/repuestos/editar/${codigoRepuesto}`, {
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
                                  Error al modificar los datos ${error.message}
                               </div>`;
    }

    setTimeout(() => resultado.innerHTML = '', 3000);
});