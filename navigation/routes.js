export const routes = {
    users: {
        path: '#users',
        title: 'Пользователи',
        breadcrumb: 'Users',
        endpoint: '/users'
    },
    todos: {
        path: '#users#todos', 
        title: 'Список задач',
        breadcrumb: 'Todos',
        endpoint: '/todos'
    },
    posts: {
        path: '#users#posts',
        title: 'Посты пользователей', 
        breadcrumb: 'Posts',
        endpoint: '/posts'
    },
    comments: {
        path: '#users#posts#comments',
        title: 'Комментарии',
        breadcrumb: 'Comments',
        endpoint: '/comments'
    }
};

export const breadcrumbsMap = {
    '#users': [
        { name: 'Users', path: '#users' }
    ],
    '#users#todos': [
        { name: 'Users', path: '#users' },
        { name: 'Todos', path: '#users#todos' }
    ],
    '#users#posts': [
        { name: 'Users', path: '#users' },
        { name: 'Posts', path: '#users#posts' }
    ],
    '#users#posts#comments': [
        { name: 'Users', path: '#users' },
        { name: 'Posts', path: '#users#posts' },
        { name: 'Comments', path: '#users#posts#comments' }
    ]
};

export function getRouteByHash(hash) {
    return Object.values(routes).find(route => route.path === hash) || routes.users;
}

export function getBreadcrumbsForRoute(hash) {
    return breadcrumbsMap[hash] || breadcrumbsMap['#users'];
}
