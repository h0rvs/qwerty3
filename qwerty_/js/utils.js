const wordLists = {
    short: [
        "привет", "мир", "код", "программа", "клавиатура", "мышь", "экран", "компьютер", 
        "интернет", "сайт", "страница", "браузер", "файл", "папка", "документ", "текст", 
        "шрифт", "цвет", "размер", "стиль", "формат", "объект", "класс", "метод", 
        "функция", "переменная", "значение", "строка", "число", "логика", "массив", "цикл", 
        "условие", "оператор", "синтаксис", "ошибка", "отладка", "компиляция", "запуск", "тест"
    ],
    medium: [
        "программирование", "алгоритм", "интерфейс", "разработка", "приложение", 
        "база данных", "фреймворк", "библиотека", "платформа", "технология", 
        "инструмент", "производительность", "оптимизация", "интеграция", "безопасность", 
        "автоматизация", "инициализация", "конфигурация", "документация", "тестирование", 
        "отладка", "развертывание", "администрирование", "архитектура", "инфраструктура"
    ],
    long: [
        "электронная вычислительная машина", "графический пользовательский интерфейс", 
        "гипертекстовый язык разметки", "каскадные таблицы стилей", "система управления базами данных", 
        "объектно-ориентированное программирование", "интерфейс прикладного программирования", 
        "виртуальная машина Java", "система контроля версий", "машинное обучение", 
        "искусственный интеллект", "большие данные", "интернет вещей", "блокчейн технология", 
        "криптографическая безопасность"
    ]
};

const quotes = [
    "Каждый день — это новая возможность изменить свою жизнь.",
    "Успех — это способность идти от одной неудачи к другой без похода энтузиазма.",
    "Единственный способ сделать великую работу — любить то, что ты делаешь.",
    "Мечты сбываются, когда желание становится действием.",
    "Не бойся совершенства. Тебе никогда его не достичь.",
    "Лучший способ предсказать будущее — создать его.",
    "Тяжелый труд побеждает талант, когда талант не работает.",
    "Великие дела совершаются не силой, а упорством.",
    "Самый большой риск — не рисковать вообще.",
    "Ваше время ограничено, не тратьте его, живя чужой жизнью.",
    "Чем больше мы любим, тем больше меньше мы тем чем.",
    ""
];

const codeSnippets = [
    "function calculateSum(a, b) { return a + b; }",
    "for (let i = 0; i < array.length; i++) { console.log(array[i]); }",
    "const result = data.filter(item => item.active).map(item => item.name);",
    "class User { constructor(name, email) { this.name = name; this.email = email; } }",
    "if (condition) { executeCode(); } else { alternativeCode(); }",
    "const response = await fetch(url); const data = await response.json();",
    "try { riskyOperation(); } catch (error) { handleError(error); }",
    "const [state, setState] = useState(initialValue); useEffect(() => { effect(); }, [dependency]);",
    "router.get('/api/users', (req, res) => { res.json(users); });",
    "def fibonacci(n): if n <= 1: return n else: return fibonacci(n-1) + fibonacci(n-2)"
];

function getRandomText(length, type, difficulty = 'легкая') {
    let result = [];
    
    if (type === 'quote') {
        const quote = quotes[Math.floor(Math.random() * quotes.length)];
        return quote.split(' ');
    } else if (type === 'code') {
        const code = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
        return code.split(' ');
    } else {
        let shortProb = 0.6;
        let mediumProb = 0.3;
        let longProb = 0.1;   
        switch(difficulty) {
            case 'сложная':
                shortProb = 0.3;
                mediumProb = 0.4;
                longProb = 0.3;
                break;
            case 'средняя':
                shortProb = 0.5;
                mediumProb = 0.35;
                longProb = 0.15;
                break;
            case 'легкая':
            default:
                shortProb = 0.6;
                mediumProb = 0.3;
                longProb = 0.1;
        }
        
        for (let i = 0; i < length; i++) {
            const wordType = Math.random();
            let wordList;
            
            if (wordType < shortProb) {
                wordList = wordLists.short;
            } else if (wordType < shortProb + mediumProb) {
                wordList = wordLists.medium;
            } else {
                wordList = wordLists.long;
            }
            
            const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
            result.push(randomWord);
        }
    }
    
    return result;
}

function switchSection(sectionName) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    const sectionToShow = document.getElementById(`${sectionName}-section`);
    if (sectionToShow) {
        sectionToShow.classList.add('active');
    }
    
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionName) {
            link.classList.add('active');
        }
    });
    
    if (sectionName === 'training') {
        const textInput = document.getElementById('text-input');
        if (textInput) {
            textInput.blur();
        }
    }
}

function toggleTheme() {
    const root = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');
    
    const isDark = themeToggle.innerHTML.includes('fa-moon');
    
    if (isDark) {
        root.style.setProperty('--bg-color', '#f5f5f5');
        root.style.setProperty('--text-color', '#333');
        root.style.setProperty('--secondary-bg', '#fff');
        root.style.setProperty('--border-color', '#ddd');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', 'light');
    } else {
        root.style.setProperty('--bg-color', '#1a1a1a');
        root.style.setProperty('--text-color', '#d1d1d1');
        root.style.setProperty('--secondary-bg', '#2a2a2a');
        root.style.setProperty('--border-color', '#333');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', 'dark');
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeToggle = document.getElementById('theme-toggle');
    
    if (savedTheme === 'light') {
        const root = document.documentElement;
        root.style.setProperty('--bg-color', '#f5f5f5');
        root.style.setProperty('--text-color', '#333');
        root.style.setProperty('--secondary-bg', '#fff');
        root.style.setProperty('--border-color', '#ddd');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        const root = document.documentElement;
        root.style.setProperty('--bg-color', '#1a1a1a');
        root.style.setProperty('--text-color', '#d1d1d1');
        root.style.setProperty('--secondary-bg', '#2a2a2a');
        root.style.setProperty('--border-color', '#333');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

function changeThemeColor(color) {
    const colors = {
        'orange': '#ff9d00',
        'green': '#4CAF50',
        'blue': '#2196F3',
        'purple': '#9C27B0'
    };
    
    if (colors[color]) {
        document.documentElement.style.setProperty('--primary-color', colors[color]);
    }
}

window.getRandomText = getRandomText;
window.switchSection = switchSection;
window.toggleTheme = toggleTheme;
window.changeThemeColor = changeThemeColor;
window.loadTheme = loadTheme;