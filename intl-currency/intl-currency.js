export default class IntlCurrency extends HTMLElement {
    static get observedAttributes() {
        return ['value', 'locale', 'currency'];
    }

    connectedCallback() {
        //
    }

    /*eslint no-unused-vars: ["error", { "argsIgnorePattern": "name|oldValue|newValue" }]*/
    attributeChangedCallback(name, oldValue, newValue) {
        // if (!this.locale || !this.currency) return;

        this.textContent = new Intl.NumberFormat(this.locale, {
            style: 'currency',
            currency: this.currency
        }).format(this.value);
    }

    get value() {
        return parseFloat(this.getAttribute('value') || this.textContent) || 0;
    }

    set value(newValue) {
        this.setAttribute('value', newValue);
    }

    get locale() {
        return this.getAttribute('locale') || 'en-NZ';
    }

    set locale(newValue) {
        this.setAttribute('locale', newValue);
    }

    get currency() {
        return this.getAttribute('currency') || 'NZD';
    }

    set currency(newValue) {
        this.setAttribute('currency', newValue);
    }
}

if (new URL(import.meta.url).searchParams.has('export') === false) {
    customElements.define('intl-currency', IntlCurrency)
}
