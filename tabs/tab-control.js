export class TabControl extends HTMLElement {
    constructor() {
        super()

        if (!document.adoptedStyleSheets.find(s => s.baseUrl === import.meta.url)) {
            let sheet = new CSSStyleSheet({baseURL: import.meta.url})
            sheet.replaceSync(`
                :where(tab-control) {
                    display: inline-flex;
                }

                :where(tab-window) {
                    display: block;

                    &:not([open]) {
                        display: none;
                    }
                }
            `)

            document.adoptedStyleSheets.push(sheet);
        }
    }

    connectedCallback() {
        this.on.split(' ').forEach(event => {
            this.addEventListener(event, this)
        })

        this.addEventListener('tab-change', this)
    }

    handleEvent(event) {
        if (this.on.split(' ').includes(event.type) && event.target.value) {
            // Toggle the open attribute on the tab window
            this.tabWindows.forEach(tabWindow => {
                tabWindow.toggle(tabWindow.name === event.target.value)
            })
        }

        if (event.type === 'tab-change') {
            this.activeTab = event.detail.name
        }
    }

    get on() {
        return this.getAttribute('on') || 'input click'
    }

    set on(value) {
        this.setAttribute('on', value)
    }

    get for() {
        return this.getAttribute('for')
    }

    set for(value) {
        this.setAttribute('for', value)
    }

    get activeTabs() {
        return this.tabWindows.filter(window => window.open)
    }

    get tabWindows() {
        let selector = this.for.split(' ')
            .map(group => `tab-window[group~="${group}"]`)
            .join(',')

        return document.querySelectorAll(selector)
    }
}

export class TabWindow extends HTMLElement {
    get controls() {
        return document.querySelectorAll(`tab-control[group="${this.group}"]`)
    }

    toggle(value) {
        this.open = value

        // Update the active tab in the controls
        this.controls.forEach(control => control.dispatchEvent(new CustomEvent('tab-change', {
            detail: {
                tabWindow: this,
                group: this.group,
                name: this.name,
            }
        })))

        if (this.open) {
            this.dispatchEvent(new CustomEvent('opened', {
                bubbles: true,
                capture: true
            }))
        }

        if (!this.open) {
            this.dispatchEvent(new CustomEvent('closed', {
                bubbles: true,
                capture: true
            }))
        }

        this.dispatchEvent(new CustomEvent('toggle', {
            bubbles: true,
            detail: {
                tabWindow: this,
                group: this.group,
                name: this.name,
                open: this.open
            }
        }))
    }

    get group() {
        return this.getAttribute('group')
    }

    set group(value) {
        this.setAttribute('group', value)
    }

    get name() {
        return this.getAttribute('name')
    }

    set name(value) {
        this.setAttribute('name', value)
    }

    get open() {
        return this.hasAttribute('open')
    }

    set open(value) {
        this.toggleAttribute('open', !!value)
    }
}

if (new URL(import.meta.url).searchParams.has('export') === false) {
    customElements.define('tab-control', TabControl)
    customElements.define('tab-window', TabWindow)
}
