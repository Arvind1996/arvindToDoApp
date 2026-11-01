/**
 * Task Manager Application Logic
 */

// DOM Elements
const appBody = document.getElementById('appBody');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeIcon = document.getElementById('themeIcon');
const taskInput = document.getElementById('taskInput');
const priorityInput = document.getElementById('priorityInput');
const dateInput = document.getElementById('dateInput');
const searchInput = document.getElementById('searchInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const listFooter = document.getElementById('listFooter');
const taskCounter = document.getElementById('taskCounter');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');

const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const importFileInput = document.getElementById('importFileInput');

const filterAll = document.getElementById('filterAll');
const filterActive = document.getElementById('filterActive');
const filterCompleted = document.getElementById('filterCompleted');

let currentFilter = 'all';
let isDarkMode = false;

// 1. Theme Management
try {
  isDarkMode = localStorage.getItem('theme_dark') === 'true';
} catch (e) {
  isDarkMode = false;
}

function applyTheme() {
  const mainCard = document.querySelector('main');
  if (isDarkMode) {
    document.documentElement.classList.add('dark');
    appBody.classList.remove('bg-slate-50', 'text-slate-800');
    appBody.classList.add('bg-slate-900', 'text-slate-100');
    mainCard.classList.remove('bg-white', 'border-slate-200');
    mainCard.classList.add('bg-slate-800', 'border-slate-700');
    themeIcon.textContent = '☀️';
  } else {
    document.documentElement.classList.remove('dark');
    appBody.classList.remove('bg-slate-900', 'text-slate-100');
    appBody.classList.add('bg-slate-50', 'text-slate-800');
    mainCard.classList.remove('bg-slate-800', 'border-slate-700');
    mainCard.classList.add('bg-white', 'border-slate-200');
    themeIcon.textContent = '🌙';
  }
}

themeToggleBtn.addEventListener('click', () => {
  isDarkMode = !isDarkMode;
  try {
    localStorage.setItem('theme_dark', isDarkMode);
  } catch (e) {}
  applyTheme();
  render();
});

applyTheme();

// 2. State & Storage Management
let tasks = [];
try {
  const saved = localStorage.getItem('my_task_list_v2');
  if (saved) tasks = JSON.parse(saved);
} catch (e) {
  tasks = [];
}

function saveTasks() {
  try {
    localStorage.setItem('my_task_list_v2', JSON.stringify(tasks));
  } catch (e) {}
}

function setFilter(filter) {
  currentFilter = filter;

  const buttons = [
    { btn: filterAll, name: 'all' },
    { btn: filterActive, name: 'active' },
    { btn: filterCompleted, name: 'completed' }
  ];

  buttons.forEach(({ btn, name }) => {
    if (name === currentFilter) {
      btn.className = `filter-btn flex-1 py-1.5 rounded-lg text-center transition ${isDarkMode ? 'bg-slate-700 text-white' : 'bg-white text-slate-800 shadow-sm'} font-semibold`;
    } else {
      btn.className = 'filter-btn flex-1 py-1.5 rounded-lg text-center transition text-slate-500 hover:text-slate-700 dark:hover:text-slate-200';
    }
  });

  render();
}

function getPriorityBadge(priority) {
  if (priority === 'high') {
    return '<span class="px-2 py-0.5 rounded-md text-[11px] font-medium bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900">High</span>';
  }
  if (priority === 'low') {
    return '<span class="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600">Low</span>';
  }
  return '<span class="px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-900">Medium</span>';
}

function formatDateBadge(dateStr, isCompleted) {
  if (!dateStr) return '';
  const today = new Date().toISOString().split('T')[0];
  const isOverdue = !isCompleted && dateStr < today;
  const parts = dateStr.split('-');
  const displayDate = `${parts[1]}/${parts[2]}`;

  if (isOverdue) {
    return `<span class="px-2 py-0.5 rounded-md text-[11px] font-medium bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300 border border-rose-300 dark:border-rose-800">Overdue: ${displayDate}</span>`;
  }
  return `<span class="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600">Due: ${displayDate}</span>`;
}

// 3. Render View
function render() {
  taskList.innerHTML = '';
  const query = searchInput.value.trim().toLowerCase();

  const filteredTasks = tasks.filter((t) => {
    if (currentFilter === 'active' && t.completed) return false;
    if (currentFilter === 'completed' && !t.completed) return false;
    if (query && !t.text.toLowerCase().includes(query)) return false;
    return true;
  });

  if (tasks.length === 0) {
    emptyState.textContent = 'No tasks yet. Type something above and click Add!';
    emptyState.style.display = 'block';
    listFooter.classList.add('hidden');
    return;
  }

  listFooter.classList.remove('hidden');

  if (filteredTasks.length === 0) {
    emptyState.textContent = query ? 'No matching tasks found.' : `No ${currentFilter} tasks to show.`;
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
  }

  filteredTasks.forEach((task) => {
    const li = document.createElement('li');
    const itemBg = isDarkMode 
      ? 'bg-slate-700/60 border-slate-700 hover:bg-slate-700' 
      : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70';
    li.className = `group task-item px-4 py-3 border rounded-xl flex items-center justify-between gap-3 transition ${itemBg}`;

    const leftWrapper = document.createElement('div');
    leftWrapper.className = 'flex items-center gap-3 flex-1 min-w-0';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.className = 'w-4 h-4 rounded border-slate-300 dark:border-slate-600 accent-indigo-600 cursor-pointer flex-shrink-0';
    checkbox.addEventListener('change', () => {
      task.completed = checkbox.checked;
      saveTasks();
      render();
    });

    const contentCol = document.createElement('div');
    contentCol.className = 'flex-1 min-w-0';

    const span = document.createElement('span');
    const textColor = task.completed 
      ? 'line-through text-slate-400 dark:text-slate-500' 
      : (isDarkMode ? 'text-slate-100' : 'text-slate-700');
    span.className = `block text-sm select-none truncate transition cursor-pointer ${textColor}`;
    span.textContent = task.text;
    span.title = 'Double-click to edit';

    span.addEventListener('dblclick', () => {
      const editInput = document.createElement('input');
      editInput.type = 'text';
      editInput.value = task.text;
      editInput.className = `w-full px-2 py-1 text-sm rounded border border-indigo-500 focus:outline-none ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-700'}`;
      
      function finishEdit() {
        const newText = editInput.value.trim();
        if (newText) {
          task.text = newText;
          saveTasks();
        }
        render();
      }

      editInput.addEventListener('blur', finishEdit);
      editInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') finishEdit();
        if (e.key === 'Escape') render();
      });

      contentCol.replaceChild(editInput, span);
      editInput.focus();
      editInput.select();
    });

    const badges = document.createElement('div');
    badges.className = 'flex items-center gap-1.5 mt-1';
    badges.innerHTML = getPriorityBadge(task.priority) + formatDateBadge(task.dueDate, task.completed);

    contentCol.appendChild(span);
    contentCol.appendChild(badges);

    leftWrapper.appendChild(checkbox);
    leftWrapper.appendChild(contentCol);

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '&times;';
    deleteBtn.className = 'text-slate-400 hover:text-rose-500 text-lg leading-none p-1 rounded transition opacity-80 group-hover:opacity-100 flex-shrink-0';
    deleteBtn.title = 'Delete task';
    deleteBtn.addEventListener('click', () => {
      tasks = tasks.filter((t) => t.id !== task.id);
      saveTasks();
      render();
    });

    li.appendChild(leftWrapper);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });

  const remaining = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.length - remaining;

  taskCounter.textContent = `${remaining} task${remaining === 1 ? '' : 's'} remaining`;
  clearCompletedBtn.disabled = completedCount === 0;
}

