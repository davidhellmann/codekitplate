/*
 * @version: 0.1beta
 * @author: hhofmann@fork.de
 *
 */

(function(jQuery){

  var pluginName = 'Slickslider'

  jQuery.fn.Slickslider = function(options){

    var defaults = {
      delay: 800,
      speed: 1000
    };

    var _self     = this;
    var options   = jQuery.extend(defaults, options);
    var debug     = false;
    var lazyslide = false;
    var dimensions;

    var methods = {
      init: function() {

        // Init if debug logging is enabled
        debug = ( _self.data( 'debug' ) && window.console ) ? _self.data( 'debug' ) : false;

        // Init lazyslide option
        lazyslide = _self.data( 'lazyslide' ) ? _self.data( 'lazyslide' ) : false;

        if ( debug )
          console.log( options.autoplay, options );

        if ( lazyslide ) {
            _self.height( 0 );
            methods.create();
        } else {
          methods.create();
          methods.setHeight();
        }

      }
      ,create: function () {
        _self.slick({
          accessibility: typeof(options.accessibility) !== 'undefined' ? options.accessibility : true,
          adaptiveHeight: typeof(options.adaptiveheight) !== 'undefined' ? options.adaptiveheight : false,
          appendArrows: typeof(options.appendarrows) !== 'undefined' ? $(options.appendarrows) : _self,
          appendDots: typeof(options.appenddots) !== 'undefined' ? $(options.appenddots) : _self,
          arrows: typeof(options.arrows) !== 'undefined' ? options.arrows : true,
          asNavFor: typeof(options.asnavfor) !== 'undefined' ? options.asnavfor : null,
          prevArrow: typeof(options.prevarrow) !== 'undefined' ? options.prevarrow : '<button type="button" data-role="none" class="slick-prev">Previous</button>',
          nextArrow: typeof(options.nextarrow) !== 'undefined' ? options.nextarrow : '<button type="button" data-role="none" class="slick-next">Next</button>',
          autoplay: typeof(options.autoplay) !== 'undefined' ? options.autoplay : false,
          autoplaySpeed: typeof(options.autoplayspeed) !== 'undefined' ? options.autoplayspeed : 3000,
          centerMode: typeof(options.centermode) !== 'undefined' ? options.centermode : false,
          centerPadding: typeof(options.centerpadding) !== 'undefined' ? options.centerpadding : '50px',
          cssEase: typeof(options.cssease) !== 'undefined' ? options.cssease : 'ease',
          dots: typeof(options.dots) !== 'undefined' ? options.dots : false,
          dotsClass: typeof(options.dotsclass) !== 'undefined' ? options.dotsclass : 'slick-dots',
          draggable: typeof(options.draggable) !== 'undefined' ? options.draggable : true,
          easing: typeof(options.easing) !== 'undefined' ? options.easing : 'linear',
          fade: typeof(options.fade) !== 'undefined' ? options.fade : false,
          focusOnSelect: typeof(options.focusonselect) !== 'undefined' ? options.focusonselect : false,
          infinite: typeof(options.infinite) !== 'undefined' ? options.infinite : true,
          initialSlide: typeof(options.initialslide) !== 'undefined' ? options.initialslide : 0,
          lazyLoad: typeof(options.lazyload) !== 'undefined' ? options.azyload : 'ondemand',
          onBeforeChange: typeof(options.onbeforechange) !== 'undefined' ? options.onbeforechange : null,
          onAfterChange: typeof(options.onafterchange) !== 'undefined' ? options.onafterchange : null,
          // onInit: typeof(options.oninit) !== 'undefined' ? options.oninit : null,
          onInit: function ( slider, b ) {
            if ( debug )
              console.log( 'Slider', slider, 'B', b );
            methods.slideDown();
          },
          onReInit: typeof(options.onreinit) !== 'undefined' ? options.onreinit : null,
          onSetPosition: typeof(options.onsetposition) !== 'undefined' ? options.onsetposition : null,
          pauseOnHover: typeof(options.pauseonhover) !== 'undefined' ? options.pauseonhover : true,
          pauseOnDotsHover: typeof(options.pauseondotshover) !== 'undefined' ? options.pauseondotshover : false,
          respondTo: typeof(options.respondto) !== 'undefined' ? options.respondto : 'window',
          responsive: typeof(options.responsive) !== 'undefined' ? options.responsive : null,
          rtl: typeof(options.rtl) !== 'undefined' ? options.rtl : false,
          slide: typeof(options.slide) !== 'undefined' ? options.slide : 'div',
          slidesToShow: typeof(options.slidestoshow) !== 'undefined' ? options.slidestoshow : 1,
          slidesToScroll: typeof(options.slidestoscroll) !== 'undefined' ? options.slidestoscroll : 1,
          speed: typeof(options.speed) !== 'undefined' ? options.speed : 500,
          swipe: typeof(options.swipe) !== 'undefined' ? options.swipe : true,
          swipeToSlide: typeof(options.swipetoslide) !== 'undefined' ? options.swipetoslide : false,
          touchMove: typeof(options.touchmove) !== 'undefined' ? options.touchmove : true,
          touchThreshold: typeof(options.touchthreshold) !== 'undefined' ? options.touchthreshold : 5,
          useCSS: typeof(options.usecss) !== 'undefined' ? options.usecss : true,
          variableWidth: typeof(options.variablewidth) !== 'undefined' ? options.variablewidth : false,
          vertical: typeof(options.vertical) !== 'undefined' ? options.vertical : false,
          waitForAnimate: typeof(options.waitforanimate) !== 'undefined' ? options.waitforanimate : true
        });
        
      }
      ,slideDown: function () {
        if ( lazyslide ) {

          dimensions = methods.getDimensions( _self );

          _self.delay( options.delay ).animate({
            height: dimensions.height + 'px',
            opacity: 1
          }, options.speed , function () {
            methods.setHeight();
          });
        }
      }
      ,setHeight: function (){
        _self.height( '100%' );
        _self.data( 'initialized', true ).attr( 'data-initialized', 'true' );
      }
      ,getDimensions: function ( element ) {
        var height = element.height();
        element.height( 'inherit' );
        element.css({
            // 'display':'block',
            'visibility':'hidden'
        });
        var _dim = {
            height: element.outerHeight(),
            width: element.outerWidth()
        };
        element.css({
            // 'display':'none',
            'visibility':'visible'
        });

        element.height( height );
        return _dim;
      }
    };

    _self.showSlider = function () {
      methods.slideDown();
    }

    return this.each(function(){
      methods.init(options);
    });

  }

})(jQuery);