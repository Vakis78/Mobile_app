import { Injectable } from "@angular/core";

@Injectable() export class AppGlobals {

    public mapsApiKey: string = "AIzaSyBmkwgQ2V3cdOE0X7aD9jEgtLHA9llUClo";

    public currentUser:any=null;
    public currentLocation:any=null;
    public currentCart: any = {products:[],cart_total:0,tax_percentage:0,tax: 0,discount_percentage:0,discount:0,shipping: 0,total:0};
    public currentCartType: string = 'pickup'; //pickup/delivery
    public currentCartAddress: any = null; //address selected for delivery

    public currencySymbol: string = '€';
    public currencyCode: string = 'EUR';
    
    constructor(){
        this.recalculateCartTotal();
    }

    public static getStoragePrefix(){
        return "serviceproviders_";
    }

    private getPrefixedKey(key){
        return AppGlobals.getStoragePrefix()+key;
    }

    private deleteItem(key){
        window.localStorage.removeItem(this.getPrefixedKey(key));
    }

    private getStringItem(key,defaultValue:string=null){
        let val=window.localStorage.getItem(this.getPrefixedKey(key));
        return (!val)?defaultValue:val;
    }

    private getNumberItem(key,defaultValue:number=0):number {
        let val=this.getStringItem(key);
        if (val!=null){
            return parseFloat(val);
        }
        return defaultValue;
    }

    private getJsonItem(key){
        let val=this.getStringItem(key);
        if (val!=null){
            val=JSON.parse(val);
        }
        return val;
    }

    private setItem(key,value:string){
        if (value==null){
            this.deleteItem(this.getPrefixedKey(key));
            return;
        }
        window.localStorage.setItem(this.getPrefixedKey(key),value);
    }

    private static USER_KEY="user";
    private static FIREBASE_TOKEN_KEY="firebaseToken";
    
    public setFirebaseToken(token){
        this.setItem(AppGlobals.FIREBASE_TOKEN_KEY,token);
    }

    public getFirebaseToken(){
        return this.getStringItem(AppGlobals.FIREBASE_TOKEN_KEY);
    }
    
    public setUser(usr){
        this.setItem(AppGlobals.USER_KEY,JSON.stringify(usr));
    }

    public getUser(){
        return this.getJsonItem(AppGlobals.USER_KEY);
    }
    

    ///cart functions start
    public clearCart(){
        this.currentCart.products=[];
        this.currentCart = {products:[],cart_total:0,tax_percentage:0,tax: 0,discount_percentage:0,discount:0,coupon_code:'',shipping: 0,total:0};
    }

    public addToCart(product,quantity,variants){
        console.log(product);
        let total=(parseInt(quantity)*parseFloat(product.price)).toFixed(2);
        for (let a=0;a<variants.length;a++){
            let v=variants[a];
            total+=v.price;
        }
        this.currentCart.products.push({product: product,quantity: quantity,variants: variants,total: total});
        this.recalculateCartTotal();
    }

    public removeFromCart(p,idx){
        console.log("removeFromCart: "+p.product.name+"::"+idx);
        this.currentCart.products.splice(idx,1);
        this.recalculateCartTotal();
    }

    public recalculateCartTotal(){
        let total=this.currentCart.shipping;
        let tax=0;
        let discount=0;
        let cart_total=0;
        for (let a=0;a<this.currentCart.products.length;a++){
            let product=this.currentCart.products[a].product;
            let quantity=this.currentCart.products[a].quantity;
            cart_total+=parseInt(quantity)*parseFloat(product.price);
        }
        if (cart_total>0){
            //calculate discount for cart_total
            //discount=((this.currentCart.discount_percentage/cart_total)*100);
            discount=((this.currentCart.discount_percentage * cart_total)/100);
            //calculate tax for cart_total
            //tax=((this.currentCart.tax_percentage/cart_total)*100);
            tax=((this.currentCart.tax_percentage*cart_total)/100);
        }
        total+=cart_total;
        total-=discount;
        total+=tax;
        this.currentCart.cart_total=cart_total.toFixed(2);
        this.currentCart.discount=discount.toFixed(2);
        this.currentCart.tax=tax.toFixed(2);
        this.currentCart.total=total.toFixed(2);
    }

    getNewCartQuantity(quantity,type){
        if (type=='+'){
            if (quantity<20)
                quantity+=1;
        }else if (type=='-'){
            if (quantity>1)
                quantity-=1;
        }
        return quantity;
    }

    modifyCartQuantity(p,type){
        p.quantity=this.getNewCartQuantity(p.quantity,type);
        this.cartQuantityChanged(p);
    }

    cartQuantityChanged(p){
        //recalculate total
        p.total=(parseInt(p.quantity)*parseFloat(p.product.price)).toFixed(2);
        this.recalculateCartTotal();
    }
    ///cart functions end

    public static isValidEmail(email) {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    public static isValidPasswordCode(code){
        let re = /\b\d{5}\b/;
        return re.test(String(code).toLowerCase());
    }

    public changeTabsColors(background,foreground){
        this.changeTabBarColor(background,foreground);
        this.changeTabHighlightColor(background,foreground);
        setTimeout(()=>{
            this.changeTabIconsColor(background,foreground);
        },50);
    }

    public changeTabBarColor(background,foreground){
        let highlightSelector=".tabbar";
        let vals=document.querySelectorAll(highlightSelector);
        console.log(highlightSelector+": ");
        console.log(vals.length);
        for (let a=0;a<vals.length;a++){
            (<any>vals[a]).style.backgroundColor=background;
        }       
    }

    public changeTabHighlightColor(background,foreground){
        let highlightSelector=".tabs-md[tabsHighlight=true] .tab-highlight";
        let vals=document.querySelectorAll(highlightSelector);
        console.log(highlightSelector+": ");
        console.log(vals.length);
        for (let a=0;a<vals.length;a++){
            (<any>vals[a]).style.background=foreground;
        }
    }

    public changeTabIconsColor(background,foreground){
        let iconDefaultColor="#979797";
        let iconsSelector=".tab-button-icon";
        let iconActiveAttr="ng-reflect-is-active";
        let vals=document.querySelectorAll(iconsSelector);
        console.log(iconsSelector+": ");
        console.log(vals.length);
        for (let a=0;a<vals.length;a++){
            let isActive=vals[a].getAttribute(iconActiveAttr);
            if(isActive=="true"){
                (<any>vals[a]).style.color=foreground;
            }else{
                (<any>vals[a]).style.color=iconDefaultColor;
            }
        }
    }

    public changeRadioColorsDelayed(background,foreground,onlyChecked=false){
        setTimeout(()=>{
            this.changeRadioColors(background,foreground,onlyChecked);
        },100);
    }

    public changeRadioColors(background,foreground,onlyChecked=false){
        if (!onlyChecked){
            let iconsSelector=".radio-icon";
            let vals=document.querySelectorAll(iconsSelector);
            console.log(iconsSelector+": ");
            console.log(vals.length);
            for (let a=0;a<vals.length;a++){
                (<any>vals[a]).style.borderColor=foreground;
            }
        }
        let iconsSelector=".radio-checked .radio-inner";
        let vals=document.querySelectorAll(iconsSelector);
        console.log(iconsSelector+": ");
        console.log(vals.length);
        for (let a=0;a<vals.length;a++){
            (<any>vals[a]).style.backgroundColor=foreground;
        }
    }

    public setCurrency(currencyCode){
        this.currencyCode=currencyCode;
        if (currencyCode=="EUR"){
            this.currencySymbol="€";
        }else if (currencyCode=="USD"){
            this.currencySymbol="$";
        }
    }
}