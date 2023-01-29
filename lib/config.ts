export interface ApplicationConfig {
  applicationName: string;
  primaryColor?: string;

  featureFlags?: {
    onlyBrandTemplates?: boolean;
    showMailTo?: boolean;
    showInlineMetaInput?: boolean;
  }
}

export const APP_CONFIGS: Map<string, ApplicationConfig> = new Map();

const BONNIBOLD: ApplicationConfig = {
    applicationName: "Simple Editor",
    primaryColor: "violett",
    featureFlags: {
      onlyBrandTemplates: true,
      showMailTo: false,
      showInlineMetaInput: true
    }
  };

export const APP_DEFAULT_CONFIG: ApplicationConfig = {
  applicationName: "Fast Content"
}


APP_CONFIGS.set('default', APP_DEFAULT_CONFIG);
APP_CONFIGS.set('bonnibold', BONNIBOLD);

