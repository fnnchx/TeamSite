import { createTag } from '../utils/dom.js';
import { createSearchInput } from './search.js';
import { ApiService } from '../services/api.js';
import { StorageService } from '../services/storage.js';
import { createLoading, createError } from './loading.js';
import { createUserCard } from './user-card.js';
import { createAddUserForm } from './add-user-form.js';

export async function createUsersPage() {
    const container = createTag('div', { className: 'page-container users-page' });
    
    const title = createTag('h1', { className: 'page-title' }, '👥 Пользователи');
    const searchContainer = createSearchInput((searchTerm) => filterUsers(searchTerm), '🔍 Поиск по имени или email...', 300);
    const addUserBtn = createTag('button', { className: 'btn btn-success add-user-btn', onclick: showAddUserForm }, '+ Добавить пользователя');
    const actionsContainer = createTag('div', { className: 'page-actions' });
    actionsContainer.appendChild(addUserBtn);
    const usersList = createTag('div', { className: 'users-list' });
    
    container.appendChild(title);
    container.appendChild(searchContainer);
    container.appendChild(actionsContainer);
    container.appendChild(usersList);
    
    let allUsers = [];
    
    try {
        usersList.appendChild(createLoading('Загружаем пользователей...'));
        const [apiUsers, localUsers] = await Promise.all([ApiService.getUsers(), Promise.resolve(StorageService.getUsers())]);
        allUsers = [...apiUsers, ...localUsers];
        renderUsers(allUsers);
    } catch (error) {
        usersList.appendChild(createError('Ошибка загрузки пользователей', error.message, loadUsers));
    }
    
    function filterUsers(searchTerm) {
        if (!searchTerm.trim()) {
            renderUsers(allUsers);
            return;
        }
        const filtered = allUsers.filter(user => 
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        renderUsers(filtered);
    }
    
    function renderUsers(users) {
        usersList.innerHTML = '';
        if (users.length === 0) {
            const emptyState = createTag('div', { className: 'empty-state' });
            emptyState.appendChild(createTag('p', {}, '😔 Пользователи не найдены'));
            usersList.appendChild(emptyState);
            return;
        }
        users.forEach(user => {
            const userCard = createUserCard(user, {
                onDelete: () => deleteUser(user.id),
                onShowTodos: () => showUserTodos(user),
                onShowPosts: () => showUserPosts(user)
            });
            usersList.appendChild(userCard);
        });
    }
    
    function deleteUser(userId) {
        if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
            StorageService.deleteUser(userId);
            allUsers = allUsers.filter(user => user.id !== userId);
            renderUsers(allUsers);
        }
    }
    
    function showUserTodos(user) {
        StorageService.setCurrentUser(user);
        window.location.hash = '#users#todos';
    }
    
    function showUserPosts(user) {
        StorageService.setCurrentUser(user);
        window.location.hash = '#users#posts';
    }
    
    function showAddUserForm() {
        const form = createAddUserForm({
            onSave: (userData) => {
                const newUser = StorageService.saveUser(userData);
                allUsers.push(newUser);
                renderUsers(allUsers);
                form.remove();
            },
            onCancel: () => form.remove()
        });
        container.appendChild(form);
    }
    
    async function loadUsers() {
        try {
            usersList.innerHTML = '';
            usersList.appendChild(createLoading('Загружаем пользователей...'));
            const [apiUsers, localUsers] = await Promise.all([ApiService.getUsers(), Promise.resolve(StorageService.getUsers())]);
            allUsers = [...apiUsers, ...localUsers];
renderUsers(allUsers);
        } catch (error) {
            usersList.appendChild(createError('Ошибка загрузки пользователей', error.message, loadUsers));
        }
    }
    
    return container;
}