export default class EnhancedForm extends HTMLElement {
    #forms = null
    #timeout = null

    connectedCallback() {
        this.#forms = this.querySelectorAll('form')

        if (this.#forms === null) {
            throw new Error('No form found')
        }

        if (this.autoSubmit) {
            this.#forms.forEach(form => {
                form.addEventListener(this.autoSubmit, this)
            })
        }

        if (this.async) {
            this.#forms.forEach(form => {
                form.addEventListener('submit', this)
            })
        }
    }

    disconnectedCallback() {
        // all handleEvent handlers are automatically removed when the element is disconnected
    }

    handleEvent(event) {
        if (event.type === this.autoSubmit) {
            clearTimeout(this.#timeout)

            this.#timeout = setTimeout(() => {
                event.target.form.requestSubmit()
            }, this.delay)
        }

        if (event.type === 'submit') {
            event.preventDefault()

            const callbackTargets = document.querySelectorAll(this.getAttribute('callback-target'))

            fetch(event.target.action, {
                method: event.target.method,
                mode: 'cors',
                body: new FormData(event.target),
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    // 'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                },
            })
            .then(response => {
                if (!response.ok) {
                    callbackTargets.forEach(target => {
                        if (this.hasAttribute('error-event')) {
                            target.dispatchEvent(new CustomEvent(this.getAttribute('error-event'), {
                                detail: response,
                                bubbles: true
                            }))
                        }

                        if (this.hasAttribute('error-command')) {
                            if (typeof target[this.getAttribute('error-command')] === 'function') {
                                target[this.getAttribute('error-command')]()
                            } else if (typeof window[this.getAttribute('error-command')] === 'function') {
                                window[this.getAttribute('error-command')]()
                            } else {
                                throw new Error(`Command ${this.getAttribute('error-command')} not found`)
                            }
                        }
                    })

                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                return response.json()
            })
            .then(json => {
                if (this.hasAttribute('callback-target')) {
                    if (callbackTargets.length) {
                        callbackTargets.forEach(target => {
                            if (this.hasAttribute('callback-event')) {
                                target.dispatchEvent(new CustomEvent(this.getAttribute('callback-event'), {
                                    detail: json.data,
                                    bubbles: true
                                }))
                            }

                            if (this.hasAttribute('success-command')) {
                                if (typeof target[this.getAttribute('success-command')] === 'function') {
                                    target[this.getAttribute('success-command')].call(target)
                                } else if (typeof window[this.getAttribute('success-command')] === 'function') {
                                    window[this.getAttribute('success-command')]()
                                } else {
                                    throw new Error(`Command ${this.getAttribute('success-command')} not found`)
                                }
                            }
                        })
                    }
                }

                this.dispatchEvent(new CustomEvent('submit-success', {
                    detail: json,
                    bubbles: true
                }))
            })
            .catch(error => {
                console.log('submit-error', error)
                this.dispatchEvent(new CustomEvent('submit-error', {
                    detail: error,
                    bubbles: true
                }))
            })
        }

        if (event.type === 'submit-success') {
            alert('Form submitted')
        }

        if (event.type === 'submit-error') {
            alert('Form failed')
        }
    }

    get delay() {
        return this.getAttribute('delay') || 50
    }

    set delay(value) {
        this.setAttribute('delay', value)
    }

    get async() {
        return this.hasAttribute('async')
    }

    set async(value) {
        this.setAttribute('async', value)
    }

    get autoSubmit() {
        if (this.getAttribute('auto-submit') == '') {
            return 'change'
        }

        return this.getAttribute('auto-submit')
    }

    set autoSubmit(value) {
        this.setAttribute('auto-submit', value)
    }
}

if (new URL(import.meta.url).searchParams.has('export') === false) {
    customElements.define('enhanced-form', EnhancedForm)
}
