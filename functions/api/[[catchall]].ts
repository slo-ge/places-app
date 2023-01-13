export async function onRequest(event: EventContext<any, any, any>) {
    const API_URL = 'https://dev-tools.at';
    const { searchParams } = new URL(event.request.url);
    return await fetch(API_URL + '/' + (event.params.catchall as string[]).join('/') + '?' + searchParams.toString());
  }
  