const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const addTaskBtn = document.getElementById('addBtn');
const dueDateInput = document.getElementById('dueDateInput');
const taskList = document.getElementById('taskList');
const filterSelect = document.getElementById("filterSelect");
const trashList = document.getElementById("trashList");
const clearTrashBtn = document.getElementById("clearTrashBtn"); // <-- NEW

addTaskBtn.addEventListener('click', () => {
  const taskText = taskInput.value.trim();
  const priority = prioritySelect.value;
  const dueDate = dueDateInput.value;

  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }

  const li = createTaskElement(taskText, priority, false, dueDate);
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
    const priority = task.classList[0]; 
    const dueDate = task.dataset.dueDate || "";
    tasks.push({ text, isCompleted, priority, dueDate });
  });

  const trash = [];
  trashList.querySelectorAll("li").forEach((task) => {
    const text = task.querySelector("span").textContent;
    const isCompleted = task.querySelector("span").classList.contains("completed");
    const priority = task.classList[0];
    const dueDate = task.dataset.dueDate || "";
    trash.push({ text, isCompleted, priority, dueDate });
  });

  // Save the new object with both arrays
  localStorage.setItem("appState", JSON.stringify({ tasks, trash }));
}

function loadState() {
  const state = JSON.parse(localStorage.getItem("appState")) || { tasks: [], trash: [] };

  // Load active tasks
  state.tasks.forEach(({ text, isCompleted, priority, dueDate }) => {
    const li = createTaskElement(text, priority, isCompleted, dueDate);
    taskList.appendChild(li);
  });

  // Load trashed tasks
  state.trash.forEach(({ text, isCompleted, priority, dueDate }) => {
    // We create the element, but then manually move it to trash
    const li = createTaskElement(text, priority, isCompleted, dueDate);
    
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

function createTaskElement(text, priority, isCompleted, dueDate) {
  const li = document.createElement("li");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("task-checkbox");

  const taskContent = document.createElement("span");
  taskContent.textContent = text;
  taskContent.classList.add(priority);

  const dueDateDisplay = document.createElement("span");
  dueDateDisplay.classList.add("due-date");
  if (dueDate) {
    // Formatting the date to be more readable
    const date = new Date(dueDate);
    dueDateDisplay.textContent = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }

  if (isCompleted) {
    checkbox.checked = true;
    taskContent.classList.add("completed");
  }

  // --- 💡 NEW: EDIT LOGIC STARTS HERE ---
  taskContent.addEventListener("click", () => {
    // Don't allow editing of a completed task
    if (taskContent.classList.contains("completed")) {
      return; 
    }
    
    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.value = taskContent.textContent;
    // Temporarily remove the priority class to avoid colored text in input
    editInput.className = taskContent.className.replace(priority, "").trim();

    // Replace the span with the input field
    li.replaceChild(editInput, taskContent);
    editInput.focus();

    // Function to save the changes
    const saveEdit = () => {
      const newText = editInput.value.trim();
      
      // If the new text is not empty, update the span
      if (newText) {
        taskContent.textContent = newText;
      }
      
      // Replace the input field back with the span
      li.replaceChild(taskContent, editInput);
      saveState(); // Save the entire app state
    };

    // Save when the user clicks away (blur)
    editInput.addEventListener("blur", saveEdit);

    // Save when the user presses "Enter"
    editInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        editInput.blur(); // Trigger the blur event to save
      } else if (e.key === "Escape") {
        // Revert changes if Escape is pressed
        li.replaceChild(taskContent, editInput);
      }
    });
  });
  // --- EDIT LOGIC ENDS HERE ---

  checkbox.addEventListener("change", () => {
    taskContent.classList.toggle("completed");
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
  if (dueDate) {
    li.appendChild(dueDateDisplay);
  }
  li.appendChild(deleteBtn);
  li.classList.add(priority);
  if (dueDate) {
    li.dataset.dueDate = dueDate;
  }

  return li;
}

// 🧹 Clear Trash functionality
clearTrashBtn.addEventListener("click", () => {
  trashList.innerHTML = "";
  saveState();
});

loadState();
