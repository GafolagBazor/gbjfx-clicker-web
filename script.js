const REPO = "GafolagBazor/gbjfx-clicker";

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

function parseReleaseBody(bodyText) {
    const featuresGrid = document.getElementById('features-grid');
    const achievementsList = document.getElementById('achievements-list');
    
    featuresGrid.innerHTML = '';
    achievementsList.innerHTML = '';

    const lines = bodyText.split('\n');
    let currentSection = '';

    const icons = ['🧱', '⏱️', '📂', '🚀', '🔮', '⚙️'];
    let featureCount = 0;

    lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) return;

        if (trimmed.includes('### 📂') || trimmed.includes('### 🧱') || trimmed.includes('Разделение') || trimmed.includes('База')) {
            currentSection = 'features';
            return;
        }
        if (trimmed.includes('### ⏱️') || trimmed.includes('Восстановление') || trimmed.includes('Таймер')) {
            currentSection = 'features';
            return;
        }
        if (trimmed.includes('### 🥇') || trimmed.includes('Сортировка') || trimmed.includes('Чемпион')) {
            currentSection = 'features';
            return;
        }
        if (trimmed.includes('### 🎮') || trimmed.includes('Достижения') || trimmed.includes('Ачивки')) {
            currentSection = 'achievements';
            return;
        }

        if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
            const content = trimmed.substring(1).trim();
            const parts = content.split('—');
            
            if (parts.length >= 2) {
                const title = parts[0].replace(/`|\*/g, '').trim();
                const desc = parts.slice(1).join('—').trim();

                if (currentSection === 'features') {
                    const card = document.createElement('div');
                    card.className = 'card';
                    
                    const iconDiv = document.createElement('div');
                    iconDiv.className = 'card-icon';
                    iconDiv.innerText = icons[featureCount % icons.length];
                    featureCount++;

                    const h3 = document.createElement('h3');
                    h3.innerText = title;

                    const p = document.createElement('p');
                    p.innerText = desc;

                    card.appendChild(iconDiv);
                    card.appendChild(h3);
                    card.appendChild(p);
                    featuresGrid.appendChild(card);
                } 
                else if (currentSection === 'achievements') {
                    const item = document.createElement('div');
                    item.className = 'ach-item';

                    const badge = document.createElement('div');
                    badge.className = 'ach-badge';
                    badge.innerText = title.toLowerCase().includes('хацкер') ? '🕵️‍♂️' : '🏆';
                    if (title.toLowerCase().includes('хацкер')) {
                        badge.style.color = '#ef4444';
                        badge.style.borderColor = '#ef4444';
                    }

                    const info = document.createElement('div');
                    info.className = 'ach-info';

                    const h4 = document.createElement('h4');
                    h4.innerText = title;

                    const p = document.createElement('p');
                    p.innerText = desc;

                    info.appendChild(h4);
                    info.appendChild(p);
                    item.appendChild(badge);
                    item.appendChild(info);
                    achievementsList.appendChild(item);
                }
            }
        }
    });
}

async function loadGitHubData() {
    try {
        const repoResponse = await fetch(`https://github.com{REPO}`);
        if (repoResponse.ok) {
            const repoData = await repoResponse.json();
            document.getElementById('repo-stars').innerText = repoData.stargazers_count;
            
            const rawDate = new Date(repoData.updated_at);
            document.getElementById('last-update').innerText = rawDate.toLocaleDateString("ru-RU");
        }

        const releasesResponse = await fetch(`https://github.com{REPO}/releases/latest`);
        if (releasesResponse.ok) {
            const releaseData = await releasesResponse.json();
            const tagName = releaseData.tag_name;
            
            document.getElementById('latest-version').innerText = tagName;
            document.getElementById('nav-download-btn').innerText = `Скачать ${tagName}`;
            
            const exeAsset = releaseData.assets.find(asset => asset.name.endsWith('.exe'));
            if (exeAsset) {
                const heroBtn = document.getElementById('hero-download-btn');
                heroBtn.href = exeAsset.browser_download_url;
                heroBtn.innerText = `Скачать инсталлятор (${tagName})`;
            }

            if (releaseData.body) {
                parseReleaseBody(releaseData.body);
            }
        }
    } catch (error) {
        console.error("Ошибка при работе с GitHub API:", error);
    }
}

window.addEventListener('DOMContentLoaded', loadGitHubData);
