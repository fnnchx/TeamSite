import { createTag } from '../utils/dom.js';

export function createTodoItem(todo, options = {}) {
    const { onToggle, onDelete } = options;
    const todoItem = createTag('div', { className: todo-item ${todo.completed ? 'completed' : ''} ${todo.isLocal ? 'local-todo' : ''} });
    const checkbox = createTag('input', { type: 'checkbox', checked: todo.completed, onchange: onToggle, className: 'todo-checkbox' });
    const todoText = createTag('span', { className: 'todo-text' }, todo.title);
    if (todo.isLocal) {
        const localBadge = createTag('span', { className: 'local-badge' }, '🟢');
        todoText.appendChild(localBadge);
    }
    const todoActions = createTag('div', { className: 'todo-actions' });
    if (todo.isLocal && onDelete) {
        const deleteBtn = createTag('button', { className: 'btn btn-danger delete-btn', onclick: onDelete, title: 'Удалить задачу' }, '🗑');
        todoActions.appendChild(deleteBtn);
    }
    todoItem.appendChild(checkbox);
    todoItem.appendChild(todoText);
    todoItem.appendChild(todoActions);
    return todoItem;
}