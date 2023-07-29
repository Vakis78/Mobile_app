import { Component } from '@angular/core';
import { LoadingController, ModalController, NavController, NavParams, ViewController } from 'ionic-angular';
import { AppGlobals } from '../../../services/appglobals';
import { AppServer } from '../../../services/appserver';
import { UiHelper } from '../../../services/uihelper';
import { SelectPinPage } from '../../select-pin/select-pin';

@Component({
    selector: 'page-addresses',
    templateUrl: 'addresses.html',
})
export class AddressesPage {

    private loading: boolean = false;
    loader: any = null;
    paymentMethods: any[]=[];
    
    constructor(public navCtrl: NavController,public viewCtrl: ViewController,public modalCtrl: ModalController,public loadingCtrl: LoadingController , public navParams: NavParams,public server: AppServer,public uiHelper: UiHelper,public globals: AppGlobals) {
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
                for (let a=0;a<data.addresses.length;a++){
                    let c=data.addresses[a];
                    this.paymentMethods.push(c);
                }
            }else{
                this.uiHelper.showMessageBox("",data.msg);
            }
        },(err)=>{
            this.loading=false;
            console.error(err);
            this.uiHelper.showNetworkError(err);
        });
    }

    addPaymentMethodClick(){
        console.log("addPaymentMethodClick");
        let mdl=this.modalCtrl.create(SelectPinPage,{address: ''});
        mdl.onDidDismiss((data)=>{
            console.log(data);
            if(data && data.address){
                data.address.user_id=this.globals.currentUser.id;
                this.loader=this.loadingCtrl.create({content: "Saving..."});
                this.loader.present();
                this.server.saveAddress(data.address).subscribe((res:any)=>{
                    this.loader.dismiss();
                    console.log(res);
                    if (res.status==200){
                        this.paymentMethods.push(data.address);
                    }else{
                        this.uiHelper.showMessageBox("",res.msg);
                    }
                },(err)=>{
                    console.error(err);
                    this.loader.dismiss();
                    this.uiHelper.showNetworkError(err);
                })
            }
        });
        mdl.present();
    }
    
    cardClick(card){
        console.log("cardClick: "+card.full_address);
    }

    deleteCard(card,idx){
        console.log("deleteCard: "+card.full_address+"::"+idx);
        this.paymentMethods.splice(idx,1);
    }
}
