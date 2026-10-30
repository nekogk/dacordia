const langButtons = document.querySelectorAll('.lang-btn');

// 언어를 불러오고 적용하는 함수
async function changeLanguage(lang) {
    try {
        // 1. JSON 파일 가져오기
        const response = await fetch(`./lang/${lang}.json`);
        if (!response.ok) throw new Error('파일을 찾을 수 없어!');
        const data = await response.json();

        // 2. 텍스트 변경 (data-i18n 속성 기준)
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (data[key]) {
                const rawValue = data[key];

                // [단어](루비) 패턴을 <ruby> 태그로 변환하는 정규표현식
                const rubyConverted = rawValue.replace(/\[(.+?)\]\((.+?)\)/g, '<ruby>$1<rt>$2</rt></ruby>');

                if (el.tagName === 'TITLE') {
                    document.title = rawValue.replace(/\[(.+?)\]\((.+?)\)/g, '$1');
                } else {
                    el.innerHTML = rubyConverted;
                }
            }
        });

        // 3. 폰트 변경을 위해 body 클래스 교체
        document.body.className = `lang-${lang}`;

        // 4. 버튼 활성화 상태 업데이트
        langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-value') === lang);
        });

        // 5. 언어 설정 저장
        localStorage.setItem('preferredLang', lang);

        // 6. 바뀐 제목으로 목차 다시 그리기
        renderToc();

    } catch (error) {
        console.error('번역 데이터를 불러오는 중 오류 발생:', error);
    }
}

langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const selectedLang = btn.getAttribute('data-value');
        changeLanguage(selectedLang);
    });
});

window.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferredLang') || 'ko';
    changeLanguage(savedLang);
});

const siteCards = document.querySelectorAll('.site-card');
const followStrength = 0.25;
const maxOffset = 10;

siteCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const relX = e.clientX - (rect.left + rect.width / 2);
        const relY = e.clientY - (rect.top + rect.height / 2);

        const offsetX = Math.max(Math.min(relX * followStrength, maxOffset), -maxOffset);
        const offsetY = Math.max(Math.min(relY * followStrength, maxOffset), -maxOffset);

        card.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translate(0px, 0px)';
    });
});

const WIDE = matchMedia('(min-width: 64rem)');
const langBox = document.querySelector('.lang-selector');
const langHome = document.querySelector('.container');
const langSlot = document.querySelector('.site-side-lang');

function placeLang() {
    if (!langBox || !langSlot) return;
    const focused = langBox.contains(document.activeElement) ? document.activeElement : null;
    if (WIDE.matches) {
        if (langBox.parentElement !== langSlot) langSlot.append(langBox);
    } else if (langBox.parentElement !== langHome) {
        langHome.prepend(langBox);
    }
    focused?.focus();
}

placeLang();
WIDE.addEventListener('change', placeLang);

const headings = [...document.querySelectorAll('.container h2')];

headings.forEach((h, i) => {
    h.dataset.num = `${i + 1}.`;
    h.id = String(i + 1);
});

function headingText(h) {
    const copy = h.cloneNode(true);
    copy.querySelectorAll('rt, rp').forEach(el => el.remove());
    return copy.textContent.replace(/\s+/g, ' ').trim();
}

function renderToc() {
    const nav = document.querySelector('.site-toc');
    if (!nav) return;
    if (!headings.length) { nav.hidden = true; return; }

    const ol = document.createElement('ol');
    ol.className = 'site-toc-list';
    for (const h of headings) {
        const text = headingText(h);
        const li = document.createElement('li');
        li.className = 'site-toc-item';

        const a = document.createElement('a');
        a.href = `#${h.id}`;
        a.title = `${h.dataset.num} ${text}`;

        const num = document.createElement('span');
        num.className = 'site-toc-num';
        num.textContent = h.dataset.num;
        const label = document.createElement('span');
        label.className = 'site-toc-text';
        label.textContent = text;

        a.append(num, label);
        li.append(a);
        ol.append(li);
    }
    nav.replaceChildren(ol);
    nav.hidden = false;
}

renderToc();
if (location.hash) {
    try { document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView(); } catch {}
}
