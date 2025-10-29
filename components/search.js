import { createTag, setEventListener } from '../utils/dom.js';

export function createSearchInput(onSearch, placeholder = 'Search...', debounceDelay = 300) {
    let timeoutId;
    
    const searchContainer = createTag('div', {
        className: 'search-container'
    });
    
    const searchInput = createTag('input', {
        type: 'text',
        placeholder: placeholder,
        className: 'search-input',
        'aria-label': 'Search input'
    });
    
    const debounceSearch = (value) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            onSearch(value);
        }, debounceDelay);
    };
    
    setEventListener(searchInput, 'input', (e) => {
        debounceSearch(e.target.value);
    });
    
    setEventListener(searchInput, 'keydown', (e) => {
        if (e.key === 'Escape') {
            searchInput.value = '';
            onSearch('');
        }
    });
    
    searchContainer.appendChild(searchInput);
    return searchContainer;
}