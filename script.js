const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const addTaskBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const filterSelect = document.getElementById("filterSelect");
const trashList = document.getElementById("trashList");
const clearTrashBtn = document.getElementById("clearTrashBtn"); // <-- NEW

addTaskBtn.addEventListener('click', () => {
  const taskText = taskInput.value.trim();
  const priority = prioritySelect.value;

  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }

  const li = createTaskElement(taskText, priority, false);
  taskList.insertBefore(li, taskList.firstChild);

  taskInput.value = "";
  updateTaskCounter();
  saveState();
});

filterSelect.addEventListener("change", () => {
  const filter = filterSelect.value;
  const allTasks = taskList.querySelectorAll("li");

  allTasks.forEach((taskItem) => {
    const isCompleted = taskItem.querySelector("span").classList.contains("completed");
    const priorityClass = taskItem.querySelector("span").classList.value;

    taskItem.style.display = "block";

    if (filter === "completed" && !isCompleted) {
      taskItem.style.display = "none";
    } else if (filter === "uncompleted" && isCompleted) {
      taskItem.style.display = "none";
    } else if (["low", "medium", "high"].includes(filter) && !priorityClass.includes(filter)) {
      taskItem.style.display = "none";
    }
  });
});

function updateTaskCounter() {
  const allTasks = taskList.querySelectorAll("li");
  let uncompletedCount = 0;

  allTasks.forEach((task) => {
    const taskTextSpan = task.querySelector("span");
    if (!taskTextSpan.classList.contains("completed")) {
      uncompletedCount++;
    }
  });

  document.getElementById("taskCounter").textContent =
    `${uncompletedCount} task${uncompletedCount !== 1 ? 's' : ''} remaining`;
}

function saveState() {
  const tasks = [];
  taskList.querySelectorAll("li").forEach((task) => {
    const text = task.querySelector("span").textContent;
    const isCompleted = task.querySelector("span").classList.contains("completed");
    const priority = task.classList[0]; // Simplified priority fetching
    tasks.push({ text, isCompleted, priority });
  });

  const trash = [];
  trashList.querySelectorAll("li").forEach((task) => {
    const text = task.querySelector("span").textContent;
    const isCompleted = task.querySelector("span").classList.contains("completed");
    const priority = task.classList[0];
    trash.push({ text, isCompleted, priority });
  });

  // Save the new object with both arrays
  localStorage.setItem("appState", JSON.stringify({ tasks, trash }));
}

function loadState() {
  const state = JSON.parse(localStorage.getItem("appState")) || { tasks: [], trash: [] };

  // Load active tasks
  state.tasks.forEach(({ text, isCompleted, priority }) => {
    const li = createTaskElement(text, priority, isCompleted);
    taskList.appendChild(li);
  });

  // Load trashed tasks
  state.trash.forEach(({ text, isCompleted, priority }) => {
    // We create the element, but then manually move it to trash
    const li = createTaskElement(text, priority, isCompleted);
    
    // Simulate the 'delete' click to move it to trash correctly
    const deleteBtn = li.querySelector(".delete-btn");
    const restoreBtn = document.createElement("button");
    restoreBtn.textContent = "🔁";
    restoreBtn.classList.add("restore-btn");

    li.removeChild(deleteBtn);
    li.appendChild(restoreBtn);
    trashList.appendChild(li);

    // Re-attach the restore functionality
    restoreBtn.addEventListener("click", () => {
      trashList.removeChild(li);
      li.removeChild(restoreBtn);
      li.appendChild(deleteBtn);
      taskList.insertBefore(li, taskList.firstChild);
      updateTaskCounter();
      saveState(); // <-- Use new save function
    });
  });

  updateTaskCounter();
}

function createTaskElement(text, priority, isCompleted) {
  const li = document.createElement("li");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("task-checkbox");

  const taskContent = document.createElement("span");
  taskContent.textContent = text;
  taskContent.classList.add(priority);

  if (isCompleted) {
    checkbox.checked = true;
    taskContent.classList.add("completed");
  }

  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      taskContent.classList.add("completed");
    } else {
      taskContent.classList.remove("completed");
    }
    updateTaskCounter();
    saveState();
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "❌";
  deleteBtn.classList.add("delete-btn");

  deleteBtn.addEventListener("click", () => {
    taskList.removeChild(li);

    const restoreBtn = document.createElement("button");
    restoreBtn.textContent = "🔁";
    restoreBtn.classList.add("restore-btn");

    li.removeChild(deleteBtn);
    li.appendChild(restoreBtn);

    trashList.appendChild(li);

    restoreBtn.addEventListener("click", () => {
      trashList.removeChild(li);
      li.removeChild(restoreBtn);
      li.appendChild(deleteBtn);
      taskList.insertBefore(li, taskList.firstChild);
      updateTaskCounter();
      saveState();
    });

    updateTaskCounter();
    saveState();
  });

  li.appendChild(checkbox);
  li.appendChild(taskContent);
  li.appendChild(deleteBtn);
  li.classList.add(priority);

  return li;
}

// 🧹 Clear Trash functionality
clearTrashBtn.addEventListener("click", () => {
  trashList.innerHTML = "";
});

loadState();
