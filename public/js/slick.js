jQuery(document).ready(function($) {
      $('.slider').slick({
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
        // autoplay: true,
        autoplaySpeed: 2000,
        arrows: true,
        responsive: [{
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1
          }
        },
        {
           breakpoint: 400,
           settings: {
              arrows: false,
              slidesToShow: 1,
              slidesToScroll: 1
           }
        }]
    });
});
jQuery(document).ready(function($) {
      $('.slider1').slick({
        dots: false,
        // infinite: true,
          autoplay:true,
         autoplaySpeed:1500,
        // speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        // autoplay: true,
        autoplaySpeed: 2000,
        arrows: true,
        responsive: [{
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        },
        {
           breakpoint: 400,
           settings: {
              arrows: false,
              slidesToShow: 1,
              slidesToScroll: 1
           }
        }]
    });
});




jQuery(document).ready(function($) {
      $('.slider2').slick({
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        // autoplay: true,
        autoplaySpeed: 2000,
        arrows: true,
        responsive: [{
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        },
        {
           breakpoint: 400,
           settings: {
              arrows: false,
              slidesToShow: 1,
              slidesToScroll: 1
           }
        }]
    });
});

// Slick Slider Script -- Provided by https://kenwheeler.github.io/slick/
/*
     _ _      _       _
 ___| (_) ___| | __  (_)___
/ __| | |/ __| |/ /  | / __|
\__ \ | | (__|   < _ | \__ \
|___/_|_|\___|_|\_(_)/ |___/
                   |__/

 Version: 1.5.7
  Author: Ken Wheeler
 Website: https://kenwheeler.github.io
    Docs: https://kenwheeler.github.io/slick
    Repo: https://github.com/kenwheeler/slick
  Issues: https://github.com/kenwheeler/slick/issues

 */
