import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UiHelper } from '../../services/uihelper';

@Component({
  selector: 'page-static-content',
  templateUrl: 'static-content.html',
})
export class StaticContentPage {

    type: string = '';
    safe_embed_url: any = null;
    title: string = '';

    constructor(public navCtrl: NavController, public navParams: NavParams,private uiHelper: UiHelper) {
        this.title='PRIVACY POLICY';
        this.safe_embed_url=this.uiHelper.sanitizeResourceUrl("assets/privacy-policy.html");
    }

    ionViewDidLoad() {
    }

}
