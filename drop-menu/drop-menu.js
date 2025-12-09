import styles from "drop-menu.css" with { type: "css" };

export default class DropMenu extends HTMLElement {
    connectedCallback() {
        const shadowRoot = this.attachShadow({ mode: 'open' });

        shadowRoot.adoptedStyleSheets = [styles];
        shadowRoot.innerHTML = `
            <style>

            </style>

            <button commandfor="${this.id}-menu" command="toggle-popover" part="toggle">
                <slot name="trigger">
                    <menu-trigger>...</menu-trigger>
                </slot>
            </button>

            <menu id="${this.id}-menu" part="menu" popover>
                <slot></slot>
            </menu>
        `;

        // if (this.hasAttribute('hover')) {
        //     this.querySelector(':host > button')
        // }
    }
}

customElements.define('drop-menu', DropMenu);
