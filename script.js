document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('taskList');
    const createTaskButton = document.getElementById('createTask');
    
    function fetchTasks() {
        fetch('http://localhost:3000/fetchTasks')
            .then(response => response.json())
            .then(tasks => {
                taskList.innerHTML = '';
                tasks.forEach(task => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <span>${task.taskname}</span>
                        <input type="checkbox" class="mark-done" data-id="${task.id}">
                    `;
                    taskList.appendChild(li);
                });

                document.querySelectorAll('.mark-done').forEach(checkbox => {
                    checkbox.addEventListener('change', (e) => {
                        if (e.target.checked) {
                            markTaskAsDone(e.target);
                        }
                    });
                });
            });
    }

    function createTask() {
        const taskName = document.getElementById('taskname').value;

        fetch(`http://localhost:3000/createTask/${taskName}/pending`, { method: 'POST' })
            .then(() => {
                document.getElementById('taskname').value = '';
                fetchTasks();
            });
    }

    function markTaskAsDone(checkbox) {
        const taskId = checkbox.dataset.id;
        const taskItem = checkbox.parentElement;

        taskItem.classList.add('done');
        setTimeout(() => {
            deleteTask(taskId);
        }, 300);
    }

    function deleteTask(taskId) {
        fetch(`http://localhost:3000/deleteTask/${taskId}`, { method: 'DELETE' })
            .then(() => fetchTasks());
    }

    createTaskButton.addEventListener('click', createTask);

    fetchTasks();
});
