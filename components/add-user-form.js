import { createTag, setEventListener } from '../utils/dom.js';

export function createAddUserForm(options = {}) {
    const { onSave, onCancel } = options;
    
    const overlay = createTag('div', { className: 'modal-overlay' });
    const formContainer = createTag('div', { className: 'add-user-form' });
    const formTitle = createTag('h3', {}, '➕ Добавить нового пользователя');
    
    const nameInput = createTag('input', { 
        type: 'text', 
        placeholder: 'Полное имя', 
        className: 'form-input', 
        required: true 
    });
    const emailInput = createTag('input', { 
        type: 'email', 
        placeholder: 'Email адрес', 
        className: 'form-input', 
        required: true 
    });
    const usernameInput = createTag('input', { 
        type: 'text', 
        placeholder: 'Имя пользователя (опционально)', 
        className: 'form-input' 
    });
    const phoneInput = createTag('input', { 
        type: 'tel', 
        placeholder: 'Телефон (опционально)', 
        className: 'form-input' 
    });
    
    const formActions = createTag('div', { className: 'form-actions' });
    const saveBtn = createTag('button', { className: 'btn btn-success' }, '💾 Сохранить');
    const cancelBtn = createTag('button', { className: 'btn btn-secondary' }, '❌ Отмена');
    
    formActions.appendChild(saveBtn);
    formActions.appendChild(cancelBtn);
    
    formContainer.appendChild(formTitle);
    formContainer.appendChild(createTag('label', {}, 'Имя:'));
    formContainer.appendChild(nameInput);
    formContainer.appendChild(createTag('label', {}, 'Email:'));
    formContainer.appendChild(emailInput);
    formContainer.appendChild(createTag('label', {}, 'Username:'));
    formContainer.appendChild(usernameInput);
    formContainer.appendChild(createTag('label', {}, 'Телефон:'));
    formContainer.appendChild(phoneInput);
    formContainer.appendChild(formActions);
    overlay.appendChild(formContainer);
    
    function handleSave() {
        const userData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            username: usernameInput.value.trim() || undefined, // Fixed this line
            phone: phoneInput.value.trim() || undefined
        };
        
        if (!userData.name || !userData.email) {
            alert('Пожалуйста, заполните обязательные поля (имя и email)');
            return;
        }
        
        if (onSave) onSave(userData);
    }
    
    function handleCancel() {
        if (onCancel) onCancel();
    }
    
    setEventListener(saveBtn, 'click', handleSave);
    setEventListener(cancelBtn, 'click', handleCancel);
    setEventListener(overlay, 'click', (e) => { 
        if (e.target === overlay) handleCancel(); 
    });
    setEventListener(document, 'keydown', (e) => { 
        if (e.key === 'Escape') handleCancel(); 
    });
    
    setTimeout(() => nameInput.focus(), 100);
    return overlay;
}
