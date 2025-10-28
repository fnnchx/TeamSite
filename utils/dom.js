
export function createTag(tagName, attributes = {}, content = '') {
    const element = document.createElement(tagName);
    
    setAttributes(element, attributes);
    setContent(element, content);
    
    return element;
}

export function setAttributes(element, attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
        if (key.startsWith('on') && typeof value === 'function') {
            const eventName = key.slice(2).toLowerCase();
            element.addEventListener(eventName, value);
        } else if (key === 'className') {
            element.className = value;
        } else if (key === 'style' && typeof value === 'object') {
            Object.assign(element.style, value);
        } else {
            element.setAttribute(key, value);
        }
    });
}

export function setContent(element, content) {
    if (typeof content === 'string') {
        element.textContent = content;
    } else if (Array.isArray(content)) {
        element.append(...content.filter(item => item instanceof Node));
    } else if (content instanceof Node) {
        element.appendChild(content);
    } else if (content !== null && content !== undefined) {
        element.textContent = String(content);
    }
}

export function setEventListener(element, event, handler) {
    element.addEventListener(event, handler);
    return () => element.removeEventListener(event, handler);
}
