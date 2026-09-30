export default class IdempotencyKey extends HTMLElement {
    static formAssociated = true
    #internals = null

    constructor()
    {
        super();
        this.#internals = this.attachInternals();
    }

    connectedCallback()
    {
        this.#internals.form?.addEventListener(this.on, this)

        if (!this.name) {
            this.name = 'idempotency-key'
        }

        this.calculate()
    }

    get name() {
        return this.getAttribute('name')
    }

    set name(value) {
        this.setAttribute('name', value)
    }

    get value() {
        return this.getAttribute('value')
    }

    set value(value) {
        this.setAttribute('value', value)
    }

    get on() {
        return this.getAttribute('on') || 'input'
    }

    async handleEvent()
    {
        await this.calculate()
    }

    async calculate()
    {
        // get all the forms data, except this element's own value, and create a hash
        let name = this.getAttribute('name'),
            entries = [...new FormData(this.#internals.form)].filter(([key]) => key !== name),
            values = await Promise.all(entries.map(async ([key, value]) => {
                if (value instanceof File) {
                    return `${key}=${await this.fileHash(value)}`
                }

                return `${key}=${value}`
            }))

        this.value = await this.hash(values.join('|'))

        // set the value to the hash
        this.#internals.setFormValue(this.value, this.value)
    }

    async hash(str, algorithm = 'SHA-256') {
        const uint8 = new TextEncoder().encode(str)  // UTF-8 bytes
        const hashAsArrayBuffer = await crypto.subtle.digest(algorithm, uint8)
        const uint8ViewOfHash = new Uint8Array(hashAsArrayBuffer)

        // Array.from so map returns strings, Uint8Array.map would coerce them back to bytes
        return Array.from(uint8ViewOfHash)
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('')
    }

    async fileHash(file, algorithm = 'SHA-1') {
        const arrayBuffer = await file.arrayBuffer()
        const hashAsArrayBuffer = await crypto.subtle.digest(algorithm, arrayBuffer)
        const uint8ViewOfHash = new Uint8Array(hashAsArrayBuffer)

        return Array.from(uint8ViewOfHash)
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('')
    }
}

if (new URL(import.meta.url).searchParams.has('export') === false) {
    customElements.define('idempotency-key', IdempotencyKey)
}
