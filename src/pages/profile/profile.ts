import { Component } from '@angular/core';
import { App, ModalController, NavController, NavParams, ViewController } from 'ionic-angular';
import { AppGlobals } from '../../services/appglobals';
import { AppServer } from '../../services/appserver';
import { UiHelper } from '../../services/uihelper';
import { LoginPage } from '../login/login';
import { MyOrdersPage } from '../my-orders/my-orders';
import { MyPointsPage } from '../my-points/my-points';
import { ReferFriendPage } from '../refer-friend/refer-friend';
import { AddressesPage } from './addresses/addresses';
import { CardsPage } from './cards/cards';
import { PersonalDetailsPage } from '../personal-details/personal-details';

@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html',
})
export class ProfilePage {

    options:any[]=[];

    constructor(public app: App, public navCtrl: NavController,public viewCtrl: ViewController,public modalCtrl: ModalController, public navParams: NavParams,public server: AppServer,public uiHelper: UiHelper,public globals: AppGlobals) {
        this.options.push({title:'Personal Details',icon:'custom-profile',code:'personal',class: 'profile-item'});
        this.options.push({title:'My Addresses',icon:'custom-locations',code:'address',class: 'profile-item'});
        this.options.push({title:'My Orders',icon:'custom-orders',code:'orders',class: 'profile-item'});
        this.options.push({title:'My Points',icon:'custom-points',code:'points',class: 'profile-item'});
        this.options.push({title:'Refer a Friend',icon:'custom-refer-friend',code:'refer',class: 'profile-item'});
        //this.options.push({title:'My Cards',icon:'md-card',code:'card',class: 'profile-item'});
        this.options.push({title:'Logout',icon:'md-log-out',code:'logout',class: 'profile-item logout'});
    }

    ionViewDidLoad() {
    }

    optionClick(opt){
        console.log("optionClick: "+opt);
        if (opt.code=='card'){
            this.navCtrl.push(CardsPage);
        }else if (opt.code=='address'){
            this.navCtrl.push(AddressesPage);
        }else if (opt.code=='logout'){
            this.logoutClick();
        }else if (opt.code=='personal'){
            this.navCtrl.push(PersonalDetailsPage);
        }else if (opt.code=="points"){
            this.navCtrl.push(MyPointsPage);
        }else if (opt.code=="refer"){
            this.navCtrl.push(ReferFriendPage,{});
        }else if (opt.code=="orders"){
            this.navCtrl.push(MyOrdersPage,{});
        }
    }

    logoutClick(){
        console.log("logoutClick");
        this.uiHelper.showConfirmBox("Logout","Are you sure you want to logout?",()=>{
            this.globals.currentUser=null;
            this.globals.setUser(null);
            this.app.getRootNav().setRoot(LoginPage);
        },null);
    }
}
