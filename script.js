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
                if (el.tagName === 'TITLE') {
                    document.title = data[key];
                } else {
                    el.textContent = data[key];
                }
            }
        });

        // 3. 폰트 변경을 위해 body 클래스 교체
        document.body.className = `lang-${lang}`;

        // 4. 버튼 활성화 상태 업데이트 (CSS 클래스 적용)
        langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-value') === lang);
        });

        // 5. 언어 설정 저장
        localStorage.setItem('preferredLang', lang);

    } catch (error) {
        console.error('번역 데이터를 불러오는 중 오류 발생:', error);
    }
}

// 버튼 클릭 이벤트 리스너
langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const selectedLang = btn.getAttribute('data-value');
        changeLanguage(selectedLang);
    });
});

// 페이지 로드 시 초기 언어 설정
window.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferredLang') || 'ko';
    changeLanguage(savedLang);
});