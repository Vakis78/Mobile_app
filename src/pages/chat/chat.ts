import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { AppGlobals } from '../../services/appglobals';
import { AppServer } from '../../services/appserver';
import { UiHelper } from '../../services/uihelper';

@Component({
    selector: 'page-chat',
    templateUrl: 'chat.html',
})
export class ChatPage {

    order:any=null;
    teams: any[]=[];
    loading: boolean = false;
    chatName: string = 'Mr. Shandy';

    constructor(public navCtrl: NavController,public viewCtrl: ViewController, public navParams: NavParams,public server: AppServer,public uiHelper: UiHelper,public globals: AppGlobals) {
        this.order=this.navParams.get('order');
        this.chatName=this.order.client_name;
    }

    ionViewDidLoad() {
        this.loadData();
    }

    loadData(){
        console.log("loadData");
        // let address_id='0';
        // if (this.globals.currentCartAddress!=null){
        //     address_id=this.globals.currentCartAddress.id;
        // }
        // let loginData={user_id: this.globals.currentUser.id,address_id: address_id,latitude:0,longitude: 0};
        // if (this.globals.currentLocation!=null){
        //     loginData.latitude=this.globals.currentLocation.latitude;
        //     loginData.longitude=this.globals.currentLocation.longitude;
        // }
        // console.log(loginData);
        // this.loading=true;
        // this.server.getLocations(loginData).subscribe((data:any)=>{
        //     this.loading=false;
        //     console.log(data);
        //     if (data.status==200){
        //         let locations=data.locations;
        //         this.teams=[];
        //         for (let a=0;a<locations.length;a++){
        //             let p=locations[a];
        //             p.show_distance=false;
        //             if (p.distance>0){
        //                 p.show_distance=true;
        //             }
        //             this.allTeams.push(p);
        //             this.teams.push(p);
        //         }
        //         this.welcomeMessage="We have <b>"+this.teams.length+"</b> Outlets ready to serve you.";
        //     }else{
        //         this.uiHelper.showMessageBox("",data.msg);
        //     }
        // },(err)=>{
        //     this.loading=false;
        //     console.error(err);
        //     this.uiHelper.showMessageBox("",JSON.stringify(err));
        // });
    }

    callClick(){
        console.log("callClick");
        //let phNumber="+12345677";
        let phNumber=this.order.client_phone;
        try{
            (<any>window).plugins.CallNumber.callNumber((result)=>{},(err)=>{
                this.uiHelper.showMessageBox("",err);
            },phNumber);
        }catch(e){
            window.open("tel:"+phNumber,'_blank');
        }
    }
}
