import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BleComms } from '../../providers/blecomms'

@Component({templateUrl: './scan.html'
})

export class Scan {
  //private nav: NavController = null;
  public device_list: any;
  public state: any = 'Scanning';

  static get parameters(){
    return [[NavController], [BleComms]]
  }

  constructor(public nav:NavController, private blecomms:BleComms, private cd:ChangeDetectorRef) {
    this.nav = nav;

    this.blecomms.app_state$
          .subscribe(event => {

              this.state = event;
          //    this.cd.detectChanges();

          })
    this.blecomms.device_store$
          .subscribe(data => {
            this.device_list = data;
            console.log("Device List: " + this.device_list);
          });
    this.blecomms.startScanning();
  }

  connectToDevice(device){
    this.blecomms.stopScanning();
    this.blecomms.connect(device);
    this.nav.pop();

  }
}
