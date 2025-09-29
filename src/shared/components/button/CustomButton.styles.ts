import { css } from "lit";

export const CustomButtonStyles = css`
    :host{
        button {
             background-color: var( --button-background );
             border-radius: var( --button-border-radius );
             border: var( --button-border );
             color: var( --button-color );
             font-size: var( --font-size );
             padding: var( --button-padding );
             width: fit-content;
        
             &.rounded{
                 border-radius: var( --button-border-radius-rounded );
             }
         }
        }
    }
`

