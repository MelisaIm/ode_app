import { LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

/**
 * Ode app landing page.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('landing-page')
export class LandingPage extends LitElement {
  @state() 
  private theme: string = 'light';

  @state()
  private loggedIn: boolean = false;

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('theme-toggle', this.toggleTheme);
  }

  disconnectedCallback() {
    this.removeEventListener('theme-toggle', this.toggleTheme);
    super.disconnectedCallback();
  }

  render() {
    return html`
        <slot name="siso"></slot>
        <theme-controls class="theme-toggle" .theme=${this.theme}></theme-controls>
          <div class="brand">
            <img class="logo" src="/ode_logo.png" alt="Ode logo" width="100">
            <h1>Welcome to Ode</h1>
          </div>
          <h3>Start the year with the ${this.theme === 'light' ? 'right' : 'some bad'} vibes, message and intention. Write an ode to your ${this.theme === 'light' ? 'best' : 'worst'} self.</h3>
        <slot name="input"></slot>
        <slot name="output"></slot>
    `
  }

  toggleTheme(event: Event) {
    event?.stopPropagation();
    this.theme = this.theme === 'light' ? 'dark' : 'light';
  }

  static styles = css`
    :host {
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
      height: 100vh;
    }

    .brand {
      display: flex;
      align-items: center;  
    }
    
    h3 {
      margin-top: 0;
    }

    .theme-toggle {
      position: absolute;
      right: 100px;
    }

    .logo {
      height: 6em;
      padding: 1.5em;
      will-change: filter;
      transition: filter 300ms;
    }
    .logo:hover {
      filter: drop-shadow(0 0 2em #646cffaa);
    }
    .logo.lit:hover {
      filter: drop-shadow(0 0 2em #325cffaa);
    }

    .grid-container {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: auto auto;
      gap: 1rem;
      align-items: center;
      justify-items: start;
    }

    .card {
      padding: 2em;
    }

    .read-the-docs {
      color: #888;
    }

    ::slotted(h1) {
      font-size: 3.2em;
      line-height: 1.1;
    }

    a {
      font-weight: 500;
      color: #646cff;
      text-decoration: inherit;
    }
    a:hover {
      color: #535bf2;
    }

    button {
      border-radius: 8px;
      border: 1px solid transparent;
      padding: 0.6em 1.2em;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      background-color: #1a1a1a;
      cursor: pointer;
      transition: border-color 0.25s;
    }
    button:hover {
      border-color: #646cff;
    }
    button:focus,
    button:focus-visible {
      outline: 4px auto -webkit-focus-ring-color;
    }

    @media (prefers-color-scheme: light) {
      a:hover {
        color: #747bff;
      }
      button {
        background-color: #f9f9f9;
      }
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'landing-page': LandingPage
  }
}
