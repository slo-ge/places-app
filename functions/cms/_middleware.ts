const API_URL = 'https://dev-tools.at/';

/**
 * Proxies all request to strapi cms
 */
export async function onRequest(context: EventContext<any, any, any>) {
    const { request } = context;
    const { pathname, searchParams } = new URL(request.url)
    const clone = new Request(`${API_URL}/${pathname}?${searchParams}`, request.clone());
    return fetch(clone);
}