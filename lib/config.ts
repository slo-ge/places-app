export enum FeatureFlags {
    ONLY_BRAND_TEMPLATES = 'onlyBrandTemplates',
    SHOW_MAILTO = 'showMailTo',
    SHOW_INLINE_META_INPUT = 'showInlineMetaInput'
}

export interface ApplicationConfig {
    applicationName: string;
    primaryColor?: string;
    featureFlags?: FeatureFlags[];
}

export const APP_CONFIGS: Map<string, ApplicationConfig> = new Map();

const BONNIBOLD: ApplicationConfig = {
    applicationName: "Simple Editor",
    primaryColor: "violett",
    featureFlags: [
            FeatureFlags.ONLY_BRAND_TEMPLATES,
            FeatureFlags.SHOW_INLINE_META_INPUT
    ]
};

export const APP_DEFAULT_CONFIG: ApplicationConfig = {
    applicationName: "Fast Content"
}


APP_CONFIGS.set('default', APP_DEFAULT_CONFIG);
APP_CONFIGS.set('bonnibold', BONNIBOLD);