!function(a){"use strict";"function"==typeof define&&define.amd?define(["jquery"],a):"undefined"!=typeof exports?module.exports=a(require("jquery")):a(jQuery)}(function(a){"use strict";var b=window.Slick||{};b=function(){function c(c,d){var f,e=this;e.defaults={accessibility:!0,adaptiveHeight:!1,appendArrows:a(c),appendDots:a(c),arrows:!0,asNavFor:null,prevArrow:'<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button">Previous</button>',nextArrow:'<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button">Next</button>',autoplay:!1,autoplaySpeed:3e3,centerMode:!1,centerPadding:"50px",cssEase:"ease",customPaging:function(a,b){return'<button type="button" data-role="none" role="button" aria-required="false" tabindex="0">'+(b+1)+"</button>"},dots:!1,dotsClass:"slick-dots",draggable:!0,easing:"linear",edgeFriction:.35,fade:!1,focusOnSelect:!1,infinite:!0,initialSlide:0,lazyLoad:"ondemand",mobileFirst:!1,pauseOnHover:!0,pauseOnDotsHover:!1,respondTo:"window",responsive:null,rows:1,rtl:!1,slide:"",slidesPerRow:1,slidesToShow:1,slidesToScroll:1,speed:500,swipe:!0,swipeToSlide:!1,touchMove:!0,touchThreshold:5,useCSS:!0,variableWidth:!1,vertical:!1,verticalSwiping:!1,waitForAnimate:!0,zIndex:1e3},e.initials={animating:!1,dragging:!1,autoPlayTimer:null,currentDirection:0,currentLeft:null,currentSlide:0,direction:1,$dots:null,listWidth:null,listHeight:null,loadIndex:0,$nextArrow:null,$prevArrow:null,slideCount:null,slideWidth:null,$slideTrack:null,$slides:null,sliding:!1,slideOffset:0,swipeLeft:null,$list:null,touchObject:{},transformsEnabled:!1,unslicked:!1},a.extend(e,e.initials),e.activeBreakpoint=null,e.animType=null,e.animProp=null,e.breakpoints=[],e.breakpointSettings=[],e.cssTransitions=!1,e.hidden="hidden",e.paused=!1,e.positionProp=null,e.respondTo=null,e.rowCount=1,e.shouldClick=!0,e.$slider=a(c),e.$slidesCache=null,e.transformType=null,e.transitionType=null,e.visibilityChange="visibilitychange",e.windowWidth=0,e.windowTimer=null,f=a(c).data("slick")||{},e.options=a.extend({},e.defaults,f,d),e.currentSlide=e.options.initialSlide,e.originalSettings=e.options,"undefined"!=typeof document.mozHidden?(e.hidden="mozHidden",e.visibilityChange="mozvisibilitychange"):"undefined"!=typeof document.webkitHidden&&(e.hidden="webkitHidden",e.visibilityChange="webkitvisibilitychange"),e.autoPlay=a.proxy(e.autoPlay,e),e.autoPlayClear=a.proxy(e.autoPlayClear,e),e.changeSlide=a.proxy(e.changeSlide,e),e.clickHandler=a.proxy(e.clickHandler,e),e.selectHandler=a.proxy(e.selectHandler,e),e.setPosition=a.proxy(e.setPosition,e),e.swipeHandler=a.proxy(e.swipeHandler,e),e.dragHandler=a.proxy(e.dragHandler,e),e.keyHandler=a.proxy(e.keyHandler,e),e.autoPlayIterator=a.proxy(e.autoPlayIterator,e),e.instanceUid=b++,e.htmlExpr=/^(?:\s*(<[\w\W]+>)[^>]*)$/,e.registerBreakpoints(),e.init(!0),e.checkResponsive(!0)}var b=0;return c}(),b.prototype.addSlide=b.prototype.slickAdd=function(b,c,d){var e=this;if("boolean"==typeof c)d=c,c=null;else if(0>c||c>=e.slideCount)return!1;e.unload(),"number"==typeof c?0===c&&0===e.$slides.length?a(b).appendTo(e.$slideTrack):d?a(b).insertBefore(e.$slides.eq(c)):a(b).insertAfter(e.$slides.eq(c)):d===!0?a(b).prependTo(e.$slideTrack):a(b).appendTo(e.$slideTrack),e.$slides=e.$slideTrack.children(this.options.slide),e.$slideTrack.children(this.options.slide).detach(),e.$slideTrack.append(e.$slides),e.$slides.each(function(b,c){a(c).attr("data-slick-index",b)}),e.$slidesCache=e.$slides,e.reinit()},b.prototype.animateHeight=function(){var a=this;if(1===a.options.slidesToShow&&a.options.adaptiveHeight===!0&&a.options.vertical===!1){var b=a.$slides.eq(a.currentSlide).outerHeight(!0);a.$list.animate({height:b},a.options.speed)}},b.prototype.animateSlide=function(b,c){var d={},e=this;e.animateHeight(),e.options.rtl===!0&&e.options.vertical===!1&&(b=-b),e.transformsEnabled===!1?e.options.vertical===!1?e.$slideTrack.animate({left:b},e.options.speed,e.options.easing,c):e.$slideTrack.animate({top:b},e.options.speed,e.options.easing,c):e.cssTransitions===!1?(e.options.rtl===!0&&(e.currentLeft=-e.currentLeft),a({animStart:e.currentLeft}).animate({animStart:b},{duration:e.options.speed,easing:e.options.easing,step:function(a){a=Math.ceil(a),e.options.vertical===!1?(d[e.animType]="translate("+a+"px, 0px)",e.$slideTrack.css(d)):(d[e.animType]="translate(0px,"+a+"px)",e.$slideTrack.css(d))},complete:function(){c&&c.call()}})):(e.applyTransition(),b=Math.ceil(b),d[e.animType]=e.options.vertical===!1?"translate3d("+b+"px, 0px, 0px)":"translate3d(0px,"+b+"px, 0px)",e.$slideTrack.css(d),c&&setTimeout(function(){e.disableTransition(),c.call()},e.options.speed))},b.prototype.asNavFor=function(b){var c=this,d=c.options.asNavFor;d&&null!==d&&(d=a(d).not(c.$slider)),null!==d&&"object"==typeof d&&d.each(function(){var c=a(this).slick("getSlick");c.unslicked||c.slideHandler(b,!0)})},b.prototype.applyTransition=function(a){var b=this,c={};c[b.transitionType]=b.options.fade===!1?b.transformType+" "+b.options.speed+"ms "+b.options.cssEase:"opacity "+b.options.speed+"ms "+b.options.cssEase,b.options.fade===!1?b.$slideTrack.css(c):b.$slides.eq(a).css(c)},b.prototype.autoPlay=function(){var a=this;a.autoPlayTimer&&clearInterval(a.autoPlayTimer),a.slideCount>a.options.slidesToShow&&a.paused!==!0&&(a.autoPlayTimer=setInterval(a.autoPlayIterator,a.options.autoplaySpeed))},b.prototype.autoPlayClear=function(){var a=this;a.autoPlayTimer&&clearInterval(a.autoPlayTimer)},b.prototype.autoPlayIterator=function(){var a=this;a.options.infinite===!1?1===a.direction?(a.currentSlide+1===a.slideCount-1&&(a.direction=0),a.slideHandler(a.currentSlide+a.options.slidesToScroll)):(0===a.currentSlide-1&&(a.direction=1),a.slideHandler(a.currentSlide-a.options.slidesToScroll)):a.slideHandler(a.currentSlide+a.options.slidesToScroll)},b.prototype.buildArrows=function(){var b=this;b.options.arrows===!0&&(b.$prevArrow=a(b.options.prevArrow).addClass("slick-arrow"),b.$nextArrow=a(b.options.nextArrow).addClass("slick-arrow"),b.slideCount>b.options.slidesToShow?(b.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),b.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),b.htmlExpr.test(b.options.prevArrow)&&b.$prevArrow.prependTo(b.options.appendArrows),b.htmlExpr.test(b.options.nextArrow)&&b.$nextArrow.appendTo(b.options.appendArrows),b.options.infinite!==!0&&b.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true")):b.$prevArrow.add(b.$nextArrow).addClass("slick-hidden").attr({"aria-disabled":"true",tabindex:"-1"}))},b.prototype.buildDots=function(){var c,d,b=this;if(b.options.dots===!0&&b.slideCount>b.options.slidesToShow){for(d='<ul class="'+b.options.dotsClass+'">',c=0;c<=b.getDotCount();c+=1)d+="<li>"+b.options.customPaging.call(this,b,c)+"</li>";d+="</ul>",b.$dots=a(d).appendTo(b.options.appendDots),b.$dots.find("li").first().addClass("slick-active").attr("aria-hidden","false")}},b.prototype.buildOut=function(){var b=this;b.$slides=b.$slider.children(b.options.slide+":not(.slick-cloned)").addClass("slick-slide"),b.slideCount=b.$slides.length,b.$slides.each(function(b,c){a(c).attr("data-slick-index",b).data("originalStyling",a(c).attr("style")||"")}),b.$slidesCache=b.$slides,b.$slider.addClass("slick-slider"),b.$slideTrack=0===b.slideCount?a('<div class="slick-track"/>').appendTo(b.$slider):b.$slides.wrapAll('<div class="slick-track"/>').parent(),b.$list=b.$slideTrack.wrap('<div aria-live="polite" class="slick-list"/>').parent(),b.$slideTrack.css("opacity",0),(b.options.centerMode===!0||b.options.swipeToSlide===!0)&&(b.options.slidesToScroll=1),a("img[data-lazy]",b.$slider).not("[src]").addClass("slick-loading"),b.setupInfinite(),b.buildArrows(),b.buildDots(),b.updateDots(),b.setSlideClasses("number"==typeof b.currentSlide?b.currentSlide:0),b.options.draggable===!0&&b.$list.addClass("draggable")},b.prototype.buildRows=function(){var b,c,d,e,f,g,h,a=this;if(e=document.createDocumentFragment(),g=a.$slider.children(),a.options.rows>1){for(h=a.options.slidesPerRow*a.options.rows,f=Math.ceil(g.length/h),b=0;f>b;b++){var i=document.createElement("div");for(c=0;c<a.options.rows;c++){var j=document.createElement("div");for(d=0;d<a.options.slidesPerRow;d++){var k=b*h+(c*a.options.slidesPerRow+d);g.get(k)&&j.appendChild(g.get(k))}i.appendChild(j)}e.appendChild(i)}a.$slider.html(e),a.$slider.children().children().children().css({width:100/a.options.slidesPerRow+"%",display:"inline-block"})}},b.prototype.checkResponsive=function(b,c){var e,f,g,d=this,h=!1,i=d.$slider.width(),j=window.innerWidth||a(window).width();if("window"===d.respondTo?g=j:"slider"===d.respondTo?g=i:"min"===d.respondTo&&(g=Math.min(j,i)),d.options.responsive&&d.options.responsive.length&&null!==d.options.responsive){f=null;for(e in d.breakpoints)d.breakpoints.hasOwnProperty(e)&&(d.originalSettings.mobileFirst===!1?g<d.breakpoints[e]&&(f=d.breakpoints[e]):g>d.breakpoints[e]&&(f=d.breakpoints[e]));null!==f?null!==d.activeBreakpoint?(f!==d.activeBreakpoint||c)&&(d.activeBreakpoint=f,"unslick"===d.breakpointSettings[f]?d.unslick(f):(d.options=a.extend({},d.originalSettings,d.breakpointSettings[f]),b===!0&&(d.currentSlide=d.options.initialSlide),d.refresh(b)),h=f):(d.activeBreakpoint=f,"unslick"===d.breakpointSettings[f]?d.unslick(f):(d.options=a.extend({},d.originalSettings,d.breakpointSettings[f]),b===!0&&(d.currentSlide=d.options.initialSlide),d.refresh(b)),h=f):null!==d.activeBreakpoint&&(d.activeBreakpoint=null,d.options=d.originalSettings,b===!0&&(d.currentSlide=d.options.initialSlide),d.refresh(b),h=f),b||h===!1||d.$slider.trigger("breakpoint",[d,h])}},b.prototype.changeSlide=function(b,c){var f,g,h,d=this,e=a(b.target);switch(e.is("a")&&b.preventDefault(),e.is("li")||(e=e.closest("li")),h=0!==d.slideCount%d.options.slidesToScroll,f=h?0:(d.slideCount-d.currentSlide)%d.options.slidesToScroll,b.data.message){case"previous":g=0===f?d.options.slidesToScroll:d.options.slidesToShow-f,d.slideCount>d.options.slidesToShow&&d.slideHandler(d.currentSlide-g,!1,c);break;case"next":g=0===f?d.options.slidesToScroll:f,d.slideCount>d.options.slidesToShow&&d.slideHandler(d.currentSlide+g,!1,c);break;case"index":var i=0===b.data.index?0:b.data.index||e.index()*d.options.slidesToScroll;d.slideHandler(d.checkNavigable(i),!1,c),e.children().trigger("focus");break;default:return}},b.prototype.checkNavigable=function(a){var c,d,b=this;if(c=b.getNavigableIndexes(),d=0,a>c[c.length-1])a=c[c.length-1];else for(var e in c){if(a<c[e]){a=d;break}d=c[e]}return a},b.prototype.cleanUpEvents=function(){var b=this;b.options.dots&&null!==b.$dots&&(a("li",b.$dots).off("click.slick",b.changeSlide),b.options.pauseOnDotsHover===!0&&b.options.autoplay===!0&&a("li",b.$dots).off("mouseenter.slick",a.proxy(b.setPaused,b,!0)).off("mouseleave.slick",a.proxy(b.setPaused,b,!1))),b.options.arrows===!0&&b.slideCount>b.options.slidesToShow&&(b.$prevArrow&&b.$prevArrow.off("click.slick",b.changeSlide),b.$nextArrow&&b.$nextArrow.off("click.slick",b.changeSlide)),b.$list.off("touchstart.slick mousedown.slick",b.swipeHandler),b.$list.off("touchmove.slick mousemove.slick",b.swipeHandler),b.$list.off("touchend.slick mouseup.slick",b.swipeHandler),b.$list.off("touchcancel.slick mouseleave.slick",b.swipeHandler),b.$list.off("click.slick",b.clickHandler),a(document).off(b.visibilityChange,b.visibility),b.$list.off("mouseenter.slick",a.proxy(b.setPaused,b,!0)),b.$list.off("mouseleave.slick",a.proxy(b.setPaused,b,!1)),b.options.accessibility===!0&&b.$list.off("keydown.slick",b.keyHandler),b.options.focusOnSelect===!0&&a(b.$slideTrack).children().off("click.slick",b.selectHandler),a(window).off("orientationchange.slick.slick-"+b.instanceUid,b.orientationChange),a(window).off("resize.slick.slick-"+b.instanceUid,b.resize),a("[draggable!=true]",b.$slideTrack).off("dragstart",b.preventDefault),a(window).off("load.slick.slick-"+b.instanceUid,b.setPosition),a(document).off("ready.slick.slick-"+b.instanceUid,b.setPosition)},b.prototype.cleanUpRows=function(){var b,a=this;a.options.rows>1&&(b=a.$slides.children().children(),b.removeAttr("style"),a.$slider.html(b))},b.prototype.clickHandler=function(a){var b=this;b.shouldClick===!1&&(a.stopImmediatePropagation(),a.stopPropagation(),a.preventDefault())},b.prototype.destroy=function(b){var c=this;c.autoPlayClear(),c.touchObject={},c.cleanUpEvents(),a(".slick-cloned",c.$slider).detach(),c.$dots&&c.$dots.remove(),c.options.arrows===!0&&(c.$prevArrow&&c.$prevArrow.length&&(c.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),c.htmlExpr.test(c.options.prevArrow)&&c.$prevArrow.remove()),c.$nextArrow&&c.$nextArrow.length&&(c.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),c.htmlExpr.test(c.options.nextArrow)&&c.$nextArrow.remove())),c.$slides&&(c.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function(){a(this).attr("style",a(this).data("originalStyling"))}),c.$slideTrack.children(this.options.slide).detach(),c.$slideTrack.detach(),c.$list.detach(),c.$slider.append(c.$slides)),c.cleanUpRows(),c.$slider.removeClass("slick-slider"),c.$slider.removeClass("slick-initialized"),c.unslicked=!0,b||c.$slider.trigger("destroy",[c])},b.prototype.disableTransition=function(a){var b=this,c={};c[b.transitionType]="",b.options.fade===!1?b.$slideTrack.css(c):b.$slides.eq(a).css(c)},b.prototype.fadeSlide=function(a,b){var c=this;c.cssTransitions===!1?(c.$slides.eq(a).css({zIndex:c.options.zIndex}),c.$slides.eq(a).animate({opacity:1},c.options.speed,c.options.easing,b)):(c.applyTransition(a),c.$slides.eq(a).css({opacity:1,zIndex:c.options.zIndex}),b&&setTimeout(function(){c.disableTransition(a),b.call()},c.options.speed))},b.prototype.fadeSlideOut=function(a){var b=this;b.cssTransitions===!1?b.$slides.eq(a).animate({opacity:0,zIndex:b.options.zIndex-2},b.options.speed,b.options.easing):(b.applyTransition(a),b.$slides.eq(a).css({opacity:0,zIndex:b.options.zIndex-2}))},b.prototype.filterSlides=b.prototype.slickFilter=function(a){var b=this;null!==a&&(b.unload(),b.$slideTrack.children(this.options.slide).detach(),b.$slidesCache.filter(a).appendTo(b.$slideTrack),b.reinit())},b.prototype.getCurrent=b.prototype.slickCurrentSlide=function(){var a=this;return a.currentSlide},b.prototype.getDotCount=function(){var a=this,b=0,c=0,d=0;if(a.options.infinite===!0)for(;b<a.slideCount;)++d,b=c+a.options.slidesToShow,c+=a.options.slidesToScroll<=a.options.slidesToShow?a.options.slidesToScroll:a.options.slidesToShow;else if(a.options.centerMode===!0)d=a.slideCount;else for(;b<a.slideCount;)++d,b=c+a.options.slidesToShow,c+=a.options.slidesToScroll<=a.options.slidesToShow?a.options.slidesToScroll:a.options.slidesToShow;return d-1},b.prototype.getLeft=function(a){var c,d,f,b=this,e=0;return b.slideOffset=0,d=b.$slides.first().outerHeight(!0),b.options.infinite===!0?(b.slideCount>b.options.slidesToShow&&(b.slideOffset=-1*b.slideWidth*b.options.slidesToShow,e=-1*d*b.options.slidesToShow),0!==b.slideCount%b.options.slidesToScroll&&a+b.options.slidesToScroll>b.slideCount&&b.slideCount>b.options.slidesToShow&&(a>b.slideCount?(b.slideOffset=-1*(b.options.slidesToShow-(a-b.slideCount))*b.slideWidth,e=-1*(b.options.slidesToShow-(a-b.slideCount))*d):(b.slideOffset=-1*b.slideCount%b.options.slidesToScroll*b.slideWidth,e=-1*b.slideCount%b.options.slidesToScroll*d))):a+b.options.slidesToShow>b.slideCount&&(b.slideOffset=(a+b.options.slidesToShow-b.slideCount)*b.slideWidth,e=(a+b.options.slidesToShow-b.slideCount)*d),b.slideCount<=b.options.slidesToShow&&(b.slideOffset=0,e=0),b.options.centerMode===!0&&b.options.infinite===!0?b.slideOffset+=b.slideWidth*Math.floor(b.options.slidesToShow/2)-b.slideWidth:b.options.centerMode===!0&&(b.slideOffset=0,b.slideOffset+=b.slideWidth*Math.floor(b.options.slidesToShow/2)),c=b.options.vertical===!1?-1*a*b.slideWidth+b.slideOffset:-1*a*d+e,b.options.variableWidth===!0&&(f=b.slideCount<=b.options.slidesToShow||b.options.infinite===!1?b.$slideTrack.children(".slick-slide").eq(a):b.$slideTrack.children(".slick-slide").eq(a+b.options.slidesToShow),c=f[0]?-1*f[0].offsetLeft:0,b.options.centerMode===!0&&(f=b.options.infinite===!1?b.$slideTrack.children(".slick-slide").eq(a):b.$slideTrack.children(".slick-slide").eq(a+b.options.slidesToShow+1),c=f[0]?-1*f[0].offsetLeft:0,c+=(b.$list.width()-f.outerWidth())/2)),c},b.prototype.getOption=b.prototype.slickGetOption=function(a){var b=this;return b.options[a]},b.prototype.getNavigableIndexes=function(){var e,a=this,b=0,c=0,d=[];for(a.options.infinite===!1?e=a.slideCount:(b=-1*a.options.slidesToScroll,c=-1*a.options.slidesToScroll,e=2*a.slideCount);e>b;)d.push(b),b=c+a.options.slidesToScroll,c+=a.options.slidesToScroll<=a.options.slidesToShow?a.options.slidesToScroll:a.options.slidesToShow;return d},b.prototype.getSlick=function(){return this},b.prototype.getSlideCount=function(){var c,d,e,b=this;return e=b.options.centerMode===!0?b.slideWidth*Math.floor(b.options.slidesToShow/2):0,b.options.swipeToSlide===!0?(b.$slideTrack.find(".slick-slide").each(function(c,f){return f.offsetLeft-e+a(f).outerWidth()/2>-1*b.swipeLeft?(d=f,!1):void 0}),c=Math.abs(a(d).attr("data-slick-index")-b.currentSlide)||1):b.options.slidesToScroll},b.prototype.goTo=b.prototype.slickGoTo=function(a,b){var c=this;c.changeSlide({data:{message:"index",index:parseInt(a)}},b)},b.prototype.init=function(b){var c=this;a(c.$slider).hasClass("slick-initialized")||(a(c.$slider).addClass("slick-initialized"),c.buildRows(),c.buildOut(),c.setProps(),c.startLoad(),c.loadSlider(),c.initializeEvents(),c.updateArrows(),c.updateDots()),b&&c.$slider.trigger("init",[c]),c.options.accessibility===!0&&c.initADA()},b.prototype.initArrowEvents=function(){var a=this;a.options.arrows===!0&&a.slideCount>a.options.slidesToShow&&(a.$prevArrow.on("click.slick",{message:"previous"},a.changeSlide),a.$nextArrow.on("click.slick",{message:"next"},a.changeSlide))},b.prototype.initDotEvents=function(){var b=this;b.options.dots===!0&&b.slideCount>b.options.slidesToShow&&a("li",b.$dots).on("click.slick",{message:"index"},b.changeSlide),b.options.dots===!0&&b.options.pauseOnDotsHover===!0&&b.options.autoplay===!0&&a("li",b.$dots).on("mouseenter.slick",a.proxy(b.setPaused,b,!0)).on("mouseleave.slick",a.proxy(b.setPaused,b,!1))},b.prototype.initializeEvents=function(){var b=this;b.initArrowEvents(),b.initDotEvents(),b.$list.on("touchstart.slick mousedown.slick",{action:"start"},b.swipeHandler),b.$list.on("touchmove.slick mousemove.slick",{action:"move"},b.swipeHandler),b.$list.on("touchend.slick mouseup.slick",{action:"end"},b.swipeHandler),b.$list.on("touchcancel.slick mouseleave.slick",{action:"end"},b.swipeHandler),b.$list.on("click.slick",b.clickHandler),a(document).on(b.visibilityChange,a.proxy(b.visibility,b)),b.$list.on("mouseenter.slick",a.proxy(b.setPaused,b,!0)),b.$list.on("mouseleave.slick",a.proxy(b.setPaused,b,!1)),b.options.accessibility===!0&&b.$list.on("keydown.slick",b.keyHandler),b.options.focusOnSelect===!0&&a(b.$slideTrack).children().on("click.slick",b.selectHandler),a(window).on("orientationchange.slick.slick-"+b.instanceUid,a.proxy(b.orientationChange,b)),a(window).on("resize.slick.slick-"+b.instanceUid,a.proxy(b.resize,b)),a("[draggable!=true]",b.$slideTrack).on("dragstart",b.preventDefault),a(window).on("load.slick.slick-"+b.instanceUid,b.setPosition),a(document).on("ready.slick.slick-"+b.instanceUid,b.setPosition)},b.prototype.initUI=function(){var a=this;a.options.arrows===!0&&a.slideCount>a.options.slidesToShow&&(a.$prevArrow.show(),a.$nextArrow.show()),a.options.dots===!0&&a.slideCount>a.options.slidesToShow&&a.$dots.show(),a.options.autoplay===!0&&a.autoPlay()},b.prototype.keyHandler=function(a){var b=this;a.target.tagName.match("TEXTAREA|INPUT|SELECT")||(37===a.keyCode&&b.options.accessibility===!0?b.changeSlide({data:{message:"previous"}}):39===a.keyCode&&b.options.accessibility===!0&&b.changeSlide({data:{message:"next"}}))},b.prototype.lazyLoad=function(){function g(b){a("img[data-lazy]",b).each(function(){var b=a(this),c=a(this).attr("data-lazy"),d=document.createElement("img");d.onload=function(){b.animate({opacity:0},100,function(){b.attr("src",c).animate({opacity:1},200,function(){b.removeAttr("data-lazy").removeClass("slick-loading")})})},d.src=c})}var c,d,e,f,b=this;b.options.centerMode===!0?b.options.infinite===!0?(e=b.currentSlide+(b.options.slidesToShow/2+1),f=e+b.options.slidesToShow+2):(e=Math.max(0,b.currentSlide-(b.options.slidesToShow/2+1)),f=2+(b.options.slidesToShow/2+1)+b.currentSlide):(e=b.options.infinite?b.options.slidesToShow+b.currentSlide:b.currentSlide,f=e+b.options.slidesToShow,b.options.fade===!0&&(e>0&&e--,f<=b.slideCount&&f++)),c=b.$slider.find(".slick-slide").slice(e,f),g(c),b.slideCount<=b.options.slidesToShow?(d=b.$slider.find(".slick-slide"),g(d)):b.currentSlide>=b.slideCount-b.options.slidesToShow?(d=b.$slider.find(".slick-cloned").slice(0,b.options.slidesToShow),g(d)):0===b.currentSlide&&(d=b.$slider.find(".slick-cloned").slice(-1*b.options.slidesToShow),g(d))},b.prototype.loadSlider=function(){var a=this;a.setPosition(),a.$slideTrack.css({opacity:1}),a.$slider.removeClass("slick-loading"),a.initUI(),"progressive"===a.options.lazyLoad&&a.progressiveLazyLoad()},b.prototype.next=b.prototype.slickNext=function(){var a=this;a.changeSlide({data:{message:"next"}})},b.prototype.orientationChange=function(){var a=this;a.checkResponsive(),a.setPosition()},b.prototype.pause=b.prototype.slickPause=function(){var a=this;a.autoPlayClear(),a.paused=!0},b.prototype.play=b.prototype.slickPlay=function(){var a=this;a.paused=!1,a.autoPlay()},b.prototype.postSlide=function(a){var b=this;b.$slider.trigger("afterChange",[b,a]),b.animating=!1,b.setPosition(),b.swipeLeft=null,b.options.autoplay===!0&&b.paused===!1&&b.autoPlay(),b.options.accessibility===!0&&b.initADA()},b.prototype.prev=b.prototype.slickPrev=function(){var a=this;a.changeSlide({data:{message:"previous"}})},b.prototype.preventDefault=function(a){a.preventDefault()},b.prototype.progressiveLazyLoad=function(){var c,d,b=this;c=a("img[data-lazy]",b.$slider).length,c>0&&(d=a("img[data-lazy]",b.$slider).first(),d.attr("src",d.attr("data-lazy")).removeClass("slick-loading").load(function(){d.removeAttr("data-lazy"),b.progressiveLazyLoad(),b.options.adaptiveHeight===!0&&b.setPosition()}).error(function(){d.removeAttr("data-lazy"),b.progressiveLazyLoad()}))},b.prototype.refresh=function(b){var c=this,d=c.currentSlide;c.destroy(!0),a.extend(c,c.initials,{currentSlide:d}),c.init(),b||c.changeSlide({data:{message:"index",index:d}},!1)},b.prototype.registerBreakpoints=function(){var c,d,e,b=this,f=b.options.responsive||null;if("array"===a.type(f)&&f.length){b.respondTo=b.options.respondTo||"window";for(c in f)if(e=b.breakpoints.length-1,d=f[c].breakpoint,f.hasOwnProperty(c)){for(;e>=0;)b.breakpoints[e]&&b.breakpoints[e]===d&&b.breakpoints.splice(e,1),e--;b.breakpoints.push(d),b.breakpointSettings[d]=f[c].settings}b.breakpoints.sort(function(a,c){return b.options.mobileFirst?a-c:c-a})}},b.prototype.reinit=function(){var b=this;b.$slides=b.$slideTrack.children(b.options.slide).addClass("slick-slide"),b.slideCount=b.$slides.length,b.currentSlide>=b.slideCount&&0!==b.currentSlide&&(b.currentSlide=b.currentSlide-b.options.slidesToScroll),b.slideCount<=b.options.slidesToShow&&(b.currentSlide=0),b.registerBreakpoints(),b.setProps(),b.setupInfinite(),b.buildArrows(),b.updateArrows(),b.initArrowEvents(),b.buildDots(),b.updateDots(),b.initDotEvents(),b.checkResponsive(!1,!0),b.options.focusOnSelect===!0&&a(b.$slideTrack).children().on("click.slick",b.selectHandler),b.setSlideClasses(0),b.setPosition(),b.$slider.trigger("reInit",[b]),b.options.autoplay===!0&&b.focusHandler()},b.prototype.resize=function(){var b=this;a(window).width()!==b.windowWidth&&(clearTimeout(b.windowDelay),b.windowDelay=window.setTimeout(function(){b.windowWidth=a(window).width(),b.checkResponsive(),b.unslicked||b.setPosition()},50))},b.prototype.removeSlide=b.prototype.slickRemove=function(a,b,c){var d=this;return"boolean"==typeof a?(b=a,a=b===!0?0:d.slideCount-1):a=b===!0?--a:a,d.slideCount<1||0>a||a>d.slideCount-1?!1:(d.unload(),c===!0?d.$slideTrack.children().remove():d.$slideTrack.children(this.options.slide).eq(a).remove(),d.$slides=d.$slideTrack.children(this.options.slide),d.$slideTrack.children(this.options.slide).detach(),d.$slideTrack.append(d.$slides),d.$slidesCache=d.$slides,d.reinit(),void 0)},b.prototype.setCSS=function(a){var d,e,b=this,c={};b.options.rtl===!0&&(a=-a),d="left"==b.positionProp?Math.ceil(a)+"px":"0px",e="top"==b.positionProp?Math.ceil(a)+"px":"0px",c[b.positionProp]=a,b.transformsEnabled===!1?b.$slideTrack.css(c):(c={},b.cssTransitions===!1?(c[b.animType]="translate("+d+", "+e+")",b.$slideTrack.css(c)):(c[b.animType]="translate3d("+d+", "+e+", 0px)",b.$slideTrack.css(c)))},b.prototype.setDimensions=function(){var a=this;a.options.vertical===!1?a.options.centerMode===!0&&a.$list.css({padding:"0px "+a.options.centerPadding}):(a.$list.height(a.$slides.first().outerHeight(!0)*a.options.slidesToShow),a.options.centerMode===!0&&a.$list.css({padding:a.options.centerPadding+" 0px"})),a.listWidth=a.$list.width(),a.listHeight=a.$list.height(),a.options.vertical===!1&&a.options.variableWidth===!1?(a.slideWidth=Math.ceil(a.listWidth/a.options.slidesToShow),a.$slideTrack.width(Math.ceil(a.slideWidth*a.$slideTrack.children(".slick-slide").length))):a.options.variableWidth===!0?a.$slideTrack.width(5e3*a.slideCount):(a.slideWidth=Math.ceil(a.listWidth),a.$slideTrack.height(Math.ceil(a.$slides.first().outerHeight(!0)*a.$slideTrack.children(".slick-slide").length)));var b=a.$slides.first().outerWidth(!0)-a.$slides.first().width();a.options.variableWidth===!1&&a.$slideTrack.children(".slick-slide").width(a.slideWidth-b)},b.prototype.setFade=function(){var c,b=this;b.$slides.each(function(d,e){c=-1*b.slideWidth*d,b.options.rtl===!0?a(e).css({position:"relative",right:c,top:0,zIndex:b.options.zIndex-2,opacity:0}):a(e).css({position:"relative",left:c,top:0,zIndex:b.options.zIndex-2,opacity:0})}),b.$slides.eq(b.currentSlide).css({zIndex:b.options.zIndex-1,opacity:1})},b.prototype.setHeight=function(){var a=this;if(1===a.options.slidesToShow&&a.options.adaptiveHeight===!0&&a.options.vertical===!1){var b=a.$slides.eq(a.currentSlide).outerHeight(!0);a.$list.css("height",b)}},b.prototype.setOption=b.prototype.slickSetOption=function(b,c,d){var f,g,e=this;if("responsive"===b&&"array"===a.type(c))for(g in c)if("array"!==a.type(e.options.responsive))e.options.responsive=[c[g]];else{for(f=e.options.responsive.length-1;f>=0;)e.options.responsive[f].breakpoint===c[g].breakpoint&&e.options.responsive.splice(f,1),f--;e.options.responsive.push(c[g])}else e.options[b]=c;d===!0&&(e.unload(),e.reinit())},b.prototype.setPosition=function(){var a=this;a.setDimensions(),a.setHeight(),a.options.fade===!1?a.setCSS(a.getLeft(a.currentSlide)):a.setFade(),a.$slider.trigger("setPosition",[a])},b.prototype.setProps=function(){var a=this,b=document.body.style;a.positionProp=a.options.vertical===!0?"top":"left","top"===a.positionProp?a.$slider.addClass("slick-vertical"):a.$slider.removeClass("slick-vertical"),(void 0!==b.WebkitTransition||void 0!==b.MozTransition||void 0!==b.msTransition)&&a.options.useCSS===!0&&(a.cssTransitions=!0),a.options.fade&&("number"==typeof a.options.zIndex?a.options.zIndex<3&&(a.options.zIndex=3):a.options.zIndex=a.defaults.zIndex),void 0!==b.OTransform&&(a.animType="OTransform",a.transformType="-o-transform",a.transitionType="OTransition",void 0===b.perspectiveProperty&&void 0===b.webkitPerspective&&(a.animType=!1)),void 0!==b.MozTransform&&(a.animType="MozTransform",a.transformType="-moz-transform",a.transitionType="MozTransition",void 0===b.perspectiveProperty&&void 0===b.MozPerspective&&(a.animType=!1)),void 0!==b.webkitTransform&&(a.animType="webkitTransform",a.transformType="-webkit-transform",a.transitionType="webkitTransition",void 0===b.perspectiveProperty&&void 0===b.webkitPerspective&&(a.animType=!1)),void 0!==b.msTransform&&(a.animType="msTransform",a.transformType="-ms-transform",a.transitionType="msTransition",void 0===b.msTransform&&(a.animType=!1)),void 0!==b.transform&&a.animType!==!1&&(a.animType="transform",a.transformType="transform",a.transitionType="transition"),a.transformsEnabled=null!==a.animType&&a.animType!==!1},b.prototype.setSlideClasses=function(a){var c,d,e,f,b=this;d=b.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden","true"),b.$slides.eq(a).addClass("slick-current"),b.options.centerMode===!0?(c=Math.floor(b.options.slidesToShow/2),b.options.infinite===!0&&(a>=c&&a<=b.slideCount-1-c?b.$slides.slice(a-c,a+c+1).addClass("slick-active").attr("aria-hidden","false"):(e=b.options.slidesToShow+a,d.slice(e-c+1,e+c+2).addClass("slick-active").attr("aria-hidden","false")),0===a?d.eq(d.length-1-b.options.slidesToShow).addClass("slick-center"):a===b.slideCount-1&&d.eq(b.options.slidesToShow).addClass("slick-center")),b.$slides.eq(a).addClass("slick-center")):a>=0&&a<=b.slideCount-b.options.slidesToShow?b.$slides.slice(a,a+b.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false"):d.length<=b.options.slidesToShow?d.addClass("slick-active").attr("aria-hidden","false"):(f=b.slideCount%b.options.slidesToShow,e=b.options.infinite===!0?b.options.slidesToShow+a:a,b.options.slidesToShow==b.options.slidesToScroll&&b.slideCount-a<b.options.slidesToShow?d.slice(e-(b.options.slidesToShow-f),e+f).addClass("slick-active").attr("aria-hidden","false"):d.slice(e,e+b.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false")),"ondemand"===b.options.lazyLoad&&b.lazyLoad()},b.prototype.setupInfinite=function(){var c,d,e,b=this;if(b.options.fade===!0&&(b.options.centerMode=!1),b.options.infinite===!0&&b.options.fade===!1&&(d=null,b.slideCount>b.options.slidesToShow)){for(e=b.options.centerMode===!0?b.options.slidesToShow+1:b.options.slidesToShow,c=b.slideCount;c>b.slideCount-e;c-=1)d=c-1,a(b.$slides[d]).clone(!0).attr("id","").attr("data-slick-index",d-b.slideCount).prependTo(b.$slideTrack).addClass("slick-cloned");for(c=0;e>c;c+=1)d=c,a(b.$slides[d]).clone(!0).attr("id","").attr("data-slick-index",d+b.slideCount).appendTo(b.$slideTrack).addClass("slick-cloned");b.$slideTrack.find(".slick-cloned").find("[id]").each(function(){a(this).attr("id","")})}},b.prototype.setPaused=function(a){var b=this;b.options.autoplay===!0&&b.options.pauseOnHover===!0&&(b.paused=a,a?b.autoPlayClear():b.autoPlay())},b.prototype.selectHandler=function(b){var c=this,d=a(b.target).is(".slick-slide")?a(b.target):a(b.target).parents(".slick-slide"),e=parseInt(d.attr("data-slick-index"));return e||(e=0),c.slideCount<=c.options.slidesToShow?(c.setSlideClasses(e),c.asNavFor(e),void 0):(c.slideHandler(e),void 0)},b.prototype.slideHandler=function(a,b,c){var d,e,f,g,h=null,i=this;return b=b||!1,i.animating===!0&&i.options.waitForAnimate===!0||i.options.fade===!0&&i.currentSlide===a||i.slideCount<=i.options.slidesToShow?void 0:(b===!1&&i.asNavFor(a),d=a,h=i.getLeft(d),g=i.getLeft(i.currentSlide),i.currentLeft=null===i.swipeLeft?g:i.swipeLeft,i.options.infinite===!1&&i.options.centerMode===!1&&(0>a||a>i.getDotCount()*i.options.slidesToScroll)?(i.options.fade===!1&&(d=i.currentSlide,c!==!0?i.animateSlide(g,function(){i.postSlide(d)}):i.postSlide(d)),void 0):i.options.infinite===!1&&i.options.centerMode===!0&&(0>a||a>i.slideCount-i.options.slidesToScroll)?(i.options.fade===!1&&(d=i.currentSlide,c!==!0?i.animateSlide(g,function(){i.postSlide(d)}):i.postSlide(d)),void 0):(i.options.autoplay===!0&&clearInterval(i.autoPlayTimer),e=0>d?0!==i.slideCount%i.options.slidesToScroll?i.slideCount-i.slideCount%i.options.slidesToScroll:i.slideCount+d:d>=i.slideCount?0!==i.slideCount%i.options.slidesToScroll?0:d-i.slideCount:d,i.animating=!0,i.$slider.trigger("beforeChange",[i,i.currentSlide,e]),f=i.currentSlide,i.currentSlide=e,i.setSlideClasses(i.currentSlide),i.updateDots(),i.updateArrows(),i.options.fade===!0?(c!==!0?(i.fadeSlideOut(f),i.fadeSlide(e,function(){i.postSlide(e)
})):i.postSlide(e),i.animateHeight(),void 0):(c!==!0?i.animateSlide(h,function(){i.postSlide(e)}):i.postSlide(e),void 0)))},b.prototype.startLoad=function(){var a=this;a.options.arrows===!0&&a.slideCount>a.options.slidesToShow&&(a.$prevArrow.hide(),a.$nextArrow.hide()),a.options.dots===!0&&a.slideCount>a.options.slidesToShow&&a.$dots.hide(),a.$slider.addClass("slick-loading")},b.prototype.swipeDirection=function(){var a,b,c,d,e=this;return a=e.touchObject.startX-e.touchObject.curX,b=e.touchObject.startY-e.touchObject.curY,c=Math.atan2(b,a),d=Math.round(180*c/Math.PI),0>d&&(d=360-Math.abs(d)),45>=d&&d>=0?e.options.rtl===!1?"left":"right":360>=d&&d>=315?e.options.rtl===!1?"left":"right":d>=135&&225>=d?e.options.rtl===!1?"right":"left":e.options.verticalSwiping===!0?d>=35&&135>=d?"left":"right":"vertical"},b.prototype.swipeEnd=function(){var c,b=this;if(b.dragging=!1,b.shouldClick=b.touchObject.swipeLength>10?!1:!0,void 0===b.touchObject.curX)return!1;if(b.touchObject.edgeHit===!0&&b.$slider.trigger("edge",[b,b.swipeDirection()]),b.touchObject.swipeLength>=b.touchObject.minSwipe)switch(b.swipeDirection()){case"left":c=b.options.swipeToSlide?b.checkNavigable(b.currentSlide+b.getSlideCount()):b.currentSlide+b.getSlideCount(),b.slideHandler(c),b.currentDirection=0,b.touchObject={},b.$slider.trigger("swipe",[b,"left"]);break;case"right":c=b.options.swipeToSlide?b.checkNavigable(b.currentSlide-b.getSlideCount()):b.currentSlide-b.getSlideCount(),b.slideHandler(c),b.currentDirection=1,b.touchObject={},b.$slider.trigger("swipe",[b,"right"])}else b.touchObject.startX!==b.touchObject.curX&&(b.slideHandler(b.currentSlide),b.touchObject={})},b.prototype.swipeHandler=function(a){var b=this;if(!(b.options.swipe===!1||"ontouchend"in document&&b.options.swipe===!1||b.options.draggable===!1&&-1!==a.type.indexOf("mouse")))switch(b.touchObject.fingerCount=a.originalEvent&&void 0!==a.originalEvent.touches?a.originalEvent.touches.length:1,b.touchObject.minSwipe=b.listWidth/b.options.touchThreshold,b.options.verticalSwiping===!0&&(b.touchObject.minSwipe=b.listHeight/b.options.touchThreshold),a.data.action){case"start":b.swipeStart(a);break;case"move":b.swipeMove(a);break;case"end":b.swipeEnd(a)}},b.prototype.swipeMove=function(a){var d,e,f,g,h,b=this;return h=void 0!==a.originalEvent?a.originalEvent.touches:null,!b.dragging||h&&1!==h.length?!1:(d=b.getLeft(b.currentSlide),b.touchObject.curX=void 0!==h?h[0].pageX:a.clientX,b.touchObject.curY=void 0!==h?h[0].pageY:a.clientY,b.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(b.touchObject.curX-b.touchObject.startX,2))),b.options.verticalSwiping===!0&&(b.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(b.touchObject.curY-b.touchObject.startY,2)))),e=b.swipeDirection(),"vertical"!==e?(void 0!==a.originalEvent&&b.touchObject.swipeLength>4&&a.preventDefault(),g=(b.options.rtl===!1?1:-1)*(b.touchObject.curX>b.touchObject.startX?1:-1),b.options.verticalSwiping===!0&&(g=b.touchObject.curY>b.touchObject.startY?1:-1),f=b.touchObject.swipeLength,b.touchObject.edgeHit=!1,b.options.infinite===!1&&(0===b.currentSlide&&"right"===e||b.currentSlide>=b.getDotCount()&&"left"===e)&&(f=b.touchObject.swipeLength*b.options.edgeFriction,b.touchObject.edgeHit=!0),b.swipeLeft=b.options.vertical===!1?d+f*g:d+f*(b.$list.height()/b.listWidth)*g,b.options.verticalSwiping===!0&&(b.swipeLeft=d+f*g),b.options.fade===!0||b.options.touchMove===!1?!1:b.animating===!0?(b.swipeLeft=null,!1):(b.setCSS(b.swipeLeft),void 0)):void 0)},b.prototype.swipeStart=function(a){var c,b=this;return 1!==b.touchObject.fingerCount||b.slideCount<=b.options.slidesToShow?(b.touchObject={},!1):(void 0!==a.originalEvent&&void 0!==a.originalEvent.touches&&(c=a.originalEvent.touches[0]),b.touchObject.startX=b.touchObject.curX=void 0!==c?c.pageX:a.clientX,b.touchObject.startY=b.touchObject.curY=void 0!==c?c.pageY:a.clientY,b.dragging=!0,void 0)},b.prototype.unfilterSlides=b.prototype.slickUnfilter=function(){var a=this;null!==a.$slidesCache&&(a.unload(),a.$slideTrack.children(this.options.slide).detach(),a.$slidesCache.appendTo(a.$slideTrack),a.reinit())},b.prototype.unload=function(){var b=this;a(".slick-cloned",b.$slider).remove(),b.$dots&&b.$dots.remove(),b.$prevArrow&&b.htmlExpr.test(b.options.prevArrow)&&b.$prevArrow.remove(),b.$nextArrow&&b.htmlExpr.test(b.options.nextArrow)&&b.$nextArrow.remove(),b.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden","true").css("width","")},b.prototype.unslick=function(a){var b=this;b.$slider.trigger("unslick",[b,a]),b.destroy()},b.prototype.updateArrows=function(){var b,a=this;b=Math.floor(a.options.slidesToShow/2),a.options.arrows===!0&&a.slideCount>a.options.slidesToShow&&!a.options.infinite&&(a.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false"),a.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false"),0===a.currentSlide?(a.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true"),a.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false")):a.currentSlide>=a.slideCount-a.options.slidesToShow&&a.options.centerMode===!1?(a.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),a.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")):a.currentSlide>=a.slideCount-1&&a.options.centerMode===!0&&(a.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),a.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")))},b.prototype.updateDots=function(){var a=this;null!==a.$dots&&(a.$dots.find("li").removeClass("slick-active").attr("aria-hidden","true"),a.$dots.find("li").eq(Math.floor(a.currentSlide/a.options.slidesToScroll)).addClass("slick-active").attr("aria-hidden","false"))},b.prototype.visibility=function(){var a=this;document[a.hidden]?(a.paused=!0,a.autoPlayClear()):a.options.autoplay===!0&&(a.paused=!1,a.autoPlay())},b.prototype.initADA=function(){var b=this;b.$slides.add(b.$slideTrack.find(".slick-cloned")).attr({"aria-hidden":"true",tabindex:"-1"}).find("a, input, button, select").attr({tabindex:"-1"}),b.$slideTrack.attr("role","listbox"),b.$slides.not(b.$slideTrack.find(".slick-cloned")).each(function(c){a(this).attr({role:"option","aria-describedby":"slick-slide"+b.instanceUid+c})}),null!==b.$dots&&b.$dots.attr("role","tablist").find("li").each(function(c){a(this).attr({role:"presentation","aria-selected":"false","aria-controls":"navigation"+b.instanceUid+c,id:"slick-slide"+b.instanceUid+c})}).first().attr("aria-selected","true").end().find("button").attr("role","button").end().closest("div").attr("role","toolbar"),b.activateADA()},b.prototype.activateADA=function(){var a=this,b=a.$slider.find("*").is(":focus");a.$slideTrack.find(".slick-active").attr({"aria-hidden":"false",tabindex:"0"}).find("a, input, button, select").attr({tabindex:"0"}),b&&a.$slideTrack.find(".slick-active").focus()},b.prototype.focusHandler=function(){var b=this;b.$slider.on("focus.slick blur.slick","*",function(c){c.stopImmediatePropagation();var d=a(this);setTimeout(function(){b.isPlay&&(d.is(":focus")?(b.autoPlayClear(),b.paused=!0):(b.paused=!1,b.autoPlay()))},0)})},a.fn.slick=function(){var g,a=this,c=arguments[0],d=Array.prototype.slice.call(arguments,1),e=a.length,f=0;for(f;e>f;f++)if("object"==typeof c||"undefined"==typeof c?a[f].slick=new b(a[f],c):g=a[f].slick[c].apply(a[f].slick,d),"undefined"!=typeof g)return g;return a}});




