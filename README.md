Becomes Visible jQuery plugin
=============================

This plugin can be used to detect when elements become visible in viewport. This can be useful, for example, when you have a long page and you want to know whether user has seen some content or not. If you are interested to see the plugin in action please check out [this jsFiddle page](http://jsfiddle.net/perttumyry/nKVD8/).

## Installation

Include the following script in your code. Please remember to make sure jQuery is included before this plugin.

```html
<script src="/path/to/jquery.becomesvisible.js"></script>
```

## Usage

Once included on the page all jQuery selectors will have .becomesVisible() method.

```javascript
// select all class="check-visibility" elements which do not have class="is-visible"
$('.check-visibility:not(.is-visible)').becomesVisible({
    // wait until the element has been visible in viewport
    // for two seconds before triggering callback function
    delay : 2000,
    // does the element have to be completely visible before it is interpreted as
    // visible in viewport, defaults to false which means that the delay timeout
    // will start when any portion of the element is visible in the viewport
    completelyVisible : false,
    // callback to be executed once element has been
    // visible in viewport for the duration of delay
    callback : function(elements) {
        // add class "is-visible" to elements which have become visible
        elements.addClass('is-visible');
    }
});
```

**Notice** that the elements are not selected live due performance reasons. This means that if your DOM changes after you have selected your elements the becomes visible plugin does not see those elements. For becomes visible to handle also new elements you need to call .becomesVisible('refresh') method on your selector.

```javascript
// let's use IIFE to avoid polluting global scope with our elementsToCheck variable
(function($) {
    var elementsToCheck = $('.check-visibility:not(.is-visible)');

    // initialize becomesVisible
    elementsToCheck.becomesVisible({
        // wait until the element has been visible in viewport
        // for two seconds before triggering callback function
        delay : 2000,
        callback : function(elements) {
            // add class "is-visible" to elements which have become visible
            elements.addClass('is-visible');
        }
    });

    $('#load-more-items-button').click(function(e) {
        // more items added to DOM, need to update becomesVisible
        elementsToCheck.becomesVisible('refresh');
    });
})(jQuery);
```
