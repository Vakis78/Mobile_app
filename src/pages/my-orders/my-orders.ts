import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { AppGlobals } from '../../services/appglobals';
import { AppServer } from '../../services/appserver';
import { DateHelper } from '../../services/date-helper';
import { UiHelper } from '../../services/uihelper';
import { OrderProductsPage } from '../order-products/order-products';

@Component({
    selector: 'page-my-orders',
    templateUrl: 'my-orders.html',
})
export class MyOrdersPage {

    points: any[]=[];
    loading: boolean = false;

    constructor(public navCtrl: NavController,public viewCtrl: ViewController, public navParams: NavParams,public server: AppServer,public uiHelper: UiHelper,public globals: AppGlobals) {
    }

    ionViewDidLoad() {
        this.loadData();
    }

    loadData(){
        console.log("loadData");
        let loginData={user_id: this.globals.currentUser.id};
        console.log(loginData);
        this.loading=true;
        this.server.getMyOrders(loginData).subscribe((data:any)=>{
            this.loading=false;
            console.log(data);
            if (data.status==200){
                let points=data.orders;
                this.points=[];
                for (let a=0;a<points.length;a++){
                    let p=points[a];
                    p.order_dt_str=DateHelper.getDisplayDate(p.order_dt,true);
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
        this.navCtrl.push(OrderProductsPage,{order: loc});
    }
}
