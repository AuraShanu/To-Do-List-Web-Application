// =============================================
//   DOM Elements
// =============================================
const taskInput       = document.getElementById("taskInput");
const addTaskBtn      = document.getElementById("addTaskBtn");
const taskList        = document.getElementById("taskList");
const taskCounter     = document.getElementById("taskCounter");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");
const errorMsg        = document.getElementById("errorMsg");
const filterButtons   = document.querySelectorAll("[data-filter]");

// =============================================
//   Data
// =============================================
let tasks = [];           // { id, text, completed }
let currentFilter = "all"; // "all" | "active" | "completed"

// =============================================
//   Optional: Load from localStorage
// =============================================
// const saved = localStorage.getItem("todo-tasks");
// if (saved) {
//     tasks = JSON.parse(saved);
// }

// =============================================
//   Helpers
// =============================================
function saveTasks() {
    // localStorage.setItem("todo-tasks", JSON.stringify(tasks));
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

// =============================================
//   Render Tasks
// =============================================
function renderTasks() {
    taskList.innerHTML = "";

    // Filter logic
    let filtered = tasks;
    if (currentFilter === "active") {
        filtered = tasks.filter(t => !t.completed);
    } else if (currentFilter === "completed") {
        filtered = tasks.filter(t => t.completed);
    }

    // Show empty message
    if (filtered.length === 0) {
        const li = document.createElement("li");
        li.className = "text-center text-muted list-group-item";
        li.textContent = "No tasks yet. Add your first task!";
        taskList.appendChild(li);
        updateCounter();
        return;
    }

    // Show tasks
    filtered.forEach(task => {
        const li = document.createElement("li");
        li.className = "list-group-item task-item";

        if (task.completed) {
            li.classList.add("task-completed");
        }

        // ---- Left: checkbox + text ----
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

        // ---- Right: delete button ----
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

// =============================================
//   Add Task (Task 3 + Task 6)
// =============================================
function addTask() {
    const text = taskInput.value.trim();

    // Validate: prevent empty or spaces-only
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
    taskInput.value = "";   // Clear input
    saveTasks();
    renderTasks();
}

// =============================================
//   Toggle Complete (Task 4)
// =============================================
function toggleCompleted(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

// =============================================
//   Delete Task (Task 5)
// =============================================
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}

// =============================================
//   Clear Completed (Task 8)
// =============================================
function clearCompleted() {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderTasks();
}

// =============================================
//   Filter Tasks (Task 7)
// =============================================
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

// =============================================
//   Event Listeners
// =============================================
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

// =============================================
//   Initial Render
// =============================================
renderTasks();