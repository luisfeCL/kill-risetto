import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";

import { HomePageStyles } from "./home-page.styles";

import '../../shared/components/input/CustomInput'
import '../../shared/components/button/CustomButton'
import UserService from "../../services/user/user-data.service";
import { Router } from "@vaadin/router";

@customElement( 'home-page' )
export class HomePage extends LitElement{

    static styles = [ HomePageStyles ]
      private _name: string | undefined = undefined;

    @state() private disabled = true;

    private _handleInput = (e: Event) => {
        const customEvent = e as CustomEvent<string>;
        this.disabled = customEvent.detail.length === 0;
        this._name = customEvent.detail;
    }

    private _handleClick(){ 
        if( this._name ){ 
            UserService.createUser( this._name );
            Router.go('/game-page');
        }
    }

    connectedCallback(): void {
        super.connectedCallback();
        this._addListeners();
    }

    render()  {
        return html`
            <img width='400' src="/images/logo.png">
            <section class="registry-wrapper">
                <custom-input placeholder='Introduce tu nombre' inputId='custominput' ></custom-input>
                <custom-button 
                rounded
                @click=${ this._handleClick } 
                ?disabled=${ this.disabled } 
                label="Join"></custom-button>
            </section>
        `
    }

        disconnectedCallback(): void {
        super.disconnectedCallback();
        this._removeListeners()
    }

    private _addListeners(){
        this.addEventListener('onHasValue', this._handleInput );
    }

    private _removeListeners(){
        this.removeEventListener('onHasValue', this._handleInput );
    }
}