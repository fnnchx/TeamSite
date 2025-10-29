import { createTag } from '../utils/dom.js';

export function createErrorComponent(message, details = '', onRetry = null) {
    return createError(message, details, onRetry);
}