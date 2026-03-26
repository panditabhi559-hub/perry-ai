export function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

export function ls_get(key, def = null) {
    try {
        const val = localStorage.getItem(key);
        return val ? JSON.parse(val) : def;
    } catch (e) {
        return def;
    }
}

export function ls_set(key, val) {
    try {
        localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
        console.error('LocalStorage Save Error', e);
    }
}

export function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}
