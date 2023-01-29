export enum FeatureFlags {
    ONLY_BRAND_TEMPLATES = 'onlyBrandTemplates',
    SIMPLE_FOOTER = 'showMailTo',
    SHOW_INLINE_META_INPUT = 'showInlineMetaInput',
    HIDE_FEEDBACK = 'hideFeedback',
    SHOW_PREST_TAGS = 'showPresetTags',
    SHOW_USER_SETTINGS = 'showUserSetting',
    SHOW_IMPRINT = 'showImprint'
}

export interface ApplicationConfig {
    applicationName: string;
    colors?: {
        primary?: string;
        'primary-soft'?: string
    };
    featureFlags?: FeatureFlags[];
}

export const APP_CONFIGS: Map<string, ApplicationConfig> = new Map();

const BONNIBOLD: ApplicationConfig = {
    applicationName: "FCE",
    colors: {
        primary: "#353956",
        'primary-soft': "#848ed9"
    },
    featureFlags: [
        FeatureFlags.ONLY_BRAND_TEMPLATES,
        FeatureFlags.SHOW_INLINE_META_INPUT,
        FeatureFlags.SIMPLE_FOOTER,
        FeatureFlags.HIDE_FEEDBACK,
        FeatureFlags.SHOW_USER_SETTINGS,
        FeatureFlags.SHOW_IMPRINT
    ]
};
const APP_DEFAULT_CONFIG: ApplicationConfig = {
    applicationName: "FCE",
    featureFlags: [
        FeatureFlags.SHOW_USER_SETTINGS,
        FeatureFlags.SHOW_IMPRINT,
        FeatureFlags.SIMPLE_FOOTER
    ]
}
export const APP_FALLBACK_CONFIG: ApplicationConfig = {
    /*applicationName: "METAMAPPER",
    featureFlags: [
        FeatureFlags.SHOW_PREST_TAGS
    ]*/
    ...BONNIBOLD
}
APP_CONFIGS.set('default', APP_DEFAULT_CONFIG);
APP_CONFIGS.set('bonnibold', BONNIBOLD);


