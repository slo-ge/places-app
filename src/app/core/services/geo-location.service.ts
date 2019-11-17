import {Injectable} from '@angular/core';


export function calculateDistance(lat1: number, lat2: number, long1: number, long2: number) {
    let p = 0.017453292519943295;    // Math.PI / 180
    let c = Math.cos;
    let a = 0.5 - c((lat1 - lat2) * p) / 2 + c(lat2 * p) * c((lat1) * p) * (1 - c(((long1 - long2) * p))) / 2;
    let dis = (12742 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6371 km
    return dis;
}

@Injectable({
    providedIn: 'root'
})
export class GeoLocationService {

    constructor() {
    }

    /**
     * returns promise with geo location
     *
     * in error cases (user denied or something else)
     *  - log error
     *  - return promise with null
     */
    getPosition(): Promise<any> {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resp => {
                    resolve({lng: resp.coords.longitude, lat: resp.coords.latitude});
                },
                err => {
                    console.error(err);
                    reject(err);
                });
        }).catch(() => null);
    }
}
