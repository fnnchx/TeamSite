const STORAGE_KEYS = {
    USERS: 'spa_app_users',
    TODOS: 'spa_app_todos', 
    CURRENT_USER: 'spa_app_current_user',
    CURRENT_POST: 'spa_app_current_post'
};

export class StorageService {
    static setItem(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    static getItem(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return defaultValue;
        }
    }

    static removeItem(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from localStorage:', error);
        }
    }

    static getUsers() {
        return this.getItem(STORAGE_KEYS.USERS, []);
    }

    static saveUser(user) {
        const users = this.getUsers();
        user.id = user.id || Date.now();
        user.isLocal = true;
        users.push(user);
        this.setItem(STORAGE_KEYS.USERS, users);
        return user;
    }

    static deleteUser(userId) {
        const users = this.getUsers().filter(user => user.id !== userId);
        this.setItem(STORAGE_KEYS.USERS, users);
    }

    static getTodos() {
        return this.getItem(STORAGE_KEYS.TODOS, []);
    }

    static saveTodo(todo) {
        const todos = this.getTodos();
        todo.id = todo.id || Date.now();
        todo.isLocal = true;
        todos.push(todo);
        this.setItem(STORAGE_KEYS.TODOS, todos);
        return todo;
    }

    static deleteTodo(todoId) {
        const todos = this.getTodos().filter(todo => todo.id !== todoId);
        this.setItem(STORAGE_KEYS.TODOS, todos);
    }

    static setCurrentUser(user) {
        this.setItem(STORAGE_KEYS.CURRENT_USER, user);
    }

    static getCurrentUser() {
        return this.getItem(STORAGE_KEYS.CURRENT_USER);
    }

    static setCurrentPost(post) {
        this.setItem(STORAGE_KEYS.CURRENT_POST, post);
    }

    static getCurrentPost() {
        return this.getItem(STORAGE_KEYS.CURRENT_POST);
    }

    static clearCurrent() {
        this.removeItem(STORAGE_KEYS.CURRENT_USER);
        this.removeItem(STORAGE_KEYS.CURRENT_POST);
    }
}
