import {Injectable} from "@angular/core";
import { AlertController, PopoverController, ToastController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable() export class UiHelper {

    constructor(private popoverCtrl: PopoverController, private sanitizer: DomSanitizer,private alertCtrl: AlertController,private toastCtrl: ToastController){
    }

    public sanitizeHTML(html: string){
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }

    public sanitizeUrl(url: string){
        return this.sanitizer.bypassSecurityTrustUrl(url);
    }

    public sanitizeResourceUrl(url: string){
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    public showPushNotification(titleText,messageText,openHandler){
        let alert = this.alertCtrl.create({
            title: titleText,
            message: messageText,
            buttons: [
                {
                    text: 'OK',
                    handler: openHandler
                },
            ]
        });
        alert.present();
    }

    public showMessageBox(titleText,messageText){
        let alert = this.alertCtrl.create({
            title: titleText,
            message: messageText,
            buttons: ['OK']
        });
        alert.present();
    }

    public showConfirmBox(titleText,messageText,yesHandler,noHandler){
        this.showConfirmBox2(titleText,messageText,"Yes",yesHandler,"No",noHandler);
    }

    public showConfirmBox2(titleText,messageText,yesText,yesHandler,noText,noHandler){
        let alert = this.alertCtrl.create({
            title: titleText,
            message: messageText,
            buttons: [
                {
                    text: yesText,
                    handler: yesHandler
                },
                {
                    text: noText,
                    handler: noHandler
                }
            ]
        });
        alert.present();
        return;
    }


    public showSubscriptionWaitMessage(titleText,messageText,waitHandler,buyHandler,cancelHandler){
        let alert = this.alertCtrl.create({
            title: titleText,
            message: messageText,
            buttons: [
                {
                    text: "WAIT",
                    handler: waitHandler
                },
                {
                    text: "BUY SUBSCRIPTION",
                    handler: buyHandler
                },
                {
                    text: "CANCEL",
                    handler: cancelHandler
                }
            ]
        });
        alert.present();
        return alert;
    }

    public showToast(str: string,duration:number=3000){
        let tst=this.toastCtrl.create({
            message: str,
            duration: duration,
            position: 'bottom',
            showCloseButton: false,
        });
        tst.present();
    }

    public showNetworkError(err){
        if (err.status==0){
            this.showMessageBox("","Please check your internet connection");
        }else{
            this.showMessageBox("",JSON.stringify(err));
        }
    }

    public showStripeError(err){
        if (err.status!=0){
            this.showMessageBox("",err.error.error.message);
        }else{
            this.showNetworkError(err);
        }
    }

    public visitUrl(url){
        if ((<any>window).cordova){
            try{
                (<any>window).cordova.InAppBrowser.open(url,"_blank",'location=no');
            }catch(e){
                window.open(url,'_blank');
            }
        }else{
            window.open(url,'_blank');
        }
    }

    public generateSummary(txt: string){
        if (txt.length>100){
            txt=txt.substring(0,100);
            txt+="...";
        }
        return txt;
    }

    public processDescription(txt: string){
        txt = txt.replace(/(?:\r\n|\r|\n)/g, '<br />');
        return txt;
    }

    public generateCardNumberDisplay(cardNumber: string){
        let displayText='';
        let len=cardNumber.length;
        let starLen=len-4-2;
        displayText+=cardNumber.substring(0,2);
        for (let a=1;a<=starLen;a++){
            displayText+='*';
        }
        let lastChars=cardNumber.substring(len-4);
        displayText+=lastChars;
        return displayText;
    }

    public getDummyThumbUrl(){
        return "https://www.gstatic.com/webp/gallery/1.jpg";
    }

    public askForCoupon(coupon,callback){
        let alert = this.alertCtrl.create({
            title: 'Enter Coupon Code',
            //subTitle: 'Nickname is required to identify yourself in posts/comments.',
            //message: 'Nickname can contain only a-z,A-Z,0-9-_~\nNo empty space is allowed',
            inputs: [
                {
                    type: 'text',
                    name: 'code',
                    placeholder: 'Coupon code',
                    value: coupon
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: (data) => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'APPLY',
                    role: 'set',
                    handler: (data) => {
                        console.log("code: "+data.code);
                        callback(data);
                    }
                }
            ]
        });
        alert.present();
    }
}