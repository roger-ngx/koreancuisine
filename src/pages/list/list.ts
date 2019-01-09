import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http'

import { NavController, NavParams } from 'ionic-angular';
import { Content } from 'ionic-angular';

import { ItemDetailsPage } from '../item-details/item-details';
import  { FoodItem} from './FoodItem'
import { ListService } from './list.service';
import * as firebase from 'firebase';
import { LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
  providers: [ListService],
  //styleUrls: ['pages/list/list.css']
})
export class ListPage implements OnInit{

  @ViewChild(Content) content: Content;

  foodItems : FoodItem[];
  foodItemsCopy : FoodItem[];
  foodItemsInPage : FoodItem[];
  currentPage : any;
  maxPages : any;
  ITEMS_IN_PAGE = 10;
  MAX_PAGE = 4;
  isBackAvail = false;
  isNextAvail = false;
  loader : any;
  loadedPage = [];
  isSearching = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private listService : ListService, private loadingCtrl: LoadingController) {
      this.currentPage = 1;
  }

  ngOnInit() {
    this.listService.getCurLocation();
    this.listService.getFoodItems().then(data => this.initData(data));
  }

  initData(data){
    this.foodItems = data;
    //console.log(this.foodItems);

    var length = this.foodItems.length;

    if(length > 0) {
      this.maxPages = length/this.ITEMS_IN_PAGE;

      this.foodItems.sort(
        function (a, b) {
          return a.Name.localeCompare(b.Name);
        }
      );

      this.onPageChanged(1);

      this.listService.getStorageService().get("#koreanfoods").then(
        (value) => {
          if (value != null && value > 0) {
            //console.log("get links from local");
            if(this.loadedPage.indexOf(this.currentPage) == -1) {
              this.loadedPage.push(this.currentPage);
            }
            for (var i = 0; i < length; i++) {
              this.listService.getStorageService().get("korean" + i).then((url) => this.setImageDownloadUrl(url));
            }
            //this.loader.dismiss();
          } else {

            this.listService.getStorageService().set("#koreanfoods", length)
            for (var i = 0; i < length; i++) {
              console.log(i + " " + this.foodItems[i].Name);
              this.listService.getFoodImage(this.foodItems[i].Name, i).then(url => this.setImageDownloadUrl(url));
            }
            //console.log("get links from firebase");
            /*
            firebase.auth().signInWithEmailAndPassword('thanh.uou@gmail.com', 'japanesecuisine_thanh_s.korea')
              .then((credentials) => {
                this.listService.getStorageService().set("#item", length)
                for (var i = 0; i < length; i++) {
                  this.listService.getFoodImage(this.foodItems[i].Name, i).then(url => this.setImageDownloadUrl(url));
                }
                //this.loader.dismiss();
              })
              .catch((err:Error) => {
                //console.log('signInWithEmailAndPassword Error:' + err.message);
                this.loader.dismiss();
              });
             */
          }
        });
    }
  }
/*
  onBackEvent(){
    this.currentPage--;
    this.onPageChanged();
  }

  onNextEvent(){
    this.currentPage++;
    this.onPageChanged();
  }
*/
  private onPageChanged(page){

    this.content.scrollToTop();

  //  this.listService.getStorageService().get("#page" + page).then(
  //    (value) => {
  //      if (value == null) {
          this.loader = this.loadingCtrl.create({
            content: "Loading...",
            duration: 7000
          });
   //       this.loader.present();

   //       this.listService.getStorageService().set("#page" + page, 21);
   //     }

        this.currentPage = page;
        var length = this.foodItems.length;

        if (length > this.ITEMS_IN_PAGE * this.currentPage) {
          this.isNextAvail = true;
        } else {
          this.isNextAvail = false;
        }

        if (this.currentPage == 1) {
          this.isBackAvail = false;
        } else {
          this.isBackAvail = true;
        }

        //console.log("next: " + this.isNextAvail + ", back: " + this.isBackAvail);

        var min = this.ITEMS_IN_PAGE * (this.currentPage - 1);
        /*
         if(min >= length){
         this.loader.dismiss();
         return;
         }
         */
        var max = this.ITEMS_IN_PAGE * this.currentPage;
        //max = (max > length) ? length : max

        //console.log("min: " + min + ", max: " + max + ", length : " + length);

        this.foodItemsInPage = Object.assign([], this.foodItems.slice(min, max));
        this.foodItemsCopy = Object.assign([], this.foodItemsInPage);

        if (this.loadedPage.length == this.MAX_PAGE) {
          this.loader.dismiss();
          return;
        }
    //  });
    /*
    this.listService.getStorageService().get("#item").then(
      (value) => {
        if (value != null && value > 0) {
          //console.log("get links from local");
          if(this.loadedPage.indexOf(this.currentPage) == -1) {
            this.loadedPage.push(this.currentPage);
          }
          for (var i = min; i < max; i++) {
            this.listService.getStorageService().get("" + i).then((url) => this.setImageDownloadUrl(url, min, max));
          }
          //this.loader.dismiss();
        } else {
          //console.log("get links from firebase");
          firebase.auth().signInWithEmailAndPassword('thanh.uou@gmail.com', 'japanesecuisine_thanh_s.korea')
            .then((credentials) => {
              this.listService.getStorageService().set("#item", length)
              for (var i = 0; i < length; i++) {
                this.listService.getFoodImage(this.foodItems[i].Name, i).then(url => this.setImageDownloadUrl(url, min, max));
              }
              //this.loader.dismiss();
            })
            .catch((err:Error) => {
              console.log('signInWithEmailAndPassword Error:' + err.message);
              this.loader.dismiss();
            });
        }
      });
      */
  }

  setImageDownloadUrl(response){
    if(response != null){
      console.log(response);
      var ret = response.split("|!@#|");
      this.foodItems[ret[1]].Image = ret[0];

      //this is only loaded for the first page, other with copy directly from foodItems list
      if(ret[1] < this.ITEMS_IN_PAGE) {
        this.foodItemsCopy[ret[1]].Image = ret[0];
        this.foodItemsInPage[ret[1]].Image = ret[0];
      }
    }
  }

  itemTapped(event, item) {
    this.navCtrl.push(ItemDetailsPage, {
      item: item
    });
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    //this.foodItems = Object.assign([], this.foodItemsCopy);

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.isSearching = true;
      this.foodItemsInPage = this.foodItems.filter((item) => {
        return (item.Name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }else{
      this.isSearching = false;
      this.foodItemsInPage = Object.assign([], this.foodItemsCopy);
    }
  }
}
