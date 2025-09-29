import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { GameCellStyles } from './GameCell.styles';

@customElement('game-cell')
export class GameCell extends LitElement {
    static styles = [ GameCellStyles ];

    @property({ type: Number }) cellIndex = 0;

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
                        ? html`<div class="mole">${this.clickEffect ? '💥' : '🐹'}</div>` 
                        : ''
                }
        </div>
        `
    }
}