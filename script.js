// STEP 1: Grab important elements from the page
const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const addTaskBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const filterSelect = document.getElementById("filterSelect");

// STEP 2: Add Task
addTaskBtn.addEventListener('click', () => {
  const taskText = taskInput.value.trim();
  const priority = prioritySelect.value;

  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }

  // Create <li>
  const li = document.createElement('li');

  // Create checkbox
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("task-checkbox");

  // Create task content span
  const taskContent = document.createElement("span");
  taskContent.textContent = `${taskText} (${priority})`;
  taskContent.classList.add(priority);

  // Checkbox logic (completed/uncompleted)
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      taskContent.classList.add("completed");
    } else {
      taskContent.classList.remove("completed");
    }
    updateTaskCounter(); // ✅ Update counter here
  });

  // Create delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "❌";
  deleteBtn.classList.add("delete-btn");

  // Delete button logic
  deleteBtn.addEventListener("click", () => {
    taskList.removeChild(li);
    updateTaskCounter(); // ✅ Update counter here
  });

  // Add all elements to the li
  li.appendChild(checkbox);
  li.appendChild(taskContent);
  li.appendChild(deleteBtn);

  // Add priority class to li (optional styling)
  li.classList.add(priority);

  // Add to the DOM
  taskList.appendChild(li);

  // Clear input
  taskInput.value = "";

  // ✅ Update counter after task is added
  updateTaskCounter();
  saveTasksToLocalStorage();

});

// STEP 3: Filter logic
filterSelect.addEventListener("change", () => {
  const filter = filterSelect.value;
  const allTasks = taskList.querySelectorAll("li");

  allTasks.forEach((taskItem) => {
    const isCompleted = taskItem.querySelector(".completed") !== null;
    const priorityClass = taskItem.querySelector("span").classList.value;

    taskItem.style.display = "block"; // Reset visibility

    if (filter === "completed" && !isCompleted) {
      taskItem.style.display = "none";
    } else if (filter === "uncompleted" && isCompleted) {
      taskItem.style.display = "none";
    } else if (["low", "medium", "high"].includes(filter) && !priorityClass.includes(filter)) {
      taskItem.style.display = "none";
    }
  });
});

// STEP 4: Task Counter function
function updateTaskCounter() {
  const allTasks = taskList.querySelectorAll("li");
  let uncompletedCount = 0;

  allTasks.forEach((task) => {
    const taskTextSpan = task.querySelector("span");
    if (!taskTextSpan.classList.contains("completed")) {
      uncompletedCount++;
    }
  });

  document.getElementById("taskCounter").textContent = `${uncompletedCount} task${uncompletedCount !== 1 ? 's' : ''} remaining`;
}

function saveTasksToLocalStorage() {
    const tasks = [];
    const allTasks = taskList.querySelectorAll("li");
  
    allTasks.forEach((task) => {
      const text = task.querySelector("span").textContent;
      const isCompleted = task.querySelector("span").classList.contains("completed");
      const priority = task.classList.contains("low")
        ? "low"
        : task.classList.contains("medium")
        ? "medium"
        : "high";
  
      tasks.push({ text, isCompleted, priority });
    });
  
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
  
  function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  
    tasks.forEach(({ text, isCompleted, priority }) => {
      // 🧱 Reconstruct each task just like we did in addTaskBtn click
      const li = document.createElement("li");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.classList.add("task-checkbox");
  
      const taskContent = document.createElement("span");
      taskContent.textContent = text;
      taskContent.classList.add(priority);
      if (isCompleted) {
        taskContent.classList.add("completed");
        checkbox.checked = true;
      }
  
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "❌";
      deleteBtn.classList.add("delete-btn");
  
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          taskContent.classList.add("completed");
        } else {
          taskContent.classList.remove("completed");
        }
        updateTaskCounter();
        saveTasksToLocalStorage();
      });
  
      deleteBtn.addEventListener("click", () => {
        taskList.removeChild(li);
        updateTaskCounter();
        saveTasksToLocalStorage();
      });
  
      li.appendChild(checkbox);
      li.appendChild(taskContent);
      li.appendChild(deleteBtn);
      li.classList.add(priority);
      taskList.appendChild(li);
    });
  
    updateTaskCounter();
  }
  
  loadTasksFromLocalStorage();