// 4. Action Handlers
function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  tasks.push({
    id: Date.now(),
    text: text,
    priority: priorityInput.value,
    dueDate: dateInput.value,
    completed: false
  });

  saveTasks();
  render();

  taskInput.value = '';
  dateInput.value = '';
  priorityInput.value = 'medium';
  taskInput.focus();
}

function clearCompleted() {
  tasks = tasks.filter((t) => !t.completed);
  saveTasks();
  render();
}

// 5. Backup & Restore
exportBtn.addEventListener('click', () => {
  if (tasks.length === 0) return;
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `tasks_backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
});

importBtn.addEventListener('click', () => {
  importFileInput.click();
});

importFileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const imported = JSON.parse(event.target.result);
      if (Array.isArray(imported)) {
        tasks = imported;
        saveTasks();
        render();
      }
    } catch (err) {}
  };
  reader.readAsText(file);
  importFileInput.value = '';
});

// Event Listeners
addBtn.addEventListener('click', addTask);
clearCompletedBtn.addEventListener('click', clearCompleted);

filterAll.addEventListener('click', () => setFilter('all'));
filterActive.addEventListener('click', () => setFilter('active'));
filterCompleted.addEventListener('click', () => setFilter('completed'));

searchInput.addEventListener('input', render);

taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTask();
});

// Initialize
render();
