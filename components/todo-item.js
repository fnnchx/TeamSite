import { createTag } from '../utils/dom.js';

export function createTodoItem(todo, options = {}) {
    const { onToggle, onDelete, onEdit } = options;
    
    const todoItem = createTag('div', { 
        className: `todo-item ${todo.completed ? 'completed' : ''} ${todo.isLocal ? 'local-todo' : ''}`,
        'data-todo-id': todo.id
    });
    
    const checkbox = createTag('input', { 
        type: 'checkbox', 
        checked: todo.completed, 
        onchange: onToggle, 
        className: 'todo-checkbox' 
    });
    
    const todoContent = createTag('div', { className: 'todo-content' });
    const todoText = createTag('span', { className: 'todo-text' }, todo.title);
    
    if (todo.isLocal) {
        const localBadge = createTag('span', { 
            className: 'local-badge',
            title: 'Локальная задача' 
        }, '🟢');
        todoText.appendChild(localBadge);
    }
    
    if (todo.userName) {
        const userInfo = createTag('span', { 
            className: 'todo-user',
            title: `Задача пользователя: ${todo.userName}`
        }, `👤 ${todo.userName}`);
        todoContent.appendChild(userInfo);
    }
    
    todoContent.appendChild(todoText);
    
    const todoActions = createTag('div', { className: 'todo-actions' });
    
    if (todo.isLocal && onEdit) {
        const editBtn = createTag('button', { 
            className: 'btn btn-secondary edit-btn', 
            onclick: () => onEdit(todo),
            title: 'Редактировать задачу' 
        }, '✏️');
        todoActions.appendChild(editBtn);
    }
    
    if (todo.isLocal && onDelete) {
        const deleteBtn = createTag('button', { 
            className: 'btn btn-danger delete-btn', 
            onclick: () => onDelete(todo.id),
            title: 'Удалить задачу' 
        }, '🗑');
        todoActions.appendChild(deleteBtn);
    }
    
    todoItem.appendChild(checkbox);
    todoItem.appendChild(todoContent);
    todoItem.appendChild(todoActions);
    
    return todoItem;
}
