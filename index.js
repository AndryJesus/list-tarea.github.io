document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const taskInput = document.querySelector('.entered-list');
    const addButton = document.querySelector('.button');
    const taskList = document.getElementById('contacts-list');
    const statsElement = document.getElementById('stats');
    const MAX_CHARACTERS = 180; // Límite de caracteres
    
    // Cargar tareas del localStorage al iniciar
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    // Renderizar las tareas
    function renderTasks() {
        taskList.innerHTML = '';
        
        tasks.forEach((task, index) => {
            const taskItem = document.createElement('li');
            taskItem.className = 'contacts-list-item';
            
            taskItem.innerHTML = `
                <div class="inputs-container">
                    <input type="checkbox" name="check" class="checkbox-input" ${task.completed ? 'checked' : ''}>
                    <input class="contacts-list-item-tarea-input" type="text" value="${task.text}" ${task.completed ? 'readonly' : ''}>
                </div>
                <div class="btns-container">
                    <button class="edit-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>            
                    </button>
                    <button class="delete-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            `;
            
            taskList.appendChild(taskItem);
            
            // Eventos para los elementos recién creados
            const checkbox = taskItem.querySelector('.checkbox-input');
            const textInput = taskItem.querySelector('.contacts-list-item-tarea-input');
            const editButton = taskItem.querySelector('.edit-btn');
            const deleteButton = taskItem.querySelector('.delete-btn');
            
            // Marcar como completada
            checkbox.addEventListener('change', function() {
                tasks[index].completed = this.checked;
                textInput.readOnly = this.checked;
                saveTasks();
                updateStats();
            });
            
            // Editar tarea
            editButton.addEventListener('click', function() {
                if (!tasks[index].completed) {
                    textInput.readOnly = !textInput.readOnly;
                    if (!textInput.readOnly) {
                        textInput.focus();
                    } else {
                        tasks[index].text = textInput.value.slice(0, MAX_CHARACTERS);
                        saveTasks();
                        renderTasks();
                    }
                }
            });
            
            // Eliminar tarea
            deleteButton.addEventListener('click', function() {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
                updateStats();
            });
            
            // Guardar al presionar Enter en el input de edición
            textInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' && !textInput.readOnly) {
                    tasks[index].text = textInput.value.slice(0, MAX_CHARACTERS);
                    textInput.readOnly = true;
                    saveTasks();
                    renderTasks();
                }
            });
        });
        
        updateStats();
    }
    
    // Añadir nueva tarea
    function addTask() {
        const text = taskInput.value.trim();
        if (text) {
            tasks.push({
                text: text.slice(0, MAX_CHARACTERS),
                completed: false
            });
            saveTasks();
            taskInput.value = '';
            renderTasks();
        }
    }
    
    // Guardar tareas en localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    // Actualizar estadísticas
    function updateStats() {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;
        const pendingTasks = totalTasks - completedTasks;
        
        statsElement.textContent = `Tareas Pendientes: ${pendingTasks} Completadas: ${completedTasks} 
        Total de Tareas ${totalTasks}`;
    }
    
    // Event Listeners
    addButton.addEventListener('click', addTask);
    
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    // Renderizar tareas al cargar la página
    renderTasks();
});