import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { AppGlobals } from '../../services/appglobals';
import { AppServer } from '../../services/appserver';
import { UiHelper } from '../../services/uihelper';

@Component({
    selector: 'page-rewards',
    templateUrl: 'rewards.html',
})
export class RewardsPage {

    location: any = null;
    rewards: any[]=[];
    loading: boolean = false;

    constructor(public navCtrl: NavController,public viewCtrl: ViewController, public navParams: NavParams,public server: AppServer,public uiHelper: UiHelper,public globals: AppGlobals) {
        this.location=this.navParams.get('location');
    }

    ionViewDidLoad() {
        this.loadData();
    }

    loadData(){
        console.log("loadData");
        let loginData={user_id: this.globals.currentUser.id,company_id: this.location.company_id};
        console.log(loginData);
        this.loading=true;
        this.server.getRewards(loginData).subscribe((data:any)=>{
            this.loading=false;
            console.log(data);
            if (data.status==200){
                let rewards=data.rewards;
                this.rewards=[];
                for (let a=0;a<rewards.length;a++){
                    let p=rewards[a];
                    this.rewards.push(p);
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

    rewardClick(loc){
        console.log("rewardClick: "+loc.name);
    }
}
