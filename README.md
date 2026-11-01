# Task Manager Web App

A clean, modern task management web application built with modular web standards.

## Project Structure

```text
task_list_app/
├── index.html     # Page markup and semantic HTML skeleton
├── style.css      # Custom styling, animations, and scrollbar rules
├── app.js         # State management, local storage, and user interactions
└── README.md      # Project overview and setup instructions
```

## How to Run Locally

1. Download and extract `task_list_website.zip`.
2. Double-click `index.html` to open the app directly in any modern web browser (Chrome, Edge, Firefox, Safari).
3. No build tools, package managers, or server installation required!

## How It Works

* **`index.html`** links to `style.css` via `<link rel="stylesheet" href="style.css">` and loads `app.js` at the bottom via `<script src="app.js"></script>`.
* **`app.js`** handles the application state (`tasks` array), automatic `localStorage` synchronization, live filtering, inline editing, and JSON backups.
* **`style.css`** provides custom typography, scrollbar styling, and transition properties.
