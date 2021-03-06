import { Injectable } from '@angular/core';
import { BLE } from 'ionic-native';
import { Observable, Observer } from 'rxjs';
import { bleData } from './bleData';


@Injectable()
export class BleComms {
  private device_list: any = [];
  private rawData: any;
  private bleDataObj : any;
  public device_store$: Observable<{}>;
  private device_Observer: Observer<{}>;
  public ble_notify$: Observable<{}>;
  private notify_Observer : Observer<{}>;
  public app_state$: Observable<{}>;
  private state_Observer : Observer<{}>;
  private connectedDevice : any;
  private device : any;
  private bleUART = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
  private RXD = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";
  private TXD = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";

  constructor(public bledata:bleData){
    this.device_store$ = new Observable(data => this.device_Observer = data).share();
    this.ble_notify$ = new Observable(data => this.notify_Observer = data).share();
    this.app_state$ = new Observable(data => this.state_Observer = data).share();
  } //construcor end

  appState(state){
    let _state = state;
    if (_state == 'Scanning'){
      this.state_Observer.next(_state);
    }
    else if (_state == 'Connecting'){
      this.state_Observer.next(_state);
    }
    else if (_state == 'Connected'){
      this.state_Observer.next(_state);
    }
    else if (_state == 'NoConnect'){
      this.state_Observer.next(_state);
    }
    else if (_state == 'Idle'){
      this.state_Observer.next(_state);
    }
    else {
      this.state_Observer.next('undifined_state');    
    }
  } 

  startScanning() {
    setTimeout(() => {
    BLE.stopScan().then(() => {
      console.log('Scanning has stopped');
      this.appState('Idle');
    });
    }, 10000);

    console.log('Scanning Started');
    BLE.startScan([]).subscribe(device => {
      this.appState("Scanning");
      this.device_list.length = 0; //flushing device list array to remove previously added devices
      this.device_list.push(device);
      this.device_Observer.next(this.device_list);
      console.log("Scan: " + this.device_list);
    });

  }

  stopScanning(){
    BLE.stopScan().then(() =>  {('Scanning has stopped');
      this.appState('Idle');
    });
  }

  connect(device) {
    this.device = device;
    console.log("Connecting: " + device.id);
    BLE.connect(device.id).subscribe(
      peripheralData => {
        console.log("Peripheral Data: " + JSON.stringify(peripheralData));
        this.appState('Connecting');
        this.connectedDevice = device.id;
          BLE.startNotification(device.id, this.bleUART, this.RXD).subscribe(
            buffer => {this.rawData = String.fromCharCode.apply(null, new Uint8Array(buffer));
              this.appState('Connected');
              console.log("Raw JSON Data: " + JSON.stringify(this.rawData) + "Raw Data Length: " + this.rawData.length);
               console.log("Raw Data: " + this.rawData + "Raw Data Length: " + this.rawData.length);
              this.bleDataObj=this.bledata.evalBleData(this.rawData);
              this.notify_Observer.next(this.bleDataObj);    
            },
            error => {console.log("Error Notification" + (error))
          });
        },
        error => {console.log("Error Connecting" + (error));
        this.appState('NoConnect');
    })
  }
    
  writeData(data){
    let _data = this.stringToBytes(data);
    BLE.isConnected(this.device.id).then(
      ()=> {BLE.write(this.device.id, this.bleUART, this.TXD, _data);
            console.log("Data written: " + String.fromCharCode.apply(null, new Uint8Array(_data)))},
      ()=> {console.log("NoConnect")}
    );
  }

  stringToBytes(string) {
    var array = new Uint8Array(string.length);
    for (var i = 0, l = string.length; i < l; i++) {
        array[i] = string.charCodeAt(i);
      }
      return array.buffer;
  }

  disconnect() {
    BLE.disconnect(this.connectedDevice).then(data => this.appState('NoConnect'))
  }

  bleDataStub(){
    let data:string = '#!185.75:175:2:99!#';
    return data;
  }
}
