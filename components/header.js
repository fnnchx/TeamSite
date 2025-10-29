import { createTag } from '../utils/dom.js';

export function createHeader() {
    const header = createTag('header', {
        className: 'app-header'
    });

    const title = createTag('h1', {
        className: 'app-title'
    }, 'SPA Application');

    const subtitle = createTag('p', {
        className: 'app-subtitle'
    }, 'Single Page Application с использованием чистого JavaScript');

    header.appendChild(title);
    header.appendChild(subtitle);

    return header;
}