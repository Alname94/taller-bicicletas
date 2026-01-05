async function cargarBicicleta() {
    const params = new URLSearchParams(window.location.search); //localiza los parámetros dentro de la URL y crea el el objeto
    const id = params.get("id"); //buscamos el id

    if (!id) {
        alert("No se recibió un ID válido.");
        window.location.href = "/html/bicicletas.html";
        return;
    }

    try {
        // Llamar al backend
        const response = await fetch(`/html/bicicletas/${id}`);

        if (!response.ok) {
            throw new Error("Bicicleta no encontrada");
        }

        const bicicleta = await response.json();
        await cargarRodadosSelect();

        // Cargar los valores en los inputs
        document.getElementById("id").value = bicicleta.id || "";
        document.getElementById('cliente').value = bicicleta.cliente.id|| "";
        document.getElementById("marca").value = bicicleta.marca || "";
        document.getElementById("modelo").value = bicicleta.modelo || "";
        document.getElementById("color").value = bicicleta.color || "";
        document.getElementById('rodado').value = bicicleta.rodado || "";
        document.getElementById("fechaIngreso").value = bicicleta.fechaIngreso || "";
        document.getElementById("fechaEgreso").value = bicicleta.fechaEgreso || "";
    
    } catch (error) {
        alert("Error cargando los datos del bicicleta: " + error.message);
    }
}

cargarBicicleta();


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


document.getElementById('btnModificar').addEventListener('click', async (evento) => {
    evento.preventDefault();
    const idBicicleta = (document.getElementById('id') || {}).value;
    const clienteId = document.getElementById('cliente').value;
    const datos = {
        id: idBicicleta,
        cliente: {
            id: clienteId
        },
        marca: document.getElementById("marca").value?.trim() ?? '',
        modelo: document.getElementById("modelo").value?.trim() ?? '',
        color: document.getElementById("color").value?.trim() ?? '',
        rodado: document.getElementById('rodado').value?.trim() ?? '',
        fechaIngreso: document.getElementById("fechaIngreso").value,
        fechaEgreso: document.getElementById("fechaEgreso").value
    };
    try {
        const respuesta = await fetch(`http://localhost:8080/html/bicicletas/editar/${idBicicleta}`, {
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

    setTimeout(() => resultado.innerHTML = '', 3000);
});
