import { css } from "lit";

export const HomePageStyles = css`
    :host {
        align-items: center;
        background-color: var( --background-color );
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        height: var( --app-height );
        justify-content: start;
        padding: var( --app-padding );

        .registry-wrapper {
            display: flex;
            width: var( --registry-wrapper-width );
}
`