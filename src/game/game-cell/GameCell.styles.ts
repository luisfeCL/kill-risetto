import { css } from 'lit';

export const GameCellStyles = css`
    :host{
        .cell{
            width: var( --cell-width);
            border: var( --cell-border );
            aspect-ratio: 1/1;
            border-radius: .8rem;
            display:flex;
            align-items: center;
            justify-content: center;
            
            .mole{
                font-size: 3rem;
            }

            &:hover{
                cursor: pointer;
            }
        }

    }
`