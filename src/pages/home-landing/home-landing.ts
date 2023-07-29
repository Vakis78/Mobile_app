import { Component } from '@angular/core';
import { IonicPage, MenuController, NavController, NavParams } from 'ionic-angular';
import { FirebaseHelper } from '../../services/firebase-helper';
import { HomePage } from '../home/home';

@Component({
    selector: 'page-home-landing',
    templateUrl: 'home-landing.html',
})
export class HomeLandingPage {

    rootPage: any = HomePage;

    constructor(public navCtrl: NavController, public navParams: NavParams, public menuCtrl: MenuController, public firebase: FirebaseHelper) {
    }

    ionViewDidEnter() {
        console.log("ldidEnter");
        //this.menuCtrl.enable(true,"homeSideMenu");
    }

    ionViewDidLoad() {
    }
}
