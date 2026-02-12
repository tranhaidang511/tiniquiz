import {
  AdMob,
  BannerAdPosition,
  BannerAdSize,
  type BannerAdOptions,
} from "@capacitor-community/admob";
import { Capacitor } from "@capacitor/core";

// --- Configuration Constants ---
const AD_CONFIG = {
  // AdSense (Web)
  ADSENSE: {
    CLIENT: "ADSENSE_CLIENT",
    // NOTE: Generate a new "Display Ad" unit in AdSense console and paste the SLOT ID here.
    SLOT: "ADSENSE_SLOT_ID",
  },
  // AdMob (Native)
  ADMOB: {
    IOS_BANNER_ID: "ADMOB_IOS_BANNER_ID", // Test ID
    ANDROID_BANNER_ID: "ADMOB_ANDROID_BANNER_ID", // Test ID
  },
};

export class AdService {
  private static instance: AdService;
  private initialized = false;

  private constructor() { }

  static getInstance(): AdService {
    if (!AdService.instance) {
      AdService.instance = new AdService();
    }
    return AdService.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      if (Capacitor.isNativePlatform()) {
        await AdMob.initialize();
        await AdMob.requestTrackingAuthorization();
        console.log("AdMob initialized");
      } else {
        // Web: Initialize AdSense
        this.injectAdSenseScript();
        console.log("AdSense initialized");
      }
      this.initialized = true;

      // Show banner by default on initialization for now
      this.showBanner();
    } catch (error) {
      console.error("Ad service initialization failed", error);
    }
  }

  private injectAdSenseScript() {
    // Check if script already exists
    if (document.querySelector('script[src*="adsbygoogle.js"]')) {
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CONFIG.ADSENSE.CLIENT}`;
    document.head.appendChild(script);
  }

  async showBanner(
    position: BannerAdPosition = BannerAdPosition.BOTTOM_CENTER,
    adSize: BannerAdSize = BannerAdSize.ADAPTIVE_BANNER
  ): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      const options: BannerAdOptions = {
        adId:
          Capacitor.getPlatform() === "ios"
            ? AD_CONFIG.ADMOB.IOS_BANNER_ID
            : AD_CONFIG.ADMOB.ANDROID_BANNER_ID,
        adSize,
        position,
        margin: 0,
      };

      try {
        await AdMob.showBanner(options);
      } catch (error) {
        console.error("Failed to show banner", error);
      }
    } else {
      // Web: Show AdSense Banner
      this.showAdSenseBanner();
    }
  }

  private showAdSenseBanner() {
    if (document.getElementById("ad-container")) {
      return;
    }

    const adContainer = document.createElement("div");
    adContainer.id = "ad-container";
    adContainer.style.position = "fixed";
    adContainer.style.bottom = "0";
    adContainer.style.left = "0";
    adContainer.style.width = "100%";
    adContainer.style.textAlign = "center";
    adContainer.style.zIndex = "1000";
    adContainer.style.backgroundColor = "#fff";

    const ins = document.createElement("ins");
    ins.className = "adsbygoogle";
    ins.style.display = "block";
    ins.setAttribute("data-ad-client", AD_CONFIG.ADSENSE.CLIENT);
    ins.setAttribute("data-ad-slot", AD_CONFIG.ADSENSE.SLOT);
    ins.setAttribute("data-ad-format", "auto");
    ins.setAttribute("data-full-width-responsive", "true");

    adContainer.appendChild(ins);
    document.body.appendChild(adContainer);

    try {
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      (window as any).adsbygoogle.push({});
    } catch (e) {
      console.error("AdSense push failed", e);
    }
  }

  async hideBanner(): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      try {
        await AdMob.hideBanner();
      } catch (error) {
        console.error("Failed to hide banner", error);
      }
    } else {
      const adContainer = document.getElementById("ad-container");
      if (adContainer) {
        adContainer.remove();
      }
    }
  }

  async resumeBanner(): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      try {
        await AdMob.resumeBanner();
      } catch (error) {
        console.error("Failed to resume banner", error);
      }
    }
  }

  async removeBanner(): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      try {
        await AdMob.removeBanner();
      } catch (error) {
        console.error("Failed to remove banner", error);
      }
    } else {
      this.hideBanner();
    }
  }
}

export const adService = AdService.getInstance();
