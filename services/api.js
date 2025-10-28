const BASE_URL = 'https://jsonplaceholder.typicode.com';

export class ApiService {
    static async request(url, options = {}) {
        try {
            const response = await fetch(`${BASE_URL}${url}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    static async getUsers() {
        return this.request('/users');
    }
    
    static async getTodos() {
        return this.request('/todos');
    }
    
    static async getPosts() {
        return this.request('/posts');
    }
    
    static async getComments() {
        return this.request('/comments');
    }

    static async getUserTodos(userId) {
        return this.request(`/todos?userId=${userId}`);
    }

    static async getUserPosts(userId) {
        return this.request(`/posts?userId=${userId}`);
    }

    static async getPostComments(postId) {
        return this.request(`/comments?postId=${postId}`);
    }
}
