// Tailwind Configuration
tailwind.config = {
    theme: {
        extend: {
            colors: {
                teal: {
                    50: '#E6F7F7', 100: '#B3E8E8', 200: '#80D9D9', 300: '#4DCACA',
                    400: '#26BABA', 500: '#00A6A6', 600: '#008B8B', 700: '#007070',
                    800: '#005555', 900: '#003A3A',
                },
                success: '#22C55E',
                surface: { 50: '#FAFBFC', 100: '#F3F4F6', 200: '#E5E7EB', 300: '#D1D5DB' }
            },
            fontFamily: {
                display: ['Plus Jakarta Sans', 'sans-serif'],
                body: ['Inter', 'sans-serif'],
                dm: ['DM Sans', 'sans-serif'],
                space: ['Space Grotesk', 'sans-serif'],
            }
        }
    }
}

// App Logic
let currentPage = 'dashboard';
const scoreTarget = 729;

function navigateTo(page) {
    const currentElement = document.getElementById('page-' + currentPage);
    const targetElement = document.getElementById('page-' + page);
    
    if (!currentElement || !targetElement || currentPage === page) return;
    
    currentElement.classList.add('exit');
    currentElement.classList.remove('active');
    
    setTimeout(() => {
        currentElement.classList.remove('exit');
        targetElement.classList.add('active');
        currentPage = page;
        
        if (page === 'dashboard') animateScore();
        if (page === 'card-details') initCardForm();
        
        updateNavigation(page);
        window.scrollTo(0, 0);
    }, 200);
}

function updateNavigation(page) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        const icon = item.querySelector('svg');
        const text = item.querySelector('span');
        if (icon) icon.style.color = 'var(--fg-muted)';
        if (text) text.style.color = 'var(--fg-muted)';
    });
}

function animateScore() {
    const progress = document.getElementById('score-progress');
    const scoreValue = document.getElementById('score-value');
    if (!progress || !scoreValue) return;
    
    const circumference = 2 * Math.PI * 88;
    const maxScore = 850;
    const minScore = 300;
    const normalizedScore = (scoreTarget - minScore) / (maxScore - minScore);
    const offset = circumference - (normalizedScore * circumference);
    
    progress.style.strokeDashoffset = Math.max(0, offset);
    
    let current = 0;
    const duration = 1500;
    const increment = scoreTarget / (duration / 16);
    
    function updateNumber() {
        current += increment;
        if (current < scoreTarget) {
            scoreValue.textContent = Math.floor(current);
            requestAnimationFrame(updateNumber);
        } else {
            scoreValue.textContent = scoreTarget;
        }
    }
    updateNumber();
}

function setTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
}

function showNotifications() {
    const modal = document.getElementById('notification-modal');
    const content = modal.querySelector('.relative');
    modal.classList.remove('pointer-events-none');
    modal.style.opacity = '1';
    content.style.transform = 'translateY(0)';
}

function hideNotifications() {
    const modal = document.getElementById('notification-modal');
    const content = modal.querySelector('.relative');
    modal.style.opacity = '0';
    content.style.transform = 'translateY(100%)';
    setTimeout(() => { modal.classList.add('pointer-events-none'); }, 300);
}

function initCardForm() {
    const cardNumberInput = document.getElementById('cardNumber');
    const expiryMonthInput = document.getElementById('expiryMonth');
    const expiryYearInput = document.getElementById('expiryYear');
    const cardNameInput = document.getElementById('cardName');
    const cvvInput = document.getElementById('cvv');
    const form = document.getElementById('paymentForm');

    const cardNumberDisplay = document.getElementById('cardNumberDisplay');
    const cardNameDisplay = document.getElementById('cardNameDisplay');
    const cardExpiryDisplay = document.getElementById('cardExpiryDisplay');

    if (!cardNumberInput) return; 

    function formatCardNumber(value) {
        const cleaned = value.replace(/\D/g, '');
        const groups = cleaned.match(/.{1,4}/g);
        return groups ? groups.join(' ') : cleaned;
    }

    function updateCardDisplay() {
        const number = cardNumberInput.value.replace(/\s/g, '');
        if (number.length > 0) {
            const masked = number.replace(/(\d{4})/g, '$1 ').trim();
            cardNumberDisplay.textContent = masked || '•••• •••• •••• ••••';
        } else {
            cardNumberDisplay.textContent = '•••• •••• •••• ••••';
        }
    }

    function updateNameDisplay() {
        cardNameDisplay.textContent = cardNameInput.value.toUpperCase() || 'Your Name';
    }

    function updateExpiryDisplay() {
        const month = expiryMonthInput.value;
        const year = expiryYearInput.value;
        if (month || year) {
            cardExpiryDisplay.textContent = (month || 'MM') + '/' + (year || 'YY');
        } else {
            cardExpiryDisplay.textContent = 'MM/YY';
        }
    }
    
    // Remove old listeners by cloning
    const newCardNumberInput = cardNumberInput.cloneNode(true);
    cardNumberInput.parentNode.replaceChild(newCardNumberInput, cardNumberInput);
    newCardNumberInput.addEventListener('input', (e) => {
        e.target.value = formatCardNumber(e.target.value);
        updateCardDisplay();
    });

    const newExpiryMonthInput = expiryMonthInput.cloneNode(true);
    expiryMonthInput.parentNode.replaceChild(newExpiryMonthInput, expiryMonthInput);
    newExpiryMonthInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
        if (parseInt(e.target.value) > 12) e.target.value = '12';
        updateExpiryDisplay();
    });

    const newExpiryYearInput = expiryYearInput.cloneNode(true);
    expiryYearInput.parentNode.replaceChild(newExpiryYearInput, expiryYearInput);
    newExpiryYearInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
        updateExpiryDisplay();
    });

    const newCardNameInput = cardNameInput.cloneNode(true);
    cardNameInput.parentNode.replaceChild(newCardNameInput, cardNameInput);
    newCardNameInput.addEventListener('input', updateNameDisplay);

    const newCvvInput = cvvInput.cloneNode(true);
    cvvInput.parentNode.replaceChild(newCvvInput, cvvInput);
    newCvvInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
    });

    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    newForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = newForm.querySelector('.login-btn-card');
        btn.textContent = 'Processing...';
        btn.disabled = true;
        
        setTimeout(() => {
            btn.textContent = 'Success!';
            btn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            setTimeout(() => {
                btn.textContent = 'Login';
                btn.disabled = false;
                navigateTo('dashboard');
            }, 2000);
        }, 1500);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    animateScore();
});