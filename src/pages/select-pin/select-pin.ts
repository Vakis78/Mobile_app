import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { AppGlobals } from '../../services/appglobals';
import { AppServer } from '../../services/appserver';
import { UiHelper } from '../../services/uihelper';

@Component({
    selector: 'page-select-pin',
    templateUrl: 'select-pin.html',
})
export class SelectPinPage {

    loading: boolean = false;
    mapId: string = '';
    map: any=null;
    selectedLocation: any = null;
    selectedMarker: any = null;
    showFooter: boolean = false;
    fullAddress: string = '';
    addressTitle: string = '';

    constructor(public navCtrl: NavController,public viewCtrl: ViewController, public navParams: NavParams,public server: AppServer,public uiHelper: UiHelper,public globals: AppGlobals) {
        this.mapId="map_"+(new Date().getTime().toString());
    }

    ionViewDidLoad() {
        this.initMap();
    }

    initMap(){
        let uluru = {lat: 35.1264, lng: 33.4299};
        this.map=(<any>window).initMapUi(this.mapId,uluru);
        this.map.setZoom(8);
        this.map.addListener("click", (mapsMouseEvent) => {
            this.showFooter=true;
            this.selectedLocation=null;
            this.removeMarker();
            this.resolveLatLng(mapsMouseEvent.latLng.toJSON());
        });
        (<any>window).addCustomMapButton(this.map,"My Location",()=>{
            if (this.globals.currentLocation!=null){
                this.doMyLocationThing();
            }
        });
        if (this.globals.currentLocation!=null){
            this.doMyLocationThing();
        }
    }

    doMyLocationThing(){
        let loc = {lat: this.globals.currentLocation.latitude,lng: this.globals.currentLocation.longitude};
        this.showFooter=true;
        this.selectedLocation=null;
        this.removeMarker();
        this.resolveLatLng(loc);
    }

    removeMarker(){
        if (this.selectedMarker!=null){
            this.selectedMarker.setMap(null);
            this.selectedMarker=null;
        }
    }

    addMarkerToLocation(){
        this.removeMarker();
        this.selectedMarker=(<any>window).addMarkerToMap(this.map,this.selectedLocation,true);
    }

    resolveLatLng(addr){
        console.log("resolveLatLng");
        this.loading=true;
        this.server.getLatLngInfo(addr,this.globals.mapsApiKey).subscribe(
            (res:any)=>{
                console.log(res);
                this.loading=false;
                try{
                    let jsonRes=res;
                    if (jsonRes["status"]=="OK"){
                        if(jsonRes["results"].length>0){
                            console.log("Address: "+jsonRes["results"][0].formatted_address);
                            let frmAddr=jsonRes["results"][0].formatted_address;
                            this.fullAddress=frmAddr;
                            // let addrVals=frmAddr.split(',');
                            // if (addrVals.length>2){
                            //     this.selectedCityName=addrVals[addrVals.length-3];
                            // }else if (addrVals.length>1){
                            //     this.selectedCityName=addrVals[addrVals.length-2];
                            // }else{
                            //     this.selectedCityName=addrVals[0];
                            // }
                            this.selectedLocation=addr;
                            this.addMarkerToLocation();
                        }else{
                            console.error("results are 0");
                        }
                    }else{
                        console.error("Status: "+jsonRes["status"]);
                        this.fullAddress=jsonRes["error_message"]+" ("+jsonRes["status"]+")";
                    }
                }catch(e){
                    console.error("Exception: "+e.message);
                    this.fullAddress=e.message;
                }
            },(err)=>{
                this.loading=false;
                console.error(JSON.stringify(err));
                this.fullAddress=JSON.stringify(err);
            }
        );
    }

    doneClick(){
        if (this.selectedLocation==null){
            this.uiHelper.showMessageBox("","Please select a location first");
            return;
            //this.selectedLocation={lat: 12,lng: 45};
            //this.fullAddress='test full address';
        }
        if (this.addressTitle==''){
            this.uiHelper.showMessageBox("","Please name this address");
            return;
        }
        this.viewCtrl.dismiss({address: {latitude: this.selectedLocation.lat,longitude: this.selectedLocation.lng,name: this.addressTitle,address_title: this.addressTitle,full_address: this.fullAddress}});
    }

    backClick(){
        this.viewCtrl.dismiss();
    }
}
