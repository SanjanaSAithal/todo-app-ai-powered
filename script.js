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


  // STEP 4: Add priority class for styling (optional)
  li.classList.add(priority);

  // STEP 5: Add to the list
  taskList.appendChild(li);

  // STEP 6: Clear input field after adding
  taskInput.value = "";
});
