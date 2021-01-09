import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ExportLatestPreset} from "@app/core/model/export-latest-preset";
import {Observable} from "rxjs";

export const CMS_API_URL = 'http://dev-tools.at:1337';
const LAYOUT_CONFIG_API = 'http://dev-tools.at:1337/export-latest-layouts';

@Injectable({
  providedIn: 'root'
})
export class LayoutSettingService {

  constructor(private httpClient: HttpClient) {
  }

  public getLayoutSetting(): Observable<ExportLatestPreset[]> {
    return this.httpClient.get<ExportLatestPreset[]>(LAYOUT_CONFIG_API);
  }
}
