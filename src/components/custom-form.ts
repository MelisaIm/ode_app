import { LitElement, css, html, nothing } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import DOMPurify from "dompurify";

@customElement("custom-form")
export class Form extends LitElement {
    @state() 
    name = "";

    @state()
    inspirationsCount = 1;

    @property({ type: String })
    theme = "light";

    @state()
    submitEnabled = false;

    @state()
    addEnabled = false;

    @query('#ode-form')
    form!: HTMLFormElement;

    async handleFormSubmit(event: Event) {
        event.preventDefault();
        const endpoint = import.meta.env.VITE_API_ENDPOINT || "http://localhost:5001";
        const formData = new FormData(event.target as HTMLFormElement);
        const name = DOMPurify.sanitize(formData.get("name") as string);
        const inspirations = [];
        for (let i=0; i < this.inspirationsCount; i++) {
            const inspiration = DOMPurify.sanitize(formData.get(`inspiration${i}`) as string);
            if (inspiration) {
                inspirations.push(inspiration);
            }
        }
        this.name = name;
        const prompt = "Write me a short 3-4 stanza poem based on this inspiration: " + inspirations.join(", ");
        const path = this.theme === "light" ? "/optimist_query" : "/negative_query";
        try {
            this.dispatchEvent(new CustomEvent("generating-content", {bubbles: true, composed: true}));
            // Simulate loading time
            await new Promise(resolve => setTimeout(resolve, 2000));
            const response = await fetch(endpoint + path, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({prompt})
            });
            if (!response.ok) {
                throw new Error("Failed to generate poem");
            }
            const result = await response.json();
            this.dispatchEvent(new CustomEvent("content-loaded", {detail: {
                name: this.name,
                output: result.content
            }, bubbles: true, composed: true}));
            this.form.reset();
            console.log(result);
        } catch(error) {
            console.error(error);
        }
    }

    validateForm() {
        const formData = new FormData(this.form);

        const inspirations = [];
        for (let i=0; i < this.inspirationsCount; i++) {
            const inspiration = DOMPurify.sanitize(formData.get(`inspiration${i}`) as string);
            if (inspiration) {
                inspirations.push(inspiration);
            }
        }
        const inspirationField = formData.get(`inspiration${this.inspirationsCount - 1}`);
        this.addEnabled = !!inspirationField;

        this.submitEnabled = inspirations.length > 0;
    }

    addInput() {
        this.inspirationsCount++;
        this.addEnabled = false;
    }

    generateInspirationRow(index: number) {
        return html`
            <input type="text" name="inspiration${index}" id="${index}" placeholder="Quotes, things, places, capybaras" @keyup=${this.validateForm}>${this.inspirationsCount - 1 === index ? html`<button type="button" class="inspiration-add" .index=${index} ?disabled=${!this.addEnabled} @click=${this.addInput}>Add +</button>` : nothing}<br>
        `
    }
    
    render() {
        return html`
            <form id="ode-form" @submit=${this.handleFormSubmit}>
                <label for="name">To whom we dedicate this ode</label>
                <input type="text" id="name" name="name" placeholder="Enter name"><br><br>
                <label for="inspiration">Inspiration</label>
                ${Array.from({length: this.inspirationsCount}, (_, index) => this.generateInspirationRow(index))}
                <button type="submit" ?disabled=${!this.submitEnabled}>Generate poem</button>
            </form>
                `
    }

    static styles = css`
        #ode-form {
            display: grid;
        }

        .inspiration-add {
            margin-top: 5px;
            margin-bottom: 10px
        }
        
    `
}