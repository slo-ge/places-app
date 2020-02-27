import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class LoadingService {

    private readonly isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private request = 0;

    constructor() {
    }

    public startLoading() {
        if (this.request < 1) {
            this.isLoading.next(true);
        }
        this.request++;
    }

    public stopLoading() {
        this.request--;
        if (this.request === 0) {
            this.isLoading.next(false);
        }
    }

    public getLoadingState(): Observable<boolean> {
        return this.isLoading.asObservable();
    }

}
