
const taskInput       = document.getElementById("taskInput");
const addTaskBtn      = document.getElementById("addTaskBtn");
const taskList        = document.getElementById("taskList");
const taskCounter     = document.getElementById("taskCounter");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");
const errorMsg        = document.getElementById("errorMsg");
const filterButtons   = document.querySelectorAll("[data-filter]");


let tasks = [];           
let currentFilter = "all"; 


function saveTasks() {
    
}

function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.classList.remove("d-none");
}

function hideError() {
    errorMsg.classList.add("d-none");
}

function updateCounter() {
    const remaining = tasks.filter(t => !t.completed).length;
    taskCounter.textContent =
        remaining === 1 ? "1 remaining" : remaining + " remaining";
}


function renderTasks() {
    taskList.innerHTML = "";

   
    let filtered = tasks;
    if (currentFilter === "active") {
        filtered = tasks.filter(t => !t.completed);
    } else if (currentFilter === "completed") {
        filtered = tasks.filter(t => t.completed);
    }

    
    if (filtered.length === 0) {
        const li = document.createElement("li");
        li.className = "text-center text-muted list-group-item";
        li.textContent = "No tasks yet. Add your first task!";
        taskList.appendChild(li);
        updateCounter();
        return;
    }

    
    filtered.forEach(task => {
        const li = document.createElement("li");
        li.className = "list-group-item task-item";

        if (task.completed) {
            li.classList.add("task-completed");
        }

       
        const leftDiv = document.createElement("div");
        leftDiv.className = "task-left";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.className = "form-check-input task-checkbox";
        checkbox.addEventListener("change", function () {
            toggleCompleted(task.id);
        });

        const span = document.createElement("span");
        span.className = "task-text";
        span.textContent = task.text;

        leftDiv.appendChild(checkbox);
        leftDiv.appendChild(span);

        
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "btn btn-sm btn-danger";
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", function () {
            deleteTask(task.id);
        });

        li.appendChild(leftDiv);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });

    updateCounter();
}


function addTask() {
    const text = taskInput.value.trim();

    
    if (text === "") {
        showError("Please enter a task.");
        return;
    }

    hideError();

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(newTask);
    taskInput.value = "";   
    saveTasks();
    renderTasks();
}


function toggleCompleted(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}


function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}


function clearCompleted() {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderTasks();
}


function changeFilter(filter) {
    currentFilter = filter;

    filterButtons.forEach(btn => {
        if (btn.getAttribute("data-filter") === filter) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });

    renderTasks();
}


addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        addTask();
    }
});

clearCompletedBtn.addEventListener("click", clearCompleted);

filterButtons.forEach(btn => {
    btn.addEventListener("click", function () {
        changeFilter(btn.getAttribute("data-filter"));
    });
});


renderTasks();