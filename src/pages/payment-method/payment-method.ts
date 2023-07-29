import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AppGlobals } from '../../services/appglobals';
import { AppServer } from '../../services/appserver';
import { UiHelper } from '../../services/uihelper';

@Component({
    selector: 'page-payment-method',
    templateUrl: 'payment-method.html',
})
export class PaymentMethodPage {

    saving: boolean = false;
    card:any = {user_id: '',id:'',name:'',card_number:'',expiry:'',cvc:''};

    constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController,public globals: AppGlobals,public server: AppServer,public uiHelper: UiHelper) {
        this.card.user_id=this.globals.currentUser.id;
    }

    ionViewDidLoad() {
    }

    submitClick(){
        console.log("submitClick");
        this.card.name=this.card.name.trim();
        this.card.card_number=this.card.card_number.trim();
        this.card.expiry=this.card.expiry.trim();
        this.card.cvc=this.card.cvc.trim();
        if (this.card.name==""){
            this.uiHelper.showMessageBox("","Please enter card holder's name");
            return;
        }
        if (this.card.card_number==""){
            this.uiHelper.showMessageBox("","Please enter card number");
            return;
        }
        if (this.card.expiry==""){
            this.uiHelper.showMessageBox("","Please enter expiry");
            return;
        }
        if (this.card.cvc==""){
            this.uiHelper.showMessageBox("","Please enter cvc");
            return;
        }
        this.saving=true;
        this.server.saveCard(this.card).subscribe((data:any)=>{
            this.saving=false;
            console.log(data);
            if (data.status!=200){
                this.uiHelper.showMessageBox("",data.msg);
                return;
            }
            this.card.id=data.card_id;
            this.viewCtrl.dismiss(this.card);
        },(err)=>{
            this.saving=false;
            this.uiHelper.showNetworkError(err);
        });
    }

    cancelClick(){
        console.log("cancelClick");
        this.viewCtrl.dismiss();
    }

    expChanged(){
        console.log("expChanged: "+this.card.expiry);
        let len=this.card.expiry.length;
        if (len==2){
            this.card.expiry+="/";
        }
    }
}
