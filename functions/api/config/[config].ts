import {APP_CONFIGS} from "../../../lib/config";

export async function onRequest(event: EventContext<any, any, any>) {
  const configName = event.params.config;
  const config = APP_CONFIGS.get(configName as string) || APP_CONFIGS.get('default');
  return new Response(JSON.stringify(config), {headers: {'content-type': 'application-json'}});
}
