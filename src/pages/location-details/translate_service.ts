/**
 * Created by thanhnt on 7/8/2017.
 */
import { Injectable } from '@angular/core';
import { Http} from '@angular/http'
import { HttpParams } from '@angular/common/http';

@Injectable()
export class GoogleTranslateService {

  private google_translate_api = 'https://translation.googleapis.com/language/translate/v2?key=YOUR_API_KEY';  // URL to web api
  constructor(private http: Http) { }

  public getTranslations(reviews): Promise<any>{
    let httpParams = new HttpParams();

    for(var i=0;i<reviews.length;i++)
    {
      httpParams = httpParams.set('p', reviews[i].text);
    }
    httpParams = httpParams.set('target', 'en');

    return this.http.post(this.google_translate_api, httpParams)
      .toPromise()
      .then(
        data => data.json().data.translations,
        err => this.handleError(err)
    );

  }

  private handleError(msg){
    console.error('An error occurred', msg); // for demo purposes only
  }
}
