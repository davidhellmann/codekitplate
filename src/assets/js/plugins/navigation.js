/*
 * @version: 0.1beta
 * @author: hhofmann@fork.de
 *
 */

(function(jQuery){

  var pluginName = 'Navigation'

  jQuery.fn.Navigation = function(options){

    var defaults = {
      data: {
        body: {
          status: 'navigation'
        },
        item: {
          nextlevel: 'nextlevel',
          additionalclasses: 'additionalclasses'
        },
        sublevel: {
          level: 'level',
          status: 'status'
        }
      },
      body: {
        tag: 'body',
        status: {
          hidden: 'hidden',
          visible: 'visible'
        }
      },
      standard: {
        classes: {
          active: 'isActive',
          open: 'isOpen',
          container: {
            inner: 'sideNav'
          },
          trigger: {
            close: 'js_closeFoldOut'
          }
        },
        sublevel: {
          status: {
            hidden: 'hidden',
            visible: 'visible'
          },
          slide: {
            duration: 'fast'
          }
        }
      },
      mobile: {
        classes: {
          trigger: {
            close: 'js_naviTrigger'
          }
        }
      },
      level: 'first',
      items: '.item',
      itemstrigger: '> a',
      container: '#nl_container',
      breakpoint: {
        pixel: 1024,
        options: {
          standard: 'standard',
          mobile: 'mobile'
        }
      }
    };

    var _self       = this;
    var _item;
    var _parent;
    var _container = {
      outer: null,
      inner: null
    };

    var _current = {
      breakpoint: '',
      navigation: {
        trigger: null,
        object: null,
        parent: null
      }
    };

    var options     = jQuery.extend(defaults, options);
    var debug       = false;

    var body = {
      object: null,
      status: '',
      width: 0
    };
    var standard = {
      trigger: {
        open: null,
        close: null
      }
    };
    var mobile = {
      trigger: {
        close: null
      }
    };

    var methods = {
      init: function() {

        // Init if debug logging is enabled
        debug = ( _self.data( 'debug' ) && window.console ) ? _self.data( 'debug' ) : false;

        // Init breakpoint visibility
        methods.setBreakpoint();

        /*
         *  Mobile Requirements
         */
        body.object = jQuery( options.body.tag );
        body.width = methods.getWindowWidth();
        body.status = body.object.data( options.data.body.status ) ? body.object.data( options.data.body.status ) : options.body.status.hidden;

        mobile.trigger.close = jQuery( '.' + options.mobile.classes.trigger.close );

        methods.createMobile();

        /*
         *  Standard Requirements
         */
        _items = _self.find( options.items );
        _parent = options.parent ? _self.find( options.parent ) : null;

        _container.outer = options.container ? jQuery( options.container ) : null;
        _container.outer.slideUp();

        if ( _container.outer )
          _container.inner = _container.outer.find( '.' + options.standard.classes.container.inner );

        standard.trigger.close = jQuery( '.' + options.standard.classes.trigger.close );

        methods.create();
      }
      ,create: function () {
        _items.on( 'click', function ( event ) {
          var item = jQuery( this );

          if ( methods.isActive( item ) ) {
            standard.trigger.close.click();
            return;
          }

          // Set current trigger
          _current.navigation.trigger = item;

          if ( item.data( options.data.item.nextlevel ) ) {
            event.preventDefault();
          }

          if ( !methods.isActive( item ) ) {
            methods.setActive();
          } else {
            _container.outer.slideDown();
          }

          if ( debug )
            console.log( 'Item cklicked', _current );

          item.addClass( options.standard.classes.open );
        });

        standard.trigger.close.on( 'click', function ( event ) {
          event.preventDefault();
          _container.outer.slideUp();
          _items.removeClass( options.standard.classes.open );

          if ( debug )
            console.log( 'Sublevel is closed' );
        });

        jQuery( window ).resize( function () {
          if ( body.status == options.body.status.visible ) {
            mobile.trigger.close.click();
          }
          methods.setBreakpoint();
        });
      }
      ,createMobile: function () {
        mobile.trigger.close.on( 'click', function( event ) {
          event.preventDefault();
          methods.toggleBodyStatus();
        });
      }
      ,getWindowWidth: function () {
        return jQuery( window ).width();
      }
      ,setBreakpoint: function () {

        var cbreakpoint = _current.breakpoint;

        if ( methods.getWindowWidth() < options.breakpoint.pixel  ) {
          _current.breakpoint = options.breakpoint.options.mobile;
        } else {
          _current.breakpoint = options.breakpoint.options.standard;
        }

        if ( cbreakpoint != _current.breakpoint ) {
          methods.detachSublevel();
        }
      }
      ,setBodyStatus: function ( status ) {
        if ( debug )
          console.log( 'Set Body Status', status, body.object.data() );

        body.status = status;
        body.object.data( options.data.body.status, status ).attr( 'data-' + options.data.body.status, status );
      }
      ,toggleBodyStatus: function () {
        if ( debug )
          console.log( 'Toggle Body Status', body.status );

        if ( body.status == options.body.status.hidden ) {
          methods.setBodyStatus( options.body.status.visible );
        } else {
          methods.setBodyStatus( options.body.status.hidden );
        }
      }
      ,setStatus: function ( sublevel, status ) {
        if ( debug )
          console.log( 'Set Sublevel Status', status );

        sublevel.data( options.data.sublevel.status, status ).attr( 'data-' + options.data.sublevel.status, status );
      }
      ,toggleStatus: function ( sublevel ) {
        var status = sublevel.data( options.data.sublevel.status );

        if ( status == options.standard.sublevel.status.hidden ) {
          methods.setStatus( sublevel, options.standard.sublevel.status.visible );
        } else {
          methods.setStatus( sublevel, options.standard.sublevel.status.hidden );
        }

        if ( debug )
          console.log( 'Toggle Sublevel Status', _self.data( options.data.standard.sublevel.status ) );
      }
      ,deactivateAll: function () {
        if ( debug )
          console.log( 'Deactivate All' );

        _items.each( function ( index, value ) {
          var _item = jQuery( value );
          _item.removeClass( options.standard.classes.active );
          _item.find( options.itemstrigger ).removeClass( options.standard.classes.active );
        });
      }
      ,setActive: function () {
        methods.deactivateAll();

        var trigger = _current.navigation.trigger;

        if ( debug )
          console.log( 'Set Active', trigger );

        // Set parent trigger for sublevels
        var parentTrigger = trigger.parent().data( 'parent' );
        if ( typeof( parentTrigger ) !== 'undefined' ) {
          _current.navigation.parent = jQuery( parentTrigger );
          methods.setActiveState( _current.navigation.parent );

          if ( debug )
            console.log( 'Set Parent Active', jQuery( parentTrigger ) );
        } else {
          _current.navigation.parent = null;
        }

        methods.setActiveState( trigger );
        methods.showSublevel();
      }
      ,setActiveState: function ( item ) {
        item.addClass( options.standard.classes.active );
        item.find( options.itemstrigger ).addClass( options.standard.classes.active );
      }
      ,isActive: function ( item ) {
        return item.hasClass( options.standard.classes.active );
      }
      ,isOpen: function ( item ) {
        return item.hasClass( options.standard.classes.open );
      }
      ,showSublevel: function () {
        _container.outer.slideUp( options.standard.sublevel.slide.duration, function () {
          var trigger = _current.navigation.trigger;

          if ( !trigger.data( options.data.item.nextlevel ) || !_container.outer ) {
            return;
          }

          _container.outer.find( 'a.back' ).remove();

          if ( _current.navigation.parent ) {
            var link = jQuery( '<a>', { class: 'back', href: '#' } )
                          .append( jQuery( '<i>', { class: 'icon icon icon-arrowleft' } ) )
                          .append( jQuery( '<span>', { text: 'zurück' } ) )
                          .append( jQuery( '<span>', { text: 'Messtechnik', class: 'headline' } ) );
            link.on( 'click', function ( event ) {
              event.preventDefault();
              console.log( _current.navigation.parent );
              _current.navigation.parent.click();
            });
            _container.outer.prepend( link );
          }

          methods.detachSublevel();
          _container.outer.slideDown();
        });
      }
      ,detachSublevel: function () {

        if ( debug )
          console.log( 'Detach Level', _current );

        if ( _current.navigation.trigger ) {
          var trigger = _current.navigation.trigger;

          // Detach current level back to init position
          if ( _current.navigation.object ) {
            var cobject = _current.navigation.object.detach();
            cobject.appendTo( cobject.data( 'parent' ) );

            // Remove additional classes to container
            if ( _current.navigation.object.data( options.data.item.additionalclasses ) ) {
              var additionalClasses = _current.navigation.object.data( options.data.item.additionalclasses );
              _container.inner.removeClass( additionalClasses );
            }
          }

          // Set current object an detach it
          _current.navigation.object = trigger.find( trigger.data( options.data.item.nextlevel ) ).detach();

          if ( _current.breakpoint == options.breakpoint.options.standard ) {
            _current.navigation.object.appendTo( _container.inner );
          } else {
            _current.navigation.object.appendTo( _current.navigation.object.data( 'parent' ) );
          }

          if ( debug )
            console.log( 'Current Level Object', _current, _current.navigation.object.data() );

          // Set additional classes to container
          if ( _current.navigation.object.data( options.data.item.additionalclasses ) ) {
            var additionalClasses = _current.navigation.object.data( options.data.item.additionalclasses );
            _container.inner.addClass( additionalClasses ); 
          }

          // Update matchHeight Container
          jQuery.fn.matchHeight._update();
        }

      }
    };

    return this.each(function(){
      methods.init(options);
    });

  }

})(jQuery);