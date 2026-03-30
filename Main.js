 // ──────────────────────────────────────────────
  // STATE
  // ──────────────────────────────────────────────
  let tasks = [];
  let currentFilter = 'all';

  // DOM elements
  const taskInput = document.getElementById('task-input');
  const addBtn = document.getElementById('add-btn');
  const taskList = document.getElementById('task-list');
  const clearBtn = document.getElementById('clear-completed');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const totalEl = document.querySelector('.stats span:nth-child(1)');
  const activeEl = document.querySelector('.stats span:nth-child(2)');
  const completedEl = document.querySelector('.stats span:nth-child(3)');

  // ──────────────────────────────────────────────
  // RENDER TASKS
  // ──────────────────────────────────────────────
  function renderTasks() {
    taskList.innerHTML = '';

    let visibleTasks = tasks;
    if (currentFilter === 'active') {
      visibleTasks = tasks.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
      visibleTasks = tasks.filter(t => t.completed);
    }

    visibleTasks.forEach(task => {
      const div = document.createElement('div');
      div.className = 'task';
      if (task.completed) div.classList.add('completed');

      div.innerHTML = `
        <input type="checkbox" ${task.completed ? 'checked' : ''}>
        <span>${task.text}</span>
        <button class="delete-btn">×</button>
      `;

      // Toggle complete
      div.querySelector('input').addEventListener('change', () => {
        task.completed = !task.completed;
        saveAndRender();
      });

      // Delete task
      div.querySelector('.delete-btn').addEventListener('click', () => {
        tasks = tasks.filter(t => t.id !== task.id);
        saveAndRender();
      });

      taskList.appendChild(div);
    });

    updateCounters();
  }

  // ──────────────────────────────────────────────
  // UPDATE COUNTERS
  // ──────────────────────────────────────────────
  function updateCounters() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const active = total - completed;

    totalEl.textContent = `TOTAL: ${total}`;
    activeEl.textContent = `ACTIVE: ${active}`;
    completedEl.textContent = `COMPLETED: ${completed}`;
  }

  // ──────────────────────────────────────────────
  // SAVE + RENDER
  // ──────────────────────────────────────────────
  function saveAndRender() {
    localStorage.setItem('my-todos', JSON.stringify(tasks));
    renderTasks();
  }

  // ──────────────────────────────────────────────
  // ADD TASK
  // ──────────────────────────────────────────────
  function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;

    tasks.push({
      id: Date.now(),
      text,
      completed: false
    });

    taskInput.value = '';
    saveAndRender();
  }

  addBtn.addEventListener('click', addTask);
  taskInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      addTask();
    }
  });

  // ──────────────────────────────────────────────
  // FILTER BUTTONS
  // ──────────────────────────────────────────────
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderTasks();
    });
  });

  // ──────────────────────────────────────────────
  // CLEAR COMPLETED
  // ──────────────────────────────────────────────
  clearBtn.addEventListener('click', () => {
    tasks = tasks.filter(t => !t.completed);
    saveAndRender();
  });

  // ──────────────────────────────────────────────
  // LOAD SAVED TASKS & INITIAL RENDER
  // ──────────────────────────────────────────────
  if (localStorage.getItem('my-todos')) {
    tasks = JSON.parse(localStorage.getItem('my-todos'));
  }
  renderTasks();
