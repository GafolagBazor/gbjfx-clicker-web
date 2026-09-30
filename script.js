const USER_REPO = "GafolagBazor/gbjfx-clicker";

document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        if (this.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
});

function injectDefaultData() {
    const featuresGrid = document.getElementById('features-grid');
    const achievementsList = document.getElementById('achievements-list');
    
    featuresGrid.innerHTML = '<div class="card"><h3>Модульный бэкенд</h3><p>Полное разделение логики на Java-модули: JSON, ClickLogger, JSconnect и WebViewManager.</p></div>' +
        '<div class="card"><h3>10-сек Таймер</h3><p>Умная система аварийного восстановления сессии и уровней прокачки при старте.</p></div>' +
        '<div class="card"><h3>Трёхфайловая база</h3><p>Изолированное хранение кликов, множителей и пассивного дохода в независимых JSON.</p></div>';

    achievementsList.innerHTML = '<div class="ach-item"><div class="ach-info"><h4>Первая сотня</h4><p>Накликано более 100 очков в рамках сессии.</p></div></div>' +
        '<div class="ach-item"><div class="ach-info"><h4>Тысяч рублей?!</h4><p>Накликано более 1 000 очков на основном счету.</p></div></div>' +
        '<div class="ach-item"><div class="ach-info"><h4>Уничтожитель лимитов</h4><p>Выход вычислений в диапазон октиллионов с BigInteger.</p></div></div>' +
        '<div class="ach-item"><div class="ach-info"><h4>Мамкин хацкер</h4><p>Достижение критического лимита очков с фиксацией таймлайна.</p></div></div>';
}

async function loadGitHubData() {
    injectDefaultData();
    
    try {
        const verResponse = await fetch("https://githubusercontent.com" + USER_REPO + "/main/ver/cVer.txt");
        if (verResponse.ok) {
            const rawVer = await verResponse.text();
            const cleanVer = rawVer.trim();
            
            document.getElementById('latest-version').innerText = "v" + cleanVer;
            document.getElementById('nav-download-btn').innerText = "Скачать v" + cleanVer;
            
            const downloadUrl = "https://github.com" + USER_REPO + "/releases/download/gbjfx-clicker-v" + cleanVer + "/GafBazClickerSetup-" + cleanVer + ".exe";
            document.getElementById('hero-download-btn').href = downloadUrl;
            document.getElementById('hero-download-btn').innerText = "Скачать инсталлятор (v" + cleanVer + ")";
        }
    } catch (error) {
        document.getElementById('latest-version').innerText = "v1.4";
        document.getElementById('nav-download-btn').innerText = "Скачать v1.4";
        document.getElementById('hero-download-btn').href = "https://github.com" + USER_REPO + "/releases/download/gbjfx-clicker-v1.4/GafBazClickerSetup-1.4.exe";
    }
}

window.addEventListener('DOMContentLoaded', loadGitHubData);
