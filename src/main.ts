import { LitElement, html} from 'lit';
import { customElement } from 'lit/decorators.js';
import { initRouter } from './router/router';

import { styles } from './styles';

@customElement('my-app')
export class MyApp extends LitElement {
    static styles =[ styles ]

    private outlet: string = 'outlet'

    firstUpdated() {
        const outlet = this.shadowRoot?.getElementById(this.outlet);
        if ( outlet ) {
        initRouter( outlet );
        }
    }

    render() {
        return html`

        <main>
            <div id=${ this.outlet }></div>
        </main>
        `;
    }
}