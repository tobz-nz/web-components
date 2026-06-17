export default class LazyLoad extends HTMLElement {
    static get observedAttributes() {
        return ['src'];
    }

    connectedCallback() {
        //
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'src') {
            this.load()
        }
    }

    load() {
        fetch(this.src)
            .then(response => {
                if (response.status === 200 || this.hasAttribute('allow-errors')) {
                    return response.text()
                }

                throw new Error(response.statusText, {cause: response})
            })
            .then(html => {
                if ('setHTML' in this) {
                    this.setHTML(html, {sanitizer: this.sanitizer})
                } else {
                    this.innerHTML = html;
                }

                this.addEventListener('load', this)
                this.dispatchEvent(new CustomEvent('load'));
            })
            .catch(error => {
                //
            });
    }

    handleEvent(event) {
        if (event.type === 'load') {
            this.removeAttribute('hidden');
        }
    }

    get src() {
        return this.getAttribute('src');
    }

    set src(value) {
        this.setAttribute('src', value);
    }

    get sanitizer() {
        return this.getAttribute('sanitizer') && typeof Sanitizer !== 'undefined'
            ? new Sanitizer(JSON.parse(this.getAttribute('sanitizer')))
            : null;
    }

    set sanitizer(value) {
        if (typeof value !== 'string') {
            value = JSON.stringify(value);
        }

        this.setAttribute('sanitizer', value);
    }
}

if (new URL(window.location.href).searchParams.has('export') === false) {
    customElements.define('lazy-load', LazyLoad);
}
