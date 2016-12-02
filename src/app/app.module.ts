import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Main } from '../pages/main/main';
import { Scan } from '../pages/scan/scan';
import { BleComms } from '../providers/blecomms';
import { bleData } from '../providers/bleData';
import { ChartistModule } from 'angular2-chartist';
import { ReflowChart } from '../pages/main/reflow-chart.component';

@NgModule({
  declarations: [
    MyApp,
    Main,
    Scan,
    ReflowChart 
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    ChartistModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Main,
    Scan,
    ReflowChart
  ],
  providers: [BleComms, bleData, {provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
