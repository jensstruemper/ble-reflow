"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var ionic_native_1 = require('ionic-native');
var rxjs_1 = require('rxjs');
var BleComms = (function () {
    function BleComms(cd) {
        var _this = this;
        this.cd = cd;
        this.device_list = [];
        this.device_store$ = new rxjs_1.Observable(function (data) { return _this.device_Observer = data; }).share();
        this.ble_notify$ = new rxjs_1.Observable(function (data) { return _this.notify_Observer = data; }).share();
        this.app_state$ = new rxjs_1.Observable(function (data) { return _this.state_Observer = data; }).share();
    }
    Object.defineProperty(BleComms, "parameters", {
        get: function () {
            return [core_1.ChangeDetectorRef];
        },
        enumerable: true,
        configurable: true
    });
    BleComms.prototype.appState = function (state) {
        var _state = state;
        if (_state == 'isScanning') {
            this.state_Observer.next(_state);
        }
        else if (_state == 'stoppedScanning') {
            this.state_Observer.next(_state);
        }
        else if (_state == 'isConnecting') {
            this.state_Observer.next(_state);
        }
        else if (_state == 'isConnected') {
            this.state_Observer.next(_state);
        }
        else if (_state == 'disConnected') {
            this.state_Observer.next(_state);
        }
        else {
            this.state_Observer.next('undifined state');
            console.log('State Error: ' + _state);
        }
    };
    BleComms.prototype.startScanning = function () {
        var _this = this;
        setTimeout(function () {
            ionic_native_1.BLE.stopScan().then(function () {
                console.log('Scanning has stopped');
                _this.appState('stoppedScanning');
            });
        }, 5000);
        console.log('Scanning Started');
        ionic_native_1.BLE.startScan([]).subscribe(function (device) {
            _this.appState("isScanning");
            _this.device_list.length = 0;
            _this.device_list.push(device);
            _this.device_Observer.next(_this.device_list);
            console.log("Scan: " + _this.device_list);
        });
    };
    BleComms.prototype.connect = function (device) {
        var _this = this;
        var bleUART = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
        var RXD = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";
        console.log("Connecting: " + device.id);
        ionic_native_1.BLE.connect(device.id).subscribe(function (peripheralData) {
            console.log("Peripheral Data: " + JSON.stringify(peripheralData));
            _this.appState('isConnecting');
            _this.connectedDevice = device.id;
            ionic_native_1.BLE.startNotification(device.id, bleUART, RXD).subscribe(function (buffer) {
                _this.temperature = String.fromCharCode.apply(null, new Uint8Array(buffer));
                _this.appState('isConnected');
                _this.notify_Observer.next(_this.temperature);
                console.log("Temperature : " + _this.temperature);
            }, function (error) {
                console.log("Error Notification" + (error));
            });
        }, function (error) {
            console.log("Error Connecting" + (error));
            _this.appState('disConnected');
        });
    };
    BleComms.prototype.disconnect = function () {
        var _this = this;
        ionic_native_1.BLE.disconnect(this.connectedDevice).then(function (data) { return _this.appState('disConnected'); });
    };
    BleComms = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [core_1.ChangeDetectorRef])
    ], BleComms);
    return BleComms;
}());
exports.BleComms = BleComms;
