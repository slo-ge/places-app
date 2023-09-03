import { Env } from './[download]';

export async function onRequestGet(event: EventContext<Env, any, any>) {
    const { results } = await event.env.DB.prepare('SELECT * FROM BackendTracking').all();
    return new Response(JSON.stringify(results));
}

