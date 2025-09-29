import { css } from "lit";

export const GamePageStyles = css`
    :host {
        background-color: var( --background-color );
        box-sizing: border-box;
        display: flex;
        height: var( --app-height );
        flex-direction:column;
        
        header{
            padding: var(--header-padding);
            box-sizing: border-box;
            background-color: var( --header-background );
            display: flex;
            justify-content: space-between;
            width: 100%;
            height: fit-content;

            .player-info{
                display: flex;
                align-items: end;
                gap: 1.6rem;
                
                span{
                    color: var( --white );
                    font-family: var( --font-family );
                    font-size: var( --title-font-size );
                }
            }

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
}
`