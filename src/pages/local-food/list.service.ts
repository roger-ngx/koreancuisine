/**
 * Created by thanhnt on 7/8/2017.
 */
import { Injectable } from '@angular/core';
import { Http } from '@angular/http'
import  { FoodItem} from './FoodItem'
import 'rxjs/add/operator/toPromise';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';
import * as firebase from 'firebase';

@Injectable()
export class LocalFoodService {

    private itemsUrl = './assets/json/japanese_food_2.json';  // URL to web api

    constructor(private http: Http, private geolocation: Geolocation, private storage: Storage) { }

    public getFoodItems(prefectureName): Promise<FoodItem[]> {
      return this.http.get(this.itemsUrl)
        .toPromise()
        .then(
            response => {
              var json = response.json();
              //console.log(prefectureName + "___" + json[prefectureName]);
              return json[prefectureName] as FoodItem[];
            },
                  msg => this.handleError(msg)
        );
    }

    public getFoodImage(itemName, position): firebase.Promise<any>{

      return firebase.storage().ref().child('japan_local_foods/' + itemName + '.jpg')
            .getDownloadURL()
            .then(
                //url => url + "|!@#|" + position;
                url => this.handleDownloadUrl(url, position)
             )
            .catch((err : Error) =>
            {
              console.log('getDownloadURL Error:' + err.message);
            });
    }

    handleDownloadUrl(url, position){
      url = url + "|!@#|" + position;
      return url;
    }

    private handleError(msg){
      console.error('An error occurred', msg); // for demo purposes only
    }

    public getStorageService(){
      return this.storage;
    }

    public getCurLocation(){
      this.geolocation.getCurrentPosition()
        .then(
        (location) => {
          //https://developers.google.com/maps/documentation/javascript/reference#LatLng

          //update a current location into the local db
          this.storage.set('current_location_lat', location.coords.latitude);
          this.storage.set('current_location_lng', location.coords.longitude);
        }
      )
        .catch(
        (error) => {
          console.log("geolocation getCurrentPosition has error");
          console.log(error);
        }
      );
    }
}
