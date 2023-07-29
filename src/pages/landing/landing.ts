import { Component, ViewChild } from '@angular/core';
import { Events, IonicPage, NavController, NavParams, Tabs } from 'ionic-angular';
import { AppGlobals } from '../../services/appglobals';
import { HomeLandingPage } from '../home-landing/home-landing';
import { OffersPage } from '../offers/offers';
import { ProfilePage } from '../profile/profile';
import { FirebaseHelper } from '../../services/firebase-helper';

@Component({
    selector: 'page-landing',
    templateUrl: 'landing.html',
})
export class LandingPage {

    tab1Root: any = HomeLandingPage;
    tab2Root: any = OffersPage;
    tab3Root: any = ProfilePage;

    @ViewChild('landingTabs') tabRef: Tabs;

    navigateTabToRoot: boolean = false;

    constructor(public navCtrl: NavController, public navParams: NavParams,public events: Events,private globals: AppGlobals,private firebase: FirebaseHelper) {
        this.events.subscribe('change_tab',(data)=>{
            console.log("change_tab: ");
            console.log(data);
            let fireChange=false;
            let currIndex=this.tabRef.getSelected().index;
            console.log(data.index+"::"+currIndex);
            if (data.navigateToRoot && data.navigateToRoot===true){
                this.navigateTabToRoot=true;
                fireChange=true;
            }
            this.tabRef.select(data.index);
            if (fireChange){
                console.log("firing change");
                setTimeout(()=>{
                    this.tabRef._fireChangeEvent(this.tabRef.getSelected());
                },200);
            }
        });
    }

    ionViewDidLoad() {
        console.log("LandingPage -> ionViewDidLoad");
        this.firebase.init();
    }

    tabChanged(ev) {
        console.log("tabChanged");
        if (this.navigateTabToRoot){
            this.navigateTabToRoot=false;
            ev.setRoot(ev.root);
        }
        this.changeTabsColors();
    }

    changeTabsColors(){
        //this.globals.changeTabsColors(this.globals.currentUser.background,this.globals.currentUser.foreground);
    }
}
