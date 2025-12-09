/**
 * CharacterCount custom element
 *
 */
export default class CharachterCount extends HTMLElement {
    static get observedAttributes() {
        return ['on']
    }

    /**
     * Get the target element
     * @returns {HTMLElement}
     */
    #target = null

    /**
     * Get the internals
     * @returns {HTMLFormElementInternals}
     */
    #internals = null

    connectedCallback() {
        this.#target = document.getElementById(this.getAttribute('for'))
        this.#internals = this.attachInternals()

        if (this.#target) {
            this.#target.addEventListener(this.triggerEvent, this)

            this.value = this.#target.value
        }
    }

    disconnectedCallback() {
        this.#target?.removeEventListener(this.triggerEvent, this)
    }

    handleEvent(event) {
        if (event.type === this.triggerEvent) {
            this.value = event.target.value
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'on') {
            this.#target?.removeEventListener(oldValue || 'input', this)
            this.#target?.addEventListener(newValue, this)
        }
    }

    /**
     * Get the target element
     * @returns {HTMLElement}
     */
    get target() {
        return this.#target
    }

    /**
     * Get the trigger event
     * @returns {string}
     */
    get triggerEvent() {
        return this.getAttribute('on') || 'input'
    }

    /**
     * Get the maximum length
     * @returns {number}
     */
    get maxlength() {
        return Number(this.getAttribute('maxlength') || this.#target.getAttribute('maxlength'))
    }

    /**
     * Get the current value
     * @returns {number}
     */
    get value() {
        return this.maxlength - (this.#target?.value.length || 0)
    }

    /**
     * Set the current value
     * @param {string} value
     */
    set value(value) {
        if (this.maxlength > 0) {
            // toggle states (Zero)
            if ((this.maxlength - value.length) === 0) {
                this.#internals.states.add('--zero')
            } else {
                this.#internals.states.delete('--zero')
            }

            // toggle states (Negative)
            if ((this.maxlength - value.length) < 0) {
                this.#internals.states.add('--negative')
            } else {
                this.#internals.states.delete('--negative')
            }

            // set text content
            this.textContent = this.maxlength - value.length

            return
        }

        this.textContent = value.length
    }
}

if (document.querySelector(`[src$="${new URL(import.meta.url).pathname}"][import-only]`) === null) {
    customElements.define('character-count', CharachterCount)
}
