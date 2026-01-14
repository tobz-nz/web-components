// import styles from "drop-menu.css" with { type: "css" };

export default class DropMenu extends HTMLElement {
    constructor() {
        super()

        const shadowRoot = this.attachShadow({ mode: 'open' })

        // shadowRoot.adoptedStyleSheets = [styles];

        shadowRoot.innerHTML = `
            <button commandfor="${this.id}-menu" command="toggle-popover" part="toggle">
                <slot name="trigger">
                    <menu-trigger>...</menu-trigger>
                </slot>
            </button>

            <menu id="${this.id}-menu" part="menu" popover>
                <slot></slot>
            </menu>
        `;

        fetch(import.meta.url.replace('.js', '.css'))
            .then(response => response.text())
            .then(css => {
                const style = document.createElement('style')
                style.textContent = css
                shadowRoot.insertBefore(style, shadowRoot.firstChild)
            })
    }
}

if (new URL(import.meta.url).searchParams.has('export') === false) {
    customElements.define('drop-menu', DropMenu)
}
