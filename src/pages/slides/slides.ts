import { Component } from '@angular/core';
import { App, NavController } from 'ionic-angular';
import { AppGlobals } from '../../services/appglobals';
import { PreLoginPage } from '../pre-login/pre-login';

@Component({
    selector: 'page-slides',
    templateUrl: 'slides.html'
})
export class SlidesPage {

    constructor(public navCtrl: NavController,private app: App,private globals: AppGlobals) {

    }

    ionViewDidLoad(){
    }

    backClick(){
        console.log("backClick");
    }

    nextClick(){
        console.log("nextClick");
        this.app.getRootNav().setRoot(PreLoginPage);
    }

}
