import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { GameCellStyles } from './GameCell.styles';

@customElement('game-cell')
export class GameCell extends LitElement {
    static styles = [ GameCellStyles ];

    @property({ type: Number }) cellIndex = 0;
    
    private risetto: string = '/images/risetto_50x50.png'
    private angryRisetto: string = '/images/risetto_angry_50x50.png'

    @state() active = false;
    @state() clickEffect = false;

    private _handleClick(){
        if( !this.active ) return;

        this.clickEffect = true

        dispatchEvent(new CustomEvent('mole-hit', {
            bubbles: true,
            composed: true
        }));

        setTimeout(() => {
            this.clickEffect = false;
        }, 600);
    }

    render() {
        return html`
        <div 
            @click=${this._handleClick }
            role="button"
            class="cell">
                ${
                    this.active 
                        ? html`<div class="mole">${ this.clickEffect 
                            ? html`<img src=${ this.angryRisetto }/>`
                            : html`<img src=${ this.risetto }/>`
                        }</div>` 
                        : ''
                }
        </div>
        `
    }
}