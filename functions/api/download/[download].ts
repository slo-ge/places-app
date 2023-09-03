export interface Env {
    // If you set another name in wrangler.toml as the value for 'binding',
    // replace "DB" with the variable name you defined.
    DB: D1Database;
}

const getTrackingEvent = (f: FormData) => f.get('trackingEvent');
const getTrackingDetail = (f: FormData) => f.get('trackingDetail');

export async function onRequestPost(event: EventContext<Env, any, any>) {
    const formdata = await event.request.formData();
    const trackingEvent = getTrackingEvent(formdata);
    const trackingDetail = getTrackingDetail(formdata);

    if (!trackingEvent || !trackingDetail) {
        return new Response('Bad Request, Request not complete', { status: 500 });
    }

    const results = await event.env.DB.prepare(
        `
        INSERT INTO BackendTracking (TrackingEvent, TrackingDetail, EventDate)
        VALUES ('${trackingEvent}', '${trackingDetail}', datetime())
    `
    ).run();

    return new Response(JSON.stringify({ message: 'Image successfully downloaded' }));
}
