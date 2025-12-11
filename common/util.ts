class Util {
    formatTime(milliseconds: number): string {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    formatDate(date: number | string, language: 'en' | 'ja' | 'vi'): string {
        if (typeof date === 'number') {
            const locale = language === 'vi' ? 'vi-VN' : language === 'ja' ? 'ja-JP' : 'en-US';
            return new Date(date).toLocaleDateString(locale);
        }
        return date as string;
    }
}

export const util = new Util();