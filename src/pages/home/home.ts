import { Component } from '@angular/core';
import { App, Events, LoadingController, ModalController, NavController, Platform, ToastController } from 'ionic-angular';
import { AppGlobals } from '../../services/appglobals';
import { AppServer } from '../../services/appserver';
import { UiHelper } from '../../services/uihelper';
import { LocationsPage } from '../locations/locations';
import { MyPointsPage } from '../my-points/my-points';
import { ProductsPage } from '../products/products';
import QRCode from 'qrcode';
import { ProfilePage } from '../profile/profile';
import { DeliveryPage } from '../delivery/delivery';
import { Geolocation } from '@ionic-native/geolocation';
import { ReferFriendPage } from '../refer-friend/refer-friend';
import { MyOrdersPage } from '../my-orders/my-orders';
import { OffersPage } from '../offers/offers';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    private loading: boolean = false;
    private loader: any= null;
    private canShowQr: boolean = false;
    private qrImageUrl: string = '';
    welcomeName: string = '';
    
    constructor(public app: App, public navCtrl: NavController,private modalCtrl: ModalController, private loadingCtrl: LoadingController, private toastCtrl: ToastController ,private platform: Platform,private geolocation: Geolocation,private server: AppServer,private globals: AppGlobals,private uiHelper: UiHelper,private events: Events) {
    }

    ionViewWillEnter(){
        this.welcomeName=this.globals.currentUser.client_name;
    }

    ionViewDidLoad(){
        this.loadData();
        this.doLocationThing();
    }

    loadData(){
        console.log("loadData");
        let loginData={user_id: this.globals.currentUser.id};
        console.log(loginData);
        this.loading=true;
        this.server.getHome(loginData).subscribe((data:any)=>{
            this.loading=false;
            console.log(data);
            if (data.status==200){
                
            }else{
                this.uiHelper.showMessageBox("",data.msg);
            }
        },(err)=>{
            this.loading=false;
            console.error(err);
            this.uiHelper.showMessageBox("",JSON.stringify(err));
        });
    }

    optionClick(type){
        console.log("optionClick: "+type);
        if (type=="locations"){
            this.globals.currentCartAddress=null;
            let mdl=this.modalCtrl.create(LocationsPage,{});
            mdl.onDidDismiss((data)=>{
                console.log(data);
            })
            mdl.present();
        }else if (type=="pickup"){
            let mdl=this.modalCtrl.create(LocationsPage,{open_products: '1'});
            mdl.onDidDismiss((data)=>{
                console.log(data);
                if (data && data.location){
                    this.globals.clearCart();
                    this.globals.currentCartType='pickup';
                    this.navCtrl.push(ProductsPage,{location: data.location});
                }
            })
            mdl.present();
        }else if (type=="delivery"){
            let mdl=this.modalCtrl.create(DeliveryPage,{open_products: '1'});
            mdl.onDidDismiss((data)=>{
                console.log(data);
                if (data && data.address){
                    this.globals.clearCart();
                    this.globals.currentCartType='delivery';
                    this.globals.currentCartAddress=data.address;
                    let mdl=this.modalCtrl.create(LocationsPage,{open_products: '1'});
                    mdl.onDidDismiss((data)=>{
                        console.log(data);
                        if (data && data.location){
                            this.navCtrl.push(ProductsPage,{location: data.location});
                        }
                    })
                    mdl.present();
                }
            })
            mdl.present();
        }else if (type=="points"){
            this.navCtrl.push(MyPointsPage);
        }else if (type=="qr"){
            this.generateQrCode();
        }else if (type=="profile"){
            this.navCtrl.push(ProfilePage,{});
        }else if (type=="refer"){
            this.navCtrl.push(ReferFriendPage,{});
        }else if (type=="orders"){
            this.navCtrl.push(MyOrdersPage,{});
        }else if (type=="facebook"){
            window.open("https://www.facebook.com/profile.php?id=100088235289352","_blank");
        }else if (type=="instagram"){
            window.open("https://www.instagram.com/tinhouseshop/","_blank");
        }else if (type=="offers"){
            this.navCtrl.push(OffersPage,{});
        }
    }

    generateQrCode() {
        console.log("generateQrCode");
        let code=this.globals.currentUser.uniquecode;
        console.log("code: "+code);
        // this.loader=this.loadingCtrl.create({content: 'Generating...'});
        // this.loader.present();
        QRCode.toDataURL(code, { errorCorrectionLevel: 'H',width: 250,margin: 0 }, (err, url)=>{
            //this.loader.dismiss();
            if (err){
                console.error(err);
                this.uiHelper.showMessageBox("",JSON.stringify(err));
                return;
            }
            console.log(url);
            this.qrImageUrl=url;
            this.canShowQr=true;
        })
    }

    closeQrClick(){
        console.log("closeQrClick");
        this.canShowQr=false;
        this.qrImageUrl='';
    }

    public doLocationThing(){
        try{
            this.geolocation.getCurrentPosition().then((resp) => {
                console.log("Location: "+resp.coords.latitude+","+resp.coords.longitude);
                this.globals.currentLocation=resp.coords;
                this.events.publish('location_changed');
            }).catch((error) => {
                console.log('Error getting location', error);
                this.uiHelper.showMessageBox("","Error getting your location: "+JSON.stringify(error));
            });

            let watch = this.geolocation.watchPosition();
            watch.subscribe((data) => {
                if (data.coords){
                    console.log("Watch Location: "+data.coords.latitude+","+data.coords.longitude);
                    this.globals.currentLocation=data.coords;
                    this.events.publish('location_changed');
                }
            });
        }catch(e){
            console.error("Error: "+e.message);
            this.uiHelper.showMessageBox("Location","Exception: "+e.message);
        }
    }
}
