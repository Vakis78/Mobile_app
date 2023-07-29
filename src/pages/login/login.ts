import { Component } from '@angular/core';
import { LoadingController, NavController } from 'ionic-angular';
import { AppGlobals } from '../../services/appglobals';
import { AppServer } from '../../services/appserver';
import { UiHelper } from '../../services/uihelper';
import { LandingPage } from '../landing/landing';
import { RegisterPage } from '../register/register';
import { StaticContentPage } from '../static-content/static-content';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {

    private loginData: any = {name:'',email:'',password:''};
    private loader:any=null;

    constructor(public navCtrl: NavController,private loadingCtrl: LoadingController,private server: AppServer,private globals: AppGlobals,private uiHelper: UiHelper) {

    }

    loginClick(){
        console.log("loginClick");
        this.loader = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        this.loader.present();
        this.server.login(this.loginData).subscribe((data:any)=>{
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

    registerClick(){
        console.log("registerClick");
        this.navCtrl.push(RegisterPage);
    }

    forgotPasswordClick(){
        console.log("forgotPasswordClick");
        //this.navCtrl.push(ForgotPasswordPage);
    }

    policyClick(){
        console.log("policyClick");
        this.navCtrl.push(StaticContentPage,{type: 'privacy-policy'});
    }

}
