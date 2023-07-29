import { Injectable } from "@angular/core";
import { Platform } from "ionic-angular";
import { UiHelper } from "./uihelper";

@Injectable() export class StoreHelper {

    public initialized: boolean = false;
    public products:any[] = [];

    constructor(private platform: Platform,private uiHelper: UiHelper){
    }

    changeProductId(pkg){
        if (this.platform.is('android')){
            //com.footballissexy.monthlysub2
            //to com.footballissexy.monthlysub1
            if (pkg.google_product_id=="com.footballissexy.monthlysub2"){
                pkg.google_product_id="com.footballissexy.monthlysub1";
            }
            console.log(pkg);
        }
        return pkg;
    }

    init(packages,callRefresh=true){
        if (!(<any>window).cordova){
            console.error("cordova not found");
            throw new Error("Cordova not available");
            //return true;
        }
        if (!(<any>window).store){
            console.error("store object not found");
            throw new Error("store object not available");
        }
        let appStore=(<any>window).store;
        appStore.error((e)=>{
            console.error("Store error: " + JSON.stringify(e));
            if (e.message.indexOf("monthlysub1")!=-1
                || e.message.indexOf("monthlysub2")!=-1
                || e.message.indexOf("annualsub1")!=-1){
                return;
            }
            //this.showMessage("Store error: "+JSON.stringify(e));
            this.showMessage(e.message+" ("+e.code+")");
        });
        //appStore.verbosity=appStore.DEBUG;
        //this.showMessage("Verbosity set to "+appStore.verbosity);
        this.products=[];
        for (let a=0;a<packages.length;a++){
            let pkg=packages[a];
            let prd = {package: pkg,id: pkg.google_product_id,type: appStore.PAID_SUBSCRIPTION};
            this.products.push(prd);
        }
        if ((this.platform.is('ios') || this.platform.is('iphone') || this.platform.is('ipad')) && packages.length>0){
            let pkg2=JSON.parse(JSON.stringify(packages[0]));
            pkg2.id="3000";
            let prd = {package: pkg2,id: "com.footballissexy.monthlysub1",type: appStore.PAID_SUBSCRIPTION};
            this.products.push(prd);
        }
        //this.showMessage("Registering products...");
        console.log("registering products...");
        this.registerProducts(appStore);
        //this.showMessage("products registered");
        console.log("products registered");
        if (callRefresh){
            console.log("refreshing store...");
            //this.showMessage("refreshing store...");
            let storeRefresh=appStore.refresh();
            //this.showMessage("refresh called");
            storeRefresh.finished(()=>{
                console.log("Store refresh finished");
                //alert("Store refresh finished");
                //this.showMessage("storeRefresh.finished");
            });
            storeRefresh.completed(()=>{
                console.log("Store refresh completed");
                //this.showMessage("storeRefresh.completed");
                this.initialized=true;
                //alert("Store refresh completed");
            });
            storeRefresh.cancelled(()=>{
                console.log("Store refresh cancelled");
                //this.showMessage("storeRefresh.cancelled");
            });
            storeRefresh.failed(()=>{
                console.log("Store refresh failed");
                //this.showMessage("storeRefresh.failed");
            });
            console.log("store refreshed");
            //this.initialized=true;
            //console.log("store initialized");
        }
        return true;
    }

    private registerProducts(appStore){
        for (let a=0;a<this.products.length;a++){
            let prd=this.products[a];
            console.log("registering: "+prd.id);
            appStore.register({
                id: prd.id,
                type: prd.type
            });
            console.log(prd.id+" registered");
            //this.showMessage(prd.id+" registered");
        }
    }

    public purchasePackage(pkg,successCb,errorCb){
        console.log("purchasePackage:");
        console.log(pkg);
        this.startPurchase(pkg.google_product_id,successCb,errorCb);
    }

    public startPurchase(productId,successCb,errorCb){
        if (!(<any>window).store){
            throw new Error("store object not found");
        }
        let appStore=(<any>window).store;
        appStore.once(productId).updated((product)=>{
            console.log("updated: "+product.id);
            //console.log(product);
        });
        appStore.once(productId).approved((product)=>{
            console.log("approved: "+product.id);
            //console.log(product);
            try{
                product.finish();
                console.log("finish called");
            }catch(e){
                console.error("Exception in finish: "+e.message);
                if (errorCb!=null)
                    errorCb("Exception in product.finish: "+e.message);
            }
        });
        appStore.once(productId).owned((product)=>{
            console.log("owned: "+product.id);
            //console.log(product);
            if (successCb!=null)
                successCb(product);
        });
        appStore.once(productId).cancelled((product)=>{
            console.error("cancelled: "+product.id);
            //console.error(product);
            if (errorCb!=null)
                errorCb("cancelled");
        });
        appStore.once(productId).error((err)=>{
            console.error("error:");
            console.error(err);
            if (errorCb!=null)
                errorCb(JSON.stringify(err));
        });
        appStore.order(productId);
    }

    public getProduct(id){
        let appStore=(<any>window).store;
        return appStore.get(id);
    }

    private showMessage(msg){
        this.uiHelper.showMessageBox("Store",msg);
        //alert("Store message::"+msg);
    }

    public removeProductCallbacks(productId){
        // let appStore=(<any>window).store;
        // appStore.once(productId).updated((product)=>{
        //     console.log("updated:");
        //     console.log(JSON.stringify(product));
        // });
        // appStore.once(productId).approved((product)=>{
        //     console.log("approved:");
        //     console.log(JSON.stringify(product));
        // });
        // appStore.once(productId).owned((product)=>{
        //     console.log("owned:");
        //     console.log(JSON.stringify(product));
        // });
        // appStore.once(productId).cancelled((product)=>{
        //     console.error("cancelled:");
        //     console.log(JSON.stringify(product));
        // });
        // appStore.once(productId).error((err)=>{
        //     console.error("error:");
        //     console.error(JSON.stringify(err));
        // });
    }

    public addProductCallbacks(productId,cb){
        let appStore=(<any>window).store;
        appStore.once(productId).updated((product)=>{
            console.log("updated: "+product.id);
            //console.log(JSON.stringify(product));
            cb("updated",product);
        });
        appStore.once(productId).approved((product)=>{
            console.log("approved: "+product.id);
            //console.log(JSON.stringify(product));
            cb("approved",product);
        });
        appStore.once(productId).owned((product)=>{
            console.log("owned: "+product.id);
            //console.log(JSON.stringify(product));
            cb("owned",product);
        });
        appStore.once(productId).cancelled((product)=>{
            console.error("cancelled: "+product.id);
            //console.log(JSON.stringify(product));
            cb("cancelled",product);
        });
        appStore.once(productId).error((err)=>{
            console.error("error:");
            console.error(JSON.stringify(err));
            cb("error",err);
        });
    }
}