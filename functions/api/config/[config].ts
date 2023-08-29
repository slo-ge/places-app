import { APP_CONFIGS, APP_FALLBACK_CONFIG } from '../../../lib/config';

export async function onRequest(event: EventContext<any, any, any>) {
  const configName = event.params.config;
  console.log(event.request.url);

  const url = new URL(event.request.url);
  if (url.searchParams?.get('referrer') === 'meta-mapper.com'){
      return APP_FALLBACK_CONFIG;
  }

  const config = APP_CONFIGS.get(configName as string) || APP_CONFIGS.get('default');
  return new Response(JSON.stringify(config), {headers: {'content-type': 'application-json'}});
}
