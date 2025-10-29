import { createTag } from '../utils/dom.js';

export function createPostCard(post, options = {}) {
    const { onShowComments } = options;
    const postCard = createTag('div', { className: 'post-card' });
    const postTitle = createTag('h3', { className: 'post-title' }, post.title);
    const postBody = createTag('p', { className: 'post-body' }, post.body);
    const postMeta = createTag('div', { className: 'post-meta' });
    if (post.userId) {
        postMeta.appendChild(createTag('span', { className: 'post-user' }, "👤 User ID: ${post.userId}"));
    }
    const postActions = createTag('div', { className: 'post-actions' });
    const commentsBtn = createTag('button', { className: 'btn btn-primary', onclick: onShowComments, title: 'Показать комментарии' }, '💬 Комментарии');
    postActions.appendChild(commentsBtn);
    postCard.appendChild(postTitle);
    postCard.appendChild(postBody);
    postCard.appendChild(postMeta);
    postCard.appendChild(postActions);
    return postCard;
}
