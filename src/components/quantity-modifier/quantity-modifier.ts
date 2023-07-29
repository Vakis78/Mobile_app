import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AppGlobals } from '../../services/appglobals';

@Component({
    selector: 'quantity-modifier',
    templateUrl: 'quantity-modifier.html'
})
export class QuantityModifierComponent {

    @Input('quantity') quantity: number = 1;
    @Output() public quantityChange: EventEmitter<any> = new EventEmitter<any>();
    
    constructor(private globals: AppGlobals) {
    }

    modifyQuantity(type){
        console.log("modifyQuantity: "+type);
        this.quantity=this.globals.getNewCartQuantity(this.quantity,type);
        //output quantity changed event
        this.quantityChange.emit(this.quantity);
    }
}
