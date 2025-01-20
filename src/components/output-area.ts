import { LitElement, html, css, PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";

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
                <h2>${!this.output ? this.theme === "light" ? "An example positive ode" : "An example negative ode" : "Generated ode to " + this.name}</h2>
                <p>Here is your poem:</p>
                ${this.theme === "light" ? this.formatContent(this.output ?? this.mockData.positive?.content) : this.formatContent(this.output ?? this.mockData.negative?.content)}
            </div>
        `
    }

    static styles = css`
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