import { Component, OnInit } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import  { FoodItem} from './FoodItem'
import { ItemOnMap } from '../item-on-map/item-on-map'
import { LocalFoodService } from './list.service';

@Component({
  selector: 'page-local-foods',
  templateUrl: 'local-food.html'
})
export class LocalFoodPage implements OnInit{
  localFoods: FoodItem[];
  prefectures: string[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private listService : LocalFoodService) {
    // If we navigated to this page, we will have an item available as a nav param
    this.prefectures = navParams.get('prefectures');

    //console.log(this.prefectures);
    //var length = this.prefectures.length;
    //for(var i=0; i< length; i++) {
      //console.log("prefecture : " + this.prefectures[i]);
      this.listService.getFoodItems(this.prefectures[0]).then(data => this.initData(data));
    //}
  }

  ngOnInit() {
    this.listService.getCurLocation();
  }

  initData(data){
    if(data == null) return;

    this.localFoods = data;

    var length = this.localFoods.length;

    this.listService.getStorageService().get(this.prefectures[0]).then(value => {
      if(value == null){
        //get url from firebase for the 1st time
        this.listService.getStorageService().set(this.prefectures[0], length);

        for (var i = 0; i < length; i++) {
          this.listService.getFoodImage(this.localFoods[i].Name, i).then(url => this.setImageDownloadUrl(url));
        }
      }else{
            //get url from local storage
            for (var i = 0; i < length; i++) {
              this.listService.getStorageService().get(this.prefectures[0] + "_" + i).then(value => {
                if (value != null) {
                  this.setImageDownloadUrl(value);
                }
              });
            }
        }
    })
    .catch(
        (err:Error) => {
          console.log('Error:' + err.message);
        }
      );

    /*
    firebase.auth().signInWithEmailAndPassword('thanh.uou@gmail.com', 'japanesecuisine_thanh_s.korea')
      .then((credentials) => {
        //this.listService.getStorageService().set("#item", length)
        for (var i = 0; i < length; i++) {
          this.listService.getFoodImage(this.localFoods[i].Name, i).then(url => this.setImageDownloadUrl(url));
        }
        //this.loader.dismiss();
      })
      .catch((err:Error) => {
        //console.log('signInWithEmailAndPassword Error:' + err.message);
        //this.loader.dismiss();
      });
      */
  }

  setImageDownloadUrl(response){
    if(response != null){
      var ret = response.split("|!@#|");

      this.listService.getStorageService().set(this.prefectures[0] + "_" + ret[1], response);

      this.localFoods[ret[1]].Image = ret[0];
    }
  }

  itemTapped(event, item) {
    this.navCtrl.push(ItemOnMap, {
      item: item
    });
  }
}
