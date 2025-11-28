export class Consent {
    private dialog: HTMLDivElement;
    private STORAGE_KEY = 'consentMode';

    constructor() {
        this.dialog = document.createElement('div');
        this.dialog.className = 'consent-dialog';
        this.dialog.innerHTML = `
            <div class="consent-content">
                <h3>We value your privacy</h3>
                <p>We use cookies to improve your experience, analyze traffic, and show relevant ads.</p>
                <p>You can choose to accept or reject these cookies.</p>
                <p>Essential cookies are always on because they are required for the site to work.</p>
                <div class="consent-buttons">
                    <button id="btn-reject" class="btn-reject">Reject All</button>
                    <button id="btn-accept" class="btn-accept">Accept All</button>
                </div>
            </div>
        `;
        document.body.appendChild(this.dialog);

        this.init();
    }

    private init() {
        const savedConsent = localStorage.getItem(this.STORAGE_KEY);
        if (!savedConsent) {
            this.showDialog();
        } else {
            this.updateConsent(savedConsent === 'granted');
        }

        this.dialog.querySelector('#btn-accept')?.addEventListener('click', () => {
            this.setConsent(true);
        });

        this.dialog.querySelector('#btn-reject')?.addEventListener('click', () => {
            this.setConsent(false);
        });
    }

    private showDialog() {
        this.dialog.style.display = 'flex';
    }

    private hideDialog() {
        this.dialog.style.display = 'none';
    }

    private setConsent(granted: boolean) {
        localStorage.setItem(this.STORAGE_KEY, granted ? 'granted' : 'denied');
        this.updateConsent(granted);
        this.hideDialog();
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
