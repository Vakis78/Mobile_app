import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { AppGlobals } from '../../services/appglobals';
import { AppServer } from '../../services/appserver';
import { UiHelper } from '../../services/uihelper';
import { RewardsPage } from '../rewards/rewards';
import { DateHelper } from '../../services/date-helper';

@Component({
    selector: 'page-my-points',
    templateUrl: 'my-points.html',
})
export class MyPointsPage {

    points: any[]=[];
    loading: boolean = false;

    constructor(public navCtrl: NavController,public viewCtrl: ViewController, public navParams: NavParams,public server: AppServer,public uiHelper: UiHelper,public globals: AppGlobals) {
    }

    ionViewDidLoad() {
        this.loadData();
    }

    loadData(){
        console.log("loadData");
        let loginData={user_id: this.globals.currentUser.id};
        console.log(loginData);
        this.loading=true;
        this.server.getMyPoints(loginData).subscribe((data:any)=>{
            this.loading=false;
            console.log(data);
            if (data.status==200){
                let points=data.points;
                this.points=[];
                for (let a=0;a<points.length;a++){
                    let p=points[a];
                    for (let b=0;b<p.rewards.length;b++){
                        p.rewards[b].visited_str=DateHelper.getDisplayDate(p.rewards[b].visited,true);
                    }
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
        console.log("locationClick: "+loc.company_name);
        this.navCtrl.push(RewardsPage,{location: loc});
    }
}
