const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const clearCompleted = document.getElementById("clearCompleted");

const filterButtons = document.querySelectorAll(".filter");


// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";


// Save tasks
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// Display tasks
function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    // Show only active tasks
    if (currentFilter === "active") {

        filteredTasks = tasks.filter(function(task) {
            return !task.completed;
        });

    }

    // Show only completed tasks
    if (currentFilter === "completed") {

        filteredTasks = tasks.filter(function(task) {
            return task.completed;
        });

    }


    filteredTasks.forEach(function(task) {

        const li = document.createElement("li");

        li.classList.add("task");

        if (task.completed) {
            li.classList.add("completed");
        }


        const leftSide = document.createElement("div");

        leftSide.classList.add("task-left");


        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.classList.add("task-checkbox");

        checkbox.checked = task.completed;


        checkbox.addEventListener("change", function() {

            toggleTask(task.id);

        });


        const text = document.createElement("span");

        text.classList.add("task-text");

        text.textContent = task.text;


        leftSide.appendChild(checkbox);

        leftSide.appendChild(text);


        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";

        deleteButton.classList.add("delete-btn");


        deleteButton.addEventListener("click", function() {

            deleteTask(task.id);

        });


        li.appendChild(leftSide);

        li.appendChild(deleteButton);


        taskList.appendChild(li);

    });


    updateTaskCount();
}


// Add task
function addTask() {

    const text = taskInput.value.trim();


    // Don't add empty tasks
    if (text === "") {

        alert("Please enter a task.");

        return;
    }


    const newTask = {

        id: Date.now(),

        text: text,

        completed: false

    };


    tasks.push(newTask);


    saveTasks();


    taskInput.value = "";


    renderTasks();
}


// Toggle task
function toggleTask(id) {

    tasks = tasks.map(function(task) {

        if (task.id === id) {

            return {
                ...task,
                completed: !task.completed
            };

        }

        return task;

    });


    saveTasks();

    renderTasks();
}


// Delete task
function deleteTask(id) {

    tasks = tasks.filter(function(task) {

        return task.id !== id;

    });


    saveTasks();

    renderTasks();
}


// Update task counter
function updateTaskCount() {

    const activeTasks = tasks.filter(function(task) {

        return !task.completed;

    }).length;


    if (activeTasks === 1) {

        taskCount.textContent = "1 task remaining";

    } else {

        taskCount.textContent = activeTasks + " tasks remaining";

    }
}


// Clear completed tasks
clearCompleted.addEventListener("click", function() {

    tasks = tasks.filter(function(task) {

        return !task.completed;

    });


    saveTasks();

    renderTasks();
});


// Filter buttons
filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        // Remove active class from all buttons
        filterButtons.forEach(function(btn) {

            btn.classList.remove("active");

        });


        // Activate clicked button
        button.classList.add("active");


        currentFilter = button.dataset.filter;


        renderTasks();

    });

});


// Add task button
addTaskBtn.addEventListener("click", addTask);


// Press Enter to add task
taskInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        addTask();

    }

});


// Run when page loads
renderTasks();