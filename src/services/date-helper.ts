import {Injectable} from "@angular/core";
import { AppGlobals } from "./appglobals";

@Injectable() export class DateHelper {

    public static monthsShort:any[]=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    public static monthsLong:any[]=["January","February","March","April","May","June","July","August","September","October","November","December"];
    public static weekNames:any[]=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

    public static AM:string = "am";
    public static PM:string = "pm";

    constructor(){
    }

    public static getDateFromTimestamp(ts:number):Date {
        return new Date(ts);
    }

    public static getDateFromDbDate(dbDate:string | number):Date {
        if (typeof dbDate==="number"){
            return DateHelper.getDateFromTimestamp(dbDate);
        }
        let vals=dbDate.split(" ");
        let dVals=vals[0].split("-");
        let tVals=vals[1].split(":");
        let dt=new Date();
        dt.setFullYear(parseInt(dVals[0]));
        dt.setMonth(parseInt(dVals[1])-1);
        dt.setDate(parseInt(dVals[2]));
        dt.setHours(parseInt(tVals[0]));
        dt.setMinutes(parseInt(tVals[1]));
        dt.setSeconds(0);
        return dt;
    }

    public static getAmPmFromDate(dt:Date):string{
        if (dt.getHours() < 12){
            return DateHelper.AM;
        }
        return DateHelper.PM;
    }

    public static get12HourHours(hours:number):number{
        if (hours>12){
            hours=hours-12;
        }else if (hours==0){
            hours=12;
        }
        return hours;
    }

    private static getZeroPadded(val: number):string {
        if (val>=10){
            return val.toString();
        }
        return ("0"+val.toString());
    }

    public static getDisplayTimeFromDate(dt: Date):string {
        let hourStr=DateHelper.getZeroPadded(DateHelper.get12HourHours(dt.getHours()));
        let minuteStr=DateHelper.getZeroPadded(dt.getMinutes());
        let amPmStr=DateHelper.getAmPmFromDate(dt);
        return hourStr+":"+minuteStr+" "+amPmStr;
    }

    public static getDisplayDateFromDate(dt: Date,showTime: boolean = false):string {
        let yearStr=dt.getFullYear().toString();
        let monthStr=DateHelper.monthsLong[dt.getMonth()];
        let dateStr=dt.getDate();
        let dtStr=monthStr+" "+dateStr;
        if (showTime){
            dtStr+=", "+DateHelper.getDisplayTimeFromDate(dt);
        }
        return dtStr;
    }

    public static getDisplayDate(dbDate:string | number,showTime: boolean = false):string {
        let dt=DateHelper.getDateFromDbDate(dbDate);
        return DateHelper.getDisplayDateFromDate(dt,showTime);
    }

    public static getScheduleDisplayDate(dbDate: string){
        let vals={date:'',time:''};
        //FRIDAY, SEPTEMBER 10TH
        //10:30 AM EST
        let dt=DateHelper.getDateFromDbDate(dbDate);
        let weekName=DateHelper.weekNames[dt.getDay()].toUpperCase();
        let monthName=DateHelper.monthsLong[dt.getMonth()].toUpperCase();
        let dateStr=dt.getDate().toString();
        if (dt.getDate()<10){
            dateStr="0"+dateStr;
        }
        vals.date=weekName+", "+monthName+" "+dateStr;
        let hours=dt.getHours();
        if (hours==0){
            hours=12;
        }else if (hours>12){
            hours-=12;
        }
        let timeStr="";
        if (hours<10){
            timeStr+="0";
        }
        timeStr+=hours.toString();
        timeStr+=":";
        let minutes=dt.getMinutes();
        if (minutes<10){
            timeStr+="0";
        }
        timeStr+=minutes.toString();
        if (dt.getHours()<12){
            timeStr+=" AM";
        }else{
            timeStr+=" PM";
        }
        timeStr+=" EST";
        vals.time=timeStr;
        return vals;
    }

    public static getHomePlaybookDisplayDate(dbDate: string){
        let vals={date:''};
        //Mar 14, 2022
        let dt=DateHelper.getDateFromDbDate(dbDate);
        let monthName=DateHelper.monthsShort[dt.getMonth()];
        let dateStr=dt.getDate().toString();
        if (dt.getDate()<10){
            dateStr="0"+dateStr;
        }
        vals.date=monthName+" "+dateStr+", "+dt.getFullYear().toString();
        return vals;
    }

    public static getDateInIonicFormat(dt: Date){
        let str=dt.getFullYear().toString();
        str+="-"+DateHelper.getZeroPadded(dt.getMonth()+1)+"-"+DateHelper.getZeroPadded(dt.getDate());
        str+="T"+DateHelper.getZeroPadded(dt.getHours())+":"+DateHelper.getZeroPadded(dt.getMinutes());
        str+="Z";
        return str;
    }

    public static getCurrentDateInIonicFormat(){
        return DateHelper.getDateInIonicFormat(new Date());
    }

    public static getDbDateFromIonicFormat(val){
        let vals=val.split('T');
        let dval=vals[0].trim();
        let tval=vals[1].trim();
        vals=tval.split('Z');
        tval=vals[0].trim();
        return dval+" "+tval;
    }
}