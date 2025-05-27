document.addEventListener("DOMContentLoaded", function () {
    mostrarHoraInternacional();
    const loginContainer = document.getElementById("loginContainer");
    const registerContainer = document.getElementById("registerContainer");
    const taskManager = document.getElementById("taskManager");
    const taskFormSection = document.getElementById("taskFormSection");
    const taskList = document.getElementById("taskList");
    const logoutButton = document.getElementById("logout");
    const sortTasks = document.getElementById("sortTasks");
    const groupSelection = document.getElementById("regGroup");

    //let users = [];
    //let tasks = [];
    let currentUser = null;  // Se inicializa correctamente

    document.getElementById("showRegister").addEventListener("click", function (e) {
        e.preventDefault();
        loginContainer.style.display = "none";
        registerContainer.style.display = "block";
    });

    document.getElementById("showLogin").addEventListener("click", function (e) {
        e.preventDefault();
        registerContainer.style.display = "none";
        loginContainer.style.display = "block";
    });

    document.getElementById("regRole").addEventListener("change", function () {
        groupSelection.style.display = this.value === "estudiante" ? "block" : "none";
    });
// registrar
    document.getElementById("registerForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const regUsername = document.getElementById("regUsername").value;
        const regPassword = document.getElementById("regPassword").value;
        const regRole = document.getElementById("regRole").value;
        const group = document.getElementById("group").value || "Ninguno";

        fetch("http://127.0.0.1:5000/usuarios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: regUsername,
                password: regPassword,
                role: regRole,
                curso: group
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.mensaje) {
                    alert("Usuario registrado correctamente");
                    regUsername.value = "";
                    regPassword.value = "";
                    regRole.value = "";  
                    group.value = "";
                } else {
                    alert("Hubo un problema con el registro.");
                }
            })
            .catch(error => {
                console.error("Error en la solicitud:", error);
                alert("Error al registrar usuario");
            });
    });

    //  Iniciar sesión
    document.getElementById("loginForm").addEventListener("submit", async function (e) {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const loginData = { username: username, password: password };

        try {
            let response = await fetch("http://127.0.0.1:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData)
            });

            let result = await response.json();

            if (response.ok) {
                alert("Inicio de sesión exitoso.");
                currentUser = result.usuario;

                console.log("Usuario logueado:", currentUser); //  Verifica que tenga ID

                loginContainer.style.display = "none";
                taskManager.style.display = "block";
                taskFormSection.style.display = currentUser.role === "Profesor" ? "block" : "none";
                renderTasks();

                username.value = "";
                password.value = "";

            } else {
                alert("Error: " + result.error);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Hubo un problema al iniciar sesión.");
        }
    });

    //  Agregar tarea (Solo Profesores)
    document.getElementById("addTaskButton").addEventListener("click", function () {
        if (!currentUser || currentUser.role !== "Profesor") {
            alert("Solo los profesores pueden agregar tareas.");
            return;
        }

        const title = document.getElementById("taskTitle").value;
        const description = document.getElementById("taskDescription").value;
        const dueDate = document.getElementById("taskDueDate").value;
        const group = document.getElementById("taskGroup").value;

        if (!title || !description || !dueDate) {
            alert("Todos los campos son obligatorios.");
            return;
        }

        console.log("Enviando tarea con profesor_id:", currentUser.id); //  Verifica en la consola

        fetch("http://127.0.0.1:5000/tareas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                titulo: title,
                descripcion: description,
                fecha_entrega: dueDate,
                grupo: group,
                profesor_id: currentUser.id  //  ID correcto
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.mensaje) {
                    alert("Tarea agregada con éxito");
                    renderTasks();
                } else {
                    alert("Error al agregar la tarea.");
                }
            })
            .catch(error => {
                console.error("Error en la solicitud:", error);
                alert("Error al agregar la tarea");
            });

        // Limpiar formulario
        document.getElementById("taskTitle").value = "";
        document.getElementById("taskDescription").value = "";
        document.getElementById("taskDueDate").value = "";
        document.getElementById("taskGroup").value = "Grupo A";
    });

    sortTasks.addEventListener("change", function () {
        const criteria = sortTasks.value;
        console.log("Criterio seleccionado:", criteria); //  Verificar qué opción se elige
    
        if (!tasks || tasks.length === 0) {
            console.error("⚠ No hay tareas para ordenar.");
            return;
        }
    
        console.log("Tareas antes de ordenar:", tasks); //  Verificar datos antes de ordenar
    
        if (criteria === "fecha") {
            tasks.sort((a, b) => new Date(a.fecha_entrega) - new Date(b.fecha_entrega));
        } else if (criteria === "estado") {
            const estados = { "Pendiente": 1, "Entregado": 2, "Vencido": 3 };
            tasks.sort((a, b) => estados[a.estado] - estados[b.estado]);
        } else if (criteria === "grupo") {
            tasks.sort((a, b) => a.grupo.localeCompare(b.grupo));
        }
    
        console.log("Tareas después de ordenar:", tasks); //  Verificar si se ordenaron correctamente
    
        renderTasks();
    });

