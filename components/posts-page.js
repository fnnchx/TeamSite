import { createTag } from '../utils/dom.js';
import { createSearchInput } from './search.js';
import { ApiService } from '../services/api.js';
import { StorageService } from '../services/storage.js';
import { createLoading, createError } from './loading.js';
import { createPostCard } from './post-card.js';

export async function createPostsPage() {
    const container = createTag('div', { className: 'page-container posts-page' });
    const currentUser = StorageService.getCurrentUser();
    const userInfo = currentUser ?  пользователя: ${currentUser.name} : '';
    const title = createTag('h1', { className: 'page-title' }, 📄 Посты${userInfo});
    const searchContainer = createSearchInput((searchTerm) => filterPosts(searchTerm), '🔍 Поиск по заголовку или содержимому...', 300);
    const postsList = createTag('div', { className: 'posts-list' });
    
    container.appendChild(title);
    container.appendChild(searchContainer);
    container.appendChild(postsList);
    
    let allPosts = [];
    
    try {
        postsList.appendChild(createLoading('Загружаем посты...'));
        const posts = currentUser ? await ApiService.getUserPosts(currentUser.id) : await ApiService.getPosts();
        allPosts = posts;
        renderPosts(allPosts);
    } catch (error) {
        postsList.appendChild(createError('Ошибка загрузки постов', error.message, loadPosts));
    }
    
    function filterPosts(searchTerm) {
        if (!searchTerm.trim()) {
            renderPosts(allPosts);
            return;
        }
        const filtered = allPosts.filter(post => 
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.body.toLowerCase().includes(searchTerm.toLowerCase())
        );
        renderPosts(filtered);
    }
    
    function renderPosts(posts) {
        postsList.innerHTML = '';
        if (posts.length === 0) {
            const emptyState = createTag('div', { className: 'empty-state' });
            emptyState.appendChild(createTag('p', {}, '📭 Посты не найдены'));
            if (!currentUser) emptyState.appendChild(createTag('p', { className: 'empty-state-hint' }, 'Выберите пользователя чтобы увидеть его посты'));
            postsList.appendChild(emptyState);
            return;
        }
        posts.forEach(post => {
            const postCard = createPostCard(post, { onShowComments: () => showPostComments(post) });
            postsList.appendChild(postCard);
        });
    }
    
    function showPostComments(post) {
        StorageService.setCurrentPost(post);
        window.location.hash = '#users#posts#comments';
    }
    
    async function loadPosts() {
        try {
            postsList.innerHTML = '';
            postsList.appendChild(createLoading('Загружаем посты...'));
            const posts = currentUser ? await ApiService.getUserPosts(currentUser.id) : await ApiService.getPosts();
            allPosts = posts;
            renderPosts(allPosts);
        } catch (error) {
            postsList.appendChild(createError('Ошибка загрузки постов', error.message, loadPosts));
        }
    }
    
    return container;
}