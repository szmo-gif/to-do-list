const TODO_STORAGE_KEY = "todos";
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");

todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteCheck);
filterOption.addEventListener("click", filterTodo);
document.addEventListener("DOMContentLoaded", getTodos);

function addTodo(event) {
  event.preventDefault();
  const todoText = todoInput.value.trim();
  if (todoText === "") return;

  createTodoElement(todoText);
  saveTodoToLocalStorage(todoText);
  todoInput.value = "";
}

function createTodoElement(todoText) {
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");

  const newTodo = document.createElement("li");
  newTodo.innerText = todoText;
  newTodo.classList.add("todo-item");
  todoDiv.appendChild(newTodo);

  createButton(todoDiv, "complete-btn", '<i class="fa-solid fa-check"></i>');
  createButton(todoDiv, "trash-btn", '<i class="fa-solid fa-trash"></i>');

  todoList.appendChild(todoDiv);
}

function createButton(parent, buttonClass, innerHTML) {
  const button = document.createElement("button");
  button.innerHTML = innerHTML;
  button.classList.add(buttonClass);
  parent.appendChild(button);
}

function deleteCheck(event) {
  const target = event.target;
  const todo = target.closest(".todo");

  if (target.classList.contains("trash-btn")) {
    todo.classList.add("fall");
    removeTodoFromLocalStorage(todo);
    todo.addEventListener("transitionend", () => {
      todo.remove();
    });
  }

  if (target.classList.contains("complete-btn")) {
    todo.classList.toggle("completed");
  }
}

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

function saveTodoToLocalStorage(todoText) {
  const todos = getTodosFromLocalStorage();
  todos.push(todoText);
  localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
}

function getTodosFromLocalStorage() {
  return JSON.parse(localStorage.getItem(TODO_STORAGE_KEY)) || [];
}

function getTodos() {
  const todos = getTodosFromLocalStorage();
  todos.forEach(todoText => createTodoElement(todoText));
}

function removeTodoFromLocalStorage(todoElement) {
  const todoText = todoElement.querySelector(".todo-item").innerText;
  const todos = getTodosFromLocalStorage();
  const filteredTodos = todos.filter(todo => todo !== todoText);
  localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(filteredTodos));
}
