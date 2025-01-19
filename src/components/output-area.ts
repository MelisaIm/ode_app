import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("output-area")
export class OutputArea extends LitElement {
    render() {
        return html`
            <div>
                <h2>Your ode</h2>
                <p>Here is your ode:</p>
                <p id="output"></p>
            </div>
        `
    }
}