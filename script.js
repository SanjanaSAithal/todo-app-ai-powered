const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const addTaskBtn = document.getElementById('addBtn');
const dueDateInput = document.getElementById('dueDateInput');
const dueTimeInput = document.getElementById('dueTimeInput');
const reminderMinsInput = document.getElementById('reminderMinsInput');
const taskList = document.getElementById('taskList');
const filterSelect = document.getElementById("filterSelect");
const trashList = document.getElementById("trashList");
const clearTrashBtn = document.getElementById("clearTrashBtn");

addTaskBtn.addEventListener('click', () => {
  const taskText = taskInput.value.trim();
  const priority = prioritySelect.value;
  const dueDate = dueDateInput.value;
  const dueTime = dueTimeInput.value;
  const reminderMins = parseInt(reminderMinsInput.value);

  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }
  
  if (dueDate && dueTime && reminderMins > 0) {
    const dueDateTime = new Date(`${dueDate}T${dueTime}`);
    const now = new Date();

    if (dueDateTime < now) {
      alert("This task is already overdue, a reminder cannot be set!");
    } else {
      const reminderTime = new Date(dueDateTime.getTime() - reminderMins * 60000);
      const timeUntilReminder = reminderTime.getTime() - now.getTime();

      if (timeUntilReminder > 0) {
        setTimeout(() => {
          alert(`Reminder: Your task "${taskText}" is due soon!`);
        }, timeUntilReminder);
        alert(`Reminder for "${taskText}" set for ${reminderMins} minutes before the due time.`);
      } else {
        alert("The reminder time is in the past. Please enter a smaller number of minutes.");
      }
    }
  }

  const li = createTaskElement(taskText, priority, false, dueDate, dueTime, reminderMins);
  taskList.insertBefore(li, taskList.firstChild);

  taskInput.value = "";
  dueDateInput.value = "";
  dueTimeInput.value = "";
  reminderMinsInput.value = "";
  updateTaskCounter();
  saveState();
});

filterSelect.addEventListener("change", () => {
  const filter = filterSelect.value;
  const allTasks = taskList.querySelectorAll("li");

  allTasks.forEach((taskItem) => {
    const isCompleted = taskItem.querySelector("span").classList.contains("completed");
    const priorityClass = taskItem.classList[0];

    taskItem.style.display = "flex";

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
    const dueTime = task.dataset.dueTime || "";
    const reminderMins = task.dataset.reminderMins || "";
    tasks.push({ text, isCompleted, priority, dueDate, dueTime, reminderMins });
  });

  const trash = [];
  trashList.querySelectorAll("li").forEach((task) => {
    const text = task.querySelector("span").textContent;
    const isCompleted = task.querySelector("span").classList.contains("completed");
    const priority = task.classList[0];
    const dueDate = task.dataset.dueDate || "";
    const dueTime = task.dataset.dueTime || "";
    const reminderMins = task.dataset.reminderMins || "";
    trash.push({ text, isCompleted, priority, dueDate, dueTime, reminderMins });
  });

  localStorage.setItem("appState", JSON.stringify({ tasks, trash }));
}

function loadState() {
  const state = JSON.parse(localStorage.getItem("appState")) || { tasks: [], trash: [] };

  state.tasks.forEach(({ text, isCompleted, priority, dueDate, dueTime, reminderMins }) => {
    const li = createTaskElement(text, priority, isCompleted, dueDate, dueTime, reminderMins);
    taskList.appendChild(li);
  });

  state.trash.forEach(({ text, isCompleted, priority, dueDate, dueTime, reminderMins }) => {
    const li = createTaskElement(text, priority, isCompleted, dueDate, dueTime, reminderMins);
    
    const deleteBtn = li.querySelector(".delete-btn");
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
  });

  updateTaskCounter();
}

function createTaskElement(text, priority, isCompleted, dueDate, dueTime, reminderMins) {
  const li = document.createElement("li");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("task-checkbox");

  const taskContent = document.createElement("span");
  taskContent.textContent = text;
  taskContent.classList.add(priority);

  const dueDateDisplay = document.createElement("span");
  dueDateDisplay.classList.add("due-date");

  let isDelayed = false;
  if (dueDate) {
    const dueDateTime = new Date(`${dueDate}T${dueTime || '00:00'}`);
    const now = new Date();
    
    if (dueDateTime < now && !isCompleted) {
      li.classList.add('delayed');
      isDelayed = true;
    }
    
    dueDateDisplay.textContent = dueDateTime.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
    if (dueTime) {
      dueDateDisplay.textContent += ` @ ${dueTime}`;
    }
  }

  if (isCompleted) {
    checkbox.checked = true;
    taskContent.classList.add("completed");
  }

  taskContent.addEventListener("click", () => {
    if (taskContent.classList.contains("completed")) {
      return; 
    }
    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.value = taskContent.textContent;
    editInput.className = taskContent.className.replace(priority, "").trim();

    li.replaceChild(editInput, taskContent);
    editInput.focus();

    const saveEdit = () => {
      const newText = editInput.value.trim();
      if (newText) {
        taskContent.textContent = newText;
      }
      li.replaceChild(taskContent, editInput);
      saveState();
    };

    editInput.addEventListener("blur", saveEdit);
    editInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        editInput.blur();
      } else if (e.key === "Escape") {
        li.replaceChild(taskContent, editInput);
      }
    });
  });

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
  if (reminderMins > 0) {
    const reminderIndicator = document.createElement("span");
    reminderIndicator.textContent = "⏰";
    reminderIndicator.classList.add("reminder-indicator");
    li.appendChild(reminderIndicator);
  }
  li.appendChild(deleteBtn);
  
  li.classList.add(priority);
  if (dueDate) {
    li.dataset.dueDate = dueDate;
    li.dataset.dueTime = dueTime;
    li.dataset.reminderMins = reminderMins;
  }

  return li;
}

clearTrashBtn.addEventListener("click", () => {
  trashList.innerHTML = "";
  saveState();
});

loadState();