import en from './i18n/en';
import ja from './i18n/ja';
import vi from './i18n/vi';

export type Language = 'en' | 'ja' | 'vi';

type LocaleData = typeof en;

const locales: Record<Language, LocaleData> = {
    en,
    ja,
    vi
};

export class Localization {
    private currentLang: Language = 'en';
    private listeners: ((lang: Language) => void)[] = [];

    constructor(initialLang: Language = 'en') {
        this.currentLang = initialLang;
    }

    get language(): Language {
        return this.currentLang;
    }

    setLanguage(lang: Language) {
        if (this.currentLang !== lang) {
            this.currentLang = lang;
            localStorage.setItem('language', lang);
            this.notifyListeners();
        }
    }

    subscribe(listener: (lang: Language) => void) {
        this.listeners.push(listener);
    }

    private notifyListeners() {
        this.listeners.forEach(listener => listener(this.currentLang));
    }

    getUIText(key: string): string {
        // @ts-ignore
        return locales[this.currentLang].ui[key] || key;
    }
}

// Initialize with saved language or default to 'en'
const savedLang = localStorage.getItem('language') as Language | null;
export const localization = new Localization(savedLang || 'en');
