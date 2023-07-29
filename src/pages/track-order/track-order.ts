import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { AppGlobals } from '../../services/appglobals';
import { AppServer } from '../../services/appserver';
import { UiHelper } from '../../services/uihelper';
import { ChatPage } from '../chat/chat';

@Component({
    selector: 'page-track-order',
    templateUrl: 'track-order.html',
})
export class TrackOrderPage {

    order: any = null;
    loading: boolean = false;
    mapId: string = '';
    private map: any=null;
    private myMarker: any=null;
    private sentTime: string = '';

    constructor(public navCtrl: NavController,public viewCtrl: ViewController, public navParams: NavParams,public server: AppServer,public uiHelper: UiHelper,public globals: AppGlobals) {
        this.order=this.navParams.get('order');
        console.log(this.order);
        this.mapId="map_"+(new Date().getTime().toString());
        this.sentTime=this.order.order_dt_str;
    }

    ionViewDidLoad() {
        this.loadData();
    }

    initMap(){
        let uluru = {lat: 35.1264, lng: 33.4299};
        console.log(uluru);
        if (this.globals.currentLocation!=null){
            uluru.lat=this.globals.currentLocation.latitude;
            uluru.lng=this.globals.currentLocation.longitude;
        }
        this.map=(<any>window).initMapUi(this.mapId,uluru);
        this.map.setZoom(8);
        (<any>window).addCustomMapButton(this.map,"My Location",()=>{
            if (this.globals.currentLocation!=null){
                if(this.myMarker!=null){
                    this.myMarker.setMap(null);
                    this.myMarker=null;
                }
                uluru = {lat: this.globals.currentLocation.latitude,lng: this.globals.currentLocation.longitude};
                this.myMarker=(<any>window).addMarkerToMap(this.map,uluru,true);
            }
        });
        if (this.globals.currentLocation!=null){
            uluru = {lat: this.globals.currentLocation.latitude,lng: this.globals.currentLocation.longitude};
            this.myMarker=(<any>window).addMarkerToMap(this.map,uluru,true);
        }
    }

    // addLocationsPinToMap(){
    //     let that=this;
    //     let firstPin=true;
    //     for (let a=0;a<this.teams.length;a++){
    //         let upd=this.teams[a];
    //         if(upd.marker!=null){
    //             upd.marker.setMap(null);
    //         }
    //         if (parseFloat(upd.branch_latitude)!=0 && parseFloat(upd.branch_longitude)!=0){
    //             let ps = {lat: parseFloat(upd.branch_latitude), lng: parseFloat(upd.branch_longitude)};
    //             let panCamera=firstPin;
    //             firstPin=false;
    //             let mrk=(<any>window).addMarkerToMap(this.map,ps,panCamera);
    //             //(<any>window).addToClusteredMarkers(mrk);
    //             let iconUrlBase="assets/markers/";
    //             let iconUrl=iconUrlBase+"pin_purple.png";
    //             let markerIcon = {
    //                 url: iconUrl,
    //                 scaledSize: new (<any>window).google.maps.Size(40, 50),
    //             };
    //             mrk.setIcon(markerIcon);
    //             mrk.title=upd.branch_id;
                
    //             mrk.addListener('click', function() {
    //                 let pid=this.title;
    //                 console.log("marker click: "+pid);
    //                 for (let a=0;a<that.teams.length;a++){
    //                     let t=that.teams[a];
    //                     if (t.branch_id==pid){
    //                         t.info_window.open(that.map,this);
    //                     }
    //                 }
    //             });
    //             let contentString="<b>"+upd.company_name+"</b><br />"+upd.branch_name+"<br />"+upd.branch_address+"<br />"+upd.branch_phone;
    //             let iWindow=(<any>window).addInfoWindow(this.map,mrk,contentString,false);
    //             upd.info_window=iWindow;
    //             upd.marker=mrk;
    //         }
    //     }
    // }

    loadData(){
        console.log("loadData");
        this.initMap();
        // let address_id='0';
        // if (this.globals.currentCartAddress!=null){
        //     address_id=this.globals.currentCartAddress.id;
        // }
        // let loginData={user_id: this.globals.currentUser.id,address_id: address_id};
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
        //             this.teams.push(p);
        //         }
        //         this.initMap();
        //         this.addLocationsPinToMap();
        //     }else{
        //         this.uiHelper.showMessageBox("",data.msg);
        //     }
        // },(err)=>{
        //     this.loading=false;
        //     console.error(err);
        //     this.uiHelper.showMessageBox("",JSON.stringify(err));
        // });
    }

    callClick(evt:Event){
        evt.stopPropagation();
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

    chatClick(evt:Event){
        evt.stopPropagation();
        console.log("chatClick");
        this.navCtrl.push(ChatPage,{order: this.order});
    }
    
    backClick(){
        this.viewCtrl.dismiss();
    }
}
