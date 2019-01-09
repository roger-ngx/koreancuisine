import { Component, OnInit, OnDestroy} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
//https://github.com/amcharts/amcharts3-angular2/issues/33
import { AmChartsService} from "amcharts3-angular2";
import { LocalFoodPage } from '../local-food/local-food'

@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage implements OnInit, OnDestroy{
  private chart: any;
  //private states : string[];
  private prefectures : any;

  constructor(private AmCharts: AmChartsService, public navCtrl: NavController) {

  }

  ngOnInit(){
    this.prefectures = [];
    this.createChart();
    this.chart.path = "/node_modules/amcharts3/amcharts/";

    // This must be called when making any changes to the chart
    this.AmCharts.updateChart(this.chart, () => {
      // Change whatever properties you want, add event listeners, etc.
      this.chart.addListener("clickMapObject", (event) => {
        // toggle showAsSelected
        for ( var i in this.chart.dataProvider.areas ) {
          this.chart.dataProvider.areas[ i ].isFirst = false;
        }
        event.mapObject.isFirst = true;
        //event.mapObject.showAsSelected = !event.mapObject.showAsSelected;

        // bring it to an appropriate color
        //this.chart.returnInitialColor( event.mapObject );
        this.addPrefecture();
      });
    });
  }

  addPrefecture(){
    this.prefectures = [];
    for ( var i in this.chart.dataProvider.areas ) {
      var area = this.chart.dataProvider.areas[ i ];
      if (area.isFirst) {
          //console.log(area);
          if(area.title.indexOf("Hokkaido") >= 0) area.title = "Hokkaido";
          this.prefectures.push(area.title)
      }
    }
  }

  ngOnDestroy(){
    this.AmCharts.destroyChart(this.chart);
  }

  itemTapped() {
    this.navCtrl.push(LocalFoodPage, {
      prefectures: this.prefectures
    });
  }

  createChart(){
    this.chart = this.AmCharts.makeChart( "chartdiv", {
      "type": "map",
      "theme": "light",

      "panEventsEnabled": true,
      //"backgroundColor": "#666666",
      //"backgroundAlpha": 1,
      "dataProvider": {
        "map": "japanLow",
        "getAreasFromMap": true
      },
      "areasSettings": {
        "autoZoom": false,
        "color": "#CDCDCD",
        "colorSolid": "#5EB7DE",
        "selectedColor": "#5EB7DE",
        "outlineColor": "#666666",
        "rollOverColor": "#88CAE7",
        "rollOverOutlineColor": "#FFFFFF",
        "selectable": true
      },
      "export": {
        "enabled": false
      }
    } );
  }
}
