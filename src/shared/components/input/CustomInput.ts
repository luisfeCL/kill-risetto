import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

import { CustomInputStyles } from "./CustomInput.style";

@customElement( 'custom-input' )
export class CustomInput extends LitElement{

    static styles = [ CustomInputStyles ]

    private onValueEvent: string = 'onHasValue';
    private defaultType: string = 'text';
    private defaultId: string = '';
    private defaultPlaceholder: string = 'Your text!'

    @property() placeholder: string = this.defaultPlaceholder;
    @property() inputId: string = this.defaultId;
    @property() type: string = this.defaultType;

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

        this.dispatchEvent(new CustomEvent(this.onValueEvent, options))
    }
    
    render(){
        return html`
            <input @input=${ this._handleInput } type=${ this.type } id=${this.inputId} placeholder=${ this.placeholder }>
        `
    }
}