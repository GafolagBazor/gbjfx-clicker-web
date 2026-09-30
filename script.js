const USER_REPO = "/GafolagBazor/gbjfx-clicker";

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

function parseCustomConfig(text) {
    const featuresGrid = document.getElementById('features-grid');
    featuresGrid.innerHTML = "";

    const lines = text.split('\n');
    let insideDescription = false;
    let insideVer = false;
    let insideDate = false;
    
    let verWithV = "";
    let verClean = "";
    let dateStr = "";

    lines.forEach(line => {
        const str = line.trim();
        if (!str) return;

        if (str.indexOf("description {") !== -1) { insideDescription = true; return; }
        if (str.indexOf("ver {") !== -1) { insideVer = true; return; }
        if (str.indexOf("dateOfUpdate {") !== -1) { insideDate = true; return; }
        if (str === "}") { insideDescription = false; insideVer = false; insideDate = false; return; }

        if (insideVer) {
            if (str.indexOf("v") === 0) verWithV = str;
            else verClean = str;
            return;
        }

        if (insideDate) {
            dateStr = str;
            return;
        }

        if (insideDescription) {
            if (str.indexOf('*') === 0 || str.indexOf('-') === 0) {
                const cleanStr = str.substring(1).trim();
                const parts = cleanStr.split('—');
                
                if (parts.length >= 2) {
                    const rawTitle = parts[0];
                    const title = rawTitle.replace(/`|\*/g, "").trim();
                    const desc = parts.slice(1).join('—').trim();

                    const card = document.createElement('div');
                    card.className = "card";
                    const h3 = document.createElement('h3');
                    h3.innerText = title;
                    const p = document.createElement('p');
                    p.innerText = desc;
                    card.appendChild(h3);
                    card.appendChild(p);
                    featuresGrid.appendChild(card);
                }
            }
        }
    });

    document.getElementById('latest-version').innerText = verWithV;
    document.getElementById('last-update').innerText = dateStr;
    document.getElementById('nav-download-btn').innerText = "Скачать " + verWithV;
    
    const downloadUrl = "https://github.com" + USER_REPO + "/releases/download/gbjfx-clicker-v" + verClean + "/GafBazClickerSetup-" + verClean + ".exe";
    document.getElementById('hero-download-btn').href = downloadUrl;
    document.getElementById('hero-download-btn').innerText = "Скачать инсталлятор (" + verWithV + ")";
}

async function loadGitHubData() {
    try {
        const response = await fetch("raw.https://githubusercontent.com" + USER_REPO + "/main/gbjfxcwres/res.md");
        if (response.ok) {
            const text = await response.text();
            parseCustomConfig(text);
        }
    } catch (error) {
        document.getElementById('latest-version').innerText = "Ошибка";
        document.getElementById('last-update').innerText = "Ошибка";
        document.getElementById('nav-download-btn').innerText = "Скачать";
        document.getElementById('hero-download-btn').href = "https://github.com" + USER_REPO + "/releases/latest";
    }
}

window.addEventListener('DOMContentLoaded', loadGitHubData);
