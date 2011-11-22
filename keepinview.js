/*! ###########################################################################
    Author:     Lunatech Research
                Egor Kloos
    date:       November 2011
    ########################################################################### */

    
    (function($){
              
        $.fn.keepInView = function(options) {
            
            var $elem = $(this);
            
            var defaults = {
                // Position will be fixed regardless of scroll position when set to true 
                fixed: false, 
                // Vertical offset that applies to both top and bottom;
                edgeOffset : 0, 
                // Override z-index if you can't or don't want to set this with CSS
                zindex : $elem.css('zIndex'),
                // Override all scripted positions with your own custom CSS classname
                // The set classname will be triggered when element scrolls out of view 
                // The Script will add a suffix of '-top' or '-bottom'
                customClass: false
            };
            
            var options = $.extend(defaults, options);
            
            var offset = $elem.offset(); 
            var cssPosition = {
                type: $elem.css('position'),
                top: $elem.css('top'),
                left: $elem.css('left'),
                zindex: $elem.css('zIndex')
            };
            var marginOffset = (cssPosition.left==="auto") ? parseInt($elem.css('marginLeft'),10) : 0;
            var h = $elem.height(),
                w = $elem.width();
            
            var prepCSS = function(){
                $elem.css({ 
                    position: 'fixed',
                    left:       offset.left-marginOffset+'px',
                    width:      w,
                    height:     h,
                    zIndex:     options.zindex
                });
            };
            var fixCSS = function(t){
                $elem.css({ 
                    top:        t+'px'
                });
            };
            var clearCSS = function(){
                $elem.css({ 
                    position:   cssPosition.type,
                    left:       cssPosition.left,
                    top:        cssPosition.top,
                    zIndex:     cssPosition.zindex
                });
            };
            
            function setElem(){
            
                var scrolledOutAt = "";
                if ( $(window).height() < parseInt(offset.top + $elem.outerHeight() - Math.abs($(window).scrollTop())+options.edgeOffset,10)  && !options.fixed ) { 
                    scrolledOutAt = "bottom"; 
                };
                if ( ($(window).scrollTop())+options.edgeOffset > offset.top && !options.fixed) { 
                    scrolledOutAt = "top"; 
                }; 
                
                if(!options.customClass){ 
                    prepCSS(); 
                    if (scrolledOutAt==="bottom" && !options.fixed){
                        fixCSS(($(window).height()-$elem.outerHeight()-options.edgeOffset));
                    } else if (scrolledOutAt==="top" && !options.fixed){ 
                        fixCSS(options.edgeOffset);
                    } else if (options.fixed){ 
                        fixCSS(options.edgeOffset);
                        $(window).unbind('resize scroll');
                    } else {
                        clearCSS();
                    }
                } else {
                    if (scrolledOutAt==="bottom" || scrolledOutAt==="top"){
                        $elem.addClass(options.customClass+"-"+scrolledOutAt);
                    } else if (!scrolledOutAt) {
                        $elem.removeClass(options.customClass+"-top").removeClass(options.customClass+"-bottom");
                    }
                }
            }
            
            $(window).bind('resize scroll',function(){
                setElem();
            }).trigger('scroll');
            
        };
    
    })(jQuery);   
        
