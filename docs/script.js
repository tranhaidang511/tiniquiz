const translations = {
    en: {
        title: 'TiniQuiz',
        subtitle: 'Free Online Games Collection',
        'geo-title': 'GeoGame',
        'geo-desc': 'Test your geography knowledge! Identify countries by their capitals or flags in this engaging quiz game.',
        'geo-feature1': 'Capitals & Flags modes',
        'geo-feature2': 'Filter by region or continent',
        'geo-button': 'Play GeoGame',
        'gomoku-title': 'Gomoku',
        'gomoku-desc': 'Classic strategy board game. Place 5 stones in a row to win! Play against a friend or challenge the AI.',
        'gomoku-feature1': '2-Player or 1-Player modes',
        'gomoku-feature2': 'Multiple board sizes',
        'gomoku-button': 'Play Gomoku',
        'sudoku-title': 'Sudoku',
        'sudoku-desc': 'Classic number puzzle game. Fill the 9×9 grid with digits so each row, column, and 3×3 box contains all numbers from 1-9.',
        'sudoku-feature1': '5 difficulty levels',
        'sudoku-feature2': 'Hints & notes system',
        'sudoku-button': 'Play Sudoku',
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
        'geo-button': 'GeoGameをプレイ',
        'gomoku-title': '五目並べ',
        'gomoku-desc': 'クラシックな戦略ボードゲーム。5つの石を一列に並べて勝利！友達と対戦、またはAIに挑戦。',
        'gomoku-feature1': '2プレイヤー・1プレイヤーモード',
        'gomoku-feature2': '複数の盤面サイズ',
        'gomoku-button': '五目並べをプレイ',
        'sudoku-title': '数独',
        'sudoku-desc': 'クラシックな数字パズルゲーム。9×9のグリッドを1から9までの数字で埋めて、各行、列、3×3のボックスにすべての数字が含まれるようにします。',
        'sudoku-feature1': '5つの難易度',
        'sudoku-feature2': 'ヒント・メモ機能',
        'sudoku-button': '数独をプレイ',
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
        'geo-button': 'Chơi GeoGame',
        'gomoku-title': 'Cờ Ca-rô',
        'gomoku-desc': 'Trò chơi cờ chiến lược kinh điển. Xếp 5 quân cờ thành hàng để thắng! Chơi với bạn bè hoặc thách đấu với AI.',
        'gomoku-feature1': 'Chế độ 2 Người hoặc 1 Người',
        'gomoku-feature2': 'Nhiều kích thước bàn cờ',
        'gomoku-button': 'Chơi Cờ Ca-rô',
        'sudoku-title': 'Sudoku',
        'sudoku-desc': 'Trò chơi giải đố số cổ điển. Điền lưới 9×9 với các chữ số sao cho mỗi hàng, cột và ô 3×3 chứa tất cả các số từ 1-9.',
        'sudoku-feature1': '5 cấp độ khó',
        'sudoku-feature2': 'Hệ thống gợi ý & ghi chú',
        'sudoku-button': 'Chơi Sudoku',
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