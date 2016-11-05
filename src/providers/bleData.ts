import { Injectable } from '@angular/core';

export interface dataObj  {
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
    }
    
    evalBleData(rawData){
        let validData = this.fillBuffer(rawData);
        let evalData = this.evalReflowData(validData);
        console.log("evalData: " + JSON.stringify(evalData));
        return evalData;
    }

    fillBuffer(rawData){
        this.buffer = this.buffer.concat(rawData.replace(/\0/g, ''));
        this.buffer = this.buffer.replace(null, '');  //ToDo combine both replace methods into one regular expression

        let startMark : number =  this.buffer.indexOf('#!');
        let stopMark : number = this.buffer.lastIndexOf('!#');
        let bufferOut : string = '';
        
        if ((startMark != -1 && stopMark != -1) && (stopMark > startMark)){   //test if start & stop marks exist and if stop mark is bigger than start mark 
            bufferOut = this.buffer.substr(startMark,stopMark + 2);
            console.log("Valid Data! startMark: " + startMark + " stopMark: " + stopMark + " buffer: ");
            this.buffer = this.buffer.substr(stopMark + 2, this.buffer.length); //add remaining data to buffer 
            this.lastValidBuffer = bufferOut; 
            }    
        else {
            bufferOut = this.lastValidBuffer; //return last valid buffer when current buffer is not valid
            }
        return bufferOut;

    }   

    evalReflowData(validData){
        // RawData format:
        // start mark: "#!"
        // end mark: "!#"
        // Separator: ":"
        // Fields in fixed order: 
        // Temperature(Celsius):Time(Seconds):State[idle:0, preheat:1, soak:2, reflow:3, cooldown:4]:PID(%)
        // Example: #!185.75:175:2:99!#
        var valid = false;        

        if (validData.indexOf('#!') == 0 && validData.indexOf('!#') == validData.length - 2 ){
            valid = true;
            }
            validData = validData.replace('#!', '');
            validData = validData.replace('!#', '')
            var values = validData.split(':');
            for (var i = 0; i < values.length; i++ ){
                switch (i+1){
                    case 1: this.dataobj.Temp=values[i];
                    break;
                    case 2: this.dataobj.Time=values[i];
                    break;
                    case 3: this.dataobj.State=values[i];
                    break;
                    case 4: this.dataobj.PID=values[i];
                    break;
                }
            }
        return this.dataobj;
    } 
}

