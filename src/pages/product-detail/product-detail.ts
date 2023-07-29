import { Component } from '@angular/core';
import { LoadingController, NavController, NavParams } from 'ionic-angular';
import { AppGlobals } from '../../services/appglobals';
import { AppServer } from '../../services/appserver';
import { UiHelper } from '../../services/uihelper';
import { DateHelper } from '../../services/date-helper';

@Component({
    selector: 'page-product-detail',
    templateUrl: 'product-detail.html'
})
export class ProductDetailPage {

    private pageData: any = {additional_notes: ''};
    private product: any = null;
    private variants:any[]=[];
    private quantity: number = 1;
    private totalAmount: string = '';
    private loader: any= null;

    private subproducts:any[]=[];
    
    constructor(public navCtrl: NavController,public navParams: NavParams,private loadingCtrl: LoadingController,private server: AppServer,private globals: AppGlobals,private uiHelper: UiHelper) {
        this.product=this.navParams.get('product');
    }

    ionViewDidLoad(){
        this.calculateTotalAmount();
        this.loadDetails();
    }

    calculateTotalAmount(){
        let val=(parseFloat(this.product.product_price)*this.quantity);
        for (let a=0;a<this.subproducts.length;a++){
            let sp=this.subproducts[a];
            if (sp.selected_id!=""){
                for (let b=0;b<sp.options.length;b++){
                    let o=sp.options[b];
                    if (o.id==sp.selected_id){
                        val+=o.price;
                        break;
                    }
                }
            }
        }
        this.totalAmount=(Math.round(val * 100) / 100).toString();
    }

    quantityChanged(val){
        console.log("quantityChanged: "+val+"::"+this.quantity);
        this.quantity=parseInt(val);
        this.calculateTotalAmount();
    }

    addToCartClick(){
        console.log("addToCartClick");
        for (let a=0;a<this.subproducts.length;a++){
            let sp=this.subproducts[a];
            if (sp.selected_id!=""){
                let opt=null;
                for (let b=0;b<sp.options.length;b++){
                    let o=sp.options[b];
                    if (o.id==sp.selected_id){
                        opt=o;
                        break;
                    }
                }
                if (opt!=null){
                    this.variants.push({option_id: sp.selected_id,subproduct_id: sp.id,subproduct: sp.subproduct_name,option_name: opt.option_name,option_price: opt.price});
                }
            }
        }
        this.globals.addToCart(this.product,this.quantity,this.variants);
        this.navCtrl.pop();
    }

    loadDetails(){
        console.log("loadDetails");
        let loginData={user_id: this.globals.currentUser.id,product_id: this.product.product_id};
        console.log(loginData);
        this.loader=this.loadingCtrl.create({content: "Please wait..."});
        this.loader.present();
        this.server.getProductDetails(loginData).subscribe((data:any)=>{
            this.loader.dismiss();
            console.log(data);
            if (data.status==200){
                let sp=data.subproducts;
                for (let a=0;a<sp.length;a++){
                    let s=sp[a];
                    s.selected_id="";
                    if (s.options.length==0){
                        continue;
                    }
                    for (let b=0;b<s.options.length;b++){
                        s.options[b].selected=false;
                        s.options[b].price=parseFloat(s.options[b].sub_product_price);
                        s.options[b].show_price=s.options[b].price>0;
                        s.options[b].price_text=this.globals.currencySymbol+""+s.options[b].price;
                    }
                    this.subproducts.push(s);
                }
            }else{
                this.uiHelper.showMessageBox("",data.msg);
            }
        },(err)=>{
            this.loader.dismiss();
            console.error(err);
            this.uiHelper.showMessageBox("",JSON.stringify(err));
        });
    }

    optionChanged(sp){
        console.log("optionChanged");
        this.calculateTotalAmount();
    }
}
