
import { css } from 'lit';

export const GameBoardStyles = css`
  :host{
    display:flex;
    flex-direction: column;
    justify-content:center;
    align-items:center;

    h2{
        font-size: var(--scores-font-size);
        font-family: var( --font-family );
        color: var( --color-accent );
    }

    .grid{
        min-width: var( --board-width );
        max-width: var( --board-width );
        display: grid;
        justify-items: center;
        align-items: center; 
        aspect-ratio: var(--aspect-ratio);
    }
`;