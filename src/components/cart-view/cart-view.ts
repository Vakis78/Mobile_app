import { Component } from '@angular/core';
import { AppGlobals } from '../../services/appglobals';

@Component({
    selector: 'cart-view',
    templateUrl: 'cart-view.html'
})
export class CartViewComponent {

    tax: string = '0';
    tax_percentage: string = '0';
    discount: string = '0';
    discount_percentage: string = '0';
    shipping: string = '0';
    cart_total: string = '0';
    total: string = '0';
    coupon_code: string = '';
    show_tax: boolean = false;
    show_discount: boolean = false;
    show_shipping: boolean = false;

    products:any[]=[];

    constructor(private globals: AppGlobals) {
        this.setLocalVars();
    }

    ionViewDidEnter(){
        //this.setLocalVars();
    }

    updateView(){
        this.setLocalVars();
    }

    setLocalVars(){
        this.shipping=this.globals.currentCart.shipping.toString();
        this.tax_percentage=this.globals.currentCart.tax_percentage.toString();
        this.tax=this.globals.currentCart.tax.toString();
        this.discount_percentage=this.globals.currentCart.discount_percentage.toString();
        this.discount=this.globals.currentCart.discount.toString();
        this.cart_total=this.globals.currentCart.cart_total.toString();
        this.total=this.globals.currentCart.total.toString();
        this.products=[];
        for (let a=0;a<this.globals.currentCart.products.length;a++){
            this.products.push(this.globals.currentCart.products[a]);
        }
        this.show_tax=(this.globals.currentCart.tax>0);
        this.show_discount=(this.globals.currentCart.discount>0);
        this.coupon_code=this.globals.currentCart.coupon_code;
    }

    quantityChanged(p){
        console.log("quantityChanged: "+p.quantity);
        this.globals.cartQuantityChanged(p);
        this.total=this.globals.currentCart.total.toString();
        this.cart_total=this.globals.currentCart.cart_total.toString();
    }

    deleteProduct(p,idx){
        console.log("deleteProduct: "+p.product.name+"::"+idx);
        this.globals.removeFromCart(p,idx);
        this.products.splice(idx,1);
        this.total=this.globals.currentCart.total.toString();
        this.cart_total=this.globals.currentCart.cart_total.toString();
    }
}
