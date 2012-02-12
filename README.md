Keep in View
===========

Copyright &copy; 2011, Lunatech Research B.V., C. Egor Kloos. All rights reserved.

### Description
Don't allow elements to scroll out of view by having them stick to the top or bottom of a window.

### Dependencies

- jQuery (tested with 1.7)


### Usage
`$("div").keepInView();`
or
`$("div").keepInView({
   edgeOffset: 24,
   zindex: 42    
});`

### Script options
`fixed: false`

- When set to true position will be fixed regardless of scroll position 

`edgeOffset : 0`

- Vertical offset that applies to BOTH top and bottom
- Do not add units like px or mm. The script always assumes pixels.

`zindex: 1`

- Override z-index if you can't or don't want to set this with CSS
- Note lowercase notation of the objectname

`.trigger('update')`

- When you element need to change in dimension like in an accordion or a toggled view the you can tell Keep in View to update the state of the element.

`.trigger('unstick')`

- If you no longer need the element to remain in view you can 'unstick' it via '.trigger('unstick')'.


Caution
=======
`customClass: false`

- Omit all jQuery positions and use your own styles with a custom CSS classname
- The set classname will be triggered when element scrolls out of view 
- The Script will add a suffix of '-top' or '-bottom'

`$("div").keepInView({
   customClass: "sticky"
});`

Will render out either:
    
`<div class"sticky-top"> … </div>`

or

`<div class"sticky-bottom"> … </div>`
