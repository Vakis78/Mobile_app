import { Component } from '@angular/core';
import { LoadingController, NavController } from 'ionic-angular';
import { AppGlobals } from '../../services/appglobals';
import { AppServer } from '../../services/appserver';
import { DateHelper } from '../../services/date-helper';
import { UiHelper } from '../../services/uihelper';
import { LandingPage } from '../landing/landing';
import { StaticContentPage } from '../static-content/static-content';

@Component({
    selector: 'page-register',
    templateUrl: 'register.html'
})
export class RegisterPage {

    private loginData: any = {name:'',email:'',password:'',phone:'',birthday:'',birthday_value:'',refer_code:''};
    private loader: any= null;

    constructor(public navCtrl: NavController,private loadingCtrl: LoadingController,private server: AppServer,private globals: AppGlobals,private uiHelper: UiHelper) {
        this.loginData.birthday_value=DateHelper.getCurrentDateInIonicFormat();
        this.loginData.birthday=DateHelper.getDbDateFromIonicFormat(this.loginData.birthday_value);
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
        if (!AppGlobals.isValidEmail(this.loginData.email.trim())){
            this.uiHelper.showMessageBox("","Please enter valid email address");
            return;
        }
        if (this.loginData.password.trim()==''){
            this.uiHelper.showMessageBox("","Please enter password");
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
        this.server.register(this.loginData).subscribe((data:any)=>{
            this.loader.dismiss();
            console.log(data);
            if (data.status==200){
                this.globals.setUser(data.user);
                this.globals.currentUser=data.user;
                this.navCtrl.setRoot(LandingPage);
            }else{
                this.uiHelper.showMessageBox("",data.msg);
            }
        },(err)=>{
            this.loader.dismiss();
            console.error(err);
            this.uiHelper.showMessageBox("",JSON.stringify(err));
        });
    }

    loginClick(){
        console.log("loginClick");
        this.navCtrl.pop();
    }

    termsClick(){
        console.log("termsClick");
        this.navCtrl.push(StaticContentPage,{type: 'privacy-policy'});
    }

}
