import { createTag } from '../utils/dom.js';

export function createLoading(message = 'Loading...') {
    const loadingContainer = createTag('div', {
        className: 'loading-container'
    });

    const spinner = createTag('div', {
        className: 'loading-spinner',
        'aria-hidden': 'true'
    });

    const loadingText = createTag('p', {
        className: 'loading-text'
    }, message);

    loadingContainer.appendChild(spinner);
    loadingContainer.appendChild(loadingText);

    return loadingContainer;
}

export function createError(message, details = '', onRetry = null) {
    const errorContainer = createTag('div', {
        className: 'error-container'
    });

    const errorIcon = createTag('div', {
        className: 'error-icon',
        'aria-hidden': 'true'
    }, '⚠️');

    const errorMessage = createTag('h3', {
        className: 'error-message'
    }, message);

    errorContainer.appendChild(errorIcon);
    errorContainer.appendChild(errorMessage);

    if (details) {
        const errorDetails = createTag('p', {
            className: 'error-details'
        }, details);
        errorContainer.appendChild(errorDetails);
    }

    if (onRetry && typeof onRetry === 'function') {
        const retryButton = createTag('button', {
            className: 'btn btn-primary retry-btn',
            onclick: onRetry
        }, 'Попробовать снова');
        errorContainer.appendChild(retryButton);
    }

    return errorContainer;
}
