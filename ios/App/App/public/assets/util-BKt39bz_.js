class c {
  currentLang = "en";
  listeners = [];
  locales;
  constructor(t, e = "en") {
    ((this.locales = t), (this.currentLang = e));
  }
  get language() {
    return this.currentLang;
  }
  setLanguage(t) {
    this.currentLang !== t &&
      ((this.currentLang = t), localStorage.setItem("language", t), this.notifyListeners());
  }
  subscribe(t) {
    this.listeners.push(t);
  }
  notifyListeners() {
    this.listeners.forEach((t) => t(this.currentLang));
  }
  getUIText(t, e) {
    const o = this.locales[this.currentLang]?.ui;
    let s = (o && o[t]) || t;
    return (
      e &&
        Object.entries(e).forEach(([n, a]) => {
          s = s.replace(`{${n}}`, a);
        }),
      s
    );
  }
}
class l {
  dialog;
  STORAGE_KEY = "consentMode";
  constructor() {
    ((this.dialog = document.createElement("div")),
      (this.dialog.className = "consent-dialog"),
      (this.dialog.innerHTML = `
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
        `),
      document.body.appendChild(this.dialog),
      this.init());
  }
  init() {
    const t = localStorage.getItem(this.STORAGE_KEY);
    (t ? this.updateConsent(t === "granted") : this.showDialog(),
      this.dialog.querySelector("#btn-accept")?.addEventListener("click", () => {
        this.setConsent(!0);
      }),
      this.dialog.querySelector("#btn-reject")?.addEventListener("click", () => {
        this.setConsent(!1);
      }));
  }
  showDialog() {
    this.dialog.style.display = "flex";
  }
  hideDialog() {
    this.dialog.style.display = "none";
  }
  setConsent(t) {
    (localStorage.setItem(this.STORAGE_KEY, t ? "granted" : "denied"),
      this.updateConsent(t),
      this.hideDialog());
  }
  updateConsent(t) {
    const e = t ? "granted" : "denied";
    typeof window.gtag == "function" &&
      window.gtag("consent", "update", {
        ad_storage: e,
        ad_user_data: e,
        ad_personalization: e,
        analytics_storage: e,
      });
  }
}
class r {
  formatTime(t) {
    const e = Math.floor(t / 1e3),
      o = e % 60;
    let s = Math.floor(e / 60);
    if (s < 60) return `${s}:${o.toString().padStart(2, "0")}`;
    const n = Math.floor(s / 60);
    return ((s = s % 60), `${n}:${s.toString().padStart(2, "0")}:${o.toString().padStart(2, "0")}`);
  }
  formatDate(t, e) {
    if (typeof t == "number") {
      const s = { vi: "vi-VN", ja: "ja-JP", zh: "zh-CN", ar: "ar-SA", en: "en-US" }[e] || "en-US";
      return new Date(t).toLocaleDateString(s);
    }
    return t;
  }
  saveHighScore(t, e, o, s = 5) {
    try {
      const n = localStorage.getItem(t);
      let a = n ? JSON.parse(n) : [];
      (a.push(e), a.sort(o), (a = a.slice(0, s)), localStorage.setItem(t, JSON.stringify(a)));
    } catch (n) {
      console.error(`Failed to save high score (key: ${t}):`, n);
    }
  }
  getHighScores(t) {
    try {
      const e = localStorage.getItem(t);
      return e ? JSON.parse(e) : [];
    } catch (e) {
      return (console.error(`Failed to load high scores (key: ${t}):`, e), []);
    }
  }
}
const h = new r();
export { l as C, c as L, h as u };
