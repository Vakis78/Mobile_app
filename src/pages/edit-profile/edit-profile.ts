import { Component } from '@angular/core';
import { LoadingController, NavController } from 'ionic-angular';
import { AppGlobals } from '../../services/appglobals';
import { AppServer } from '../../services/appserver';
import { DateHelper } from '../../services/date-helper';
import { UiHelper } from '../../services/uihelper';
import { HomePage } from '../home/home';

@Component({
    selector: 'page-edit-profile',
    templateUrl: 'edit-profile.html'
})
export class EditProfilePage {

    private loginData: any = {user_id: '',name:'',email:'',phone:'',birthday:'',birthday_value:''};
    private loader: any= null;

    constructor(public navCtrl: NavController,private loadingCtrl: LoadingController,private server: AppServer,private globals: AppGlobals,private uiHelper: UiHelper) {
        this.loginData.birthday_value=DateHelper.getCurrentDateInIonicFormat();
        this.loginData.birthday=DateHelper.getDbDateFromIonicFormat(this.loginData.birthday_value);

        console.log(this.globals.currentUser);

        this.loginData.user_id=this.globals.currentUser.id;
        this.loginData.birthday=this.globals.currentUser.client_birthdate;
        this.loginData.birthday_value=DateHelper.getDateInIonicFormat(DateHelper.getDateFromDbDate(this.loginData.birthday+" 00:00:00"));
        this.loginData.name=this.globals.currentUser.client_name;
        this.loginData.email=this.globals.currentUser.client_email;
        this.loginData.phone=this.globals.currentUser.client_phone;
    }

    registerClick(){
        console.log("registerClick");
        if (this.loginData.name.trim()==''){
            this.uiHelper.showMessageBox("","Please enter name");
            return;
        }
        if (this.loginData.email.trim()==''){
            this.uiHelper.showMessageBox("","Please enter email");
            return;
        }
        if (this.loginData.phone.trim()==''){
            this.uiHelper.showMessageBox("","Please enter phone");
            return;
        }
        this.loginData.birthday=DateHelper.getDbDateFromIonicFormat(this.loginData.birthday_value);
        this.loader = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        this.loader.present();
        this.server.updateProfile(this.loginData).subscribe((data:any)=>{
            this.loader.dismiss();
            console.log(data);
            if (data.status==200){
                this.globals.setUser(data.user);
                this.globals.currentUser=data.user;
                this.uiHelper.showToast("Profile updated");
            }else{
                this.uiHelper.showMessageBox("",data.msg);
            }
        },(err)=>{
            this.loader.dismiss();
            console.error(err);
            this.uiHelper.showMessageBox("",JSON.stringify(err));
        });
    }

}
