import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule } from '@angular/http'
import {HttpClientModule} from '@angular/common/http';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { ListPage } from '../pages/list/list';
import { ListService } from '../pages/list/list.service';
import { ItemOnMap } from '../pages/item-on-map/item-on-map';
import { LocationDetails } from '../pages/location-details/location-details'
import { LocalFoodPage } from '../pages/local-food/local-food';
import { LocalFoodService } from '../pages/local-food/list.service';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Geolocation } from '@ionic-native/geolocation';
import { IonicStorageModule } from '@ionic/storage';
import { Ionic2RatingModule } from 'ionic2-rating';

import { LazyLoadDirective }   from './LazyLoadDirective';

import { ImgcacheService }    from './ImgCacheService';
import { IonicImageLoader } from 'ionic-image-loader';

import { AmChartsModule } from "amcharts3-angular2";

//https://ionicframework.com/docs/native/location-accuracy/
import { LocationAccuracy } from '@ionic-native/location-accuracy';

import { GoogleMaps } from '@ionic-native/google-maps';
import { ContentDrawerComponent } from '../components/content-drawer/content-drawer';
//angular material
//https://material.angular.io/guide/getting-started
//import {NoopAnimationsModule} from '@angular/platform-browser/animations';
//import {MdProgressBarModule} from '@angular/material';
//import { MaterialModule } from '@angular/material';
import { IonPullupModule } from 'ionic-pullup';

@NgModule({
  declarations: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    ItemOnMap,
    LocationDetails,
    LazyLoadDirective,
    LocalFoodPage,
    ContentDrawerComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    Ionic2RatingModule,
    IonicImageLoader.forRoot(),
    AmChartsModule,
    IonPullupModule
   // MaterialModule,
    //NoopAnimationsModule,
    //MdProgressBarModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    ItemOnMap,
    LocationDetails,
    LocalFoodPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ListService,
    LocalFoodService,
    Geolocation,
    ImgcacheService,
    LocationAccuracy,
    GoogleMaps,
  ]
})
export class AppModule {}
