import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { AppGlobals } from '../../services/appglobals';
import { AppServer } from '../../services/appserver';
import { UiHelper } from '../../services/uihelper';

@Component({
    selector: 'page-locations',
    templateUrl: 'locations.html',
})
export class LocationsPage {

    allTeams: any[]=[];
    teams: any[]=[];
    loading: boolean = false;
    openProducts: boolean = false;
    searchText: string = '';
    welcomeMessage: string = '';
    
    constructor(public navCtrl: NavController,public viewCtrl: ViewController, public navParams: NavParams,public server: AppServer,public uiHelper: UiHelper,public globals: AppGlobals) {
        if (this.navParams.get('open_products')==='1'){
            this.openProducts=true;
        }
    }

    ionViewDidLoad() {
        this.loadData();
    }

    loadData(){
        console.log("loadData");
        let address_id='0';
        if (this.globals.currentCartAddress!=null){
            address_id=this.globals.currentCartAddress.id;
        }
        let loginData={user_id: this.globals.currentUser.id,address_id: address_id,latitude:0,longitude: 0};
        if (this.globals.currentLocation!=null){
            loginData.latitude=this.globals.currentLocation.latitude;
            loginData.longitude=this.globals.currentLocation.longitude;
        }
        console.log(loginData);
        this.loading=true;
        this.server.getLocations(loginData).subscribe((data:any)=>{
            this.loading=false;
            console.log(data);
            if (data.status==200){
                let locations=data.locations;
                this.teams=[];
                for (let a=0;a<locations.length;a++){
                    let p=locations[a];
                    p.show_distance=false;
                    if (p.distance>0){
                        p.show_distance=true;
                    }
                    let latLngText=p.branch_latitude+","+p.branch_longitude;
                    let url="https://maps.googleapis.com/maps/api/staticmap?maptype=roadmap&center="+latLngText+"&zoom=15&size=400x130";
                    url+="&markers=color:red%7Clabel:B%7C"+latLngText;
                    url+="&key="+this.globals.mapsApiKey;
                    console.log(url);
                    //Brooklyn+Bridge,New+York,NY&maptype=roadmap
//&markers=color:blue%7Clabel:S%7C40.702147,-74.015794&markers=color:green%7Clabel:G%7C40.711614,-74.012318
//&markers=color:red%7Clabel:C%7C40.718217,-73.998284
//&key=YOUR_API_KEY&signature=YOUR_SIGNATURE
                    p.static_map_url=url;
                    this.allTeams.push(p);
                    this.teams.push(p);
                }
                this.welcomeMessage="We have <b>"+this.teams.length+"</b> Outlets ready to serve you.";
            }else{
                this.uiHelper.showMessageBox("",data.msg);
            }
        },(err)=>{
            this.loading=false;
            console.error(err);
            this.uiHelper.showMessageBox("",JSON.stringify(err));
        });
    }

    callClick(loc,evt:Event){
        evt.stopPropagation();
        console.log("callClick: "+loc.branch_phone);
        try{
            (<any>window).plugins.CallNumber.callNumber((result)=>{},(err)=>{
                this.uiHelper.showMessageBox("",err);
            },loc.branch_phone);
        }catch(e){
            window.open("tel:"+loc.branch_phone,'_blank');
        }
    }

    directionsClick(loc,evt:Event){
        evt.stopPropagation();
        console.log("directionsClick: "+loc.branch_address);
        let url="https://www.google.com/maps?q="+loc.branch_latitude+","+loc.branch_longitude;
        console.log(url);
        window.open(url,'_blank');
    }

    locationClick(loc){
        console.log("locationClick: "+loc.branch_name);
        if (this.openProducts){
            this.globals.currencyCode=loc.currency_code;
            this.globals.currencySymbol=loc.currency_symbol;
            this.viewCtrl.dismiss({location: loc});
        }
    }

    searchChanged(){
        //console.log("searchChanged: "+this.searchText);
        this.teams=[];
        let sText=this.searchText.toLowerCase().trim();
        for (let a=0;a<this.allTeams.length;a++){
            let p=this.allTeams[a];
            if (sText=="" || p.branch_name.toLowerCase().indexOf(sText)!=-1 || p.branch_address.toLowerCase().indexOf(sText)!=-1){
                this.teams.push(p);
            }
        }
    }

    backClick(){
        this.viewCtrl.dismiss();
    }
}
