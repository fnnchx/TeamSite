import { getRouteByHash, getBreadcrumbsForRoute } from './routes.js';

export class Router {
    constructor() {
        this.currentRoute = null;
        this.routes = new Map();
        this.init();
    }

    init() {
        window.addEventListener('hashchange', () => {
            this.handleRouteChange();
        });

        window.addEventListener('load', () => {
            this.handleRouteChange();
        });
    }

    registerRoute(path, handler) {
        this.routes.set(path, handler);
    }

    handleRouteChange() {
        const hash = window.location.hash || '#users';
        const route = getRouteByHash(hash);
        
        this.currentRoute = route;
        
        const handler = this.routes.get(route.path);
        if (handler) {
            handler(route);
        }

        document.title = `${route.title} - SPA App`;
        this.dispatchRouteChange(route);
    }

    dispatchRouteChange(route) {
        const event = new CustomEvent('routechange', {
            detail: {
                route: route,
                breadcrumbs: getBreadcrumbsForRoute(route.path),
                hash: window.location.hash
            }
        });
        window.dispatchEvent(event);
    }

    navigateTo(path) {
        window.location.hash = path;
    }

    getCurrentRoute() {
        return this.currentRoute;
    }

    getCurrentHash() {
        return window.location.hash || '#users';
    }
}
