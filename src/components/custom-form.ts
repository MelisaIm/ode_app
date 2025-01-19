import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("custom-form")
export class Form extends LitElement {

    handleFormSubmit(event: Event) {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const name = formData.get("name") as string;
        const inspiration = formData.get("inspiration") as string;
        console.log("Form submitted with data: ", name, inspiration);
        //TODO send data to backend and send result to output-area
    }
    
    render() {
        return html`
            <form id="ode-form" @submit=${this.handleFormSubmit}>
                <label for="name">To whom we dedicate this ode</label>
                <input type="text" id="name" name="name" placeholder="Enter name"><br><br>
                <label for="inspiration">Inspiration</label>
                <input type="text" id="inspiration" name="inspiration" placeholder="Quotes, things, places, capybaras"><br><br>
                <button type="submit">Generate poem</button>
            </form>
                `
    }
}