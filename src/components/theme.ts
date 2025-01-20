import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('theme-controls')
export class ThemeControls extends LitElement {
    @property({ type: String, reflect: true }) 
    theme: string = 'light';

    heartIcon() {
        return html`<img class="icon" src="/like.png"></img>`
    }

    skullIcon() {
        return html`<img class="icon" src="/human-skull.png"></img>`
    }

    render() {
        return html`
        <div class="theme-controls">
            <button @click=${this.changeTheme}>
                <span>
                    ${this.theme === 'light' ? this.heartIcon() : this.skullIcon()}
                     Toggle to ${this.theme === 'light' ? 'dark' : 'light'}
                </span>
            </button>
        </div>
        `
    }
    
    changeTheme() {
        document.body.classList.toggle('dark-theme')
        this.dispatchEvent(new CustomEvent('theme-toggle', {bubbles: true, composed: true}))
    }
    
    static styles = css`
        .theme-controls {
            display: flex;
            flex-direction: row-reverse;
            padding: 1rem;
        }

        span {
            display: flex;
        }

        .icon {
            height: 16px;
            width: 16px;
            margin-right: 3px;
        }

        button {
            border-radius: 5px;
            cursor: pointer;
            padding: 8px;
        }
    `
}