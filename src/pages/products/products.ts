import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { AppGlobals } from '../../services/appglobals';
import { AppServer } from '../../services/appserver';
import { UiHelper } from '../../services/uihelper';
import { MyCartPage } from '../my-cart/my-cart';
import { ProductDetailPage } from '../product-detail/product-detail';

@Component({
    selector: 'page-products',
    templateUrl: 'products.html',
})
export class ProductsPage {

    location: any = {};
    categories: any[]=[];
    allSubCategories: any[]=[];
    subCategories: any[]=[];
    allProducts: any[]=[];
    products: any[]=[];
    loading: boolean = false;
    showCart: boolean = false;
    totalAmount: string = '';
    searchText: string = '';
    
    selectedCategory: any = null;
    selectedSubCategory: any = null;

    constructor(public navCtrl: NavController,public viewCtrl: ViewController, public navParams: NavParams,public server: AppServer,public uiHelper: UiHelper,public globals: AppGlobals) {
        this.location=this.navParams.get('location');
    }

    ionViewDidLoad() {
        this.loadData();
    }

    ionViewDidEnter() {
        this.calculateTotalAmount();
        this.showCart=this.globals.currentCart.cart_total>0;
    }

    calculateTotalAmount(){
        let val=parseFloat(this.globals.currentCart.cart_total);
        this.totalAmount=val.toFixed(2);
    }

    loadData(){
        console.log("loadData");
        let loginData={user_id: this.globals.currentUser.id,company_id: this.location.company_id};
        console.log(loginData);
        this.loading=true;
        this.server.getCategories(loginData).subscribe((data:any)=>{
            this.loading=false;
            console.log(data);
            if (data.status==200){
                this.categories=[];
                this.allSubCategories=[];
                this.subCategories=[];

                let categories=data.categories;
                let subCategories=data.sub_categories;

                for (let a=0;a<categories.length;a++){
                    let cat=categories[a];
                    cat.selected=false;
                    this.categories.push(cat);
                }
                for (let a=0;a<subCategories.length;a++){
                    let cat=subCategories[a];
                    this.allSubCategories.push(cat);
                }
                if (this.categories.length>0){
                    this.categories[0].selected=true;
                    this.selectedCategory=this.categories[0];
                    this.categoryChanged();
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

    loadProducts(){
        console.log("loadProducts");
        if (this.selectedCategory==null){
            console.error("category is null");
            return;
        }
        if (this.selectedSubCategory==null){
            console.error("subcategory is null");
            return;
        }
        let categoryId=this.selectedCategory.category_id;
        let subCategoryId=this.selectedSubCategory.sub_id;
        let loginData={user_id: this.globals.currentUser.id,company_id: this.location.company_id,category_id: categoryId,sub_category_id: subCategoryId};
        console.log(loginData);
        this.loading=true;
        this.server.getProducts(loginData).subscribe((data:any)=>{
            this.loading=false;
            console.log(data);
            if (data.status==200){
                this.products=[];
                this.allProducts=[];
                let products=data.products;
                for (let a=0;a<products.length;a++){
                    let p=products[a];
                    p.price=p.product_price;
                    p.tags=this.selectedCategory.category_name+", "+this.selectedSubCategory.sub_category_name;
                    if (a==1){
                        //p.disabled="1";
                    }
                    p.out_of_stock=false;
                    p.can_buy=true;
                    if (p.disabled=="1"){
                        p.out_of_stock=true;
                        p.can_buy=false;
                    }
                    this.allProducts.push(p);
                    this.products.push(p);
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

    categoryClick(cat){
        console.log("categoryClick: "+cat.category_name);
        if (this.selectedCategory!=null && this.selectedCategory.category_id==cat.category_id){
            return;
        }
        for (let a=0;a<this.categories.length;a++){
            this.categories[a].selected=false;
        }
        cat.selected=true;
        this.selectedCategory=cat;
        this.categoryChanged();
    }

    subCategoryClick(cat){
        console.log("subCategoryClick: "+cat.sub_category_name);
        for (let a=0;a<this.subCategories.length;a++){
            this.subCategories[a].selected=false;
        }
        cat.selected=true;
        this.selectedSubCategory=cat;
        this.products=[];
        this.loadProducts();
    }

    categoryChanged(){
        console.log("categoryChanged: "+this.selectedCategory.category_name);
        this.products=[];
        this.subCategories=[];
        for (let a=0;a<this.allSubCategories.length;a++){
            let cat=this.allSubCategories[a];
            cat.selected=false;
            if (cat.category_id==this.selectedCategory.category_id){
                this.subCategories.push(cat);
            }
        }
        if (this.subCategories.length>0){
            this.subCategories[0].selected=true;
            this.selectedSubCategory=this.subCategories[0];
            this.loadProducts();
        }
    }

    productClick(p){
        console.log("productClick: "+p.product_name);
        if (p.out_of_stock){
            return;
        }
        this.navCtrl.push(ProductDetailPage,{product: p});
    }

    viewCartClick(){
        console.log("viewCartClick");
        this.navCtrl.push(MyCartPage,{location: this.location});
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

    searchChanged(){
        //console.log("searchChanged: "+this.searchText);
        this.products=[];
        let sText=this.searchText.toLowerCase().trim();
        for (let a=0;a<this.allProducts.length;a++){
            let p=this.allProducts[a];
            if (sText=="" || p.product_name.toLowerCase().indexOf(sText)!=-1){
                this.products.push(p);
            }
        }
    }
}
