/*
Usage:
<input id="input-to-match" value="test">
<match-input for="input-to-match">
    <input name="matching-input">
</match-input>
*/

export default class MatchInput extends HTMLElement {
    static formAssociated = true;

    static get observedAttributes() {
        return ["visible"]
    }

    /**
     * @type {HTMLElement}
     */
    #target;

    /**
     * @type {HTMLElement}
     */
    #input;

    constructor() {
        super()
        if (!this.shadowRoot) {
            const input = document.createElement('input')
            input.name = this.getAttribute('name')
            input.part = 'input'
            input.required = this.hasAttribute('required')

            this.attachShadow({ mode: 'open', delegatesFocus: true, referenceTarget: input })

            this.shadowRoot.appendChild(input)

            const style = document.createElement('style')
            style.textContent = `
                :host(:user-invalid) input {
                    box-shadow: 0 0 0 1px red;
                }
            `
            this.shadowRoot.appendChild(style)
        }
    }

    connectedCallback() {
        this.internals = this.attachInternals();

        if (!this.hasAttribute('for')) {
            return
        }

        this.#target = document.getElementById(this.getAttribute('for'))
        this.#input = this.shadowRoot.querySelector('input, textarea, select')

        if (!this.#input || !this.#target) {
            throw new Error('Invalid input or target element')
        }

        this.#input.addEventListener('blur', this)
        this.#input.addEventListener('input', this)
        this.#input.addEventListener('change', this)
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'toggle-password' && this.#input) {
            this.#input.type = newValue !== null ? this.#input : 'password'
        }
    }

    handleEvent(event) {
        if (['input', 'change', 'blur'].includes(event.type)) {
            this.internals.setValidity({})
        }

        if (event.type === 'blur') {
            if (this.#target.value != event.target.value) {
                this.internals.setValidity(
                    { patternMismatch: true },
                    `"${this.#input.value}" must match "${this.#target.value}"`,
                    event.target
                )
            }

            this.#input.checkValidity()
        }
    }
}

if (new URL(import.meta.url).searchParams.has('export') === false) {
    customElements.define('match-input', MatchInput)
}
