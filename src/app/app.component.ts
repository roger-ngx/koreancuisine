import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav } from 'ionic-angular';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ListPage } from '../pages/list/list';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import * as firebase from 'firebase';

import { ImgcacheService } from './ImgCacheService';
import { ImageLoaderConfig } from 'ionic-image-loader';

//https://ionicframework.com/docs/native/location-accuracy/
import { LocationAccuracy } from '@ionic-native/location-accuracy';

export const firebaseConfig = {
  apiKey: "AIzaSyBMNfAgw8LXsxx5CN8HjCDveuInd__Usl0",
  authDomain: "koreancuisine-a55d2.firebaseapp.com",
  databaseURL: "https://koreancuisine-a55d2.firebaseio.com",
  projectId: "koreancuisine-a55d2",
  storageBucket: "koreancuisine-a55d2.appspot.com",
  messagingSenderId: "494172144561"
};

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage = ListPage;
  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public imgcacheService: ImgcacheService,
    private imageLoaderConfig: ImageLoaderConfig,
    private locationAccuracy: LocationAccuracy
  ) {

    this.initializeApp();

    firebase.initializeApp(firebaseConfig);

    this.imageLoaderConfig.setConcurrency(3);
    this.imageLoaderConfig.setMaximumCacheSize(40 * 1024 * 1024);
    // set our app's pages
    this.pages = [
      { title: 'Find Local Foods', component: HelloIonicPage },
      { title: 'Food List', component: ListPage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // initialize imgCache library and set root : less than 2 seconds
      this.imgcacheService.initImgCache().then(() => {
        //this.nav.setRoot(this.rootPage);
      });

      /*
      //https://ionicframework.com/docs/native/location-accuracy/
      this.locationAccuracy.canRequest().then((canRequest: boolean) => {

        if(canRequest) {
          // the accuracy option will be ignored by iOS
          this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
            () => console.log('Request successful'),
              error => console.log('Error requesting location permissions', error)
          );
        }

      });
      */

    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
}
