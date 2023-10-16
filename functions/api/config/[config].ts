import { APP_CONFIGS, APP_FALLBACK_CONFIG } from '../../../lib/config';

export async function onRequest(event: EventContext<any, any, any>) {
    const configName = event.params.config;
    const host = event.request.headers?.get('host');
    if (['meta-mapper.com', 'www.meta-mapper.com'].includes(host)) {
        return new Response(JSON.stringify(APP_FALLBACK_CONFIG), { headers: { 'content-type': 'application-json' } });
    }

    const config = APP_CONFIGS.get(configName as string) || APP_CONFIGS.get('default');
    return new Response(JSON.stringify(config), { headers: { 'content-type': 'application-json' } });
}
