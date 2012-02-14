/*! ###########################################################################
    
    Source: https://github.com/dutchcelt/Keep-in-View
    
    Copyright (C) 2011 - 2012,  Lunatech Research B.V., C. Egor Kloos. All rights reserved.
    GNU General Public License, version 3 (GPL-3.0)
    
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see http://www.opensource.org/licenses/gpl-3.0.html
    
    ########################################################################### */
    
    // Uses AMD or browser globals to create a jQuery plugin.
        
    (function (factory) {
    
        if (typeof define === 'function' && define.amd) {
            // AMD. Register as an anonymous module.
            define(['jquery'], factory);
        } else {
            // Browser globals
            factory(jQuery);
        }
        
    }(function ($) {
    
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
                    
                    //  Set the height and width (user can override these if necessary)
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
                    fixCSS       =  function(t){ $elem.css({ top: t+'px' }); }
                
                var setElem = function(){
                
                    //  Making sure that $elem doesn't fire if it is taller than the window (like a sidebar)
                    //  To prevent elastic scrolling fireing set the body in css to 'overflow: hidden'.
                    //  Then wrap your content in a div with 'overflow: auto'.
                    if ( $elem.height() > $(window).height() ) { return false; }
                    
                    var scrolledOutAt = "";
                    if ( $(window).height() < parseInt(offset.top + $elem.outerHeight() - Math.abs($(window).scrollTop())+options.edgeOffset,10)  && !options.fixed ) { 
                        scrolledOutAt = "bottom"; 
                    };
                    if ( ($(window).scrollTop()) > offset.top - options.edgeOffset && !options.fixed) { 
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
                var staySticky = function(){
                    $elem.removeAttr('style');
                    options.w = $elem.width();
                    options.h = $elem.height();
                    offset = $elem.offset();
                    setElem(); 
                }
                var killSticky = function(){
                    $elem.removeAttr('style').off(".sticky");
                    $(window).off('.sticky', staySticky).off('.sticky', setElem);
                }
                
                $elem.on('update.sticky', staySticky);
                $elem.on('unstick.sticky', killSticky);
                $(window).on('resize.sticky', $elem, staySticky).on('scroll.sticky', $elem, setElem).trigger('scroll');
            });
        };
        
    }));



