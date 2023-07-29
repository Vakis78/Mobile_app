import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { AppGlobals } from '../../services/appglobals';
import { AppServer } from '../../services/appserver';
import { UiHelper } from '../../services/uihelper';

@Component({
    selector: 'page-offer-detail',
    templateUrl: 'offer-detail.html',
})
export class OfferDetailPage {

    offer: any = null;
    loading: boolean = false;

    constructor(public navCtrl: NavController,public viewCtrl: ViewController, public navParams: NavParams,public server: AppServer,public uiHelper: UiHelper,public globals: AppGlobals) {
        this.offer=this.navParams.get('offer');
    }

    ionViewDidLoad() {
    }
}
