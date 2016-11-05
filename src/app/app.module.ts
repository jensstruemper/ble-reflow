import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { Main } from '../pages/main/main';
import { Scan } from '../pages/scan/scan';
import { BleComms } from '../providers/blecomms';
import { bleData } from '../providers/bleData';
//import { ChartistModule } from 'angular2-chartist';
//import { Chart } from '../pages/main/chart';

@NgModule({
  declarations: [
    MyApp,
    Main,
    Scan,
   // Chart, 
  ],
  imports: [
    IonicModule.forRoot(MyApp),
   // ChartistModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Main,
    Scan,
   // Chart
  ],
  providers: [BleComms, bleData]
})
export class AppModule {}
