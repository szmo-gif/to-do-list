// Clé pour le stockage local
const TODO_STORAGE_KEY = "todos";

// Sélection des éléments HTML
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");

// Écouteurs d'événements
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteCheck);
filterOption.addEventListener("click", filterTodo);
document.addEventListener("DOMContentLoaded", getTodos);

// Fonction pour ajouter une tâche
function addTodo(event) {
  event.preventDefault();
  // Récupération du texte de la tâche et vérification s'il est vide
  const todoText = todoInput.value.trim();
  if (todoText === "") return;

  // Création de l'élément de tâche et enregistrement dans le stockage local
  createTodoElement(todoText);
  saveTodoToLocalStorage(todoText);
  todoInput.value = "";
}

// Fonction pour créer un nouvel élément de tâche
function createTodoElement(todoText) {
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");

  const newTodo = document.createElement("li");
  newTodo.innerText = todoText;
  newTodo.classList.add("todo-item");
  todoDiv.appendChild(newTodo);

  // Ajout des boutons de complétion et de suppression
  createButton(todoDiv, "complete-btn", '<i class="fa-solid fa-check"></i>');
  createButton(todoDiv, "trash-btn", '<i class="fa-solid fa-trash"></i>');

  todoList.appendChild(todoDiv);
}

// Fonction pour créer un bouton
function createButton(parent, buttonClass, innerHTML) {
  const button = document.createElement("button");
  button.innerHTML = innerHTML;
  button.classList.add(buttonClass);
  parent.appendChild(button);
}

// Fonction pour supprimer ou marquer une tâche comme complétée
function deleteCheck(event) {
  const target = event.target;
  const todo = target.closest(".todo");

  if (target.classList.contains("trash-btn")) {
    // Supprimer la tâche
    todo.classList.add("fall");
    removeTodoFromLocalStorage(todo);
    todo.addEventListener("transitionend", () => {
      todo.remove();
    });
  }

  if (target.classList.contains("complete-btn")) {
    // Marquer la tâche comme complétée
    todo.classList.toggle("completed");
    saveTodoToLocalStorage(todo.querySelector(".todo-item").innerText, todo.classList.contains("completed"));
  }
}


// Fonction pour filtrer les tâches affichées
function filterTodo() {
  const todos = Array.from(todoList.children);
  todos.forEach(todo => {
    switch (filterOption.value) {
      case "completed":
        todo.style.display = todo.classList.contains("completed") ? "flex" : "none";
        break;
      case "uncompleted":
        todo.style.display = !todo.classList.contains("completed") ? "flex" : "none";
        break;
      default:
        todo.style.display = "flex";
    }
  });
}

// Fonction pour enregistrer une tâche dans le stockage local
function saveTodoToLocalStorage(todoText, todoCompleted) {
  let todos = getTodosFromLocalStorage();

  // Recherche de la tâche existante dans le tableau
  const existingTodoIndex = todos.findIndex(todo => todo.text === todoText);

  if (existingTodoIndex !== -1) {
    // Mettre à jour les informations de la tâche existante
    todos[existingTodoIndex].completed = todoCompleted;
  } else {
    // Ajouter une nouvelle tâche si elle n'existe pas déjà
    todos.push({ text: todoText, completed: todoCompleted });
  }

  localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
}



// Fonction pour récupérer les tâches depuis le stockage local
function getTodosFromLocalStorage() {
  return JSON.parse(localStorage.getItem(TODO_STORAGE_KEY)) || [];
}

// Fonction pour afficher les tâches sauvegardées lors du chargement de la page
function getTodos() {
  const todos = getTodosFromLocalStorage();
  todos.forEach(todo => {
    createTodoElement(todo.text, todo.completed);
    if (todo.completed) {
      const todoItem = todoList.lastChild.querySelector(".todo-item");
      todoItem.classList.add("completed");
    }
  });
}


// Fonction pour supprimer une tâche du stockage local
function removeTodoFromLocalStorage(todoElement) {
  const todoText = todoElement.querySelector(".todo-item").innerText;
  const todos = getTodosFromLocalStorage();
  const filteredTodos = todos.filter(todo => todo.text !== todoText);
  localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(filteredTodos));
}
