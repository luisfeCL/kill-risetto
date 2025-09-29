import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { CustomButtonStyles } from "./CustomButton.styles";

@customElement('custom-button')
export class CustomButton extends LitElement {

    static styles = [ CustomButtonStyles ];

    @property() label: string = 'Click me!';
    @property({ type: Boolean }) disabled: boolean = false;
    @property({ type: Boolean }) rounded: boolean = false;

    render() {
        return html`
            <button class=${ this.rounded ? 'rounded' : '' } 
                    ?disabled=${this.disabled}
                    >
                    ${this.label}
            </button>
        `;
    }
}