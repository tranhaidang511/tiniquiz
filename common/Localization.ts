export type Language = 'en' | 'ja' | 'vi';

export class Localization<T = any> {
    protected currentLang: Language = 'en';
    private listeners: ((lang: Language) => void)[] = [];
    protected locales: Record<Language, T>;

    constructor(locales: Record<Language, T>, initialLang: Language = 'en') {
        this.locales = locales;
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

    getUIText(key: string, params?: Record<string, string>): string {
        // @ts-ignore
        const ui = this.locales[this.currentLang]?.ui;
        let text = ui ? (ui[key] || key) : key;
        if (params) {
            Object.entries(params).forEach(([k, v]) => {
                text = text.replace(`{${k}}`, v);
            });
        }
        return text;
    }
}
