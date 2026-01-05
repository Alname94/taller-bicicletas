document.getElementById("dni").addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, ""); // elimina todo lo que no sea número
});

//permite cargar los datos del cliente existente
async function cargarCliente() {
    const params = new URLSearchParams(window.location.search); //localiza los parámetros dentro de la URL y crea el el objeto
    const id = params.get("id"); //buscamos el id

    if (!id) {
        alert("No se recibió un ID válido.");
        window.location.href = "/html/clientes.html";
        return;
    }

    try {
        // Llamar al backend
        const response = await fetch(`/html/clientes/${id}`);

        if (!response.ok) {
            throw new Error("Cliente no encontrado");
        }

        const cliente = await response.json();

        // Cargar los valores en los inputs
        document.getElementById("id").value = cliente.id || "";
        document.getElementById("nombre").value = cliente.nombre || "";
        document.getElementById("apellido").value = cliente.apellido || "";
        document.getElementById("dni").value = cliente.dni || "";
        document.getElementById("telefono").value = cliente.telefono || "";
        document.getElementById("email").value = cliente.email || "";

        // 🚲 Renderizar bicicletas en cards
        const contenedor = document.getElementById("bicicletasContainer");
        contenedor.innerHTML = ""; //Limpia cualquier contenido previo que pudiera haber en el contenedor.

        //Verifica si la propiedad cliente.bicicletas existe, es un array y no está vacío.
        if (Array.isArray(cliente.bicicletas) && cliente.bicicletas.length) {
            const fragment = document.createDocumentFragment(); //construye todo el HTML de las tarjetas fuera del DOM principal de la página

            cliente.bicicletas.forEach(bici => {
                const col = document.createElement("div");
                col.className = "col-md-4 mb-3";

                const card = document.createElement("div");
                card.className = "card shadow-sm h-100";

                const cardBody = document.createElement("div");
                cardBody.className = "card-body d-flex flex-column";

                const title = document.createElement("h5");
                title.className = "card-title";
                title.textContent = bici.marca || "—";

                const text = document.createElement("p");
                text.className = "card-text mb-3";
                text.innerHTML = `Modelo: <strong>${escapeHtml(bici.modelo || "—")}</strong><br>ID: ${String(bici.id || "")}`;

                const btn = document.createElement("a");
                btn.className = "btn btn-primary mt-auto";
                btn.href = `/html/bicicleta-editar.html?id=${encodeURIComponent(bici.id)}`;
                btn.textContent = "Editar";

                cardBody.appendChild(title);
                cardBody.appendChild(text);
                cardBody.appendChild(btn);
                card.appendChild(cardBody);
                col.appendChild(card);
                fragment.appendChild(col);
            });

            contenedor.appendChild(fragment);
        } else {
            contenedor.innerHTML = `<p class="text-white">El cliente no tiene bicicletas registradas.</p>`;
        }

        //Convierte caracteres especiales de HTML (como <, >, &, ") a sus entidades HTML (&lt;, &gt;, &amp;, etc.).
        function escapeHtml(str) {
            return String(str)
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#39;");
        }
    } catch (error) {
        alert("Error cargando los datos del cliente: " + error.message);
    }
}

cargarCliente();


document.getElementById('btnModificar').addEventListener('click', async (evento) => {
    evento.preventDefault();
    const idCliente = (document.getElementById('id') || {}).value;
    const datos = {
        id: idCliente,
        nombre: (document.getElementById('nombre') || {}).value?.trim() ?? '',
        apellido: (document.getElementById('apellido') || {}).value?.trim() ?? '',
        dni: (document.getElementById('dni') || {}).value,
        telefono: (document.getElementById('telefono') || {}).value?.trim() ?? '',
        email: (document.getElementById('email') || {}).value?.trim() ?? ''
    };
    try {
        const respuesta = await fetch(`http://localhost:8080/html/clientes/editar/${idCliente}`, {
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