import { Component } from '@angular/core';
import { LoadingController, NavController } from 'ionic-angular';
import { AppGlobals } from '../../services/appglobals';
import { AppServer } from '../../services/appserver';

@Component({
    selector: 'page-forgot-password',
    templateUrl: 'forgot-password.html'
})
export class ForgotPasswordPage {

    private loginData: any = {email:''};
    private loader:any=null;

    constructor(public navCtrl: NavController,private loadingCtrl: LoadingController,private server: AppServer,private globals: AppGlobals) {

    }

    loginClick(){
        console.log("loginClick");
        this.loader = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        this.loader.present();
        this.server.forgotPassword(this.loginData).subscribe((data:any)=>{
            this.loader.dismiss();
            console.log(data);
            if (data.status==200){
                alert("Password is sent to your email");
                this.navCtrl.pop();
            }else{
                alert(data.msg);
            }
        },(err)=>{
            this.loader.dismiss();
            console.error(err);
            alert(JSON.stringify(err));
        });
    }
}
