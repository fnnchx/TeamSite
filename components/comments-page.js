import { createTag } from '../utils/dom.js';
import { createSearchInput } from './search.js';
import { ApiService } from '../services/api.js';
import { StorageService } from '../services/storage.js';
import { createLoading, createError } from './loading.js';

export async function createCommentsPage() {
    const container = createTag('div', { className: 'page-container comments-page' });
    const currentPost = StorageService.getCurrentPost();
    const postInfo = currentPost ? `к посту: "${currentPost.title.substring(0, 50)}..."` : "";
    const title = createTag('h1', { className: 'page-title' }, `💬 Комментарии ${postInfo}`);
    const searchContainer = createSearchInput((searchTerm) => filterComments(searchTerm), '🔍 Поиск по имени или содержимому комментария...', 300);
    const commentsList = createTag('div', { className: 'comments-list' });
    
    container.appendChild(title);
    container.appendChild(searchContainer);
    container.appendChild(commentsList);
    
    let allComments = [];
    
    try {
        commentsList.appendChild(createLoading('Загружаем комментарии...'));
        const comments = currentPost ? await ApiService.getPostComments(currentPost.id) : await ApiService.getComments();
        allComments = comments;
        renderComments(allComments);
    } catch (error) {
        commentsList.appendChild(createError('Ошибка загрузки комментариев', error.message, loadComments));
    }
    
    function filterComments(searchTerm) {
        if (!searchTerm.trim()) {
            renderComments(allComments);
            return;
        }
        const filtered = allComments.filter(comment => 
            comment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            comment.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
            comment.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        renderComments(filtered);
    }
    
    function renderComments(comments) {
        commentsList.innerHTML = '';
        if (comments.length === 0) {
            const emptyState = createTag('div', { className: 'empty-state' });
            emptyState.appendChild(createTag('p', {}, '📭 Комментарии не найдены'));
            if (!currentPost) emptyState.appendChild(createTag('p', { className: 'empty-state-hint' }, 'Выберите пост чтобы увидеть комментарии'));
            commentsList.appendChild(emptyState);
            return;
        }
        comments.forEach(comment => {
            const commentElement = createCommentItem(comment);
            commentsList.appendChild(commentElement);
        });
    }
    
    function createCommentItem(comment) {
        const commentElement = createTag('div', { className: 'comment-item' });
        const commentHeader = createTag('div', { className: 'comment-header' });
        const commentAuthor = createTag('strong', { className: 'comment-author' }, comment.name);
        const commentEmail = createTag('span', { className: 'comment-email' }, comment.email);
        commentHeader.appendChild(commentAuthor);
        commentHeader.appendChild(commentEmail);
        const commentBody = createTag('p', { className: 'comment-body' }, comment.body);
        commentElement.appendChild(commentHeader);
        commentElement.appendChild(commentBody);
        return commentElement;
    }
    
    async function loadComments() {
        try {
            commentsList.innerHTML = '';
            commentsList.appendChild(createLoading('Загружаем комментарии...'));
            const comments = currentPost ? await ApiService.getPostComments(currentPost.id) : await ApiService.getComments();
            allComments = comments;
            renderComments(allComments);
        } catch (error) {
            commentsList.appendChild(createError('Ошибка загрузки комментариев', error.message, loadComments));
        }
    }
    
    return container;
}