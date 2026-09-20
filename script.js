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

    } catch (error) {
        console.error('번역 데이터를 불러오는 중 오류 발생:', error);
    }
}

// 버튼 클릭 이벤트 및 로드 시 실행 부분은 기존과 동일
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

// site-card가 마우스를 살짝 따라가게 하는 효과 (macOS Dock 느낌)
const siteCards = document.querySelectorAll('.site-card');
const followStrength = 0.25; // 마우스를 따라가는 비율 (0~1, 클수록 많이 따라감)
const maxOffset = 10; // 최대로 움직일 수 있는 픽셀 값

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