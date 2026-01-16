import {
    AdMob,
    BannerAdPosition,
    BannerAdSize,
    type BannerAdOptions,
} from "@capacitor-community/admob";
import { Capacitor } from "@capacitor/core";

export class AdMobService {
    private static instance: AdMobService;
    private initialized = false;

    private constructor() { }

    static getInstance(): AdMobService {
        if (!AdMobService.instance) {
            AdMobService.instance = new AdMobService();
        }
        return AdMobService.instance;
    }

    async initialize(): Promise<void> {
        if (this.initialized || !Capacitor.isNativePlatform()) {
            return;
        }

        try {
            await AdMob.initialize();
            await AdMob.requestTrackingAuthorization();
            this.initialized = true;
            console.log("AdMob initialized");

            // Show banner by default on initialization for now
            this.showBanner();
        } catch (error) {
            console.error("AdMob initialization failed", error);
        }
    }

    async showBanner(
        position: BannerAdPosition = BannerAdPosition.BOTTOM_CENTER,
        adSize: BannerAdSize = BannerAdSize.ADAPTIVE_BANNER
    ): Promise<void> {
        if (!Capacitor.isNativePlatform()) return;

        const options: BannerAdOptions = {
            adId:
                Capacitor.getPlatform() === "ios"
                    ? "ca-app-pub-3940256099942544/2934735716" // Test ID
                    : "ca-app-pub-3940256099942544/6300978111", // Test ID
            adSize,
            position,
            margin: 0,
        };

        try {
            await AdMob.showBanner(options);
        } catch (error) {
            console.error("Failed to show banner", error);
        }
    }

    async hideBanner(): Promise<void> {
        if (!Capacitor.isNativePlatform()) return;
        try {
            await AdMob.hideBanner();
        } catch (error) {
            console.error("Failed to hide banner", error);
        }
    }

    async resumeBanner(): Promise<void> {
        if (!Capacitor.isNativePlatform()) return;
        try {
            await AdMob.resumeBanner();
        } catch (error) {
            console.error("Failed to resume banner", error);
        }
    }

    async removeBanner(): Promise<void> {
        if (!Capacitor.isNativePlatform()) return;
        try {
            await AdMob.removeBanner();
        } catch (error) {
            console.error("Failed to remove banner", error);
        }
    }
}

export const admob = AdMobService.getInstance();
