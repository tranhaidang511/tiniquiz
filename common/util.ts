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

    /**
     * Generic high score manager
     * Saves a high score entry with automatic sorting and trimming
     * @param key The localStorage key for this high score list
     * @param newScore The new score entry to add
     * @param sortFn Custom sort function (lower return value = better score)
     * @param maxScores Maximum number of scores to keep (default: 5)
     */
    saveHighScore<T extends { date: number | string }>(
        key: string,
        newScore: T,
        sortFn: (a: T, b: T) => number,
        maxScores: number = 5
    ): void {
        try {
            const existing = localStorage.getItem(key);
            let scores: T[] = existing ? JSON.parse(existing) : [];

            scores.push(newScore);

            // Sort using custom function
            scores.sort(sortFn);

            // Keep only top scores
            scores = scores.slice(0, maxScores);

            localStorage.setItem(key, JSON.stringify(scores));
        } catch (e) {
            console.error(`Failed to save high score (key: ${key}):`, e);
        }
    }

    /**
     * Load high scores from localStorage
     * @param key The localStorage key for this high score list
     * @returns Array of high scores, or empty array if none found
     */
    getHighScores<T>(key: string): T[] {
        try {
            const existing = localStorage.getItem(key);
            return existing ? JSON.parse(existing) : [];
        } catch (e) {
            console.error(`Failed to load high scores (key: ${key}):`, e);
            return [];
        }
    }
}

export const util = new Util();