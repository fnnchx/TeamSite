import { createHeader } from './components/header.js';
import { createBreadcrumbs } from './components/breadcrumbs.js';
import { createUsersPage } from './components/users-page.js';
import { createTodosPage } from './components/todos-page.js';
import { createPostsPage } from './components/posts-page.js';
import { createCommentsPage } from './components/comments-page.js';
import { createLoading, createError } from './components/loading.js';
import { Router } from './navigation/router.js';
import { createTag } from './utils/dom.js';

class App {
    constructor() {
        this.appContainer = document.getElementById('app');
        this.router = new Router();
        this.currentPage = null;
        this.init();
    }

    init() {
        this.setupRouter();
        this.renderAppShell();
        this.router.handleRouteChange();
    }

    setupRouter() {
        this.router.registerRoute('#users', (route) => this.renderPage('users'));
        this.router.registerRoute('#users#todos', (route) => this.renderPage('todos'));
        this.router.registerRoute('#users#posts', (route) => this.renderPage('posts'));
        this.router.registerRoute('#users#posts#comments', (route) => this.renderPage('comments'));

        window.addEventListener('routechange', (event) => {
            this.updateBreadcrumbs(event.detail.breadcrumbs);
        });
    }

    renderAppShell() {
        this.appContainer.innerHTML = '';
        const header = createHeader();
        this.appContainer.appendChild(header);
        this.breadcrumbsContainer = createTag('div', { className: 'breadcrumbs-wrapper' });
        this.appContainer.appendChild(this.breadcrumbsContainer);
        this.contentContainer = createTag('main', { className: 'main-content', id: 'main-content' });
        this.appContainer.appendChild(this.contentContainer);
    }

    updateBreadcrumbs(breadcrumbsData) {
        this.breadcrumbsContainer.innerHTML = '';
        const currentHash = this.router.getCurrentHash();
        const breadcrumbs = createBreadcrumbs(currentHash);
        this.breadcrumbsContainer.appendChild(breadcrumbs);
    }

    async renderPage(pageType) {
        this.contentContainer.innerHTML = '';
        this.contentContainer.appendChild(createLoading('Загружаем данные...'));

        try {
            let pageComponent;
            switch (pageType) {
                case 'users': pageComponent = await createUsersPage(); break;
                case 'todos': pageComponent = await createTodosPage(); break;
                case 'posts': pageComponent = await createPostsPage(); break;
                case 'comments': pageComponent = await createCommentsPage(); break;
                default: pageComponent = await createUsersPage();
            }
            this.contentContainer.innerHTML = '';
            this.contentContainer.appendChild(pageComponent);
            this.currentPage = pageType;
            this.contentContainer.scrollTop = 0;
        } catch (error) {
            console.error('Error rendering page:', error);
            this.contentContainer.innerHTML = '';
            this.contentContainer.appendChild(createError('Ошибка загрузки страницы', error.message, () => this.renderPage(pageType)));
        }
    }

    navigateTo(path) {
        this.router.navigateTo(path);
    }

    getCurrentPage() {
        return this.currentPage;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});