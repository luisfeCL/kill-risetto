import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { CustomSelectStyles } from "./CustomSelect.styles";
import { capitalize } from "../../../helpers/string.helper";

interface SelectOption {
  value: string;
  label: string;
}

@customElement('custom-select')
export class CustomSelect extends LitElement {
    static styles = [CustomSelectStyles];

    @property({ type: String }) value = '';
    @property({ type: String }) name = '';
    @property({ type: String }) id = '';
    @property({ type: String }) label = 'Select an option';
    @property({ type: Array }) options: SelectOption[] = [];

    private _handleChange(e: Event) {
        const select = e.target as HTMLSelectElement;
        this.value = select.value;
    
        this.dispatchEvent(new CustomEvent('value-selected', {
            detail: { value: this.value },
            bubbles: true,
            composed: true
        }));
    }
    
    render() {
        return html`
            <form class="selector" action="#">
                <label for=${ this.id }>${ this.label }</label>
                <select @change=${ this._handleChange } name=${ this.name } id=${ this.id }>
                    ${this.options.map(option => 
                        html`<option value=${ option.value } ?selected=${ this.value === option.value }>
                            ${ capitalize( option.label ) }
                        </option>`
                    )}
                </select>
            </form>
        `;
    }
}