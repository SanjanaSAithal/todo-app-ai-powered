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
  li.textContent = `${taskText} (${priority})`;

  // STEP 4: Add priority class for styling (optional)
  li.classList.add(priority);

  // STEP 5: Add to the list
  taskList.appendChild(li);

  // STEP 6: Clear input field after adding
  taskInput.value = "";
});
