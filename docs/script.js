const translations = {
    en: {
        title: 'TiniQuiz',
        subtitle: 'Free Online Games Collection',
        'geo-title': 'GeoGame',
        'geo-desc': 'Test your geography knowledge! Identify countries by their capitals or flags in this engaging quiz game.',
        'geo-feature1': 'Capitals & Flags modes',
        'geo-feature2': 'Filter by region or continent',
        'geo-feature3': 'Multilingual (EN/JA/VI)',
        'geo-button': 'Play GeoGame',
        'gomoku-title': 'Gomoku',
        'gomoku-desc': 'Classic strategy board game. Place 5 stones in a row to win! Play against a friend or challenge the AI.',
        'gomoku-feature1': '2-Player & vs AI modes',
        'gomoku-feature2': '15×15 or 19×19 board',
        'gomoku-feature3': 'Multilingual (EN/JA/VI)',
        'gomoku-button': 'Play Gomoku',
        'footer-made': 'Made with ❤️ by Tran Hai Dang',
        'footer-copyright': '© 2025 TiniQuiz. All rights reserved.'
    },
    ja: {
        title: 'TiniQuiz',
        subtitle: '無料オンラインゲームコレクション',
        'geo-title': 'GeoGame',
        'geo-desc': '地理の知識をテスト！国の首都や国旗を当てる魅力的なクイズゲーム。',
        'geo-feature1': '首都・国旗モード',
        'geo-feature2': '地域・大陸でフィルター',
        'geo-feature3': '多言語対応 (EN/JA/VI)',
        'geo-button': 'GeoGameをプレイ',
        'gomoku-title': '五目並べ',
        'gomoku-desc': 'クラシックな戦略ボードゲーム。5つの石を一列に並べて勝利！友達と対戦、またはAIに挑戦。',
        'gomoku-feature1': '2プレイヤー・vsCPUモード',
        'gomoku-feature2': '15×15または19×19盤面',
        'gomoku-feature3': '多言語対応 (EN/JA/VI)',
        'gomoku-button': '五目並べをプレイ',
        'footer-made': 'Made with ❤️ by Tran Hai Dang',
        'footer-copyright': '© 2025 TiniQuiz. All rights reserved.'
    },
    vi: {
        title: 'TiniQuiz',
        subtitle: 'Bộ Sưu Tập Trò Chơi Trực Tuyến Miễn Phí',
        'geo-title': 'GeoGame',
        'geo-desc': 'Kiểm tra kiến thức địa lý của bạn! Nhận diện các quốc gia qua thủ đô hoặc quốc kỳ trong trò chơi đố vui hấp dẫn này.',
        'geo-feature1': 'Chế độ Thủ Đô & Quốc Kỳ',
        'geo-feature2': 'Lọc theo khu vực hoặc châu lục',
        'geo-feature3': 'Đa ngôn ngữ (EN/JA/VI)',
        'geo-button': 'Chơi GeoGame',
        'gomoku-title': 'Cờ Ca-rô',
        'gomoku-desc': 'Trò chơi cờ chiến lược kinh điển. Xếp 5 quân cờ thành hàng để thắng! Chơi với bạn bè hoặc thách đấu với AI.',
        'gomoku-feature1': 'Chế độ 2 Người & vs Máy',
        'gomoku-feature2': 'Bàn cờ 15×15 hoặc 19×19',
        'gomoku-feature3': 'Đa ngôn ngữ (EN/JA/VI)',
        'gomoku-button': 'Chơi Cờ Ca-rô',
        'footer-made': 'Made with ❤️ by Tran Hai Dang',
        'footer-copyright': '© 2025 TiniQuiz. All rights reserved.'
    }
};

let currentLang = localStorage.getItem('language') || 'en';

function updateTexts() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            el.textContent = translations[currentLang][key];
        }
    });
}

function updateActiveLangButton() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === currentLang);
    });
}

document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        currentLang = e.target.dataset.lang;
        localStorage.setItem('language', currentLang);
        updateTexts();
        updateActiveLangButton();
    });
});

updateTexts();
updateActiveLangButton();

// Consent Dialog Logic
(function () {
    const STORAGE_KEY = 'consentMode';
    const dialog = document.getElementById('consent-dialog');
    const btnAccept = document.getElementById('btn-accept');
    const btnReject = document.getElementById('btn-reject');

    function init() {
        const savedConsent = localStorage.getItem(STORAGE_KEY);
        if (!savedConsent) {
            dialog.style.display = 'flex';
        } else {
            updateConsent(savedConsent === 'granted');
        }

        btnAccept.addEventListener('click', () => setConsent(true));
        btnReject.addEventListener('click', () => setConsent(false));
    }

    function setConsent(granted) {
        localStorage.setItem(STORAGE_KEY, granted ? 'granted' : 'denied');
        updateConsent(granted);
        dialog.style.display = 'none';
    }

    function updateConsent(granted) {
        const state = granted ? 'granted' : 'denied';
        if (typeof gtag === 'function') {
            gtag('consent', 'update', {
                'ad_storage': state,
                'ad_user_data': state,
                'ad_personalization': state,
                'analytics_storage': state
            });
        }
    }

    init();
})();