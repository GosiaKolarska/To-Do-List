document.addEventListener('DOMContentLoaded', () => {
    
    // Get references to the necessary DOM elements
    const taskInput = document.getElementById('new-task');
    const addTaskBtn = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');
    const emptyState = document.getElementById('empty-state');
    const errorMessage = document.createElement('p');
    errorMessage.classList.add('error-message');
    errorMessage.setAttribute('role', 'alert');

    // Event listener to enable/disable the add button based on input value
    taskInput.addEventListener('input', () => {
        addTaskBtn.disabled = taskInput.value.trim() === '';
        if (taskInput.value.trim() !== '') {
            errorMessage.textContent = '';
        }
    });

    // Event listener to handle adding a new task
    addTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if(taskText) {
            addTask(taskText);
            taskInput.value = '';
            taskInput.focus();
            addTaskBtn.disabled = true;
        } else {
            errorMessage.textContent = 'Task description cannot be empty.';
            taskInput.after(errorMessage);
        }
    })
    
    // Function to add a task to the list
    function addTask(taskText, isCompleted = false) {
        const taskId = `task-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 11)}`;

        const taskListItem = document.createElement('li');
        taskListItem.classList.add('todo-list__task-item');
        if (isCompleted) {
            taskListItem.classList.add('todo-list__task-item--completed');
        }

        // Create & configure the checkbox for marking tasks as completed
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = taskId;
        checkbox.classList.add('todo-list__checkbox');
        checkbox.checked = isCompleted;
        checkbox.addEventListener('change', () => {
            taskListItem.classList.toggle('todo-list__task-item--completed');
            saveTasks();
        });

        // Create the span element for task text
        const taskLabel = document.createElement('label');
        taskLabel.setAttribute('for', taskId);
        taskLabel.textContent = taskText;
        taskLabel.classList.add('todo-list__task-item-text');

        // Create & configure the remove button
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove task';
        removeButton.classList.add("todo-list__btn-remove", "todo-list__btn");
        removeButton.setAttribute('aria-label', 'Remove task');
        removeButton.addEventListener('click', () => {
            taskListItem.remove();
            toggleEmptyState();
            saveTasks();
        });

        // Append all elements to task list item
        taskListItem.appendChild(checkbox);
        taskListItem.appendChild(taskLabel);
        taskListItem.appendChild(removeButton);

        // Append the task list item to task list
        taskList.appendChild(taskListItem);
        toggleEmptyState();
        saveTasks();
    }

    // Function to toggle the visibility of the empty state message
    function toggleEmptyState() {
        if (taskList.children.length > 0) {
            emptyState.style.display = 'none';
        } else {
            emptyState.style.display = 'block';
        }
    }

    // Function to save tasks to local storage, so when refreshing page, our list is still there
    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('.todo-list__task-item').forEach(taskItem => {
            const taskText = taskItem.querySelector('.todo-list__task-item-text').textContent;
            const isCompleted = taskItem.querySelector('.todo-list__checkbox').checked;
            tasks.push({ text: taskText, completed: isCompleted });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Function to load tasks from local storage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => addTask(task.text, task.completed));
    }

    // Initialize empty state on page load
    toggleEmptyState();

    // Initialize add task buttton state on page load
    addTaskBtn.disabled = true;

    //Load tasks from local storage
    loadTasks();
})