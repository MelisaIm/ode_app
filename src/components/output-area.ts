import { LitElement, html, css, PropertyValues, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import html2canvas from "html2canvas";
@customElement("output-area")
export class OutputArea extends LitElement {
    showingDefault = true;

    @property({ type: String, reflect: true })
    theme = "light";

    @property({type: Object, reflect: true}) 
    output?: string;

    @property({type: Object}) 
    mockData: {
        positive?: {
            content: string;
        };
        negative?: {
            content: string;
        };
    } = {};

    @property({ type: Boolean })
    loading = false;

    @property({ type: String, reflect: true})
    name = "someone special";

    @query('#output-poem')
    outputElement!: HTMLElement;

    async fetchSampleData() {
        const endpoint = import.meta.env.VITE_API_ENDPOINT || "http://localhost:5001";
        const response = await fetch(endpoint, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            
        });
        const data = await response.json();
        this.mockData = data;
        console.log(data);
    }

    connectedCallback() {
        super.connectedCallback();
        this.fetchSampleData();
    }

    formatContent(content: string | undefined) {
        const lines = content?.split("\n");
        return html`${lines?.map(line => {
            if (line.length === 0) {
                return html`<br />`;
            }
            return html`<p class="poem-line">${line}</p>`}
        )}`;
    }

    protected updated(_changedProperties: PropertyValues): void {
        super.updated(_changedProperties);
        if (_changedProperties.has("output")) {
            this.showingDefault = false;
        }
    }

    private async exportAsImage() {
        if (this.outputElement) {
            const appendEl = document.createElement("p");
            appendEl.textContent = "Generated with https://odeapp.netlify.app/ | Powered by OpenAI | Built by Melisa Im";
            this.outputElement.appendChild(appendEl)
            const canvas = await html2canvas(this.outputElement, {backgroundColor: this.theme === "light" ? "#ffffff" : "#242424"});
            const image = canvas.toDataURL("image/png");
            const a = document.createElement("a");
            this.outputElement.removeChild(appendEl);
            a.href = image;
            a.download = `${Date.now()}_ode_poem.png`;
            a.click();
        }
    }

    async copy() {
        const content = this.output;
        try {
            await navigator.clipboard.writeText(content ?? "");
        } catch (err) {
            console.error("Failed to copy: ", err);
            alert("Failed to copy to clipboard");
        }
    }

    render() {
        if (this.loading) {
            return html`
                <div id="loading">
                    <h2>Generating your ode...</h2>
                    ${this.theme === "light" ? 
                        html`<img src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExdGQ3czVpaW1jcmxwbHIzc242bTRqb3VtbGoxbGtqbTgyZ2g5b3JrcSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/fmcZfQIoaL49M9RUgX/giphy.gif" alt="Loading spinner">` : 
                        html`<img src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHp1am4zNTRxMW54OGZwbjVlODFuNWh6eWg4NWo3bGpwcjVpOG5peSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Y4VkyhG1RO7pQbQFhF/giphy.gif" alt="Loading spinner">`}
                        
                </div>
            `
        }
        return html`
            <div id="output">
                <div id="output-poem" class=${this.theme}>
                    <h2>${!this.output ? this.theme === "light" ? "An example positive ode" : "An example negative ode" : "Generated ode to " + this.name}</h2>
                    ${this.theme === "light" ? this.formatContent(this.output ?? this.mockData.positive?.content) : this.formatContent(this.output ?? this.mockData.negative?.content)}
                </div>
                <div id="output-actions">
                ${this.output ? html`<button @click=${this.exportAsImage}>Export as Image</button>` : nothing}
                ${this.output ? html`<button @click=${this.copy}>Copy text</button>` : nothing}
                </div>
                <p>Thank you for using Ode! - Melisa Im</p>
            </div>
        `
    }

    static styles = css`
        #output-poem {
            padding: 1rem;
            border-radius: 5px;
            max-width: 600px;
            margin: 0 auto;
        }
        #output-poem .light {
            background-color: #f7f7f7;
            color: #333;
        }

        #output-poem .dark {
            background-color: #333;
            color: #f7f7f7;
        }

        #output-actions {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-top: 1rem;
        }

        #loading, #output {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100%;
        }

        #loading {
            height: 100vh;
        }

        #loading h2 {
            position: relative;
            display: block;
            margin-block-end: -45px;
            z-index: 100;
        }

        #loading img {
            width: 90%;
        }

        .poem-line {
            padding: 0;
            margin: 1px;
        }
    `
}