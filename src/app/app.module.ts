import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SplashPage } from '../pages/splash/splash';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { AppGlobals } from '../services/appglobals';
import { AppServer } from '../services/appserver';
import { UiHelper } from '../services/uihelper';
import { DateHelper } from '../services/date-helper';
import { FirebaseHelper } from '../services/firebase-helper';
import { HtmlHelper } from '../services/html-helper';
import { StoreHelper } from '../services/store-helper';
import { AppStorage } from '../services/appstorage';
import { HttpClientModule } from '@angular/common/http';
import { LocationsPage } from '../pages/locations/locations';
import { ProductsPage } from '../pages/products/products';
import { MyPointsPage } from '../pages/my-points/my-points';
import { RewardsPage } from '../pages/rewards/rewards';
import { ProductDetailPage } from '../pages/product-detail/product-detail';
import { MyCartPage } from '../pages/my-cart/my-cart';
import { PaymentMethodPage } from '../pages/payment-method/payment-method';
import { ProfilePage } from '../pages/profile/profile';
import { CardsPage } from '../pages/profile/cards/cards';
import { SelectPinPage } from '../pages/select-pin/select-pin';
import { AddressesPage } from '../pages/profile/addresses/addresses';
import { DeliveryPage } from '../pages/delivery/delivery';
import { Geolocation } from '@ionic-native/geolocation';
import { ReferFriendPage } from '../pages/refer-friend/refer-friend';
import { MyOrdersPage } from '../pages/my-orders/my-orders';
import { OrderProductsPage } from '../pages/order-products/order-products';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { OffersPage } from '../pages/offers/offers';
import { OfferDetailPage } from '../pages/offer-detail/offer-detail';
import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';
import { LandingPage } from '../pages/landing/landing';
import { HomeLandingPage } from '../pages/home-landing/home-landing';
import { ComponentsModule } from '../components/components.module';
import { PersonalDetailsPage } from '../pages/personal-details/personal-details';
import { SlidesPage } from '../pages/slides/slides';
import { PreLoginPage } from '../pages/pre-login/pre-login';
import { StaticContentPage } from '../pages/static-content/static-content';
import { TrackOrderPage } from '../pages/track-order/track-order';
import { ChatPage } from '../pages/chat/chat';

@NgModule({
  declarations: [
    MyApp,
    SplashPage,
    SlidesPage,
    PreLoginPage,
    LoginPage,
    ForgotPasswordPage,
    RegisterPage,
    LandingPage,
    HomeLandingPage,
    HomePage,
    ProfilePage,
    CardsPage,
    AddressesPage,
    SelectPinPage,
    LocationsPage,
    DeliveryPage,
    ProductsPage,
    ProductDetailPage,
    MyCartPage,
    PaymentMethodPage,
    MyPointsPage,
    RewardsPage,
    ReferFriendPage,
    MyOrdersPage,
    PersonalDetailsPage,
    EditProfilePage,
    OrderProductsPage,
    OffersPage,
    OfferDetailPage,
    StaticContentPage,
    TrackOrderPage,
    ChatPage,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ComponentsModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SplashPage,
    SlidesPage,
    PreLoginPage,
    LoginPage,
    ForgotPasswordPage,
    RegisterPage,
    LandingPage,
    HomeLandingPage,
    HomePage,
    ProfilePage,
    CardsPage,
    AddressesPage,
    SelectPinPage,
    LocationsPage,
    DeliveryPage,
    ProductsPage,
    ProductDetailPage,
    MyCartPage,
    PaymentMethodPage,
    MyPointsPage,
    RewardsPage,
    ReferFriendPage,
    MyOrdersPage,
    PersonalDetailsPage,
    EditProfilePage,
    OrderProductsPage,
    OffersPage,
    OfferDetailPage,
    StaticContentPage,
    TrackOrderPage,
    ChatPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    AppGlobals,AppServer,UiHelper,DateHelper,FirebaseHelper,HtmlHelper,StoreHelper,AppStorage,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
