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
        'gomoku-feature1': '2-Player or vs AI mode',
        'gomoku-feature2': 'Multiple board sizes',
        'gomoku-button': 'Play Gomoku',
        'sudoku-title': 'Sudoku',
        'sudoku-desc': 'Classic number puzzle game. Fill the 9×9 grid with digits so each row, column, and 3×3 box contains all numbers from 1-9.',
        'sudoku-feature1': '5 difficulty levels',
        'sudoku-feature2': 'Hints & notes system',
        'sudoku-button': 'Play Sudoku',
        'minesweeper-title': 'Minesweeper',
        'minesweeper-desc': 'Classic puzzle game. Clear the board without hitting any mines! Use logic to flag dangerous cells.',
        'minesweeper-feature1': '3 difficulty levels',
        'minesweeper-feature2': 'High score tracking',
        'minesweeper-button': 'Play Minesweeper',
        'sliding-title': 'Sliding Puzzle',
        'sliding-desc': 'Classic puzzle game. Slide tiles to order them numerically. Challenge yourself with different board sizes!',
        'sliding-feature1': '3x3 to 7x7 board sizes',
        'sliding-feature2': 'Move counter & timer',
        'sliding-button': 'Play Sliding Puzzle',
        'checkers-title': 'Checkers',
        'checkers-desc': 'Classic board game. Jump over your opponent\'s pieces to capture them. King your pieces to move in all directions!',
        'checkers-feature1': '2-Player or vs AI mode',
        'checkers-feature2': 'Multiple board sizes',
        'checkers-button': 'Play Checkers',
        'othello-title': 'Othello',
        'othello-desc': 'Classic strategy board game. Flip your opponent\'s pieces to your color. Most pieces at the end wins!',
        'othello-feature1': '2-Player or vs AI mode',
        'othello-feature2': '2 difficulty levels',
        'othello-button': 'Play Othello',
        'mancala-title': 'Mancala',
        'mancala-desc': 'Ancient strategy board game. Capture stones by moving them around the board. Empty your opponent\'s side to win!',
        'mancala-feature1': '2-Player or vs AI mode',
        'mancala-feature2': 'Multiple number of pits and stones',
        'mancala-button': 'Play Mancala',
        'chess-title': 'Chess',
        'chess-desc': 'Classic chess strategy game for two players!',
        'chess-feature1': '2-Player or vs AI mode',
        'chess-feature2': 'Valid move hints',
        'chess-button': 'Play Chess',
        'xiangqi-title': 'Xiangqi',
        'xiangqi-desc': 'Classic Asian strategy board game!',
        'xiangqi-feature1': '2-Player or vs AI mode',
        'xiangqi-feature2': 'Valid move hints',
        'xiangqi-button': 'Play Xiangqi',
        'go-title': 'Go',
        'go-desc': 'Ancient strategy board game. Surround more territory than your opponent to win!',
        'go-feature1': 'Multiple board sizes',
        'go-feature2': 'Handicap and Komi support',
        'go-button': 'Play Go',
        'footer-made': 'Made by Tran Hai Dang',
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
        'gomoku-feature1': '2プレイヤー・AI対戦',
        'gomoku-feature2': '複数の盤面サイズ',
        'gomoku-button': '五目並べをプレイ',
        'sudoku-title': '数独',
        'sudoku-desc': 'クラシックな数字パズルゲーム。9×9のグリッドを1から9までの数字で埋めて、各行、列、3×3のボックスにすべての数字が含まれるようにします。',
        'sudoku-feature1': '5つの難易度',
        'sudoku-feature2': 'ヒント・メモ機能',
        'sudoku-button': '数独をプレイ',
        'minesweeper-title': 'マインスイーパー',
        'minesweeper-desc': 'クラシックなパズルゲーム。地雷を踏まずにボードをクリアしよう！論理を使って危険なセルにフラグを立てます。',
        'minesweeper-feature1': '3つの難易度',
        'minesweeper-feature2': 'ハイスコア記録',
        'minesweeper-button': 'マインスイーパーをプレイ',
        'sliding-title': 'スライディングパズル',
        'sliding-desc': 'クラシックなパズルゲーム。タイルをスライドさせて番号順に並べよう。様々なボードサイズに挑戦！',
        'sliding-feature1': '3x3から7x7のボードサイズ',
        'sliding-feature2': '移動回数＆タイマー',
        'sliding-button': 'スライディングパズルをプレイ',
        'checkers-title': 'チェッカー',
        'checkers-desc': 'クラシックなボードゲーム。相手の駒を飛び越えて捕獲します。キングになると全方向に移動できます！',
        'checkers-feature1': '2プレイヤー・AI対戦',
        'checkers-feature2': '複数のボードサイズ',
        'checkers-button': 'チェッカーをプレイ',
        'othello-title': 'オセロ',
        'othello-desc': 'クラシックな戦略ボードゲーム。相手の石を自分の色に裏返そう。最後に石が多い方が勝ち！',
        'othello-feature1': '2プレイヤー・AI対戦',
        'othello-feature2': '2つの難易度',
        'othello-button': 'オセロをプレイ',
        'mancala-title': 'マンカラ',
        'mancala-desc': '古代の戦略ボードゲーム。石を移動させて相手の石を集めよう。相手側を空にすれば勝ち！',
        'mancala-feature1': '2プレイヤー・AI対戦',
        'mancala-feature2': '複数のピット数と石数',
        'mancala-button': 'マンカラをプレイ',
        'chess-title': 'チェス',
        'chess-desc': '2人用のクラシックなチェス戦略ゲーム！',
        'chess-feature1': '2プレイヤー・AI対戦',
        'chess-feature2': '有効な移動のヒント',
        'chess-button': 'チェスをプレイ',
        'xiangqi-title': '将棋 (シャンチー)',
        'xiangqi-desc': 'クラシックなアジアの戦略ボードゲーム！',
        'xiangqi-feature1': '2プレイヤー・AI対戦',
        'xiangqi-feature2': '有効な移動のヒント',
        'xiangqi-button': 'シャンチーをプレイ',
        'go-title': '囲碁',
        'go-desc': '古代の戦略ボードゲーム。相手より多くの陣地を囲んで勝利しよう！',
        'go-feature1': '複数の盤面サイズ',
        'go-feature2': 'ハンディキャップとコミのサポート',
        'go-button': '囲碁をプレイ',
        'footer-made': 'Made by Tran Hai Dang',
        'footer-copyright': '© 2025 TiniQuiz. All rights reserved.'
    },
    vi: {
        title: 'TiniQuiz',
        subtitle: 'Bộ sưu tập trò chơi trực tuyến miễn phí',
        'geo-title': 'Trò chơi Địa lý',
        'geo-desc': 'Kiểm tra kiến thức địa lý của bạn! Nhận diện các quốc gia qua thủ đô hoặc quốc kỳ trong trò chơi đố vui hấp dẫn này.',
        'geo-feature1': 'Chế độ Thủ đô & Quốc kỳ',
        'geo-feature2': 'Lọc theo khu vực hoặc châu lục',
        'geo-button': 'Chơi Trò chơi Địa lý',
        'gomoku-title': 'Cờ ca-rô',
        'gomoku-desc': 'Trò chơi cờ chiến lược kinh điển. Xếp 5 quân cờ thành hàng để thắng! Chơi với bạn bè hoặc thách đấu với AI.',
        'gomoku-feature1': '2 Người chơi hoặc Đấu với AI',
        'gomoku-feature2': 'Nhiều kích thước bàn cờ',
        'gomoku-button': 'Chơi Cờ ca-rô',
        'sudoku-title': 'Sudoku',
        'sudoku-desc': 'Trò chơi giải đố số cổ điển. Điền lưới 9×9 với các chữ số sao cho mỗi hàng, cột và ô 3×3 chứa tất cả các số từ 1-9.',
        'sudoku-feature1': '5 cấp độ khó',
        'sudoku-feature2': 'Hệ thống gợi ý & ghi chú',
        'sudoku-button': 'Chơi Sudoku',
        'minesweeper-title': 'Dò mìn',
        'minesweeper-desc': 'Trò chơi giải đố kinh điển. Dọn sạch bàn cờ mà không chạm vào mìn! Sử dụng tư duy logic để cắm cờ các ô nguy hiểm.',
        'minesweeper-feature1': '3 cấp độ khó',
        'minesweeper-feature2': 'Bảng xếp hạng điểm cao',
        'minesweeper-button': 'Chơi Dò mìn',
        'sliding-title': 'Xếp hình',
        'sliding-desc': 'Trò chơi xếp hình cổ điển. Trượt các ô để sắp xếp theo thứ tự số. Thử thách bản thân với nhiều kích thước bàn cờ!',
        'sliding-feature1': 'Kích thước bàn cờ từ 3x3 đến 7x7',
        'sliding-feature2': 'Đếm số bước & thời gian',
        'sliding-button': 'Chơi Xếp hình',
        'checkers-title': 'Cờ đam',
        'checkers-desc': 'Trò chơi cờ cổ điển. Nhảy qua quân cờ của đối thủ để bắt chúng. Phong vương để di chuyển mọi hướng!',
        'checkers-feature1': '2 Người chơi hoặc Đấu với AI',
        'checkers-feature2': 'Nhiều kích thước bàn cờ',
        'checkers-button': 'Chơi Cờ đam',
        'othello-title': 'Cờ lật',
        'othello-desc': 'Trò chơi cờ chiến lược kinh điển. Lật quân cờ của đối thủ thành màu của bạn. Người có nhiều quân nhất sẽ thắng!',
        'othello-feature1': '2 Người chơi hoặc Đấu với AI',
        'othello-feature2': '2 cấp độ khó',
        'othello-button': 'Chơi Cờ lật',
        'mancala-title': 'Mancala',
        'mancala-desc': 'Trò chơi cờ chiến lược cổ xưa. Thu thập đá bằng cách di chuyển chúng quanh bàn cờ. Làm rỗng phía đối thủ để thắng!',
        'mancala-feature1': '2 Người chơi hoặc Đấu với AI',
        'mancala-feature2': 'Nhiều kích thước bàn cờ và số lượng đá',
        'mancala-button': 'Chơi Mancala',
        'chess-title': 'Cờ vua',
        'chess-desc': 'Trò chơi cờ chiến lược kinh điển cho hai người chơi!',
        'chess-feature1': '2 Người chơi hoặc Đấu với AI',
        'chess-feature2': 'Gợi ý nước đi hợp lệ',
        'chess-button': 'Chơi Cờ vua',
        'xiangqi-title': 'Cờ tướng',
        'xiangqi-desc': 'Trò chơi cờ chiến lược kinh điển của châu Á!',
        'xiangqi-feature1': '2 Người chơi hoặc Đấu với AI',
        'xiangqi-feature2': 'Gợi ý nước đi hợp lệ',
        'xiangqi-button': 'Chơi Cờ tướng',
        'go-title': 'Cờ vây',
        'go-desc': 'Trò chơi cờ chiến lược cổ xưa. Vây bắt nhiều lãnh thổ hơn đối thủ để giành chiến thắng!',
        'go-feature1': 'Nhiều kích thước bàn cờ',
        'go-feature2': 'Hỗ trợ Chấp quân và Komi',
        'go-button': 'Chơi Cờ vây',
        'footer-made': 'Made by Tran Hai Dang',
        'footer-copyright': '© 2025 TiniQuiz. All rights reserved.'
    },
    zh: {
        title: 'TiniQuiz',
        subtitle: '免费在线游戏合集',
        'geo-title': '地理游戏',
        'geo-desc': '测试你的地理知识！在这个引人入胜的问答游戏中，通过首都或国旗识别国家。',
        'geo-feature1': '首都和国旗模式',
        'geo-feature2': '按地区或大洲筛选',
        'geo-button': '玩地理游戏',
        'gomoku-title': '五子棋',
        'gomoku-desc': '经典策略棋盘游戏。五子连珠即可获胜！与朋友对战或挑战AI。',
        'gomoku-feature1': '双人或人机对战',
        'gomoku-feature2': '多种棋盘尺寸',
        'gomoku-button': '玩五子棋',
        'sudoku-title': '数独',
        'sudoku-desc': '经典数字益智游戏。用数字填充9×9网格，使每行、每列和3×3宫包含1-9的所有数字。',
        'sudoku-feature1': '5个难度级别',
        'sudoku-feature2': '提示和笔记系统',
        'sudoku-button': '玩数独',
        'minesweeper-title': '扫雷',
        'minesweeper-desc': '经典益智游戏。在不触雷的情况下清除棋盘！利用逻辑标记危险方块。',
        'minesweeper-feature1': '3个难度级别',
        'minesweeper-feature2': '高分追踪',
        'minesweeper-button': '玩扫雷',
        'sliding-title': '滑块拼图',
        'sliding-desc': '经典益智游戏。滑动方块按数字顺序排列。挑战不同尺寸的棋盘！',
        'sliding-feature1': '3x3到7x7棋盘尺寸',
        'sliding-feature2': '移动计数器和计时器',
        'sliding-button': '玩滑块拼图',
        'checkers-title': '国际跳棋',
        'checkers-desc': '经典棋盘游戏。跳过对手的棋子进行吃子。成为王棋后可向任意方向移动！',
        'checkers-feature1': '双人或人机对战',
        'checkers-feature2': '多种棋盘尺寸',
        'checkers-button': '玩国际跳棋',
        'othello-title': '黑白棋',
        'othello-desc': '经典策略棋盘游戏。将对手的棋子翻转为你的颜色。结束时棋子多者获胜！',
        'othello-feature1': '双人或人机对战',
        'othello-feature2': '2个难度级别',
        'othello-button': '玩黑白棋',
        'mancala-title': '播棋',
        'mancala-desc': '古老的策略棋盘游戏。在棋盘上移动以收集宝石。清空对手的一侧即可获胜！',
        'mancala-feature1': '双人或人机对战',
        'mancala-feature2': '多种棋坑和宝石数量',
        'mancala-button': '玩播棋',
        'chess-title': '国际象棋',
        'chess-desc': '经典的双人战略棋盘游戏！',
        'chess-feature1': '双人或人机对战',
        'chess-feature2': '有效移动提示',
        'chess-button': '玩国际象棋',
        'xiangqi-title': '中国象棋',
        'xiangqi-desc': '经典的亚洲战略棋盘游戏！',
        'xiangqi-feature1': '双人或人机对战',
        'xiangqi-feature2': '有效移动提示',
        'xiangqi-button': '玩中国象棋',
        'go-title': '围棋',
        'go-desc': '古老的策略棋盘游戏。比对手围取更多的地盘即可获胜！',
        'go-feature1': '多种棋盘尺寸',
        'go-feature2': '支持让子和贴目',
        'go-button': '玩围棋',
        'footer-made': 'Made by Tran Hai Dang',
        'footer-copyright': '© 2025 TiniQuiz. All rights reserved.'
    },
    ar: {
        title: 'TiniQuiz',
        subtitle: 'مجموعة ألعاب مجانية عبر الإنترنت',
        'geo-title': 'لعبة الجغرافيا',
        'geo-desc': 'اختبر معلوماتك الجغرافية! تعرف على البلدان من خلال عواصمها أو أعلامها في هذه اللعبة الممتعة.',
        'geo-feature1': 'أوضاع العواصم والأعلام',
        'geo-feature2': 'تصفية حسب المنطقة أو القارة',
        'geo-button': 'العب لعبة الجغرافيا',
        'gomoku-title': 'جوموكو',
        'gomoku-desc': 'لعبة استراتيجية كلاسيكية. ضع 5 أحجار في صف واحد للفوز! العب ضد صديق أو تحدى الذكاء الاصطناعي.',
        'gomoku-feature1': 'لاعبان أو ضد الذكاء الاصطناعي',
        'gomoku-feature2': 'أحجام متعددة للوحة',
        'gomoku-button': 'العب جوموكو',
        'sudoku-title': 'سودوكو',
        'sudoku-desc': 'لعبة الألغاز الرقمية الكلاسيكية. املأ الشبكة 9×9 بالأرقام بحيث يحتوي كل صف وعمود ومربع 3×3 على جميع الأرقام من 1-9.',
        'sudoku-feature1': '5 مستويات صعوبة',
        'sudoku-feature2': 'نظام التلميحات والملاحظات',
        'sudoku-button': 'العب سودوكو',
        'minesweeper-title': 'كانسة الألغام',
        'minesweeper-desc': 'لعبة ألغاز كلاسيكية. قم بإخلاء اللوحة دون الاصطدام بأي لغم! استخدم المنطق لوضع علامة على الخلايا الخطرة.',
        'minesweeper-feature1': '3 مستويات صعوبة',
        'minesweeper-feature2': 'تتبع أعلى الدرجات',
        'minesweeper-button': 'العب كانسة الألغام',
        'sliding-title': 'لغز الانزلاق',
        'sliding-desc': 'لعبة ألغاز كلاسيكية. حرك المربعات لترتيبها رقميًا. تحدى نفسك بأحجام مختلفة للوحة!',
        'sliding-feature1': 'أحجام لوحة من 3x3 إلى 7x7',
        'sliding-feature2': 'عداد الحركات والمؤقت',
        'sliding-button': 'العب لغز الانزلاق',
        'checkers-title': 'الداما',
        'checkers-desc': 'لعبة لوحة كلاسيكية. اقفز فوق قطع خصمك لالتقاطها. قم بترقية قطعك للتحرك في جميع الاتجاهات!',
        'checkers-feature1': 'لاعبان أو ضد الذكاء الاصطناعي',
        'checkers-feature2': 'أحجام متعددة للوحة',
        'checkers-button': 'العب الداما',
        'othello-title': 'أوثيلو',
        'othello-desc': 'لعبة استراتيجية كلاسيكية. اقلب قطع خصمك لتصبح بلونك. الفائز هو من يملك أكبر عدد من القطع في النهاية!',
        'othello-feature1': 'لاعبان أو ضد الذكاء الاصطناعي',
        'othello-feature2': 'مستويان للصعوبة',
        'othello-button': 'العب أوثيلو',
        'mancala-title': 'المنقلة',
        'mancala-desc': 'لعبة استراتيجية قديمة. التقط الحجارة بتحريكها حول اللوحة. أفرغ جانب خصمك للفوز!',
        'mancala-feature1': 'لاعبان أو ضد الذكاء الاصطناعي',
        'mancala-feature2': 'عدد متعدد من الحفر والحجارة',
        'mancala-button': 'العب المنقلة',
        'chess-title': 'الشطرنج',
        'chess-desc': 'لعبة استراتيجية كلاسيكية للاعبين!',
        'chess-feature1': 'لاعبان أو ضد الذكاء الاصطناعي',
        'chess-feature2': 'تلميحات للحركات الصحيحة',
        'chess-button': 'العب الشطرنج',
        'xiangqi-title': 'الشطرنج الصيني',
        'xiangqi-desc': 'لعبة استراتيجية آسيوية كلاسيكية!',
        'xiangqi-feature1': 'لاعبان أو ضد الذكاء الاصطناعي',
        'xiangqi-feature2': 'تلميحات للحركات الصحيحة',
        'xiangqi-button': 'العب الشطرنج الصيني',
        'go-title': 'غو',
        'go-desc': 'لعبة استراتيجية قديمة. حاصر مساحة أكبر من خصمك للفوز!',
        'go-feature1': 'أحجام متعددة للوحة',
        'go-feature2': 'دعم الإعاقة والكومي',
        'go-button': 'العب غو',
        'footer-made': 'Made by Tran Hai Dang',
        'footer-copyright': '© 2025 TiniQuiz. All rights reserved.'
    }
};

let currentLang = localStorage.getItem('language') || 'en';

function updateTexts() {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

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