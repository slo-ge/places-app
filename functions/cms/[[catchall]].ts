export async function onRequest(event: EventContext<any, any, any>) {
    const API_URL = 'https://dev-tools.at/cms';
    const { searchParams } = new URL(event.request.url);
    const url = API_URL + '/' + (event.params.catchall as string[]).join('/') + '?' + searchParams.toString();
    return fetch(url);
  }
  