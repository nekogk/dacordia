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
                    // 브라우저 탭 제목(TITLE)에는 HTML 태그가 안 먹히니까,
                    // 루비 문법에서 '단어'만 추출해서 넣어줌
                    document.title = rawValue.replace(/\[(.+?)\]\((.+?)\)/g, '$1');
                } else {
                    // 일반 요소에는 HTML 형태로 삽입 (textContent 대신 innerHTML 사용)
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