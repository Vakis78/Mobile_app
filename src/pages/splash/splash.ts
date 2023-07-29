import { Component } from '@angular/core';
import { App, NavController } from 'ionic-angular';
import { AppGlobals } from '../../services/appglobals';
import { LandingPage } from '../landing/landing';
import { LoginPage } from '../login/login';
import { SlidesPage } from '../slides/slides';

@Component({
    selector: 'page-splash',
    templateUrl: 'splash.html'
})
export class SplashPage {

    constructor(public navCtrl: NavController,private app: App,private globals: AppGlobals) {

    }

    ionViewDidLoad(){
        setTimeout(()=>{
            this.globals.currentUser=this.globals.getUser();
            if (this.globals.currentUser==null){
                this.app.getRootNav().setRoot(SlidesPage);
            }else{
                //this.app.getRootNav().setRoot(SlidesPage);
                this.app.getRootNav().setRoot(LandingPage);
            }
        },2000);
    }

}