// API DE HORA EN JAPON

    async function mostrarHoraInternacional() {
        const contenedor = document.getElementById("horaInternacional");
    
        try {
            // Obtener la hora base solo una vez
            const respuesta = await fetch("https://timeapi.io/api/Time/current/zone?timeZone=Asia/Tokyo");
            const datos = await respuesta.json();
            let hora = new Date(datos.dateTime);
    
            // Actualizar cada segundo localmente
            setInterval(() => {
                hora.setSeconds(hora.getSeconds() + 1); // Incrementa en 1 segundo
                const horaFormateada = hora.toLocaleTimeString("es-ES", {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
                contenedor.textContent = `Hora en Japón: ${horaFormateada}`;
            }, 1000);
    
        } catch (error) {
            contenedor.textContent = "No se pudo obtener la hora internacional.";
            console.error("Error al obtener hora internacional:", error);
        }
    }
    
     

    async function renderTasks() {
        window.renderTasks = renderTasks;
        taskList.innerHTML = "";
    
        try {
            let response = await fetch("http://127.0.0.1:5000/tareas");
            tasks = await response.json(); 

    
            const today = new Date().toISOString().split("T")[0];

    
            tasks.forEach(task => {
                if (currentUser.role === "estudiante" && task.grupo !== currentUser.curso) return;
    
                if (task.estado === "Pendiente" && task.fecha_entrega < today) {
                    task.estado = "Vencido";
                }
                
                let fecha = new Date(task.fecha_entrega);
                let opcionesFecha = { year: "numeric", month: "long", day: "numeric" };
                let fechaFormateada = fecha.toLocaleDateString("es-ES", opcionesFecha);

               // let rowClass = task.estado === "Vencido" ? "task-warning" : task.estado === "Entregado" ? "task-completed" : "";
    
                let actions = "";
                if (currentUser.role === "Profesor") {
                    actions = `<button onclick="enableEdit(${task.id})">Editar</button> <button onclick="deleteTask(${task.id})">Eliminar</button>`;
                } else if (currentUser.role === "estudiante" && task.estado === "Pendiente") {
                    actions = `<button onclick="markAsDelivered(${task.id})">Entregar</button>`;
                }
    
                taskList.innerHTML += ` 
                <tr id="task-${task.id}">
                    <td>
                        <span id="text-title-${task.id}">${task.titulo}</span>
                        <input type="text" value="${task.titulo}" id="edit-title-${task.id}" class="edit-field" style="display:none;">
                    </td>
                    <td>
                        <span id="text-desc-${task.id}">${task.descripcion}</span>
                        <input type="text" value="${task.descripcion}" id="edit-desc-${task.id}" class="edit-field" style="display:none;">
                    </td>
                    <td>
                        <span id="text-date-${task.id}">${fechaFormateada}</span>
                        <input type="date" value="${new Date(task.fecha_entrega).toISOString().split("T")[0]}" id="edit-date-${task.id}" class="edit-field" style="display:none;">
                    </td>
                    <td>
                        <span id="text-group-${task.id}">${task.grupo}</span>
                        <input type="text" value="${task.grupo}" id="edit-group-${task.id}" class="edit-field" style="display:none;">
                    </td>
                    
                    <td>${task.estado}</td>
            
                    <td id="actions-${task.id}">
                        ${currentUser.role === "Profesor" ? `
                            <button onclick="enableEdit(${task.id})">Editar</button>
                            <button onclick="deleteTask(${task.id})">Eliminar</button>` 
                        : `
                            <button onclick="entregarTarea(${task.id})" ${task.estado === "Entregado" ? "disabled" : ""}>
                                ${task.estado === "Entregado" ? "Entregado" : "Entregar"}
                            </button>`}
                    </td>
                </tr>`;
            });
    
        } catch (error) {
            console.error("Error al obtener tareas:", error);
            alert("Hubo un problema al cargar las tareas.");
        }
    }
    

    window.markAsDelivered = function (index) {
        if (currentUser.role !== "Estudiante") return;
        tasks[index].status = "Entregado";
        renderTasks();
    };

    window.deleteTask = function (index) {
        if (currentUser.role !== "Profesor") return;
        tasks.splice(index, 1);
        renderTasks();
    };

    logoutButton.addEventListener("click", function () {
        currentUser = null;
        taskManager.style.display = "none";
        loginContainer.style.display = "block";

        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
    });
    // Eliminar tarea
    window.deleteTask = async function (id) {
        if (!confirm("¿Estás seguro de que deseas eliminar esta tarea?")) return;
    
        try {
            let response = await fetch(`http://127.0.0.1:5000/tareas/${id}`, {
                method: "DELETE"
            });
    
            let result = await response.json();
            alert(result.mensaje);
            renderTasks();  //  Recargar tareas
        } catch (error) {
            console.error("Error al eliminar tarea:", error);
            alert("No se pudo eliminar la tarea.");
        }
    };
    

    // 🔹 Habilitar edición
    window.enableEdit = function (taskId) {
        document.getElementById(`text-title-${taskId}`).style.display = "none";
        document.getElementById(`text-desc-${taskId}`).style.display = "none";
        document.getElementById(`text-date-${taskId}`).style.display = "none";
        document.getElementById(`text-group-${taskId}`).style.display = "none";
    
        document.getElementById(`edit-title-${taskId}`).style.display = "inline";
        document.getElementById(`edit-desc-${taskId}`).style.display = "inline";
        document.getElementById(`edit-date-${taskId}`).style.display = "inline";
        document.getElementById(`edit-group-${taskId}`).style.display = "inline";
    
        document.getElementById(`actions-${taskId}`).innerHTML = `
            <button onclick="saveEdit(${taskId})">Guardar</button>
            <button onclick="renderTasks()">Cancelar</button>
        `;
    };

//  Guardar edición
window.saveEdit = async function (taskId) {
    let tituloInput = document.getElementById(`edit-title-${taskId}`);
    let descripcionInput = document.getElementById(`edit-desc-${taskId}`);
    let fechaInput = document.getElementById(`edit-date-${taskId}`);
    let grupoInput = document.getElementById(`edit-group-${taskId}`);

    // Verifica que los elementos existen antes de acceder a 'value'
    if (!tituloInput || !descripcionInput || !fechaInput || !grupoInput) {
        console.error("Error: No se encontraron los campos de edición.");
        return;
    }

    let nuevaTarea = {
        titulo: tituloInput.value,
        descripcion: descripcionInput.value,
        fecha_entrega: fechaInput.value,
        grupo: grupoInput.value
    };

    fetch(`http://127.0.0.1:5000/tareas/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaTarea)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Tarea actualizada:", data);
        renderTasks(); // Vuelve a cargar la lista después de editar
    })
    .catch(error => console.error("Error al actualizar:", error));
}

window.entregarTarea = function (taskId) {
    fetch(`http://localhost:5000/tareas/${taskId}/entregar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: "Entregado" })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.mensaje);
        cargarTareas();
    })
    .catch(error => console.error("Error al entregar tarea:", error));
};

async function cargarTareas() {
    try {
        // Hacer la petición al backend para obtener las tareas
        const respuesta = await fetch("http://localhost:5000/tareas");

        if (!respuesta.ok) {
            throw new Error("Error al obtener las tareas");
        }

        const tareas = await respuesta.json();

        // Obtener el cuerpo de la tabla donde se mostrarán las tareas
        const tabla = document.getElementById("taskList");

        // Limpiar el contenido antes de cargar nuevas tareas
        tabla.innerHTML = "";

        // Recorrer las tareas y agregarlas a la tabla
        tareas.forEach((task) => {
            // Formatear la fecha al estilo que te gusta (DD/MM/YYYY)
            const fecha = new Date(task.fecha_entrega);
            const fechaFormateada = fecha.toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            });

            const fila = document.createElement("tr");
            fila.id = `task-${task.id}`;

            fila.innerHTML = `
                <td>${task.titulo}</td>
                <td>${task.descripcion}</td>
                <td> <span id="text-date-${task.id}">${fechaFormateada}</span>
                        <input type="date" value="${new Date(task.fecha_entrega).toISOString().split("T")[0]}" id="edit-date-${task.id}" class="edit-field" style="display:none;"></td>
                <td>${task.grupo}</td>
                <td>${task.estado}</td>
                <td id="actions-${task.id}">
                    ${currentUser.role === "Profesor" ? `
                        <button onclick="enableEdit(${task.id})">Editar</button>
                        <button onclick="deleteTask(${task.id})">Eliminar</button>
                    ` : `
                        <button onclick="entregarTarea(${task.id})" ${task.estado === "Entregado" ? "disabled" : ""}>
                            ${task.estado === "Entregado" ? "Entregado" : "Entregar"}
                        </button>
                    `}
                </td>
            `;

            tabla.appendChild(fila);
        });

    } catch (error) {
        console.error("Error al cargar tareas:", error);
    }
}


});

