import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class AppServer {
    
    //private BASE_URL="http://localhost:9100/doono/api/";
    private BASE_URL="https://rewardloyalty.eu/api/";
    
    constructor (private http: HttpClient) {}

    login(loginData) {
    	console.log("login");
        let bodyString = "email="+encodeURIComponent(loginData.email);
        bodyString+="&password="+encodeURIComponent(loginData.password);
        console.log(bodyString);
        let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
        let options = { headers: headers };
        let url=this.BASE_URL+"login.php";
        return this.http.post(url, bodyString, options);
    }

    checkRegisterEmail(loginData) {
    	console.log("register");
        let bodyString = "email="+encodeURIComponent(loginData.email);
        console.log(bodyString);
        let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
        let options = { headers: headers };
        let url=this.BASE_URL+"check_register_email.php";
        return this.http.post(url, bodyString, options);
    }

    register(loginData) {
    	console.log("register");
        let bodyString = "email="+encodeURIComponent(loginData.email);
        bodyString+="&password="+encodeURIComponent(loginData.password);
        bodyString+="&name="+encodeURIComponent(loginData.name);
        bodyString+="&phone="+encodeURIComponent(loginData.phone);
        bodyString+="&birthday="+encodeURIComponent(loginData.birthday);
        bodyString+="&refer_code="+encodeURIComponent(loginData.refer_code);
        console.log(bodyString);
        let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
        let options = { headers: headers };
        let url=this.BASE_URL+"register.php";
        return this.http.post(url, bodyString, options);
    }

    forgotPassword(loginData) {
    	console.log("forgotPassword");
        let bodyString = "email="+encodeURIComponent(loginData.email);
        console.log(bodyString);
        let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
        let options = { headers: headers };
        let url=this.BASE_URL+"forgot_password.php";
        return this.http.post(url, bodyString, options);
    }

    verifyCode(loginData) {
    	console.log("verifyCode");
        let bodyString = "code="+encodeURI(loginData.code);
        bodyString+="&user_id="+encodeURI(loginData.user_id);
        console.log(bodyString);
        let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
        let options = { headers: headers };
        let url=this.BASE_URL+"verify_code.php";
        return this.http.post(url, bodyString, options);
    }

    resetPassword(loginData) {
    	console.log("resetPassword");
        let bodyString = "user_id="+encodeURI(loginData.user_id);
        bodyString+="&password="+encodeURIComponent(loginData.password);
        console.log(bodyString);
        let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
        let options = { headers: headers };
        let url=this.BASE_URL+"reset_password.php";
        return this.http.post(url, bodyString, options);
    }

    savePushToken(loginData) {
    	console.log("savePushToken");
        let bodyString = "user_id="+encodeURI(loginData.user_id);
        bodyString+="&token="+encodeURI(loginData.token);
        console.log(bodyString);
        let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
        let options = { headers: headers };
        let url=this.BASE_URL+"save_push_token.php";
        return this.http.post(url, bodyString, options);
    }

    deleteAccount(loginData) {
    	console.log("deleteAccount");
        let bodyString = "user_id="+encodeURI(loginData.user_id);
        console.log(bodyString);
        let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
        let options = { headers: headers };
        let url=this.BASE_URL+"delete_account.php";
        return this.http.post(url, bodyString, options);
    }

    updateProfile(loginData) {
    	console.log("updateProfile");
        let bodyString = "email="+encodeURIComponent(loginData.email);
        bodyString+="&name="+encodeURIComponent(loginData.name);
        bodyString+="&phone="+encodeURIComponent(loginData.phone);
        bodyString+="&birthday="+encodeURIComponent(loginData.birthday);
        bodyString+="&user_id="+encodeURI(loginData.user_id);
        console.log(bodyString);
        let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
        let options = { headers: headers };
        let url=this.BASE_URL+"update_profile.php";
        return this.http.post(url, bodyString, options);
    }

    updatePassword(loginData) {
    	console.log("updatePassword");
        let bodyString = "new_password="+encodeURIComponent(loginData.new_password);
        bodyString+="&old_password="+encodeURIComponent(loginData.old_password);
        bodyString+="&user_id="+encodeURI(loginData.user_id);
        console.log(bodyString);
        let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
        let options = { headers: headers };
        let url=this.BASE_URL+"update_password.php";
        return this.http.post(url, bodyString, options);
    }

    getHome(loginData) {
    	console.log("getHome");
        let headers = { };
        let options = { headers: headers };
        let url=this.BASE_URL+"get_home.php?user_id="+encodeURI(loginData.user_id);
        console.log(url);
        return this.http.get(url, options);
    }

    getLocations(loginData) {
    	console.log("getLocations");
        let headers = { };
        let options = { headers: headers };
        let url=this.BASE_URL+"get_locations.php?user_id="+encodeURI(loginData.user_id);
        url+="&address_id="+encodeURI(loginData.address_id);
        url+="&latitude="+encodeURI(loginData.latitude);
        url+="&longitude="+encodeURI(loginData.longitude);
        console.log(url);
        return this.http.get(url, options);
    }

    getMyPoints(loginData) {
    	console.log("getMyPoints");
        let headers = { };
        let options = { headers: headers };
        let url=this.BASE_URL+"get_my_points.php?user_id="+encodeURI(loginData.user_id);
        console.log(url);
        return this.http.get(url, options);
    }

    getRewards(loginData) {
    	console.log("getRewards");
        let headers = { };
        let options = { headers: headers };
        let url=this.BASE_URL+"get_rewards.php?user_id="+encodeURI(loginData.user_id);
        url+="&company_id="+encodeURI(loginData.company_id);
        console.log(url);
        return this.http.get(url, options);
    }

    getOffers(loginData) {
    	console.log("getOffers");
        let headers = { };
        let options = { headers: headers };
        let url=this.BASE_URL+"get_offers.php?company_id="+encodeURI(loginData.company_id);
        console.log(url);
        return this.http.get(url, options);
    }

    getCategories(loginData) {
    	console.log("getCategories");
        let headers = { };
        let options = { headers: headers };
        let url=this.BASE_URL+"get_categories.php?user_id="+encodeURI(loginData.user_id);
        url+="&company_id="+encodeURI(loginData.company_id);
        console.log(url);
        return this.http.get(url, options);
    }

    getProducts(loginData) {
    	console.log("getProducts");
        let headers = { };
        let options = { headers: headers };
        let url=this.BASE_URL+"get_products.php?user_id="+encodeURI(loginData.user_id);
        url+="&company_id="+encodeURI(loginData.company_id);
        url+="&category_id="+encodeURI(loginData.category_id);
        url+="&sub_category_id="+encodeURI(loginData.sub_category_id);
        console.log(url);
        return this.http.get(url, options);
    }

    getProductDetails(loginData) {
    	console.log("getProductDetails");
        let headers = { };
        let options = { headers: headers };
        let url=this.BASE_URL+"get_product_details.php?user_id="+encodeURI(loginData.user_id);
        url+="&product_id="+encodeURI(loginData.product_id);
        console.log(url);
        return this.http.get(url, options);
    }

    getClientData(loginData) {
    	console.log("getClientData");
        let headers = { };
        let options = { headers: headers };
        let url=this.BASE_URL+"get_client_data.php?user_id="+encodeURI(loginData.user_id);
        console.log(url);
        return this.http.get(url, options);
    }

    saveCard(loginData) {
    	console.log("saveCard");
        let bodyString = "user_id="+encodeURI(loginData.user_id);
        bodyString+="&name="+encodeURI(loginData.name);
        bodyString+="&card_number="+encodeURI(loginData.card_number);
        bodyString+="&expiry="+encodeURI(loginData.expiry);
        bodyString+="&cvc="+encodeURI(loginData.cvc);
        console.log(bodyString);
        let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
        let options = { headers: headers };
        let url=this.BASE_URL+"save_card.php";
        return this.http.post(url, bodyString, options);
    }

    saveAddress(loginData) {
    	console.log("saveAddress");
        let bodyString = "user_id="+encodeURI(loginData.user_id);
        bodyString+="&name="+encodeURI(loginData.name);
        bodyString+="&full_address="+encodeURI(loginData.full_address);
        bodyString+="&latitude="+encodeURI(loginData.latitude);
        bodyString+="&longitude="+encodeURI(loginData.longitude);
        console.log(bodyString);
        let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
        let options = { headers: headers };
        let url=this.BASE_URL+"save_address.php";
        return this.http.post(url, bodyString, options);
    }

    saveOrder(loginData) {
    	console.log("saveOrder");
        let bodyString = "user_id="+encodeURI(loginData.user_id);
        bodyString+="&address="+encodeURI(loginData.address);
        bodyString+="&total="+encodeURI(loginData.total);
        bodyString+="&cart_total="+encodeURI(loginData.cart_total);
        bodyString+="&tax_percentage="+encodeURI(loginData.tax_percentage);
        bodyString+="&tax="+encodeURI(loginData.tax);
        bodyString+="&discount_percentage="+encodeURI(loginData.discount_percentage);
        bodyString+="&discount="+encodeURI(loginData.discount);
        bodyString+="&payment_mode="+encodeURI(loginData.payment_mode);
        bodyString+="&order_type="+encodeURI(loginData.order_type);
        bodyString+="&card_id="+encodeURI(loginData.card_id);
        bodyString+="&products="+encodeURI(JSON.stringify(loginData.products));
        bodyString+="&branch_id="+encodeURI(loginData.branch_id);
        bodyString+="&pickup_dt="+encodeURI(loginData.pickup_dt);
        console.log(bodyString);
        let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
        let options = { headers: headers };
        let url=this.BASE_URL+"save_order.php";
        return this.http.post(url, bodyString, options);
    }

    getMyOrders(loginData) {
    	console.log("getMyOrders");
        let headers = { };
        let options = { headers: headers };
        let url=this.BASE_URL+"get_orders.php?user_id="+encodeURI(loginData.user_id);
        console.log(url);
        return this.http.get(url, options);
    }

    getOrderProducts(loginData) {
    	console.log("getOrderProducts");
        let headers = { };
        let options = { headers: headers };
        let url=this.BASE_URL+"get_order_products.php?user_id="+encodeURI(loginData.user_id);
        url+="&order_id="+encodeURI(loginData.order_id);
        console.log(url);
        return this.http.get(url, options);
    }

    referFriends(loginData) {
    	console.log("referFriends");
        let bodyString = "user_id="+encodeURI(loginData.user_id);
        bodyString+="&friends="+encodeURI(JSON.stringify(loginData.friends));
        console.log(bodyString);
        let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
        let options = { headers: headers };
        let url=this.BASE_URL+"refer_friends.php";
        return this.http.post(url, bodyString, options);
    }

    saveAppointment(loginData) {
    	console.log("saveAppointment");
        let bodyString = "user_id="+encodeURIComponent(loginData.user_id);
        bodyString+="&provider_id="+encodeURIComponent(loginData.provider_id);
        bodyString+="&date_time="+encodeURIComponent(loginData.date_time);
        bodyString+="&duration="+encodeURIComponent(loginData.duration);
        bodyString+="&notes="+encodeURIComponent(loginData.notes);
        console.log(bodyString);
        let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
        let options = { headers: headers };
        let url=this.BASE_URL+"save_appointment.php";
        return this.http.post(url, bodyString, options);
    }

    getAddressInfo(addr,apiKey){
        console.log("getAddressInfo");
        let url="http://maps.googleapis.com/maps/api/geocode/json?address="+encodeURI(addr)+"&key="+apiKey;
        console.log(url);
        return this.http.get(url);
    }

    getLatLngInfo(addr,apiKey){
        console.log("getLatLngInfo");
        let url="https://maps.googleapis.com/maps/api/geocode/json?latlng="+addr.lat+","+addr.lng+"&key="+apiKey;
        console.log(url);
        return this.http.get(url);
    }

}