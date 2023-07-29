import { Component, ViewChild } from '@angular/core';
import { ModalController, NavController, NavParams, ViewController } from 'ionic-angular';
import { AppGlobals } from '../../../services/appglobals';
import { AppServer } from '../../../services/appserver';
import { UiHelper } from '../../../services/uihelper';
import { PaymentMethodPage } from '../../payment-method/payment-method';

@Component({
    selector: 'page-cards',
    templateUrl: 'cards.html',
})
export class CardsPage {

    private loading: boolean = false;
    paymentMethods: any[]=[];
    
    constructor(public navCtrl: NavController,public viewCtrl: ViewController,public modalCtrl: ModalController, public navParams: NavParams,public server: AppServer,public uiHelper: UiHelper,public globals: AppGlobals) {
    }

    ionViewDidLoad() {
        this.loadData();
    }

    loadData(){
        console.log("loadData");
        let loginData={user_id: this.globals.currentUser.id};
        console.log(loginData);
        this.loading=true;
        this.server.getClientData(loginData).subscribe((data:any)=>{
            this.loading=false;
            console.log(data);
            if (data.status==200){
                for (let a=0;a<data.cards.length;a++){
                    let c=data.cards[a];
                    c.display_text=this.uiHelper.generateCardNumberDisplay(c.card_number);
                    this.paymentMethods.push(c);
                }
            }else{
                this.uiHelper.showMessageBox("",data.msg);
            }
        },(err)=>{
            this.loading=false;
            console.error(err);
            this.uiHelper.showMessageBox("",JSON.stringify(err));
        });
    }

    addPaymentMethodClick(){
        console.log("addPaymentMethodClick");
        let mdl=this.modalCtrl.create(PaymentMethodPage,{address: ''});
        mdl.onDidDismiss((data)=>{
            console.log(data);
            if(data){
                //new card
                let card=data;
                card.display_text=this.uiHelper.generateCardNumberDisplay(card.card_number);
                card.selected=false;
                this.paymentMethods.push(card);
            }
        });
        mdl.present();
    }
    
    cardClick(card){
        console.log("cardClick: "+card.card_number);
    }

    deleteCard(card,idx){
        console.log("deleteCard: "+card.card_number+"::"+idx);
        this.paymentMethods.splice(idx,1);
    }
}
