import { Component } from '@angular/core';
import { ChartType } from 'angular2-chartist';
import * as Chartist from 'chartist';

export interface liveData {
  labels: string[];
  series: Array<Array<string>>;
}

export interface profileData {
     [s:string]: string;
}

@Component({
selector: 'component-chart-reflow',

template: `<ion-card>
            <ion-card-content>
              <x-chartist
                [data]="lData"
                [type]="type"
                [options]="options">
              </x-chartist>
            </ion-card-content>
          </ion-card>`})

// template: `<x-chartist
//                 [data]="lData"
//                 [type]="type"
//                 [options]="options">
//               </x-chartist>`
//       })

export class ReflowChart {

  private options : any;
  private type : ChartType;
  private lData : liveData;
  private pData : profileData;

  constructor (){

   this.type = 'Line';

    this.pData = {
        "0"  : "20",
        "30" : "70",
        "60" : "110",
        "90" : "150",
        "120": "165",
        "150": "170",
        "180": "185",
        "210": "210",
        "240" : "200",
        "270" : "180",
        "300" : "160"
    };

    this.lData =
    {
      labels: [],
      series: [[],[]]
    };

    this.options = {
      heigth: 250,
      fullWidth: true,
      lineSmooth: Chartist.Interpolation.cardinal({
            fillHoles: true,
      }),
      axisX: {
        labelInterpolationFnc: function(value, index) {
        return index % 30 === 0 ?  + value : null;
        }
      },
      chartPadding: {
        right: 10,
        left: -20
      },
      
    }
    this.populateData(301);
  } // constructor end

  populateData(n){
      for (let i=0; i<n; i++){
        this.lData.labels.push(i.toString());
        var match = null;
        var flag = 0;
        var me = this;
        for (let prop in this.pData){
            if( this.pData.hasOwnProperty( prop ) ) {

                if (i.toString() == prop && flag != 1){
                    match = (this.pData[prop]);
                    flag = 1;
                }
                if (flag != 1){
                    match = null;
                }
            }
        }
        me.lData.series[0].push(match);
      }
      console.log(JSON.stringify(me.lData));
     // this.addLiveData();       //to be removed!
   }  

  addLiveData(){   //to be replaced by real logic
    var liveData = {
      "1" : "22",
      "2" : "25",
      "3" : "28",
      "5" : "40"
    }
    var me = this;
    this.lData.labels.forEach(function(label){
      Object.keys(liveData).forEach(function(key){
          if (label[0] == key ){
              me.lData.series[1][label[0]] = (liveData[key]);
          }
      });
    });
  }
}//class