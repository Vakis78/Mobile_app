import { Component } from '@angular/core';
import { LoadingController, NavController, NavParams, ViewController } from 'ionic-angular';
import { AppGlobals } from '../../services/appglobals';
import { AppServer } from '../../services/appserver';
import { UiHelper } from '../../services/uihelper';
import { DateHelper } from '../../services/date-helper';

@Component({
    selector: 'page-refer-friend',
    templateUrl: 'refer-friend.html'
})
export class ReferFriendPage {

    private pageData: any = {friend_lines: ''};
    private loader: any= null;

    constructor(public navCtrl: NavController,public navParams: NavParams,private viewCtrl: ViewController,private loadingCtrl: LoadingController,private server: AppServer,private globals: AppGlobals,private uiHelper: UiHelper) {
    }

    ionViewDidLoad(){
    }

    submitClick(){
        console.log("submitClick");
        let friends=[];
        let vals=this.pageData.friend_lines.trim().split("\n");
        for (let a=0;a<vals.length;a++){
            let val=vals[a].trim();
            if (val==""){
                continue;
            }
            if (AppGlobals.isValidEmail(val)){
                friends.push(val);
            }
        }
        this.loader=this.loadingCtrl.create({content: "Please wait..."});
        this.loader.present();
        this.server.referFriends({user_id: this.globals.currentUser.id,friends: friends}).subscribe((data:any)=>{
            this.loader.dismiss();
            console.log(data);
            if (data.status!=200){
                this.uiHelper.showMessageBox("",data.msg);
                return;
            }
            this.uiHelper.showToast("Invitations sent");
            this.navCtrl.pop();
        },(err)=>{
            this.loader.dismiss();
            this.uiHelper.showNetworkError(err);
        });
    }
}
