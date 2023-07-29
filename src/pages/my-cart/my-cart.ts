import { Component, ViewChild } from '@angular/core';
import { App, LoadingController, ModalController, NavController, NavParams, ViewController } from 'ionic-angular';
import { CartViewComponent } from '../../components/cart-view/cart-view';
import { AppGlobals } from '../../services/appglobals';
import { AppServer } from '../../services/appserver';
import { DateHelper } from '../../services/date-helper';
import { UiHelper } from '../../services/uihelper';
import { DeliveryPage } from '../delivery/delivery';
import { HomePage } from '../home/home';
import { PaymentMethodPage } from '../payment-method/payment-method';
import { LandingPage } from '../landing/landing';

@Component({
    selector: 'page-my-cart',
    templateUrl: 'my-cart.html',
})
export class MyCartPage {

    pageData: any = {payment_mode: 'cash',min_pickup_dt: '',max_pickup_dt:'',pickup_dt_val:'',pickup_dt: ''};
    location: any = {};
    loader: any = null;
    loading: boolean = false;
    totalAmount: string = '';
    paymentMethods: any[]=[];
    selectedCard:any=null;
    selectedAddress:any=null;

    @ViewChild(CartViewComponent) cartView;
    
    constructor(public navCtrl: NavController,public viewCtrl: ViewController,public app: App,public loadingCtrl: LoadingController,public modalCtrl: ModalController, public navParams: NavParams,public server: AppServer,public uiHelper: UiHelper,public globals: AppGlobals) {
        this.location=this.navParams.get('location');
        let dt=new Date();
        dt.setSeconds(0);
        this.pageData.pickup_dt_val=DateHelper.getDateInIonicFormat(dt);
        this.pageData.min_pickup_dt=DateHelper.getDateInIonicFormat(dt);
        let ts=dt.getTime()+(1000*60*60*24*7);
        this.pageData.max_pickup_dt=DateHelper.getDateInIonicFormat(new Date(ts));
    }

    ionViewDidLoad() {
        this.calculateTotalAmount();
        this.loadData();
    }

    calculateTotalAmount(){
        let val=parseFloat(this.globals.currentCart.cart_total);
        this.totalAmount=val.toFixed(2);
    }

    loadData(){
        console.log("loadData");
        let loginData={user_id: this.globals.currentUser.id};
        console.log(loginData);
        this.loading=true;
        this.server.getClientData(loginData).subscribe((data:any)=>{
            this.loading=false;
            console.log(data);
            if (data.status==200){
                for (let a=0;a<data.cards.length;a++){
                    let c=data.cards[a];
                    c.display_text=this.uiHelper.generateCardNumberDisplay(c.card_number);
                    this.paymentMethods.push(c);
                }
                if (this.paymentMethods.length>0){
                    this.paymentMethods[0].selected=true;
                    this.selectedCard=this.paymentMethods[0];
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

    addPaymentMethodClick(){
        console.log("addPaymentMethodClick");
        let mdl=this.modalCtrl.create(PaymentMethodPage,{address: ''});
        mdl.onDidDismiss((data)=>{
            console.log(data);
            if(data){
                //new card
                let card=data;
                card.display_text=this.uiHelper.generateCardNumberDisplay(card.card_number);
                card.selected=false;
                this.paymentMethods.push(card);
            }
        });
        mdl.present();
    }
    
    cardClick(card){
        console.log("cardClick: "+card.card_number);
        for (let a=0;a<this.paymentMethods.length;a++){
            this.paymentMethods[a].selected=false;
        }
        card.selected=true;
        this.selectedCard=card;
    }

    editAddress(){
        let mdl=this.modalCtrl.create(DeliveryPage,{});
        mdl.onDidDismiss((data)=>{
            console.log(data);
            if (data && data.address){
                this.globals.currentCartAddress=data.address;
            }
        })
        mdl.present();
    }

    checkoutClick(){
        console.log("viewCartClick");        
        // if (this.pageData.payment_mode=='card' && this.selectedCard==null){
        //     this.uiHelper.showMessageBox("","Please select a card for payment");
        //     return;
        // }
        let card_id=0;//this.pageData.payment_mode=='card'?this.selectedCard.id:0;
        let orderData={user_id: this.globals.currentUser.id,payment_mode: this.pageData.payment_mode,order_type: this.globals.currentCartType,card_id: card_id,branch_id: this.location.branch_id,address:'',total:'',cart_total:'0',tax_percentage:'',tax:'',discount_percentage:'',discount:'',pickup_dt:'',products:[]};
        orderData.pickup_dt=DateHelper.getDbDateFromIonicFormat(this.pageData.pickup_dt_val);
        orderData.total=this.globals.currentCart.total.toString();
        orderData.cart_total=this.globals.currentCart.cart_total.toString();
        orderData.tax_percentage=this.globals.currentCart.tax_percentage.toString();
        orderData.tax=this.globals.currentCart.tax.toString();
        orderData.discount_percentage=this.globals.currentCart.discount_percentage.toString();
        orderData.discount=this.globals.currentCart.discount.toString();
        for (let a=0;a<this.globals.currentCart.products.length;a++){
            let prd=this.globals.currentCart.products[a];
            console.log(prd);
            let p={product_id: prd.product.product_id,quantity: prd.quantity,price: prd.product.price,total: prd.total,variants: prd.variants};
            orderData.products.push(p);
        }
        orderData.address='';
        if (this.globals.currentCartType=='delivery'){
            //get current delivery address
            orderData.address=this.globals.currentCartAddress.full_address;
        }

        this.loader=this.loadingCtrl.create({content: "Saving your order..."});
        this.loader.present();
        this.server.saveOrder(orderData).subscribe((data:any)=>{
            this.loader.dismiss();
            console.log(data);
            if (data.status!=200){
                this.uiHelper.showMessageBox("",data.msg);
                return;
            }
            if (this.pageData.payment_mode=='card'){
                this.redirectToCheckout(data.order_code);
                this.uiHelper.showToast("Order placed");
                this.globals.clearCart();
                this.app.getRootNav().setRoot(LandingPage);
            }else{
                this.uiHelper.showToast("Order placed");
                this.globals.clearCart();
                this.app.getRootNav().setRoot(LandingPage);
            }
            
        },(err)=>{
            this.loader.dismiss();
            this.uiHelper.showNetworkError(err);
        });
    }

    redirectToCheckout(orderCode){
        console.log("redirectToCheckout: "+orderCode);
        //let url="https://demo.vivapayments.com/web/checkout?ref="+orderCode;
        let url="https://www.vivapayments.com/web/checkout?ref="+orderCode;
        window.open(url,"_blank");
    }
}
