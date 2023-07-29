import { Injectable } from "@angular/core";
import { Platform } from "ionic-angular";
import { AppGlobals } from "./appglobals";
import { AppServer } from "./appserver";
import { UiHelper } from "./uihelper";

@Injectable() export class FirebaseHelper {

    public static Config:any=null;

    constructor(private platform: Platform, private uiHelper: UiHelper,private server: AppServer,private globals: AppGlobals){

    }

    public init(){
        if (this.platform.is('ios') || this.platform.is('iphone') || this.platform.is('ipad')){
            this.checkPermissionAndStart();
            return;   
        }
        this.start();
    }

    private checkPermissionAndStart(){
        console.log("Granting permission");
        try{
            (<any>window).FirebasePlugin.grantPermission(()=>{
                console.log("grantPermission success");
                this.start();
            }, function(error) {
                console.error("Error in grantPermissions: "+error);
                this.showMessageIfApp("Firebase","Error in grantPermissions: "+error);
            });
        }catch(e){
            console.error(e);
            this.showMessageIfApp("Firebase","Exception in grantPermission: "+e.message);
        }
    }

    private start(){
        try{
            (<any>window).FirebasePlugin.onTokenRefresh((fcmToken)=>{
                console.log("fcmToken: "+fcmToken);
                //this.showMessageIfApp("Firebase","fcmToken: "+fcmToken);
                //save token in local storage
                this.setToken(fcmToken);
                //subscribe to common channel
                this.subscribeToFirebaseTopic(FirebaseHelper.Config["common_topic"]);
                //save token on server
                this.saveTokenOnServer();
            },(error)=>{
                console.error(error);
                this.showMessageIfApp("Firebase","Error in onTokenRefresh: "+error);
            });
        }catch(e){
            console.error(e);
            this.showMessageIfApp("Firebase","Exception: "+e.message);
        }

        try{
            (<any>window).FirebasePlugin.onMessageReceived((message)=>{
                console.log(JSON.stringify(message));
                //alert(JSON.stringify(message));
                if (message.tap && message.tap=="background"){
                    //this is background
                    this.openPushDetails(message);
                }else{
                    //do in foreground
                    let fullBody=this.uiHelper.generateSummary(message.body);
                    this.uiHelper.showPushNotification(message.title,fullBody,()=>{
                        console.log("open details clicked");
                        this.openPushDetails(message);
                    });
                }
                
            },(error)=>{
                console.error(error);
                this.showMessageIfApp("Firebase","Error in onMessageReceived: "+error);
            });
        }catch(e){
            console.error(e);
            this.showMessageIfApp("Firebase","Exception: "+e.message);
        }
    }

    private openPushDetails(message){
        
    }

    public subscribeToFirebaseTopic(topic){
        (<any>window).FirebasePlugin.subscribe(topic,()=>{
            console.log("subscribed to: "+topic);
        },(err)=>{
            this.uiHelper.showMessageBox("","Error in subscribeToFirebaseTopic for "+topic+": "+err);
        });
    }

    public unsubscribeFromFirebaseTopic(topic){
        try{
            (<any>window).FirebasePlugin.unsubscribe(topic,()=>{
                console.log("unsubscribed from: "+topic);
            },(err)=>{
                //this.showMessageIfApp("","Error in subscribeToFirebaseTopic for "+topic+": "+err);
            });
        }catch(e){
            console.error(e);
        }
    }

    public setToken(token){
        this.globals.setFirebaseToken(token);
    }

    public getToken(){
        return this.globals.getFirebaseToken();
    }

    public saveTokenOnServer(){
        console.log("saveTokenOnServer");
        if (this.globals.currentUser==null){
            console.error("User is not logged in");
            return;
        }
        let token=this.getToken();
        if (token==null || token==""){
            console.error("token is not generated");
            return;
        }
        this.server.savePushToken({user_id: this.globals.currentUser.id,token: this.getToken()}).subscribe((res:any)=>{
            try{
                console.log(res.status);
                if (res.status!=200){
                    console.error(res.msg);
                    this.showMessageIfApp("API",res.msg);
                }else{
                    console.log("token saved on server");
                    //this.showMessageIfApp("API","Token saved on server");
                }
            }catch(e){
                console.error(e);
                this.showMessageIfApp("API","Exception: "+e.message);
            }
        },(err)=>{
            console.error(err);
            this.showMessageIfApp("API","Err: "+JSON.stringify(err));
        });
    }

    private showMessageIfApp(title,msg){
        if ((<any>window).cordova){
            this.uiHelper.showMessageBox(title,msg);
        }
    }
}