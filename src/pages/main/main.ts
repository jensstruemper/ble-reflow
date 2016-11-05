import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BleComms } from '../../providers/blecomms';
import { Scan } from '../scan/scan';
//import { Chart } from '..main/chart';

@Component({
selector: 'page.main',
templateUrl: './main.html'
})

export class Main {
  public bleDataObj: any
  public state: any = 'idle';
  public profile: any = 'Default';
  public reflowTemp: any = '-- °C';  //Reflow data variables
  public reflowState: any = '--';
  public reflowTime: any = '-- sec';
  public reflowPID: any = '-- %';
  
  constructor(private nav:NavController, 
              private cd:ChangeDetectorRef, 
              private blecomms:BleComms) {
    this.nav = nav;
 
    this.blecomms.app_state$
          .subscribe(state => {
            this.state = state;
            this.cd.detectChanges();
            if (state == 'disConnected'){
              this.setReflowVars('disconnect');
            }
          })

    this.blecomms.ble_notify$
          .subscribe(data => {
            this.bleDataObj = data;
            this.setReflowVars(this.bleDataObj);
            this.cd.detectChanges();
          });
   }
  
  startProcess(){
    console.log("pressed start");
    this.blecomms.writeData("START");
  }

  stopProcess(){
    this.blecomms.writeData("STOP");
  }

  profileSelect(){
    console.log("pressed profile");
  }

  scan() {
    this.nav.push(Scan);
  }

  disconnect() {
    this.blecomms.disconnect()
  }

  setReflowVars(dataObj) {
    if (dataObj == 'disconnect'){
      this.reflowTemp = '-- °C';
      this.reflowState = '--';
      this.reflowTime = '-- sec';
      this.reflowPID =  '-- %';
    } 
    else {
      this.reflowTemp = dataObj.Temp + ' °c';
      this.reflowState = dataObj.State;
      this.reflowTime = dataObj.Time + ' sec';
      this.reflowPID = dataObj.PID + ' %'; 
    } 
  }
}
