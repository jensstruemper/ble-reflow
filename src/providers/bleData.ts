import { Injectable } from '@angular/core';

export interface dataObj  {
            Status? : string;
            Temp? : string;
            Time? : string;
            State? : string;
            PID? : string;
        }

@Injectable()
export class bleData{
     
    private buffer:string = ''; 
    private dataobj:dataObj;
    private lastValidBuffer:string = ''; 
   
    constructor(){
        this.dataobj = {};
        this.dataobj.Temp = '0';
        this.dataobj.Time = '0';
        this.dataobj.State = '0';
        this.dataobj.PID = '0';
        this.dataobj.Status = 'valid';
    }
    
    evalBleData(rawData){
        let buffer = this.fillBuffer(rawData);
        let evalData = this.evalReflowData(buffer);
        return evalData;
    }

    fillBuffer(rawData){
        this.buffer = this.buffer.concat(rawData.replace(/\0/g, ''));
        this.buffer = this.buffer.replace(null, '');  //ToDo combine both replace methods into one regular expression
      //  this.buffer = this.buffer.replace('.', '');


        let startMark : number =  this.buffer.indexOf('#!');
        let stopMark : number = this.buffer.lastIndexOf('!#');
        let bufferOut : string = '';
        
        if ((startMark != -1 && stopMark != -1) && (stopMark > startMark)){   //test if start & stop marks exist and if stop mark is bigger than start mark 
            bufferOut = this.buffer.substr(startMark,stopMark + 2);
         //   console.log("Valid Data! startMark: " + startMark + " stopMark: " + stopMark + " buffer: ");
            this.buffer = this.buffer.substr(stopMark + 2, this.buffer.length); //add remaining data to buffer 
            console.log("Int Buffer: " + this.buffer);
            this.lastValidBuffer = bufferOut; 
            }    
        else {
            bufferOut = this.lastValidBuffer; //return last valid buffer when current buffer is not valid
            }
        console.log("bufferOut: " + bufferOut);
        return bufferOut;


    }   

    evalReflowData(buffer){
        // RawData format:
        // start mark: "#!"
        // end mark: "!#"
        // Separator: ":"
        // Fields in fixed order: 
        // Temperature(Celsius):Time(Seconds):State[idle:0, preheat:1, soak:2, reflow:3, cooldown:4]:PID(%)
        // Example: #!185.75:175:2:99!#
        var valid = false;        

        if (buffer.indexOf('#!') == 0 && buffer.indexOf('!#') == buffer.length - 2 && buffer.indexOf(':') != -1 ){
            console.log("Data valid: " + buffer.indexOf(':'));
            valid = true;
            
            buffer = buffer.replace('#!', '');
            buffer = buffer.replace('!#', '')
            var values = buffer.split(':');
            for (var i = 0; i < values.length; i++ ){
                switch (i+1){
                    case 1: this.dataobj.Temp=values[i]; 
                    break;
                    case 2: this.dataobj.Time=values[i];
                    break;
                    case 4: this.dataobj.PID=values[i];
                    
                    
                            // let _PID = values[i];
                            // if (_PID[0] == '1'){
                            //      _PID = '100';
                            //      console.log("PID: " + _PID[0] + ":" + _PID[1] + ":" + _PID[2] + ":" + _PID[3])
                            // } else {
                            // _PID[0]='';
                            // _PID[1]='';
                            // this.dataobj.PID=_PID;
                            //}
                    break;
                    case 3: //mapping int reflow state to meaningful string 
                        switch (values[i]){
                            case '1' : this.dataobj.State="Idle"; break;
                            case '2' : this.dataobj.State="PreHeat"; break;
                            case '3' : this.dataobj.State="Soak"; break;
                            case '4' : this.dataobj.State="Reflow"; break;
                            case '5' : this.dataobj.State="Cool"; break;
                            case '6' : this.dataobj.State="Complete"; break;
                            case '7' : this.dataobj.State="TooHot"; break;
                            case '8' : this.dataobj.State="Error"; break;
                        }
                    break;
                }
            }
        }
        else if (valid = false) {
            this.dataobj.Status = 'Not Valid';
            console.log("NOT VALID");
        }
        console.log("DataObj: " + JSON.stringify(this.dataobj))
        return this.dataobj;
    } 
}

