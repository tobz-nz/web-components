export class TabControl extends HTMLElement {

    #tabWindows = []

    connectedCallback() {
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

        if (!document.adoptedStyleSheets.find(s => s.baseUrl === sheet.baseUrl)) {
            document.adoptedStyleSheets.push(sheet);
        }

        this.addEventListener(this.on, this)
        this.addEventListener('tab-change', this)
    }

    disconnectedCallback() {
        this.removeEventListener(this.on, this)
    }

    handleEvent(event) {
        if (event.type === this.on && event.target.value) {
            // Toggle the open attribute on the tab window
            this.#tabWindows.forEach(tabWindow => {
                tabWindow.toggle(tabWindow.name === event.target.value)
            })
        }

        if (event.type === 'tab-change') {
            this.activeTab = event.detail.name
        }
    }

    get on() {
        return this.getAttribute('on') || 'input'
    }

    set on(value) {
        this.setAttribute('on', value)
    }

    get targets() {
        return this.getAttribute('targets')
    }

    get activeTab() {
        return this.getAttribute('active-tab')
    }

    set activeTab(value) {
        this.setAttribute('active-tab', value)
    }

    get tabWindows() {
        return this.#tabWindows
    }

    addTabWindow(tabWindow) {
        this.#tabWindows.push(tabWindow)

        // Check/Set if the new tab window is active
        this.querySelector(':is(:checked, :selected)')?.dispatchEvent(new Event(this.on, {bubbles: true}))
    }

    removeTabWindow(tabWindow) {
        this.#tabWindows = this.#tabWindows.filter(window => window !== tabWindow)
    }
}

export class TabWindow extends HTMLElement {
    connectedCallback() {
        // push this window into the control's list of tab-windows
        document.querySelectorAll(`tab-control[group="${this.group}"]`).forEach(control => control.addTabWindow(this))
    }

    disconnectedCallback() {
        // remove this window from the control's list of tab-windows
        document.querySelectorAll(`tab-control[group="${this.group}"]`).forEach(control => control.removeTabWindow(this))
    }

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
