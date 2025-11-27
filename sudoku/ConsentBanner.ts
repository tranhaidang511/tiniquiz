export class ConsentBanner {
    private banner: HTMLDivElement;
    private STORAGE_KEY = 'consentMode';

    constructor() {
        this.banner = document.createElement('div');
        this.banner.className = 'consent-banner';
        this.banner.innerHTML = `
            <div class="consent-content">
                <h3>We value your privacy</h3>
                <p>We use cookies to improve your experience, analyze traffic, and show relevant ads.
                <br>You can choose to accept or reject these cookies.
                <br>Essential cookies are always on because they are required for the site to work.</p>
                <div class="consent-buttons">
                    <button id="btn-reject" class="btn-reject">Reject All</button>
                    <button id="btn-accept" class="btn-accept">Accept All</button>
                </div>
            </div>
        `;
        document.body.appendChild(this.banner);

        this.init();
    }

    private init() {
        const savedConsent = localStorage.getItem(this.STORAGE_KEY);
        if (!savedConsent) {
            this.showBanner();
        } else {
            this.updateConsent(savedConsent === 'granted');
        }

        this.banner.querySelector('#btn-accept')?.addEventListener('click', () => {
            this.setConsent(true);
        });

        this.banner.querySelector('#btn-reject')?.addEventListener('click', () => {
            this.setConsent(false);
        });
    }

    private showBanner() {
        this.banner.style.display = 'flex';
    }

    private hideBanner() {
        this.banner.style.display = 'none';
    }

    private setConsent(granted: boolean) {
        localStorage.setItem(this.STORAGE_KEY, granted ? 'granted' : 'denied');
        this.updateConsent(granted);
        this.hideBanner();
    }

    private updateConsent(granted: boolean) {
        const state = granted ? 'granted' : 'denied';
        // @ts-ignore
        if (typeof window.gtag === 'function') {
            // @ts-ignore
            window.gtag('consent', 'update', {
                'ad_storage': state,
                'ad_user_data': state,
                'ad_personalization': state,
                'analytics_storage': state
            });
        }
    }
}
