// STEP 1: Grab important elements from the page
const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const addTaskBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

// STEP 2: When button is clicked, run a function
addTaskBtn.addEventListener('click', () => {
  const taskText = taskInput.value.trim(); // get text
  const priority = prioritySelect.value;   // get selected priority

  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }

  // STEP 3: Create a new list item for the task
  const li = document.createElement('li');
  // li.textContent = `${taskText} (${priority})`;

  // Create checkbox
const checkbox = document.createElement("input");
checkbox.type = "checkbox";
checkbox.classList.add("task-checkbox");

// Event: when checkbox is clicked
checkbox.addEventListener("change", () => {
  if (checkbox.checked) {
    taskContent.classList.add("completed");
  } else {
    taskContent.classList.remove("completed");
  }
});

  // Set up task text with no priority inside <span>
const taskContent = document.createElement("span");
taskContent.textContent = `${taskText} (${priority})`;
taskContent.classList.add(priority); // 🔥 This is the fix

// Create delete button
const deleteBtn = document.createElement("button");
deleteBtn.textContent = "❌"; // or "Delete"
deleteBtn.classList.add("delete-btn");

// Add event listener to remove task on click
deleteBtn.addEventListener("click", () => {
  taskList.removeChild(li);
});

// Add everything to the list item
li.appendChild(checkbox);      // ✅ Add checkbox first
li.appendChild(taskContent);   // 📝 Then task text
li.appendChild(deleteBtn);     // ❌ Then delete button

const filterSelect = document.getElementById("filterSelect");

filterSelect.addEventListener("change", () => {
  const filter = filterSelect.value;
  const allTasks = taskList.querySelectorAll("li");

  allTasks.forEach((taskItem) => {
    const isCompleted = taskItem.querySelector(".completed") !== null;
    const priorityClass = taskItem.querySelector("span").classList.value;

    taskItem.style.display = "block"; // reset first

    if (filter === "completed" && !isCompleted) {
      taskItem.style.display = "none";
    } else if (filter === "uncompleted" && isCompleted) {
      taskItem.style.display = "none";
    } else if (["low", "medium", "high"].includes(filter) && !priorityClass.includes(filter)) {
      taskItem.style.display = "none";
    }
  });
});

  // STEP 4: Add priority class for styling (optional)
  li.classList.add(priority);

  // STEP 5: Add to the list
  taskList.appendChild(li);

  // STEP 6: Clear input field after adding
  taskInput.value = "";
});
