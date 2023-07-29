import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { CartViewComponent } from './cart-view/cart-view';
import { QuantityModifierComponent } from './quantity-modifier/quantity-modifier';
@NgModule({
	declarations: [CartViewComponent,QuantityModifierComponent],
	imports: [
		IonicModule,
	],
	exports: [CartViewComponent,QuantityModifierComponent]
})
export class ComponentsModule {}
