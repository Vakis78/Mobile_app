import { Component } from '@angular/core';
import { LoadingController, NavController } from 'ionic-angular';
import { AppGlobals } from '../../services/appglobals';
import { AppServer } from '../../services/appserver';
import { UiHelper } from '../../services/uihelper';
import { EditProfilePage } from '../edit-profile/edit-profile';

@Component({
    selector: 'page-personal-details',
    templateUrl: 'personal-details.html'
})
export class PersonalDetailsPage {

    private loginData: any = {name:'',email:'',phone:'',address:'',location:'',profile_pic_url:''};
    private loader: any = null;
    
    constructor(public navCtrl: NavController,private loadingCtrl: LoadingController,private server: AppServer,private globals: AppGlobals,private uiHelper: UiHelper) {
    }

    ionViewWillEnter(){
        this.loginData.name=this.globals.currentUser.client_name;
        this.loginData.location='Cyprus, Cyprus';
        this.loginData.email=this.globals.currentUser.client_email;
        this.loginData.phone=this.globals.currentUser.client_phone;
        this.loginData.profile_pic_url='https://www.gstatic.com/webp/gallery/2.jpg';
    }

    ionViewDidLoad(){
        this.loadData();
    }

    loadData(){
        console.log("loadData");
        let loginData={user_id: this.globals.currentUser.id};
        console.log(loginData);
        this.loader=this.loadingCtrl.create({content: "Please wait..."});
        this.loader.present();
        this.server.getClientData(loginData).subscribe((data:any)=>{
            this.loader.dismiss();
            console.log(data);
            if (data.status==200){
                for (let a=0;a<data.addresses.length;a++){
                    let c=data.addresses[a];
                    this.loginData.address=c.full_address;
                    break;
                }
            }else{
                this.uiHelper.showMessageBox("",data.msg);
            }
        },(err)=>{
            this.loader.dismiss();
            console.error(err);
            this.uiHelper.showNetworkError(err);
        });
    }

    editClick(){
        console.log("editClick");
        this.navCtrl.push(EditProfilePage);
    }
}
