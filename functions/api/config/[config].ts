export interface Config {
    applicationName: string;
    primaryColor?: string;

    featureFlags?: {
        onlyBrandTemplates?: boolean;
        showMailTo?: boolean;
    }
}

const configs: Map<string, Config> = new Map();
configs.set(
    'bonnibold',
    {
        applicationName: "Simple Editor",
        primaryColor: "violett",
        featureFlags: {
            onlyBrandTemplates: true,
            showMailTo: false
        }
    }
);

configs.set(
    'default',
    {
        applicationName: "Fast Content"
    }
)

export async function onRequest(event: EventContext<any, any, any>) {
    const configName = event.params.config;
    const config = configs.get(configName as string) || configs.get('default')
    return new Response(JSON.stringify(config), { headers: { 'content-type': 'application-json' } });
}
