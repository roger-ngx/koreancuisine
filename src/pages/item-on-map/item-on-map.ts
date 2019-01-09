/**
 * Created by thanhnt on 7/9/2017.
 */
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  MarkerOptions,
  Marker
} from '@ionic-native/google-maps';

import {Component, OnInit} from '@angular/core'

import { Platform, NavController, NavParams} from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';

import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { LocationDetails } from '../location-details/location-details'

//http://arielfaur.github.io/ionic-pullup/
import { IonPullUpFooterState } from 'ionic-pullup';

declare var google: any;



@Component({
  selector : 'item-on-map',
  templateUrl : './item-on-map.html',
})

/*
 for reference
 http://www.honobono-life.info/wpeng/google-maps-for-angularjs-place-detailsv2-0-7/
 */

/*
 To fix Google Maps not found
 I spent all day on 10th July 2017. Fuck that !!!!
 1. typings install dt~google.maps --global
 2. declare var google;
 https://stackoverflow.com/questions/42173662/typescript-error-cannot-find-name-google-in-ionic2-when-using-googlemaps-javas?answertab=active#tab-top
 */
export class ItemOnMap{
    map: GoogleMap;
    mapElement: HTMLElement;

    places = [];
    selectedItem: any;
    location:any;
    mapIsLoaded = false;
    //location = new google.maps.LatLng(-33.8665433,151.1956316);
    loader : any;
    infowindow : any;
    drawerOptions: any;

    footerState: IonPullUpFooterState;

    constructor(public navCtrl: NavController, public navParams: NavParams, private googleMaps: GoogleMaps, private platform : Platform,
                private geolocation: Geolocation, private loadingCtrl: LoadingController, private storage: Storage) {

      this.footerState = IonPullUpFooterState.Collapsed;

      this.drawerOptions = {
        handleHeight: 50,
        thresholdFromBottom: 200,
        thresholdFromTop: 200,
        bounceBack: true
      };

      this.platform.ready().then(() => {

          var elem = document.getElementById('googleMaps');

          if(elem == null) {
              // not exists.
              let script = document.createElement("script");
              script.id = "googleMaps";

              script.src = 'http://maps.google.com/maps/api/js?key=AIzaSyCsbAb6Wsoq9z9TqDHsmXP18NfyA-pbrJU&libraries=places';

              document.body.appendChild(script);
          }

          console.log("calling the construction");
          // If we navigated to this page, we will have an item available as a nav param
          this.selectedItem = navParams.get('item');

          //this.onLocateUser();
      });

    }

    toggleFooter() {
      this.footerState = this.footerState == IonPullUpFooterState.Collapsed ? IonPullUpFooterState.Expanded : IonPullUpFooterState.Collapsed;
    }

  footerExpanded() {
    console.log('Footer expanded!');
  }

  footerCollapsed() {
    console.log('Footer collapsed!');
  }

    ////////////////////////////
    ionViewDidLoad() {
      //this.loadGoogleMap();

      this.initialMap();
      this.onLocateUser();
/*
      this.platform.ready().then(() => {

        var element =  document.getElementById('googleMaps');
        if (typeof(element) == 'undefined' || element == null)
        {
          // not exists.
          let script = document.createElement("script");
          script.id = "googleMaps";

          script.src = 'http://maps.google.com/maps/api/js?key=AIzaSyCsbAb6Wsoq9z9TqDHsmXP18NfyA-pbrJU&libraries=places';

          document.body.appendChild(script);
        }

        this.initialMap();
        this.onLocateUser();

      });
*/

    }

    loadGoogleMap() {

      var lat = 35.652832;
      var lng = 139.839478;

      this.mapElement = document.getElementById('map');

      let mapOptions: GoogleMapOptions = {
        camera: {
          target: {
            lat: lat,
            lng: lng
          },
          zoom: 12,
          tilt: 30
        }
      };

      this.map = new GoogleMap(this.mapElement, mapOptions);

      // Wait the MAP_READY before using any methods.
      this.map.one(GoogleMapsEvent.MAP_READY)
        .then(() => {
          console.log('Map is ready!');

          // Now you can use all methods safely.
          this.map.addMarker({
            title: 'Ionic',
            icon: 'blue',
            animation: 'DROP',
            position: {
              lat: lat,
              lng: lng
            }
          })
            .then(marker => {
              marker.on(GoogleMapsEvent.MARKER_CLICK)
                .subscribe(() => {
                  alert('clicked');
                });
            });

        });


      this.searchPlaces(this.map, lat, lng);
    }
    /////////////////////////////////

/*
    ngOnInit(){
      console.log("calling the on init");
      this.initialMap();
      this.onLocateUser();
    }
*/

    doRefresh(refresher){
      this.onLocateUser();

      refresher.complete();
    }

