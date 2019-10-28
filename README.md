# find-in-nw

Adds "Ctrl+F" find box to highlight text in the DOM

![Animated example](find-in-nw.gif)




## Use

1. `npm install --save find-in-nw`
1. In your HTML file add:
    ```html
    <script src="node_modules/find-in-nw/dist/find-in-nw.js"></script>
    <script>
      findInNw.initialize();
    </script>
    ```
1. Use `CTRL+F` and `ESC` to show/hide the search box




## API


### `findInNw.initialize();`

This is the initialization command. It must be ran once. Multiple attempts to run it are ignored.


### `findInNw.showSearchBox();`

This is used to programmitcally display the search box. `CTRL+F` will still display it too.


### `findInNw.hideSearchBox();`

This is used to programmitcally hide the search box. `ESC` will still hide it too.


### `findInNw.search('Text to find');`

This is used to programmitcally find text.


### `findInNw.clearTokens();`

This is used to remove all the highlighted tokens.




## Customing Styles

There are built in styles applied to classes. Each element has class and a matching ID. You can target the ID to override any styles for customization.

```css
/* The container for the input/count/close */
#find-in-nw-search-box {}

/* The input field you type in */
#find-in-nw-input {}

/* The count of matching highlighted items */
#find-in-nw-count {}

/* The X close button */
#find-in-nw-close {}
```
