import { Component } from '@angular/core';
import { App, NavController } from 'ionic-angular';
import { AppGlobals } from '../../services/appglobals';
import { LoginPage } from '../login/login';

@Component({
    selector: 'page-pre-login',
    templateUrl: 'pre-login.html'
})
export class PreLoginPage {

    constructor(public navCtrl: NavController,private app: App,private globals: AppGlobals) {

    }

    ionViewDidLoad(){
    }

    nextClick(){
        console.log("nextClick");
        this.app.getRootNav().setRoot(LoginPage);
    }

}