/*-----------Calendar------------------*/
(function($, undefined){

  var $window = $(window);

  function UTCDate(){
    return new Date(Date.UTC.apply(Date, arguments));
  }
  function UTCToday(){
    var today = new Date();
    return UTCDate(today.getFullYear(), today.getMonth(), today.getDate());
  }
  function alias(method){
    return function(){
      return this[method].apply(this, arguments);
    };
  }

  var DateArray = (function(){
    var extras = {
      get: function(i){
        return this.slice(i)[0];
      },
      contains: function(d){
        // Array.indexOf is not cross-browser;
        // $.inArray doesn't work with Dates
        var val = d && d.valueOf();
        for (var i=0, l=this.length; i < l; i++)
          if (this[i].valueOf() === val)
            return i;
        return -1;
      },
      remove: function(i){
        this.splice(i,1);
      },
      replace: function(new_array){
        if (!new_array)
          return;
        if (!$.isArray(new_array))
          new_array = [new_array];
        this.clear();
        this.push.apply(this, new_array);
      },
      clear: function(){
        this.length = 0;
      },
      copy: function(){
        var a = new DateArray();
        a.replace(this);
        return a;
      }
    };

    return function(){
      var a = [];
      a.push.apply(a, arguments);
      $.extend(a, extras);
      return a;
    };
  })();


  // Picker object

  var Datepicker = function(element, options){
    this.dates = new DateArray();
    this.viewDate = UTCToday();
    this.focusDate = null;

    this._process_options(options);

    this.element = $(element);
    this.isInline = false;
    this.isInput = this.element.is('input');
    this.component = this.element.is('.date') ? this.element.find('.add-on, .input-group-addon, .btn') : false;
    this.hasInput = this.component && this.element.find('input').length;
    if (this.component && this.component.length === 0)
      this.component = false;

    this.picker = $(DPGlobal.template);
    this._buildEvents();
    this._attachEvents();

    if (this.isInline){
      this.picker.addClass('datepicker-inline').appendTo(this.element);
    }
    else {
      this.picker.addClass('datepicker-dropdown dropdown-menu');
    }

    if (this.o.rtl){
      this.picker.addClass('datepicker-rtl');
    }

    this.viewMode = this.o.startView;

    if (this.o.calendarWeeks)
      this.picker.find('tfoot th.today')
            .attr('colspan', function(i, val){
              return parseInt(val) + 1;
            });

    this._allow_update = false;

    this.setStartDate(this._o.startDate);
    this.setEndDate(this._o.endDate);
    this.setDaysOfWeekDisabled(this.o.daysOfWeekDisabled);

    this.fillDow();
    this.fillMonths();

    this._allow_update = true;

    this.update();
    this.showMode();

    if (this.isInline){
      this.show();
    }
  };

  Datepicker.prototype = {
    constructor: Datepicker,

    _process_options: function(opts){
      // Store raw options for reference
      this._o = $.extend({}, this._o, opts);
      // Processed options
      var o = this.o = $.extend({}, this._o);

      // Check if "de-DE" style date is available, if not language should
      // fallback to 2 letter code eg "de"
      var lang = o.language;
      if (!dates[lang]){
        lang = lang.split('-')[0];
        if (!dates[lang])
          lang = defaults.language;
      }
      o.language = lang;

      switch (o.startView){
        case 2:
        case 'decade':
          o.startView = 2;
          break;
        case 1:
        case 'year':
          o.startView = 1;
          break;
        default:
          o.startView = 0;
      }

      switch (o.minViewMode){
        case 1:
        case 'months':
          o.minViewMode = 1;
          break;
        case 2:
        case 'years':
          o.minViewMode = 2;
          break;
        default:
          o.minViewMode = 0;
      }

      o.startView = Math.max(o.startView, o.minViewMode);

      // true, false, or Number > 0
      if (o.multidate !== true){
        o.multidate = Number(o.multidate) || false;
        if (o.multidate !== false)
          o.multidate = Math.max(0, o.multidate);
        else
          o.multidate = 1;
      }
      o.multidateSeparator = String(o.multidateSeparator);

      o.weekStart %= 7;
      o.weekEnd = ((o.weekStart + 6) % 7);

      var format = DPGlobal.parseFormat(o.format);
      if (o.startDate !== -Infinity){
        if (!!o.startDate){
          if (o.startDate instanceof Date)
            o.startDate = this._local_to_utc(this._zero_time(o.startDate));
          else
            o.startDate = DPGlobal.parseDate(o.startDate, format, o.language);
        }
        else {
          o.startDate = -Infinity;
        }
      }
      if (o.endDate !== Infinity){
        if (!!o.endDate){
          if (o.endDate instanceof Date)
            o.endDate = this._local_to_utc(this._zero_time(o.endDate));
          else
            o.endDate = DPGlobal.parseDate(o.endDate, format, o.language);
        }
        else {
          o.endDate = Infinity;
        }
      }

      o.daysOfWeekDisabled = o.daysOfWeekDisabled||[];
      if (!$.isArray(o.daysOfWeekDisabled))
        o.daysOfWeekDisabled = o.daysOfWeekDisabled.split(/[,\s]*/);
      o.daysOfWeekDisabled = $.map(o.daysOfWeekDisabled, function(d){
        return parseInt(d, 10);
      });

      var plc = String(o.orientation).toLowerCase().split(/\s+/g),
        _plc = o.orientation.toLowerCase();
      plc = $.grep(plc, function(word){
        return (/^auto|left|right|top|bottom$/).test(word);
      });
      o.orientation = {x: 'auto', y: 'auto'};
      if (!_plc || _plc === 'auto')
        ; // no action
      else if (plc.length === 1){
        switch (plc[0]){
          case 'top':
          case 'bottom':
            o.orientation.y = plc[0];
            break;
          case 'left':
          case 'right':
            o.orientation.x = plc[0];
            break;
        }
      }
      else {
        _plc = $.grep(plc, function(word){
          return (/^left|right$/).test(word);
        });
        o.orientation.x = _plc[0] || 'auto';

        _plc = $.grep(plc, function(word){
          return (/^top|bottom$/).test(word);
        });
        o.orientation.y = _plc[0] || 'auto';
      }
    },
    _events: [],
    _secondaryEvents: [],
    _applyEvents: function(evs){
      for (var i=0, el, ch, ev; i < evs.length; i++){
        el = evs[i][0];
        if (evs[i].length === 2){
          ch = undefined;
          ev = evs[i][1];
        }
        else if (evs[i].length === 3){
          ch = evs[i][1];
          ev = evs[i][2];
        }
        el.on(ev, ch);
      }
    },
    _unapplyEvents: function(evs){
      for (var i=0, el, ev, ch; i < evs.length; i++){
        el = evs[i][0];
        if (evs[i].length === 2){
          ch = undefined;
          ev = evs[i][1];
        }
        else if (evs[i].length === 3){
          ch = evs[i][1];
          ev = evs[i][2];
        }
        el.off(ev, ch);
      }
    },
    _buildEvents: function(){
      if (this.isInput){ // single input
        this._events = [
          [this.element, {
            focus: $.proxy(this.show, this),
            keyup: $.proxy(function(e){
              if ($.inArray(e.keyCode, [27,37,39,38,40,32,13,9]) === -1)
                this.update();
            }, this),
            keydown: $.proxy(this.keydown, this)
          }]
        ];
      }
      else if (this.component && this.hasInput){ // component: input + button
        this._events = [
          // For components that are not readonly, allow keyboard nav
          [this.element.find('input'), {
            focus: $.proxy(this.show, this),
            keyup: $.proxy(function(e){
              if ($.inArray(e.keyCode, [27,37,39,38,40,32,13,9]) === -1)
                this.update();
            }, this),
            keydown: $.proxy(this.keydown, this)
          }],
          [this.component, {
            click: $.proxy(this.show, this)
          }]
        ];
      }
      else if (this.element.is('div')){  // inline datepicker
        this.isInline = true;
      }
      else {
        this._events = [
          [this.element, {
            click: $.proxy(this.show, this)
          }]
        ];
      }
      this._events.push(
        // Component: listen for blur on element descendants
        [this.element, '*', {
          blur: $.proxy(function(e){
            this._focused_from = e.target;
          }, this)
        }],
        // Input: listen for blur on element
        [this.element, {
          blur: $.proxy(function(e){
            this._focused_from = e.target;
          }, this)
        }]
      );

      this._secondaryEvents = [
        [this.picker, {
          click: $.proxy(this.click, this)
        }],
        [$(window), {
          resize: $.proxy(this.place, this)
        }],
        [$(document), {
          'mousedown touchstart': $.proxy(function(e){
            // Clicked outside the datepicker, hide it
            if (!(
              this.element.is(e.target) ||
              this.element.find(e.target).length ||
              this.picker.is(e.target) ||
              this.picker.find(e.target).length
            )){
              this.hide();
            }
          }, this)
        }]
      ];
    },
    _attachEvents: function(){
      this._detachEvents();
      this._applyEvents(this._events);
    },
    _detachEvents: function(){
      this._unapplyEvents(this._events);
    },
    _attachSecondaryEvents: function(){
      this._detachSecondaryEvents();
      this._applyEvents(this._secondaryEvents);
    },
    _detachSecondaryEvents: function(){
      this._unapplyEvents(this._secondaryEvents);
    },
    _trigger: function(event, altdate){
      var date = altdate || this.dates.get(-1),
        local_date = this._utc_to_local(date);

      this.element.trigger({
        type: event,
        date: local_date,
        dates: $.map(this.dates, this._utc_to_local),
        format: $.proxy(function(ix, format){
          if (arguments.length === 0){
            ix = this.dates.length - 1;
            format = this.o.format;
          }
          else if (typeof ix === 'string'){
            format = ix;
            ix = this.dates.length - 1;
          }
          format = format || this.o.format;
          var date = this.dates.get(ix);
          return DPGlobal.formatDate(date, format, this.o.language);
        }, this)
      });
    },

    show: function(){
      if (!this.isInline)
        this.picker.appendTo('body');
      this.picker.show();
      this.place();
      this._attachSecondaryEvents();
      this._trigger('show');
    },

    hide: function(){
      if (this.isInline)
        return;
      if (!this.picker.is(':visible'))
        return;
      this.focusDate = null;
      this.picker.hide().detach();
      this._detachSecondaryEvents();
      this.viewMode = this.o.startView;
      this.showMode();

      if (
        this.o.forceParse &&
        (
          this.isInput && this.element.val() ||
          this.hasInput && this.element.find('input').val()
        )
      )
        this.setValue();
      this._trigger('hide');
    },

    remove: function(){
      this.hide();
      this._detachEvents();
      this._detachSecondaryEvents();
      this.picker.remove();
      delete this.element.data().datepicker;
      if (!this.isInput){
        delete this.element.data().date;
      }
    },

    _utc_to_local: function(utc){
      return utc && new Date(utc.getTime() + (utc.getTimezoneOffset()*60000));
    },
    _local_to_utc: function(local){
      return local && new Date(local.getTime() - (local.getTimezoneOffset()*60000));
    },
    _zero_time: function(local){
      return local && new Date(local.getFullYear(), local.getMonth(), local.getDate());
    },
    _zero_utc_time: function(utc){
      return utc && new Date(Date.UTC(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate()));
    },

    getDates: function(){
      return $.map(this.dates, this._utc_to_local);
    },

    getUTCDates: function(){
      return $.map(this.dates, function(d){
        return new Date(d);
      });
    },

    getDate: function(){
      return this._utc_to_local(this.getUTCDate());
    },

    getUTCDate: function(){
      return new Date(this.dates.get(-1));
    },

    setDates: function(){
      var args = $.isArray(arguments[0]) ? arguments[0] : arguments;
      this.update.apply(this, args);
      this._trigger('changeDate');
      this.setValue();
    },

    setUTCDates: function(){
      var args = $.isArray(arguments[0]) ? arguments[0] : arguments;
      this.update.apply(this, $.map(args, this._utc_to_local));
      this._trigger('changeDate');
      this.setValue();
    },

    setDate: alias('setDates'),
    setUTCDate: alias('setUTCDates'),

    setValue: function(){
      var formatted = this.getFormattedDate();
      if (!this.isInput){
        if (this.component){
          this.element.find('input').val(formatted).change();
        }
      }
      else {
        this.element.val(formatted).change();
      }
    },

    getFormattedDate: function(format){
      if (format === undefined)
        format = this.o.format;

      var lang = this.o.language;
      return $.map(this.dates, function(d){
        return DPGlobal.formatDate(d, format, lang);
      }).join(this.o.multidateSeparator);
    },

    setStartDate: function(startDate){
      this._process_options({startDate: startDate});
      this.update();
      this.updateNavArrows();
    },

    setEndDate: function(endDate){
      this._process_options({endDate: endDate});
      this.update();
      this.updateNavArrows();
    },

    setDaysOfWeekDisabled: function(daysOfWeekDisabled){
      this._process_options({daysOfWeekDisabled: daysOfWeekDisabled});
      this.update();
      this.updateNavArrows();
    },

    place: function(){
      if (this.isInline)
        return;
      var calendarWidth = this.picker.outerWidth(),
        calendarHeight = this.picker.outerHeight(),
        visualPadding = 10,
        windowWidth = $window.width(),
        windowHeight = $window.height(),
        scrollTop = $window.scrollTop();

      var zIndex = parseInt(this.element.parents().filter(function(){
          return $(this).css('z-index') !== 'auto';
        }).first().css('z-index'))+10;
      var offset = this.component ? this.component.parent().offset() : this.element.offset();
      var height = this.component ? this.component.outerHeight(true) : this.element.outerHeight(false);
      var width = this.component ? this.component.outerWidth(true) : this.element.outerWidth(false);
      var left = offset.left,
        top = offset.top;

      this.picker.removeClass(
        'datepicker-orient-top datepicker-orient-bottom '+
        'datepicker-orient-right datepicker-orient-left'
      );

      if (this.o.orientation.x !== 'auto'){
        this.picker.addClass('datepicker-orient-' + this.o.orientation.x);
        if (this.o.orientation.x === 'right')
          left -= calendarWidth - width;
      }
      // auto x orientation is best-placement: if it crosses a window
      // edge, fudge it sideways
      else {
        // Default to left
        this.picker.addClass('datepicker-orient-left');
        if (offset.left < 0)
          left -= offset.left - visualPadding;
        else if (offset.left + calendarWidth > windowWidth)
          left = windowWidth - calendarWidth - visualPadding;
      }

      // auto y orientation is best-situation: top or bottom, no fudging,
      // decision based on which shows more of the calendar
      var yorient = this.o.orientation.y,
        top_overflow, bottom_overflow;
      if (yorient === 'auto'){
        top_overflow = -scrollTop + offset.top - calendarHeight;
        bottom_overflow = scrollTop + windowHeight - (offset.top + height + calendarHeight);
        if (Math.max(top_overflow, bottom_overflow) === bottom_overflow)
          yorient = 'top';
        else
          yorient = 'bottom';
      }
      this.picker.addClass('datepicker-orient-' + yorient);
      if (yorient === 'top')
        top += height;
      else
        top -= calendarHeight + parseInt(this.picker.css('padding-top'));

      this.picker.css({
        top: top,
        left: left,
        zIndex: zIndex
      });
    },

    _allow_update: true,
    update: function(){
      if (!this._allow_update)
        return;

      var oldDates = this.dates.copy(),
        dates = [],
        fromArgs = false;
      if (arguments.length){
        $.each(arguments, $.proxy(function(i, date){
          if (date instanceof Date)
            date = this._local_to_utc(date);
          dates.push(date);
        }, this));
        fromArgs = true;
      }
      else {
        dates = this.isInput
            ? this.element.val()
            : this.element.data('date') || this.element.find('input').val();
        if (dates && this.o.multidate)
          dates = dates.split(this.o.multidateSeparator);
        else
          dates = [dates];
        delete this.element.data().date;
      }

      dates = $.map(dates, $.proxy(function(date){
        return DPGlobal.parseDate(date, this.o.format, this.o.language);
      }, this));
      dates = $.grep(dates, $.proxy(function(date){
        return (
          date < this.o.startDate ||
          date > this.o.endDate ||
          !date
        );
      }, this), true);
      this.dates.replace(dates);

      if (this.dates.length)
        this.viewDate = new Date(this.dates.get(-1));
      else if (this.viewDate < this.o.startDate)
        this.viewDate = new Date(this.o.startDate);
      else if (this.viewDate > this.o.endDate)
        this.viewDate = new Date(this.o.endDate);

      if (fromArgs){
        // setting date by clicking
        this.setValue();
      }
      else if (dates.length){
        // setting date by typing
        if (String(oldDates) !== String(this.dates))
          this._trigger('changeDate');
      }
      if (!this.dates.length && oldDates.length)
        this._trigger('clearDate');

      this.fill();
    },

    fillDow: function(){
      var dowCnt = this.o.weekStart,
        html = '<tr>';
      if (this.o.calendarWeeks){
        var cell = '<th class="cw">&nbsp;</th>';
        html += cell;
        this.picker.find('.datepicker-days thead tr:first-child').prepend(cell);
      }
      while (dowCnt < this.o.weekStart + 7){
        html += '<th class="dow">'+dates[this.o.language].daysMin[(dowCnt++)%7]+'</th>';
      }
      html += '</tr>';
      this.picker.find('.datepicker-days thead').append(html);
    },

    fillMonths: function(){
      var html = '',
      i = 0;
      while (i < 12){
        html += '<span class="month">'+dates[this.o.language].monthsShort[i++]+'</span>';
      }
      this.picker.find('.datepicker-months td').html(html);
    },

    setRange: function(range){
      if (!range || !range.length)
        delete this.range;
      else
        this.range = $.map(range, function(d){
          return d.valueOf();
        });
      this.fill();
    },

    getClassNames: function(date){
      var cls = [],
        year = this.viewDate.getUTCFullYear(),
        month = this.viewDate.getUTCMonth(),
        today = new Date();
      if (date.getUTCFullYear() < year || (date.getUTCFullYear() === year && date.getUTCMonth() < month)){
        cls.push('old');
      }
      else if (date.getUTCFullYear() > year || (date.getUTCFullYear() === year && date.getUTCMonth() > month)){
        cls.push('new');
      }
      if (this.focusDate && date.valueOf() === this.focusDate.valueOf())
        cls.push('focused');
      // Compare internal UTC date with local today, not UTC today
      if (this.o.todayHighlight &&
        date.getUTCFullYear() === today.getFullYear() &&
        date.getUTCMonth() === today.getMonth() &&
        date.getUTCDate() === today.getDate()){
        cls.push('today');
      }
      if (this.dates.contains(date) !== -1)
        cls.push('active');
      if (date.valueOf() < this.o.startDate || date.valueOf() > this.o.endDate ||
        $.inArray(date.getUTCDay(), this.o.daysOfWeekDisabled) !== -1){
        cls.push('disabled');
      }
      if (this.range){
        if (date > this.range[0] && date < this.range[this.range.length-1]){
          cls.push('range');
        }
        if ($.inArray(date.valueOf(), this.range) !== -1){
          cls.push('selected');
        }
      }
      return cls;
    },

    fill: function(){
      var d = new Date(this.viewDate),
        year = d.getUTCFullYear(),
        month = d.getUTCMonth(),
        startYear = this.o.startDate !== -Infinity ? this.o.startDate.getUTCFullYear() : -Infinity,
        startMonth = this.o.startDate !== -Infinity ? this.o.startDate.getUTCMonth() : -Infinity,
        endYear = this.o.endDate !== Infinity ? this.o.endDate.getUTCFullYear() : Infinity,
        endMonth = this.o.endDate !== Infinity ? this.o.endDate.getUTCMonth() : Infinity,
        todaytxt = dates[this.o.language].today || dates['en'].today || '',
        cleartxt = dates[this.o.language].clear || dates['en'].clear || '',
        tooltip;
      this.picker.find('.datepicker-days thead th.datepicker-switch')
            .text(dates[this.o.language].months[month]+' '+year);
      this.picker.find('tfoot th.today')
            .text(todaytxt)
            .toggle(this.o.todayBtn !== false);
      this.picker.find('tfoot th.clear')
            .text(cleartxt)
            .toggle(this.o.clearBtn !== false);
      this.updateNavArrows();
      this.fillMonths();
      var prevMonth = UTCDate(year, month-1, 28),
        day = DPGlobal.getDaysInMonth(prevMonth.getUTCFullYear(), prevMonth.getUTCMonth());
      prevMonth.setUTCDate(day);
      prevMonth.setUTCDate(day - (prevMonth.getUTCDay() - this.o.weekStart + 7)%7);
      var nextMonth = new Date(prevMonth);
      nextMonth.setUTCDate(nextMonth.getUTCDate() + 42);
      nextMonth = nextMonth.valueOf();
      var html = [];
      var clsName;
      while (prevMonth.valueOf() < nextMonth){
        if (prevMonth.getUTCDay() === this.o.weekStart){
          html.push('<tr>');
          if (this.o.calendarWeeks){
            // ISO 8601: First week contains first thursday.
            // ISO also states week starts on Monday, but we can be more abstract here.
            var
              // Start of current week: based on weekstart/current date
              ws = new Date(+prevMonth + (this.o.weekStart - prevMonth.getUTCDay() - 7) % 7 * 864e5),
              // Thursday of this week
              th = new Date(Number(ws) + (7 + 4 - ws.getUTCDay()) % 7 * 864e5),
              // First Thursday of year, year from thursday
              yth = new Date(Number(yth = UTCDate(th.getUTCFullYear(), 0, 1)) + (7 + 4 - yth.getUTCDay())%7*864e5),
              // Calendar week: ms between thursdays, div ms per day, div 7 days
              calWeek =  (th - yth) / 864e5 / 7 + 1;
            html.push('<td class="cw">'+ calWeek +'</td>');

          }
        }
        clsName = this.getClassNames(prevMonth);
        clsName.push('day');

        if (this.o.beforeShowDay !== $.noop){
          var before = this.o.beforeShowDay(this._utc_to_local(prevMonth));
          if (before === undefined)
            before = {};
          else if (typeof(before) === 'boolean')
            before = {enabled: before};
          else if (typeof(before) === 'string')
            before = {classes: before};
          if (before.enabled === false)
            clsName.push('disabled');
          if (before.classes)
            clsName = clsName.concat(before.classes.split(/\s+/));
          if (before.tooltip)
            tooltip = before.tooltip;
        }

        clsName = $.unique(clsName);
        html.push('<td class="'+clsName.join(' ')+'"' + (tooltip ? ' title="'+tooltip+'"' : '') + '>'+prevMonth.getUTCDate() + '</td>');
        if (prevMonth.getUTCDay() === this.o.weekEnd){
          html.push('</tr>');
        }
        prevMonth.setUTCDate(prevMonth.getUTCDate()+1);
      }
      this.picker.find('.datepicker-days tbody').empty().append(html.join(''));

      var months = this.picker.find('.datepicker-months')
            .find('th:eq(1)')
              .text(year)
              .end()
            .find('span').removeClass('active');

      $.each(this.dates, function(i, d){
        if (d.getUTCFullYear() === year)
          months.eq(d.getUTCMonth()).addClass('active');
      });

      if (year < startYear || year > endYear){
        months.addClass('disabled');
      }
      if (year === startYear){
        months.slice(0, startMonth).addClass('disabled');
      }
      if (year === endYear){
        months.slice(endMonth+1).addClass('disabled');
      }

      html = '';
      year = parseInt(year/10, 10) * 10;
      var yearCont = this.picker.find('.datepicker-years')
                .find('th:eq(1)')
                  .text(year + '-' + (year + 9))
                  .end()
                .find('td');
      year -= 1;
      var years = $.map(this.dates, function(d){
          return d.getUTCFullYear();
        }),
        classes;
      for (var i = -1; i < 11; i++){
        classes = ['year'];
        if (i === -1)
          classes.push('old');
        else if (i === 10)
          classes.push('new');
        if ($.inArray(year, years) !== -1)
          classes.push('active');
        if (year < startYear || year > endYear)
          classes.push('disabled');
        html += '<span class="' + classes.join(' ') + '">'+year+'</span>';
        year += 1;
      }
      yearCont.html(html);
    },

    updateNavArrows: function(){
      if (!this._allow_update)
        return;

      var d = new Date(this.viewDate),
        year = d.getUTCFullYear(),
        month = d.getUTCMonth();
      switch (this.viewMode){
        case 0:
          if (this.o.startDate !== -Infinity && year <= this.o.startDate.getUTCFullYear() && month <= this.o.startDate.getUTCMonth()){
            this.picker.find('.prev').css({visibility: 'hidden'});
          }
          else {
            this.picker.find('.prev').css({visibility: 'visible'});
          }
          if (this.o.endDate !== Infinity && year >= this.o.endDate.getUTCFullYear() && month >= this.o.endDate.getUTCMonth()){
            this.picker.find('.next').css({visibility: 'hidden'});
          }
          else {
            this.picker.find('.next').css({visibility: 'visible'});
          }
          break;
        case 1:
        case 2:
          if (this.o.startDate !== -Infinity && year <= this.o.startDate.getUTCFullYear()){
            this.picker.find('.prev').css({visibility: 'hidden'});
          }
          else {
            this.picker.find('.prev').css({visibility: 'visible'});
          }
          if (this.o.endDate !== Infinity && year >= this.o.endDate.getUTCFullYear()){
            this.picker.find('.next').css({visibility: 'hidden'});
          }
          else {
            this.picker.find('.next').css({visibility: 'visible'});
          }
          break;
      }
    },

    click: function(e){
      e.preventDefault();
      var target = $(e.target).closest('span, td, th'),
        year, month, day;
      if (target.length === 1){
        switch (target[0].nodeName.toLowerCase()){
          case 'th':
            switch (target[0].className){
              case 'datepicker-switch':
                this.showMode(1);
                break;
              case 'prev':
              case 'next':
                var dir = DPGlobal.modes[this.viewMode].navStep * (target[0].className === 'prev' ? -1 : 1);
                switch (this.viewMode){
                  case 0:
                    this.viewDate = this.moveMonth(this.viewDate, dir);
                    this._trigger('changeMonth', this.viewDate);
                    break;
                  case 1:
                  case 2:
                    this.viewDate = this.moveYear(this.viewDate, dir);
                    if (this.viewMode === 1)
                      this._trigger('changeYear', this.viewDate);
                    break;
                }
                this.fill();
                break;
              case 'today':
                var date = new Date();
                date = UTCDate(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);

                this.showMode(-2);
                var which = this.o.todayBtn === 'linked' ? null : 'view';
                this._setDate(date, which);
                break;
              case 'clear':
                var element;
                if (this.isInput)
                  element = this.element;
                else if (this.component)
                  element = this.element.find('input');
                if (element)
                  element.val("").change();
                this.update();
                this._trigger('changeDate');
                if (this.o.autoclose)
                  this.hide();
                break;
            }
            break;
          case 'span':
            if (!target.is('.disabled')){
              this.viewDate.setUTCDate(1);
              if (target.is('.month')){
                day = 1;
                month = target.parent().find('span').index(target);
                year = this.viewDate.getUTCFullYear();
                this.viewDate.setUTCMonth(month);
                this._trigger('changeMonth', this.viewDate);
                if (this.o.minViewMode === 1){
                  this._setDate(UTCDate(year, month, day));
                }
              }
              else {
                day = 1;
                month = 0;
                year = parseInt(target.text(), 10)||0;
                this.viewDate.setUTCFullYear(year);
                this._trigger('changeYear', this.viewDate);
                if (this.o.minViewMode === 2){
                  this._setDate(UTCDate(year, month, day));
                }
              }
              this.showMode(-1);
              this.fill();
            }
            break;
          case 'td':
            if (target.is('.day') && !target.is('.disabled')){
              day = parseInt(target.text(), 10)||1;
              year = this.viewDate.getUTCFullYear();
              month = this.viewDate.getUTCMonth();
              if (target.is('.old')){
                if (month === 0){
                  month = 11;
                  year -= 1;
                }
                else {
                  month -= 1;
                }
              }
              else if (target.is('.new')){
                if (month === 11){
                  month = 0;
                  year += 1;
                }
                else {
                  month += 1;
                }
              }
              this._setDate(UTCDate(year, month, day));
            }
            break;
        }
      }
      if (this.picker.is(':visible') && this._focused_from){
        $(this._focused_from).focus();
      }
      delete this._focused_from;
    },

    _toggle_multidate: function(date){
      var ix = this.dates.contains(date);
      if (!date){
        this.dates.clear();
      }
      else if (ix !== -1){
        this.dates.remove(ix);
      }
      else {
        this.dates.push(date);
      }
      if (typeof this.o.multidate === 'number')
        while (this.dates.length > this.o.multidate)
          this.dates.remove(0);
    },

    _setDate: function(date, which){
      if (!which || which === 'date')
        this._toggle_multidate(date && new Date(date));
      if (!which || which  === 'view')
        this.viewDate = date && new Date(date);

      this.fill();
      this.setValue();
      this._trigger('changeDate');
      var element;
      if (this.isInput){
        element = this.element;
      }
      else if (this.component){
        element = this.element.find('input');
      }
      if (element){
        element.change();
      }
      if (this.o.autoclose && (!which || which === 'date')){
        this.hide();
      }
    },

    moveMonth: function(date, dir){
      if (!date)
        return undefined;
      if (!dir)
        return date;
      var new_date = new Date(date.valueOf()),
        day = new_date.getUTCDate(),
        month = new_date.getUTCMonth(),
        mag = Math.abs(dir),
        new_month, test;
      dir = dir > 0 ? 1 : -1;
      if (mag === 1){
        test = dir === -1
          // If going back one month, make sure month is not current month
          // (eg, Mar 31 -> Feb 31 == Feb 28, not Mar 02)
          ? function(){
            return new_date.getUTCMonth() === month;
          }
          // If going forward one month, make sure month is as expected
          // (eg, Jan 31 -> Feb 31 == Feb 28, not Mar 02)
          : function(){
            return new_date.getUTCMonth() !== new_month;
          };
        new_month = month + dir;
        new_date.setUTCMonth(new_month);
        // Dec -> Jan (12) or Jan -> Dec (-1) -- limit expected date to 0-11
        if (new_month < 0 || new_month > 11)
          new_month = (new_month + 12) % 12;
      }
      else {
        // For magnitudes >1, move one month at a time...
        for (var i=0; i < mag; i++)
          // ...which might decrease the day (eg, Jan 31 to Feb 28, etc)...
          new_date = this.moveMonth(new_date, dir);
        // ...then reset the day, keeping it in the new month
        new_month = new_date.getUTCMonth();
        new_date.setUTCDate(day);
        test = function(){
          return new_month !== new_date.getUTCMonth();
        };
      }
      // Common date-resetting loop -- if date is beyond end of month, make it
      // end of month
      while (test()){
        new_date.setUTCDate(--day);
        new_date.setUTCMonth(new_month);
      }
      return new_date;
    },

    moveYear: function(date, dir){
      return this.moveMonth(date, dir*12);
    },

    dateWithinRange: function(date){
      return date >= this.o.startDate && date <= this.o.endDate;
    },

    keydown: function(e){
      if (this.picker.is(':not(:visible)')){
        if (e.keyCode === 27) // allow escape to hide and re-show picker
          this.show();
        return;
      }
      var dateChanged = false,
        dir, newDate, newViewDate,
        focusDate = this.focusDate || this.viewDate;
      switch (e.keyCode){
        case 27: // escape
          if (this.focusDate){
            this.focusDate = null;
            this.viewDate = this.dates.get(-1) || this.viewDate;
            this.fill();
          }
          else
            this.hide();
          e.preventDefault();
          break;
        case 37: // left
        case 39: // right
          if (!this.o.keyboardNavigation)
            break;
          dir = e.keyCode === 37 ? -1 : 1;
          if (e.ctrlKey){
            newDate = this.moveYear(this.dates.get(-1) || UTCToday(), dir);
            newViewDate = this.moveYear(focusDate, dir);
            this._trigger('changeYear', this.viewDate);
          }
          else if (e.shiftKey){
            newDate = this.moveMonth(this.dates.get(-1) || UTCToday(), dir);
            newViewDate = this.moveMonth(focusDate, dir);
            this._trigger('changeMonth', this.viewDate);
          }
          else {
            newDate = new Date(this.dates.get(-1) || UTCToday());
            newDate.setUTCDate(newDate.getUTCDate() + dir);
            newViewDate = new Date(focusDate);
            newViewDate.setUTCDate(focusDate.getUTCDate() + dir);
          }
          if (this.dateWithinRange(newDate)){
            this.focusDate = this.viewDate = newViewDate;
            this.setValue();
            this.fill();
            e.preventDefault();
          }
          break;
        case 38: // up
        case 40: // down
          if (!this.o.keyboardNavigation)
            break;
          dir = e.keyCode === 38 ? -1 : 1;
          if (e.ctrlKey){
            newDate = this.moveYear(this.dates.get(-1) || UTCToday(), dir);
            newViewDate = this.moveYear(focusDate, dir);
            this._trigger('changeYear', this.viewDate);
          }
          else if (e.shiftKey){
            newDate = this.moveMonth(this.dates.get(-1) || UTCToday(), dir);
            newViewDate = this.moveMonth(focusDate, dir);
            this._trigger('changeMonth', this.viewDate);
          }
          else {
            newDate = new Date(this.dates.get(-1) || UTCToday());
            newDate.setUTCDate(newDate.getUTCDate() + dir * 7);
            newViewDate = new Date(focusDate);
            newViewDate.setUTCDate(focusDate.getUTCDate() + dir * 7);
          }
          if (this.dateWithinRange(newDate)){
            this.focusDate = this.viewDate = newViewDate;
            this.setValue();
            this.fill();
            e.preventDefault();
          }
          break;
        case 32: // spacebar
          // Spacebar is used in manually typing dates in some formats.
          // As such, its behavior should not be hijacked.
          break;
        case 13: // enter
          focusDate = this.focusDate || this.dates.get(-1) || this.viewDate;
          this._toggle_multidate(focusDate);
          dateChanged = true;
          this.focusDate = null;
          this.viewDate = this.dates.get(-1) || this.viewDate;
          this.setValue();
          this.fill();
          if (this.picker.is(':visible')){
            e.preventDefault();
            if (this.o.autoclose)
              this.hide();
          }
          break;
        case 9: // tab
          this.focusDate = null;
          this.viewDate = this.dates.get(-1) || this.viewDate;
          this.fill();
          this.hide();
          break;
      }
      if (dateChanged){
        if (this.dates.length)
          this._trigger('changeDate');
        else
          this._trigger('clearDate');
        var element;
        if (this.isInput){
          element = this.element;
        }
        else if (this.component){
          element = this.element.find('input');
        }
        if (element){
          element.change();
        }
      }
    },

    showMode: function(dir){
      if (dir){
        this.viewMode = Math.max(this.o.minViewMode, Math.min(2, this.viewMode + dir));
      }
      this.picker
        .find('>div')
        .hide()
        .filter('.datepicker-'+DPGlobal.modes[this.viewMode].clsName)
          .css('display', 'block');
      this.updateNavArrows();
    }
  };

  var DateRangePicker = function(element, options){
    this.element = $(element);
    this.inputs = $.map(options.inputs, function(i){
      return i.jquery ? i[0] : i;
    });
    delete options.inputs;

    $(this.inputs)
      .datepicker(options)
      .bind('changeDate', $.proxy(this.dateUpdated, this));

    this.pickers = $.map(this.inputs, function(i){
      return $(i).data('datepicker');
    });
    this.updateDates();
  };
  DateRangePicker.prototype = {
    updateDates: function(){
      this.dates = $.map(this.pickers, function(i){
        return i.getUTCDate();
      });
      this.updateRanges();
    },
    updateRanges: function(){
      var range = $.map(this.dates, function(d){
        return d.valueOf();
      });
      $.each(this.pickers, function(i, p){
        p.setRange(range);
      });
    },
    dateUpdated: function(e){
      // `this.updating` is a workaround for preventing infinite recursion
      // between `changeDate` triggering and `setUTCDate` calling.  Until
      // there is a better mechanism.
      if (this.updating)
        return;
      this.updating = true;

      var dp = $(e.target).data('datepicker'),
        new_date = dp.getUTCDate(),
        i = $.inArray(e.target, this.inputs),
        l = this.inputs.length;
      if (i === -1)
        return;

      $.each(this.pickers, function(i, p){
        if (!p.getUTCDate())
          p.setUTCDate(new_date);
      });

      if (new_date < this.dates[i]){
        // Date being moved earlier/left
        while (i >= 0 && new_date < this.dates[i]){
          this.pickers[i--].setUTCDate(new_date);
        }
      }
      else if (new_date > this.dates[i]){
        // Date being moved later/right
        while (i < l && new_date > this.dates[i]){
          this.pickers[i++].setUTCDate(new_date);
        }
      }
      this.updateDates();

      delete this.updating;
    },
    remove: function(){
      $.map(this.pickers, function(p){ p.remove(); });
      delete this.element.data().datepicker;
    }
  };

  function opts_from_el(el, prefix){
    // Derive options from element data-attrs
    var data = $(el).data(),
      out = {}, inkey,
      replace = new RegExp('^' + prefix.toLowerCase() + '([A-Z])');
    prefix = new RegExp('^' + prefix.toLowerCase());
    function re_lower(_,a){
      return a.toLowerCase();
    }
    for (var key in data)
      if (prefix.test(key)){
        inkey = key.replace(replace, re_lower);
        out[inkey] = data[key];
      }
    return out;
  }

  function opts_from_locale(lang){
    // Derive options from locale plugins
    var out = {};
    // Check if "de-DE" style date is available, if not language should
    // fallback to 2 letter code eg "de"
    if (!dates[lang]){
      lang = lang.split('-')[0];
      if (!dates[lang])
        return;
    }
    var d = dates[lang];
    $.each(locale_opts, function(i,k){
      if (k in d)
        out[k] = d[k];
    });
    return out;
  }

  var old = $.fn.datepicker;
  $.fn.datepicker = function(option){
    var args = Array.apply(null, arguments);
    args.shift();
    var internal_return;
    this.each(function(){
      var $this = $(this),
        data = $this.data('datepicker'),
        options = typeof option === 'object' && option;
      if (!data){
        var elopts = opts_from_el(this, 'date'),
          // Preliminary otions
          xopts = $.extend({}, defaults, elopts, options),
          locopts = opts_from_locale(xopts.language),
          // Options priority: js args, data-attrs, locales, defaults
          opts = $.extend({}, defaults, locopts, elopts, options);
        if ($this.is('.input-daterange') || opts.inputs){
          var ropts = {
            inputs: opts.inputs || $this.find('input').toArray()
          };
          $this.data('datepicker', (data = new DateRangePicker(this, $.extend(opts, ropts))));
        }
        else {
          $this.data('datepicker', (data = new Datepicker(this, opts)));
        }
      }
      if (typeof option === 'string' && typeof data[option] === 'function'){
        internal_return = data[option].apply(data, args);
        if (internal_return !== undefined)
          return false;
      }
    });
    if (internal_return !== undefined)
      return internal_return;
    else
      return this;
  };

  var defaults = $.fn.datepicker.defaults = {
    autoclose: false,
    beforeShowDay: $.noop,
    calendarWeeks: false,
    clearBtn: false,
    daysOfWeekDisabled: [],
    endDate: Infinity,
    forceParse: true,
    format: 'mm/dd/yyyy',
    keyboardNavigation: true,
    language: 'en',
    minViewMode: 0,
    multidate: false,
    multidateSeparator: ',',
    orientation: "auto",
    rtl: false,
    startDate: -Infinity,
    startView: 0,
    todayBtn: false,
    todayHighlight: false,
    weekStart: 0
  };
  var locale_opts = $.fn.datepicker.locale_opts = [
    'format',
    'rtl',
    'weekStart'
  ];
  $.fn.datepicker.Constructor = Datepicker;
  var dates = $.fn.datepicker.dates = {
    en: {
      days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
      months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      today: "Today",
      clear: "Clear"
    }
  };

  var DPGlobal = {
    modes: [
      {
        clsName: 'days',
        navFnc: 'Month',
        navStep: 1
      },
      {
        clsName: 'months',
        navFnc: 'FullYear',
        navStep: 1
      },
      {
        clsName: 'years',
        navFnc: 'FullYear',
        navStep: 10
    }],
    isLeapYear: function(year){
      return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
    },
    getDaysInMonth: function(year, month){
      return [31, (DPGlobal.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    },
    validParts: /dd?|DD?|mm?|MM?|yy(?:yy)?/g,
    nonpunctuation: /[^ -\/:-@\[\u3400-\u9fff-`{-~\t\n\r]+/g,
    parseFormat: function(format){
      // IE treats \0 as a string end in inputs (truncating the value),
      // so it's a bad format delimiter, anyway
      var separators = format.replace(this.validParts, '\0').split('\0'),
        parts = format.match(this.validParts);
      if (!separators || !separators.length || !parts || parts.length === 0){
        throw new Error("Invalid date format.");
      }
      return {separators: separators, parts: parts};
    },
    parseDate: function(date, format, language){
      if (!date)
        return undefined;
      if (date instanceof Date)
        return date;
      if (typeof format === 'string')
        format = DPGlobal.parseFormat(format);
      var part_re = /([\-+]\d+)([dmwy])/,
        parts = date.match(/([\-+]\d+)([dmwy])/g),
        part, dir, i;
      if (/^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/.test(date)){
        date = new Date();
        for (i=0; i < parts.length; i++){
          part = part_re.exec(parts[i]);
          dir = parseInt(part[1]);
          switch (part[2]){
            case 'd':
              date.setUTCDate(date.getUTCDate() + dir);
              break;
            case 'm':
              date = Datepicker.prototype.moveMonth.call(Datepicker.prototype, date, dir);
              break;
            case 'w':
              date.setUTCDate(date.getUTCDate() + dir * 7);
              break;
            case 'y':
              date = Datepicker.prototype.moveYear.call(Datepicker.prototype, date, dir);
              break;
          }
        }
        return UTCDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0);
      }
      parts = date && date.match(this.nonpunctuation) || [];
      date = new Date();
      var parsed = {},
        setters_order = ['yyyy', 'yy', 'M', 'MM', 'm', 'mm', 'd', 'dd'],
        setters_map = {
          yyyy: function(d,v){
            return d.setUTCFullYear(v);
          },
          yy: function(d,v){
            return d.setUTCFullYear(2000+v);
          },
          m: function(d,v){
            if (isNaN(d))
              return d;
            v -= 1;
            while (v < 0) v += 12;
            v %= 12;
            d.setUTCMonth(v);
            while (d.getUTCMonth() !== v)
              d.setUTCDate(d.getUTCDate()-1);
            return d;
          },
          d: function(d,v){
            return d.setUTCDate(v);
          }
        },
        val, filtered;
      setters_map['M'] = setters_map['MM'] = setters_map['mm'] = setters_map['m'];
      setters_map['dd'] = setters_map['d'];
      date = UTCDate(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
      var fparts = format.parts.slice();
      // Remove noop parts
      if (parts.length !== fparts.length){
        fparts = $(fparts).filter(function(i,p){
          return $.inArray(p, setters_order) !== -1;
        }).toArray();
      }
      // Process remainder
      function match_part(){
        var m = this.slice(0, parts[i].length),
          p = parts[i].slice(0, m.length);
        return m === p;
      }
      if (parts.length === fparts.length){
        var cnt;
        for (i=0, cnt = fparts.length; i < cnt; i++){
          val = parseInt(parts[i], 10);
          part = fparts[i];
          if (isNaN(val)){
            switch (part){
              case 'MM':
                filtered = $(dates[language].months).filter(match_part);
                val = $.inArray(filtered[0], dates[language].months) + 1;
                break;
              case 'M':
                filtered = $(dates[language].monthsShort).filter(match_part);
                val = $.inArray(filtered[0], dates[language].monthsShort) + 1;
                break;
            }
          }
          parsed[part] = val;
        }
        var _date, s;
        for (i=0; i < setters_order.length; i++){
          s = setters_order[i];
          if (s in parsed && !isNaN(parsed[s])){
            _date = new Date(date);
            setters_map[s](_date, parsed[s]);
            if (!isNaN(_date))
              date = _date;
          }
        }
      }
      return date;
    },
    formatDate: function(date, format, language){
      if (!date)
        return '';
      if (typeof format === 'string')
        format = DPGlobal.parseFormat(format);
      var val = {
        d: date.getUTCDate(),
        D: dates[language].daysShort[date.getUTCDay()],
        DD: dates[language].days[date.getUTCDay()],
        m: date.getUTCMonth() + 1,
        M: dates[language].monthsShort[date.getUTCMonth()],
        MM: dates[language].months[date.getUTCMonth()],
        yy: date.getUTCFullYear().toString().substring(2),
        yyyy: date.getUTCFullYear()
      };
      val.dd = (val.d < 10 ? '0' : '') + val.d;
      val.mm = (val.m < 10 ? '0' : '') + val.m;
      date = [];
      var seps = $.extend([], format.separators);
      for (var i=0, cnt = format.parts.length; i <= cnt; i++){
        if (seps.length)
          date.push(seps.shift());
        date.push(val[format.parts[i]]);
      }
      return date.join('');
    },
    headTemplate: '<thead>'+
              '<tr>'+
                '<th class="prev">&laquo;</th>'+
                '<th colspan="5" class="datepicker-switch"></th>'+
                '<th class="next">&raquo;</th>'+
              '</tr>'+
            '</thead>',
    contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>',
    footTemplate: '<tfoot>'+
              '<tr>'+
                '<th colspan="7" class="today"></th>'+
              '</tr>'+
              '<tr>'+
                '<th colspan="7" class="clear"></th>'+
              '</tr>'+
            '</tfoot>'
  };
  DPGlobal.template = '<div class="datepicker">'+
              '<div class="datepicker-days">'+
                '<table class=" table-condensed">'+
                  DPGlobal.headTemplate+
                  '<tbody></tbody>'+
                  DPGlobal.footTemplate+
                '</table>'+
              '</div>'+
              '<div class="datepicker-months">'+
                '<table class="table-condensed">'+
                  DPGlobal.headTemplate+
                  DPGlobal.contTemplate+
                  DPGlobal.footTemplate+
                '</table>'+
              '</div>'+
              '<div class="datepicker-years">'+
                '<table class="table-condensed">'+
                  DPGlobal.headTemplate+
                  DPGlobal.contTemplate+
                  DPGlobal.footTemplate+
                '</table>'+
              '</div>'+
            '</div>';

  $.fn.datepicker.DPGlobal = DPGlobal;


  /* DATEPICKER NO CONFLICT
  * =================== */

  $.fn.datepicker.noConflict = function(){
    $.fn.datepicker = old;
    return this;
  };


  /* DATEPICKER DATA-API
  * ================== */

  $(document).on(
    'focus.datepicker.data-api click.datepicker.data-api',
    '[data-provide="datepicker"]',
    function(e){
      var $this = $(this);
      if ($this.data('datepicker'))
        return;
      e.preventDefault();
      // component click requires us to explicitly show it
      $this.datepicker('show');
    }
  );
  $(function(){
    $('[data-provide="datepicker-inline"]').datepicker();
  });

}(window.jQuery));

/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */

var dateFormat = function () {
  var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
    timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
    timezoneClip = /[^-+\dA-Z]/g,
    pad = function (val, len) {
      val = String(val);
      len = len || 2;
      while (val.length < len) val = "0" + val;
      return val;
    };

  // Regexes and supporting functions are cached through closure
  return function (date, mask, utc) {
    var dF = dateFormat;

    // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
    if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
      mask = date;
      date = undefined;
    }

    // Passing date through Date applies Date.parse, if necessary
    date = date ? new Date(date) : new Date;
    if (isNaN(date)) throw SyntaxError("invalid date");

    mask = String(dF.masks[mask] || mask || dF.masks["default"]);

    // Allow setting the utc argument via the mask
    if (mask.slice(0, 4) == "UTC:") {
      mask = mask.slice(4);
      utc = true;
    }

    var _ = utc ? "getUTC" : "get",
      d = date[_ + "Date"](),
      D = date[_ + "Day"](),
      m = date[_ + "Month"](),
      y = date[_ + "FullYear"](),
      H = date[_ + "Hours"](),
      M = date[_ + "Minutes"](),
      s = date[_ + "Seconds"](),
      L = date[_ + "Milliseconds"](),
      o = utc ? 0 : date.getTimezoneOffset(),
      flags = {
        d:    d,
        dd:   pad(d),
        ddd:  dF.i18n.dayNames[D],
        dddd: dF.i18n.dayNames[D + 7],
        m:    m + 1,
        mm:   pad(m + 1),
        mmm:  dF.i18n.monthNames[m],
        mmmm: dF.i18n.monthNames[m + 12],
        yy:   String(y).slice(2),
        yyyy: y,
        h:    H % 12 || 12,
        hh:   pad(H % 12 || 12),
        H:    H,
        HH:   pad(H),
        M:    M,
        MM:   pad(M),
        s:    s,
        ss:   pad(s),
        l:    pad(L, 3),
        L:    pad(L > 99 ? Math.round(L / 10) : L),
        t:    H < 12 ? "a"  : "p",
        tt:   H < 12 ? "am" : "pm",
        T:    H < 12 ? "A"  : "P",
        TT:   H < 12 ? "AM" : "PM",
        Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
        o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
        S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
      };

    return mask.replace(token, function ($0) {
      return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
    });
  };
}();

// Some common format strings
dateFormat.masks = {
  "default":      "ddd mmm dd yyyy HH:MM:ss",
  shortDate:      "m/d/yy",
  mediumDate:     "mmm d, yyyy",
  longDate:       "mmmm d, yyyy",
  fullDate:       "dddd, mmmm d, yyyy",
  shortTime:      "h:MM TT",
  mediumTime:     "h:MM:ss TT",
  longTime:       "h:MM:ss TT Z",
  isoDate:        "yyyy-mm-dd",
  isoTime:        "HH:MM:ss",
  isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
  isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
  dayNames: [
    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ],
  monthNames: [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
  return dateFormat(this, mask, utc);
};

$.fn.notes = function(name){
  return this.each(function(){
    var self = $(this);
    var add  = self.find(name+"__add");
    var time = self.find(name+"__time");
    var field = self.find(name+"__field");
    var list = self.find(name+"__list");

    var prevHtml = '';

    add.on('click', function(){
      if(field.val() != '' && field.val() != prevHtml) {
        var html = "<li><span>"+ (time.val() ? time.val() : "00:00") +"</span>"+field.val()+"</li>";
        prevHtml = field.val();
        
        list.append(html);

        setInterval(function(){
          prevHtml = '';
        }, 5000)
      }

      return false;
    });
  }); 
}

$(function(){
  $(".b-notes").notes(".b-notes");

  $("#calendar").datepicker({
    todayHighlight: true,
    weekStart: 1
  }).on({

    'changeDate': function(e) {

      if(typeof(e.date) == "undefined") return false;

      var milliseconds = Date.parse(e.date);

      setCelendarDay(milliseconds);
    }

  });

  var today = new Date();
  var milliseconds = Date.parse(today);

  setCelendarDay(milliseconds);

  function setCelendarDay(milliseconds){
    var date = new Date(milliseconds).format("dd/mm/yyyy");
    var formatTitle = new Date(milliseconds).format("dddd, <b>d mmmm</b>");
    var list = $(".b-notes__list");
    var title = $(".b-app__title");

    $.getJSON("https://dl.dropboxusercontent.com/u/27474693/db.json", function(data) {

      $.each(data.days, function(){
        var obj = this;
        
        if(date == obj.day) {
          var items = obj.data;
          
          list.html('');

          $.each(items, function(){
            var html = "<li><span>"+ this.time +"</span>"+this.title+"</li>";
            list.append(html);
          });

          return false;
        } else {
          list.html('');
        }

        title.html(formatTitle);
      })

    });
  }
});