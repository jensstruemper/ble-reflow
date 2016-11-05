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
var scan_1 = require('../+scan/scan');
var angular2_chartist_1 = require('angular2-chartist');
var main = (function () {
    function main(navParams, nav, cd, blecomms) {
        var _this = this;
        this.cd = cd;
        this.blecomms = blecomms;
        this.nav = null;
        this.navParams = null;
        this.state = 'idle';
        this.reflowTemp = '-- °C';
        this.reflowState = '--';
        this.reflowTime = '-- sec';
        this.reflowPID = '-- %';
        this.nav = nav;
        this.navParams = navParams;
        this.blecomms.app_state$
            .subscribe(function (state) {
            _this.state = state;
            _this.cd.detectChanges();
            console.log('State: ' + state);
            if (state == 'disConnected') {
                _this.setReflowVars();
            }
        });
        this.blecomms.ble_notify$
            .subscribe(function (data) {
            _this.reflowTemp = data;
            _this.cd.detectChanges();
            console.log("Temp: " + _this.reflowTemp);
        });
        this.type = 'Line';
        this.data = {
            labels: [[], []],
            series: [[], []]
        };
        this.data = { labels: [[], []],
            series: [[22, 70, 110, 150, 165, 170, 185, 210, 200, 180, 160], []] };
        var i = 1;
        var _i;
        this.interval = setInterval(function () {
            i++;
            _i = i.toString();
            _this.reflowTemp = 50;
            _this.data.series[1].push(_this.reflowTemp);
            _this.data = Object.assign({}, _this.data);
            console.log("Data: " + JSON.stringify(_this.data));
        }, 1000);
        this.options = {
            width: 300,
            height: 200,
            axisX: {
                ticks: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300]
            },
        };
    }
    Object.defineProperty(main, "parameters", {
        get: function () {
            return [[ionic_angular_1.NavParams], [ionic_angular_1.NavController], [core_1.ChangeDetectorRef], [blecomms_1.BleComms]];
        },
        enumerable: true,
        configurable: true
    });
    main.prototype.printMyObject = function (liveData) {
        console.log("data: " + liveData.series);
    };
    main.prototype.scan = function () {
        this.nav.push(scan_1.scan);
    };
    main.prototype.disconnect = function () {
        this.blecomms.disconnect();
    };
    main.prototype.setReflowVars = function () {
        this.reflowTemp = '-- °C';
        this.reflowState = '--';
        this.reflowTime = '-- sec';
        this.reflowPID = '-- %';
    };
    main = __decorate([
        core_1.Component({
            templateUrl: 'build/+main/main.html',
            directives: [angular2_chartist_1.ChartistComponent]
        }), 
        __metadata('design:paramtypes', [Object, Object, core_1.ChangeDetectorRef, blecomms_1.BleComms])
    ], main);
    return main;
}());
exports.main = main;
