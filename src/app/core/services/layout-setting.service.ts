import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LayoutSetting} from "@app/core/model/layout-setting";
import {Observable} from "rxjs";

export const LAYOUT_CONFIG_BASE_URL = 'http://dev-tools.at:1337';
const LAYOUT_CONFIG_API = 'http://dev-tools.at:1337/export-latest-layouts';

@Injectable({
  providedIn: 'root'
})
export class LayoutSettingService {

  constructor(private httpClient: HttpClient) {
  }

  public getLayoutSetting(): Observable<LayoutSetting[]> {
    return this.httpClient.get<LayoutSetting[]>(LAYOUT_CONFIG_API);
  }

}
