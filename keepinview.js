/*! ###########################################################################
    Author:     Lunatech Research
                Egor Kloos
    date:       November 2011
    git:        https://github.com/dutchcelt/Keep-in-View
    ########################################################################### */

    (function($){
              
        $.fn.keepInView = function(settings) {
            
            return this.each(function() {
            
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
                    customClass: false,
                    
                    //  Only trigger this script on scrolling out at the 'top', 'bottom' the default is 'both'.
                    trigger: 'both',
                    
                    //  To be able to resize $elem via external events you will need to reset the width and height.
                    h : $elem.height(),
                    w : $elem.width()
                    
                };
                
                var options      =  $.extend(defaults, settings),
                    offset       =  $elem.offset(),
                    leftPosition =  $elem.css('left'),
                    marginOffset =  (leftPosition==="auto") ? parseInt($elem.css('marginLeft'),10) : 0,
                    prepCSS      =  function(){
                                        $elem.css({ 
                                            position: 'fixed',
                                            left:       leftPosition - marginOffset + 'px',
                                            width:      options.w,
                                            height:     options.h,
                                            zIndex:     options.zindex
                                        });
                                    },
                    fixCSS       =  function(t){ $elem.css({ top: t+'px' }); };
                
                function setElem(){
                    console.log(options.trigger)
                    var scrolledOutAt = "";
                    if ( $(window).height() < parseInt(offset.top + $elem.outerHeight() - Math.abs($(window).scrollTop())+options.edgeOffset,10)  && !options.fixed ) { 
                        scrolledOutAt = "bottom"; 
                    };
                    if ( ($(window).scrollTop())+options.edgeOffset > offset.top && !options.fixed) { 
                        scrolledOutAt = "top"; 
                    }; 
                    if(!options.customClass){ 
                       prepCSS();
                        if (scrolledOutAt==="bottom" && (options.trigger === 'both' || options.trigger === 'bottom')){
                            fixCSS(($(window).height()-$elem.outerHeight()-options.edgeOffset));
                        } else if (scrolledOutAt==="top" && (options.trigger === 'both' || options.trigger === 'top')){ 
                            fixCSS(options.edgeOffset);
                        } else if (options.fixed){ 
                            $elem.css({top:options.edgeOffset,left:offset.left});
                        } else {
                            $elem.removeAttr('style');
                        }
                    } else if(options.customClass){
                        if ( options.trigger === 'both') {
                            if (scrolledOutAt==="bottom" || scrolledOutAt==="top"){
                                $elem.addClass(options.customClass+"-"+scrolledOutAt);
                            } else if (!scrolledOutAt) {
                                $elem.removeClass(options.customClass+"-top").removeClass(options.customClass+"-bottom");
                            }
                        } else if (scrolledOutAt===options.trigger){
                            $elem.addClass(options.customClass+"-"+options.trigger);
                        } else if (!scrolledOutAt) {
                            $elem.removeClass(options.customClass+"-"+options.trigger);
                        }
                    }
                }
                
                $(window).on('resize scroll', function(event){
                
                    if ( $elem.height()+offset.top > $(window).height() ) { return false; }
                    
                    if (event.type==="resize") { 
                        $elem.removeAttr('style');
                        options.w = $elem.width();
                        options.h = $elem.height();
                    }
                    setElem(); 
                    
                }).trigger('scroll');
                
            });
        };
        
    })(jQuery);   
