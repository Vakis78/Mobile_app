import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { AppGlobals } from '../../services/appglobals';
import { AppServer } from '../../services/appserver';
import { DateHelper } from '../../services/date-helper';
import { UiHelper } from '../../services/uihelper';
import { TrackOrderPage } from '../track-order/track-order';

@Component({
    selector: 'page-order-products',
    templateUrl: 'order-products.html',
})
export class OrderProductsPage {

    pageTitle: string = '';
    order: any = null;
    points: any[]=[];
    loading: boolean = false;
    canTrack: boolean = false;

    constructor(public navCtrl: NavController,public viewCtrl: ViewController, public navParams: NavParams,public server: AppServer,public uiHelper: UiHelper,public globals: AppGlobals) {
        this.order=this.navParams.get('order');
        this.pageTitle="Order#"+this.order.order_number;
        if (this.order.order_type=="delivery"){
            this.canTrack=true;
        }
    }

    ionViewDidLoad() {
        this.loadData();
    }

    loadData(){
        console.log("loadData");
        let loginData={user_id: this.globals.currentUser.id,order_id: this.order.id};
        console.log(loginData);
        this.loading=true;
        this.server.getOrderProducts(loginData).subscribe((data:any)=>{
            this.loading=false;
            console.log(data);
            if (data.status==200){
                let points=data.products;
                this.points=[];
                for (let a=0;a<points.length;a++){
                    let p=points[a];
                    this.points.push(p);
                }
            }else{
                this.uiHelper.showMessageBox("",data.msg);
            }
        },(err)=>{
            this.loading=false;
            console.error(err);
            this.uiHelper.showMessageBox("",JSON.stringify(err));
        });
    }

    locationClick(loc){
        console.log("locationClick: "+loc.company_name);
    }

    trackOrder(){
        console.log("trackOrder");
        this.navCtrl.push(TrackOrderPage,{order: this.order});
    }
}
