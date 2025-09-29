import { css } from "lit";

export const CustomSelectStyles = css`
    :host{
     .selector{
        display: flex;
        align-items: end;
        gap: 1rem;
        font-family: var( --font-family );
        color: var( --white );
        font-size: var( --font-size);
            
            select{
                background-color: var( --select-background );
                border: none;
                font-size: var( --font-size);
                color: var( --white );
                border-bottom: 1px solid var( --white );

                option{
                    background-color: var( --color-primary );
                    color: var( --black );
                }
            }
        }       
    }
`