    public initialMap(){

      console.log("initial map");
      //this.onLocateUser();

      this.storage.get('current_location_lat').then((val) => {
        var lat = val;
        this.storage.get('current_location_lng').then((val) => {
          var lng = val;

          if(lat == null || lng == null) {
            lat = 35.652832;
            lng = 139.839478
          }

          this.loadMap(lat, lng);

        });
      });
    }

/*
    ionViewDidEnter(){
      console.log("ionViewDidEnter");
      this.onLocateUser();

      this.storage.get('current_location_lat').then((val) => {
        var lat = val;
        this.storage.get('current_location_lng').then((val) => {
          var lng = val;

          if(lat != null && lng != null) {
            this.loadMap(lat, lng);

            var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
            var beachMarker = new google.maps.Marker({
              position: {lat: lat, lng: lng},
              map: map,
              icon: image
            });
          }else{
            console.log('Cannot locate your location');
          }
        });
      });

    }
*/
    loadMap(lat,lng){
      if(!this.mapIsLoaded){
        this.mapIsLoaded = true;
      }else{
        return;
      }

      console.log('loadMap lat: '+lat+" ,lng: " + lng);

      let mapOptions = {
        center: {lat: lat, lng: lng},
        zoom: 12
      };

      try{
          this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
          this.searchPlaces(this.map, lat, lng);
      }catch(exp){
          setTimeout(function(){
            console.log("Exception: " + exp);
            this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
            this.searchPlaces(this.map, lat, lng);
          }.bind(this), 3000);
      }
    }

    onLocateUser(){
      console.log('onLocateUser');
      this.loader = this.loadingCtrl.create({
        content: "Please wait...",
        duration: 5000
      });
      this.loader.present();

      var options = {
        enableHighAccuracy: true,
        //timeout: 5000,
        maximumAge: 5
      };

      //https://github.com/ionic-team/ng-cordova/issues/743
      //adding permissions in AndroidManifest.xml worked for me...
      this.geolocation.getCurrentPosition(options)
      .then((location) => {
          //https://developers.google.com/maps/documentation/javascript/reference#LatLng

          var lat = location.coords.latitude;
          var lng = location.coords.longitude;

          console.log(lat + " " + lng);

          //update a current location into the local db
          this.storage.set('current_location_lat', lat);
          this.storage.set('current_location_lng', lng);

/*
          if(lat != null && lng != null) {
            //this.loadMap(lat, lng);

            var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
            var beachMarker = new google.maps.Marker({
              position: {lat: lat, lng: lng},
              map: map,
              icon: image
            });
          }else{
            console.log('Cannot locate your location');
          }
          */
        }
      ).catch(
        (error) => {
          console.log("geolocation getCurrentPosition has error");
          console.log(error);
          //loader.dismiss();
        }
      );

      let watch = this.geolocation.watchPosition();
      watch.subscribe((data) => {
        // data can be a set of coordinates, or an error (if an error occurred).
        console.log(data + " from watch");

        this.storage.set('current_location_lat', data.coords.latitude);
        this.storage.set('current_location_lng', data.coords.longitude);

      });
    }

    searchPlaces(map, lat, lng) {
      console.log('search places for : ' + this.selectedItem.Name);

      var firstIndex = this.selectedItem.Name.indexOf('(') + 1;
      var lastIndex = this.selectedItem.Name.indexOf(')');
      var name = this.selectedItem.Name.slice(firstIndex, lastIndex);

      console.log('search places for : ' + name);
      //console.log(this.location);

        var request = {
          location: new google.maps.LatLng(lat, lng),
          radius: '15000',
          //rankBy: google.maps.places.RankBy.DISTANCE,
          type: ['restaurant'],
          keyword: name
        };
      /*
      var request = {
        location: new google.maps.LatLng(lat, lng),
        radius: '15000',
        //rankBy: google.maps.places.RankBy.DISTANCE,
        //type: ['restaurant'],
        query: name
      };
      */

        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, this.callback.bind(this));
        //service.textSearch(request, this.callback.bind(this));

      var image = './assets/img/position.png';
      var beachMarker = new google.maps.Marker({
        position: {lat: lat, lng: lng},
        map: this.map,
        icon: image
      });
    }

    setPlace(results){
       this.places = []
       this.places = Object.assign([], results);
       console.log(this.places);
    }

    callback(results, status) {
        console.log('Found : ' + results.length + ' places');

        if (status === google.maps.places.PlacesServiceStatus.OK) {

          this.setPlace(results);

          for (var i = 0; i < results.length; i++) {
            this.createMarker(results[i]);
          }
        }
        this.loader.dismiss();
    }

    itemTapped(placeId) {

      //https://developers.google.com/maps/documentation/javascript/places#place_details

      var request = {
        placeId: placeId
      };

      var service = new google.maps.places.PlacesService(this.map);
      service.getDetails(request, callback.bind(this));

      function callback(place, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          this.navCtrl.push(LocationDetails, {
            place: place
          });
        }
      }

      /*
       _navCtrl.push(LocationDetails, {
       place: place
       });
       */
    }

    createMarker(place){
      //console.log('createMarker');
      var placeLoc = place.geometry.location;
      var marker = new google.maps.Marker({
        map: this.map,
        position: placeLoc
      });

      google.maps.event.addListener(marker, 'click', function() {
        //infowindow.setContent(place.name);
        //infowindow.open(map, marker);
        this.itemTapped(place.place_id);
      }.bind(this));
    }

    goHome(){
      this.navCtrl.popToRoot();
    }
}

