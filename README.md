# web-components
Just a bunch of vanilla js web components

## <character-count>

Usage:

For forced limiting to the maxlength

```html
<input id="my-input" maxlength="100">
<character-count for="my-input"></character-count>
```

or for just counting the characters - allows for negative count.

```html
<input id="my-input">
<character-count for="my-input" maxlength="100"></character-count>
```


## <tab-control>

Set-up:

```html
<script src="tab-control.js" type="module"></script>
<style>
tab-window {
    display: block;

    &:not([open]) {
        display: none;
    }
}
</style>
```

### Control via radio's

```html
<tab-control group="some-group">
    <label><input type="radio" name="whatever" value="tab-1"> Tab 1</label>
    <label><input type="radio" name="whatever" value="tab-2"> Tab 2</label>
</tab-control>

<tab-window group="some-group" value="tab-1">
Tab 1 Content
</tab-window>

<tab-window group="some-group" value="tab-2">
Tab 2 Content
</tab-window>

<tab-window group="some-group" value="tab-1">
A second Tab 1 Window
</tab-window>
```

### Control via dropdown

```html
<tab-control group="some-group">
    A select control
    <select name="whatever">
        <option value="tab-1">Tab 1</option>
        <option value="tab-2">Tab 2</option>
    </select>
</tab-control>

<tab-window group="some-group" value="tab-1">
Tab 1 Content
</tab-window>

<tab-window group="some-group" value="tab-2">
Tab 2 Content
</tab-window>

<tab-window group="some-group" value="tab-1">
A second Tab 1 Window
</tab-window>
```

### Control via button

```html
<tab-control group="some-group" on="click">
    A button control
    <button type="button" value="tab-1">Tab 1</button>
    <button type="button" value="tab-2">Tab 2</button>
</tab-control>
```

## Element Registration

If you do not want the elements to be registered by default, you can add `?export` to the script path.
This will skip registration, allowing to register them in your own time - perhaps after extending the class.

```javascript
import { TabControl, TabWindow } from './tabs/tab-control.js?export';

customElements.define('tab-control', class extends TabControl {
    constructor() {
        super();

		console.log('woot')
    }
});

customElements.define('tab-window', TabWindow)
```
