import en from './en';
import ja from './ja';
import vi from './vi';

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

    // Helper to get localized string from an object like {en: "...", ja: "..."}
    getText(obj: { en: string; ja: string; vi: string }): string {
        return obj[this.currentLang];
    }

    getCountryName(code: string): string {
        // @ts-ignore
        const data = locales[this.currentLang].countries[code];
        return data ? data.name : code;
    }

    getCapital(code: string): string {
        // @ts-ignore
        const data = locales[this.currentLang].countries[code];
        return data ? data.capital : "Unknown";
    }

    getRegionName(key: string): string {
        // @ts-ignore
        const regionName = locales[this.currentLang].regions[key];
        return regionName || key;
    }

    getUIText(key: string, params?: Record<string, string>): string {
        // @ts-ignore
        let text = locales[this.currentLang].ui[key] || key;
        if (params) {
            Object.entries(params).forEach(([k, v]) => {
                text = text.replace(`{${k}}`, v);
            });
        }
        return text;
    }
}

// Initialize with saved language or default to 'en'
const savedLang = localStorage.getItem('language') as Language | null;
export const localization = new Localization(savedLang || 'en');
