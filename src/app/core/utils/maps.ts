import {ACFLocation} from "@places/core/model/wpObject";

/**
 * returns the url which should be opned in google maps
 *
 * @param place, current place
 */
export function getGoogleMapRoute(place: ACFLocation) {
    return `https://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=${place.acf.place.lat},${place.acf.place.lng}`;
}
