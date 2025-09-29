import { css } from "lit";

export const CustomInputStyles = css`
    :host{
         input {
            background-color: var( --text-input-background );
            border-radius: var( --text-input-border-radius);
            border: var( --text-input-border );
            color: var(--text-input-color);
            font-size: var(--font-size);
            padding: var( --text-input-padding );

            &.rounded{
                border-radius: var( --text-input-border-radius-rounded );
            }

            &::placeholder{
                color: var( --text-input-placeholder );
            }


            }
    }
`