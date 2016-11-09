import { Component, ChangeDetectorRef } from '@angular/core';
import { ChartType, ChartEvent } from 'angular2-chartist';
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

template: `<ion-card>
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
  private events: ChartEvent;
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
          right: 10,
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
    

  }

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
        me.lData.series[0].data.push(match);
        //me.lData.series[1].push('120');
      }
      console.log(JSON.stringify(me.lData));
     
   }  


  addLiveDataStub(){
     setInterval(() => {
        //this.lData.series[1][this.counter] = "120";
       // Object.keys(this.lData.series).forEach(function(key){
        //  if (key == '0'){
            this.lData.series[1].data[this.counter] = "100";
            console.log("data: " + JSON.stringify(this.lData));
            this.counter++
            if (this.counter === 300){
                this.counter = 0;
            }

          
    
//  })
        
       // this.lData = Object.assign({}, this.lData);
        // this.events= {
        //   draw(lData: liveData): void {
        //   console.log(lData);
        
        //     }
        //   }
        // if(this.counter == 300){
        //   this.counter = 0; 
            
        // } 
        // console.log("added livedata: " + JSON.stringify(this.lData) );
     
     },1000);
  }

  addLiveData(bleData){   //to be replaced by real logica
   
    //var liveData = this.bleDataObj
        
    // {
    //   "1" : "22",
    //   "2" : "25",
    //   "3" : "28",
    //   "5" : "40"
    // }
    // var me = this;
    // this.lData.labels.forEach(function(label){
    //   console.log("label: " + label +' '+ label[0] + ' ' + bleData.Time);

  //    Object.keys(liveData).forEach(function(key){
    if (bleData.Time >= 0 && bleData.Time <= 300){
        let index:number = bleData.Time;
       // this.lData.series[1][index] = bleData.Temp;
        this.lData.series[1].data[index] = bleData.Temp;
        this.lData = Object.assign({}, this.lData);
            console.log("data: " + JSON.stringify(this.lData));
           


    }
      //     if (label[0] == bleData.Time ){
      //       console.log("if");
      //         me.lData.series[1][label[0]] = bleData.Temp;
      //         console.log("add data to chart " + bleData.Temp);
      //     }
      // });
    
  }
}//class