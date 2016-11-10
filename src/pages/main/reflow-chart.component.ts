import { Component, ChangeDetectorRef } from '@angular/core';
import { ChartType } from 'angular2-chartist';
import * as Chartist from 'chartist';
import { BleComms } from '../../providers/blecomms';

// export interface liveData {
//   labels: string[];
//   series: Array<Array<string>>;
// }

export interface profileData {
     [s:string]: string;
}

@Component({
selector: 'component-chart-reflow',

template: `<ion-card id="chart-css">
            <ion-card-content>
              <x-chartist
                [data]="lData"
                [type]="type"
                [options]="options">
              </x-chartist>
            </ion-card-content>
          </ion-card>`})

export class ReflowChart {

  private options : any;
  private type : ChartType;
//  private lData : liveData;
  private lData : any; 
  private pData : profileData;
  private bleDataObj: any;
  private counter = 0;
  

  constructor (private blecomms : BleComms, private cd:ChangeDetectorRef){
    this.blecomms.ble_notify$
          .subscribe(data => {
            this.bleDataObj = data;
            this.addLiveData(this.bleDataObj);
            this.cd.detectChanges();
          });
  } // constructor end

  ngOnInit(){
    console.time("setupChart");
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
        series: [{name:'series-1', data:[]},{name:'series-2', data:[]}]
      };

      this.options = {
        heigth: 250,
        fullWidth: true,
        // lineSmooth: Chartist.Interpolation.cardinal({
        //       fillHoles: true,
        // }),
        axisX: {
          labelInterpolationFnc: function(value, index) {
          return index % 30 === 0 ?  + value : null;
          }
        },
        chartPadding: {
          right: 15,
          left: -10,
          top: -10,
          bottom: -10
        },
         series: {
          'series-1': {
            lineSmooth: Chartist.Interpolation.cardinal({
              fillHoles: true
            }),
          },
          'series-2': {
            lineSmooth: Chartist.Interpolation.cardinal(),
              showPoint: false
          }
        }
      }
      
      this.populateData(301);
      //this.addLiveDataStub();
      console.timeEnd("setupChart");

  }

  populateData(n){
    console.time("populateData");
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
        me.lData.series[0].data.push(match);
        //me.lData.series[1].push('120');
      }
      console.log(JSON.stringify(me.lData));
     console.timeEnd("populateData");
   }  


  addLiveDataStub(){
     setInterval(() => {
          this.lData.series[1].data[this.counter] = "100";
          console.log("data: " + JSON.stringify(this.lData));
          this.counter++
          if (this.counter === 300){
              this.counter = 0;
          }
     },1000);
  }

  addLiveData(bleData){  
    if (bleData.Time >= 0 && bleData.Time <= 300){
      let index:number = bleData.Time;
      this.lData.series[1].data[index] = bleData.Temp;
      this.lData = Object.assign({}, this.lData);
      console.log("data: " + JSON.stringify(this.lData));        
    }
    if (bleData.Time == 0){
      this.lData.series[1].data.length = 0;
    }

  }
}//class