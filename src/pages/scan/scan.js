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
var ionic_angular_1 = require('ionic-angular');
var blecomms_1 = require('../+shared/blecomms');
var scan = (function () {
    function scan(nav, blecomms, cd) {
        var _this = this;
        this.blecomms = blecomms;
        this.cd = cd;
        this.nav = null;
        this.navParams = null;
        this.state = 'isScanning';
        this.nav = nav;
        this.blecomms.app_state$
            .subscribe(function (event) {
            _this.state = event;
        });
        this.blecomms.device_store$
            .subscribe(function (data) {
            _this.device_list = data;
            console.log("Device List: " + _this.device_list);
        });
        this.blecomms.startScanning();
    }
    Object.defineProperty(scan, "parameters", {
        get: function () {
            return [[ionic_angular_1.NavController], [blecomms_1.BleComms]];
        },
        enumerable: true,
        configurable: true
    });
    scan.prototype.connectToDevice = function (device) {
        this.blecomms.connect(device);
        this.nav.pop();
    };
    scan = __decorate([
        core_1.Component({ templateUrl: 'build/+scan/scan.html'
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController, blecomms_1.BleComms, core_1.ChangeDetectorRef])
    ], scan);
    return scan;
}());
exports.scan = scan;
