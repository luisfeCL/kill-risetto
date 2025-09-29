import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

import { CustomInputStyles } from "./CustomInput.style";

@customElement( 'custom-input' )
export class CustomInput extends LitElement{

    static styles = [ CustomInputStyles ]
    
    @property() placeholder: string = 'Introduce el texto';
    @property() inputId: string = 'Introduce el texto';

    _handleInput( e: Event ){
        const input = e.target as HTMLInputElement;
        this._dispatchHasValueEvent( input.value );
    }

    _dispatchHasValueEvent( value: string){
        const options = {
            detail: value,
            bubbles: true,
            composed: true
        }

        this.dispatchEvent(new CustomEvent('onHasValue', options))
    }
    
    render(){
        return html`
            <input @input=${ this._handleInput } type="text" id=${this.inputId} placeholder=${ this.placeholder }>
        `
    }
}