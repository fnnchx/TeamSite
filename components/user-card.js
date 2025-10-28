import { createTag } from '../utils/dom.js';

export function createUserCard(user, options = {}) {
    const { onDelete, onShowTodos, onShowPosts } = options;
    
    const userCard = createTag('div', { className: user-card ${user.isLocal ? 'local-user' : ''} });
    const userInfo = createTag('div', { className: 'user-info' });
    const userName = createTag('h3', { className: 'user-name' }, user.name);
    const userEmail = createTag('p', { className: 'user-email' }, user.email);
    
    userInfo.appendChild(userName);
    userInfo.appendChild(userEmail);
    
    const userMeta = createTag('div', { className: 'user-meta' });
    if (user.username) {
        userMeta.appendChild(createTag('span', { className: 'user-username' }, @${user.username}));
    }
    if (user.phone) {
        userMeta.appendChild(createTag('span', { className: 'user-phone' }, 📞 ${user.phone}));
    }
    if (user.isLocal) {
        userMeta.appendChild(createTag('span', { className: 'local-badge' }, '🟢 Локальный пользователь'));
    }
    userInfo.appendChild(userMeta);
    
    const userActions = createTag('div', { className: 'user-actions' });
    if (user.isLocal && onDelete) {
        const deleteBtn = createTag('button', { className: 'btn btn-danger delete-btn', onclick: onDelete, title: 'Удалить пользователя' }, '🗑 Удалить');
        userActions.appendChild(deleteBtn);
    }
    const todosLink = createTag('button', { className: 'btn btn-primary action-btn', onclick: onShowTodos, title: 'Показать задачи' }, '📝 Задачи');
    const postsLink = createTag('button', { className: 'btn btn-primary action-btn', onclick: onShowPosts, title: 'Показать посты' }, '📄 Посты');
    userActions.appendChild(todosLink);
    userActions.appendChild(postsLink);
    
    userCard.appendChild(userInfo);
    userCard.appendChild(userActions);
    return userCard;
}