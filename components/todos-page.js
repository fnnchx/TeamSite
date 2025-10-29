import { createTag } from '../utils/dom.js';
import { createSearchInput } from './search.js';
import { ApiService } from '../services/api.js';
import { StorageService } from '../services/storage.js';
import { createLoading, createError } from './loading.js';
import { createTodoItem } from './todo-item.js';

export async function createTodosPage() {
    const container = createTag('div', { className: 'page-container todos-page' });
    const currentUser = StorageService.getCurrentUser();
    const userInfo = currentUser ? ` для пользователя: ${currentUser.name}` : ''; // Fixed: added backticks
    const title = createTag('h1', { className: 'page-title' }, `📝 Задачи${userInfo}`); // Fixed: added backticks
    const searchContainer = createSearchInput((searchTerm) => filterTodos(searchTerm), '🔍 Поиск по названию задачи...', 300);
    const addTodoBtn = createTag('button', { className: 'btn btn-success add-todo-btn', onclick: showAddTodoForm }, '+ Добавить задачу');
    const actionsContainer = createTag('div', { className: 'page-actions' });
    actionsContainer.appendChild(addTodoBtn);
    const todosList = createTag('div', { className: 'todos-list' });
    
    container.appendChild(title);
    container.appendChild(searchContainer);
    if (currentUser) container.appendChild(actionsContainer);
    container.appendChild(todosList);
    
    let allTodos = [];
    
    try {
        todosList.appendChild(createLoading('Загружаем задачи...'));
        const [apiTodos, localTodos] = await Promise.all([
            currentUser ? ApiService.getUserTodos(currentUser.id) : ApiService.getTodos(),
            Promise.resolve(StorageService.getTodos())
        ]);
        const userLocalTodos = currentUser ? localTodos.filter(todo => todo.userId === currentUser.id) : localTodos;
        allTodos = [...apiTodos, ...userLocalTodos];
        renderTodos(allTodos);
    } catch (error) {
        todosList.appendChild(createError('Ошибка загрузки задач', error.message, loadTodos));
    }
    
    function filterTodos(searchTerm) {
        if (!searchTerm.trim()) {
            renderTodos(allTodos);
            return;
        }
        const filtered = allTodos.filter(todo => todo.title.toLowerCase().includes(searchTerm.toLowerCase()));
        renderTodos(filtered);
    }
    
    function renderTodos(todos) {
        todosList.innerHTML = '';
        if (todos.length === 0) {
            const emptyState = createTag('div', { className: 'empty-state' });
            emptyState.appendChild(createTag('p', {}, '📭 Задачи не найдены'));
            if (!currentUser) emptyState.appendChild(createTag('p', { className: 'empty-state-hint' }, 'Выберите пользователя чтобы увидеть его задачи'));
            todosList.appendChild(emptyState);
            return;
        }
        
        const completedTodos = todos.filter(todo => todo.completed);
        const activeTodos = todos.filter(todo => !todo.completed);
        
        if (activeTodos.length > 0) {
            const activeSection = createTag('div', { className: 'todos-section' });
            activeSection.appendChild(createTag('h3', {}, `Активные (${activeTodos.length})`)); // Fixed: added backticks
            activeTodos.forEach(todo => {
                const todoElement = createTodoItem(todo, { onToggle: () => toggleTodo(todo.id), onDelete: () => deleteTodo(todo.id) });
                activeSection.appendChild(todoElement);
            });
            todosList.appendChild(activeSection);
        }
        
        if (completedTodos.length > 0) {
            const completedSection = createTag('div', { className: 'todos-section' });
            completedSection.appendChild(createTag('h3', {}, `Выполненные (${completedTodos.length})`)); // Fixed: added backticks
            completedTodos.forEach(todo => {
                const todoElement = createTodoItem(todo, { onToggle: () => toggleTodo(todo.id), onDelete: () => deleteTodo(todo.id) });
                completedSection.appendChild(todoElement);
            });
            todosList.appendChild(completedSection);
        }
    }
    
    function toggleTodo(todoId) {
        const todo = allTodos.find(t => t.id === todoId);
        if (todo && todo.isLocal) {
            todo.completed = !todo.completed;
            StorageService.saveTodo(todo);
            renderTodos(allTodos);
        }
    }
    
    function deleteTodo(todoId) {
        if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
            StorageService.deleteTodo(todoId);
            allTodos = allTodos.filter(todo => todo.id !== todoId);
            renderTodos(allTodos);
        }
    }
    
    function showAddTodoForm() {
        if (!currentUser) {
            alert('Пожалуйста, выберите пользователя сначала');
            return;
        }
        
        const overlay = createTag('div', { className: 'modal-overlay' });
        const form = createTag('div', { className: 'add-form' });
        const titleInput = createTag('input', { 
            type: 'text', 
            placeholder: 'Название задачи', 
            className: 'form-input' 
        });
        
        const formActions = createTag('div', { className: 'form-actions' });
        const saveBtn = createTag('button', { 
            className: 'btn btn-success', 
            onclick: handleSaveTodo 
        }, '💾 Сохранить');
        
        const cancelBtn = createTag('button', { 
            className: 'btn btn-secondary', 
            onclick: () => overlay.remove() 
        }, '❌ Отмена');
        
        formActions.appendChild(saveBtn);
        formActions.appendChild(cancelBtn);
        
        form.appendChild(createTag('h3', {}, 'Новая задача'));
        form.appendChild(titleInput);
        form.appendChild(formActions);
        overlay.appendChild(form);
        container.appendChild(overlay);
        
        function handleSaveTodo() {
            const title = titleInput.value.trim();
            if (title) {
                const newTodo = StorageService.saveTodo({ 
                    userId: currentUser.id, 
                    title: title, 
                    completed: false,
                    isLocal: true 
                });
                allTodos.push(newTodo);
                renderTodos(allTodos);
                overlay.remove();
            } else {
                alert('Пожалуйста, введите название задачи');
                titleInput.focus();
            }
        }
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
        
        document.addEventListener('keydown', function handleEscape(e) {
            if (e.key === 'Escape') {
                overlay.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        });
        
        setTimeout(() => titleInput.focus(), 100);
    }
    
    async function loadTodos() {
        try {
            todosList.innerHTML = '';
            todosList.appendChild(createLoading('Загружаем задачи...'));
            const [apiTodos, localTodos] = await Promise.all([
                currentUser ? ApiService.getUserTodos(currentUser.id) : ApiService.getTodos(),
                Promise.resolve(StorageService.getTodos())
            ]);
            const userLocalTodos = currentUser ? localTodos.filter(todo => todo.userId === currentUser.id) : localTodos;
            allTodos = [...apiTodos, ...userLocalTodos];
            renderTodos(allTodos);
        } catch (error) {
            todosList.appendChild(createError('Ошибка загрузки задач', error.message, loadTodos));
        }
    }
    
    return container;
}