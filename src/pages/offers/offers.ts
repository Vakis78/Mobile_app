import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { AppGlobals } from '../../services/appglobals';
import { AppServer } from '../../services/appserver';
import { UiHelper } from '../../services/uihelper';
import { OfferDetailPage } from '../offer-detail/offer-detail';

@Component({
    selector: 'page-offers',
    templateUrl: 'offers.html',
})
export class OffersPage {

    points: any[]=[];
    loading: boolean = false;

    constructor(public navCtrl: NavController,public viewCtrl: ViewController, public navParams: NavParams,public server: AppServer,public uiHelper: UiHelper,public globals: AppGlobals) {
    }

    ionViewDidLoad() {
        this.loadData();
    }

    loadData(){
        console.log("loadData");
        let loginData={user_id: this.globals.currentUser.id,company_id: 2};
        console.log(loginData);
        this.loading=true;
        this.server.getOffers(loginData).subscribe((data:any)=>{
            this.loading=false;
            console.log(data);
            if (data.status==200){
                let points=data.offers;
                this.points=[];
                for (let a=0;a<points.length;a++){
                    let p=points[a];
                    this.points.push(p);
                }
            }else{
                this.uiHelper.showMessageBox("",data.msg);
            }
        },(err)=>{
            this.loading=false;
            console.error(err);
            this.uiHelper.showMessageBox("",JSON.stringify(err));
        });
    }

    locationClick(loc){
        console.log("locationClick: "+loc.offer_title);
        this.navCtrl.push(OfferDetailPage,{offer: loc});
    }
}
