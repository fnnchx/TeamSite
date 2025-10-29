import { createTag } from '../utils/dom.js';

export function createUserCard(user, options = {}) {
    if (!user || typeof user !== 'object') {
        console.error('Invalid user data provided to createUserCard');
        return createTag('div', { className: 'user-card error' }, 'Invalid user data');
    }
    
    const { onDelete, onShowTodos, onShowPosts } = options;
    
    const userCard = createTag('div', { 
        className: `user-card ${user.isLocal ? 'local-user' : ''}`,
        'data-user-id': user.id
    });
    
    const userInfo = createTag('div', { className: 'user-info' });
    const userName = createTag('h3', { className: 'user-name' }, user.name || 'Unknown User');
    const userEmail = createTag('p', { className: 'user-email' }, user.email || 'No email');
    
    userInfo.appendChild(userName);
    userInfo.appendChild(userEmail);
    
    const userMeta = createTag('div', { className: 'user-meta' });
    if (user.username) {
        userMeta.appendChild(createTag('span', { className: 'user-username' }, `@${user.username}`));
    }
    if (user.phone) {
        userMeta.appendChild(createTag('span', { className: 'user-phone' }, `📞 ${user.phone}`));
    }
    if (user.isLocal) {
        userMeta.appendChild(createTag('span', { className: 'local-badge' }, '🟢 Локальный пользователь'));
    }
    userInfo.appendChild(userMeta);
    
    const userActions = createTag('div', { className: 'user-actions' });
    
    if (user.isLocal && onDelete) {
        const deleteBtn = createTag('button', { 
            className: 'btn btn-danger delete-btn', 
            onclick: () => onDelete(user),
            title: 'Удалить пользователя' 
        }, '🗑 Удалить');
        userActions.appendChild(deleteBtn);
    }
    
    if (onShowTodos) {
        const todosLink = createTag('button', { 
            className: 'btn btn-primary action-btn', 
            onclick: () => onShowTodos(user),
            title: 'Показать задачи' 
        }, '📝 Задачи');
        userActions.appendChild(todosLink);
    }
    
    if (onShowPosts) {
        const postsLink = createTag('button', { 
            className: 'btn btn-primary action-btn', 
            onclick: () => onShowPosts(user),
            title: 'Показать посты' 
        }, '📄 Посты');
        userActions.appendChild(postsLink);
    }
    
    userCard.appendChild(userInfo);
    userCard.appendChild(userActions);
    return userCard;
}
