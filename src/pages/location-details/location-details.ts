/**
 * Created by thanhnt on 7/9/2017.
 */

import {Component, OnInit} from '@angular/core'

import { NavController, NavParams} from 'ionic-angular';
import { GoogleTranslateService } from './translate_service';

@Component({
  selector : 'location-details',
  templateUrl : './location-details.html',
  providers : [GoogleTranslateService]
})

export class LocationDetails implements OnInit{

  place: any;
  embed_url : any;
  static_url: any;
  translatedText : any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private service : GoogleTranslateService) {
    // https://developers.google.com/maps/documentation/javascript/reference#PlaceResult
    this.place = navParams.get('place');

    //you must enable Maps Embed API
    //this.embed_url = '//www.google.com/maps/embed/v1/place?q=place_id:' + this.place.place_id + '&zoom=17&key=AIzaSyAOssGDLv8eEu_rw7csJssor9d82TxpFUQ';
    let location = this.place.geometry.location;

    this.static_url = 'https://maps.googleapis.com/maps/api/staticmap' +
      '?&size=400x200&style=visibility:on' +
      '&maptype=roadmap' +
      '&markers=color:red%7C'+ location.lat() + ',' + location.lng()
      '&key=AIzaSyC4DjqnB33W1QE4gOo9uxKO6scZPH6z2kY'

    //this.embed_url = "https://www.google.com/maps?q=loc:"+ location.lat() + ',' + location.lng()+"&amp;z=14";

    this.embed_url = "https://www.google.com/maps?q=" + this.place.name + "," + this.place.formatted_address;

    console.log(location);
  }

  ngOnInit(){
    //this.service.getTranslations(this.place.reviews).then(data => this.handleResponseData(data));
  }

  handleResponseData(data){
    this.translatedText = data;
  }
}

