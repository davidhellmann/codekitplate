/*
 * @version: 0.1beta
 * @author: dhellmann@fork.de
 *
 */

(function(jQuery){

  var pluginName = 'Layer'

  jQuery.fn.Layer = function(options){

    var defaults = {
      data: {
        body: {
          status: 'layer'
        }
      },
      body: {
        tag: 'body',
        status: {
          hidden: 'hidden',
          visible: 'visible'
        }
      },
      openlayer: {
        classes: {
          wrapper: 'dimBackground',
          content: 'dimBackground__contentWrapper',
          closelayer: 'dimBackground__closerLayer',
          item: 'layer',
          close: 'js_closeLayer',
          status: {
            hidden: 'hidden',
            visible: 'visible'
          }
        },
        close: {
          tag: '<div>'
        }
      },
      content: ''
    };

    var _self       = this;
    var _content;
    var options     = jQuery.extend(defaults, options);
    var debug       = false;

    var body = {
      object: null
    }

    var openlayer = {
      wrapper: null,
      content: null,
      item: null,
      trigger: {
        close: null
      }
    };

    var methods = {
      init: function() {

        // Init if debug logging is enabled
        debug = ( _self.data( 'debug' ) && window.console ) ? _self.data( 'debug' ) : false;

        // Init body tag
        body.object = jQuery( options.body.tag );

        // Init openlayer
        openlayer.wrapper = jQuery( '.' + options.openlayer.classes.wrapper );
        openlayer.item = jQuery( '.' + options.openlayer.classes.item );

        if ( !openlayer.wrapper ) {
          if ( debug )
            console.log( 'Error: Missing Layer Structure', _self );
          return;
        }

        // Init openlayer content
        openlayer.content = jQuery( '.' + options.openlayer.classes.content );

        // Init openlayer close triggers
        var contentCloser = jQuery( '.' + options.openlayer.classes.close );
        var layerCloser = jQuery( '.' + options.openlayer.classes.closelayer );
        openlayer.wrapper.append( layerCloser );
        openlayer.trigger.close = layerCloser.add( contentCloser );

        if ( debug )
          console.log( 'Closing Triggers: ', openlayer.trigger.close );

        // Init instance dependencies
        _content = jQuery( options.content );

        if ( debug )
          console.log( 'Related Content: ', _content );

        if ( !_content ) {
          if ( debug )
            console.log( 'Error: Missing Layer Content', _self );
          return;
        }

        methods.setStatus( options.body.status.hidden );
        methods.create();
      },

      create: function () {

        if ( debug )
          console.log( 'Create Layer' );

        // Add layer content to dimmer
        _content.addClass( options.openlayer.classes.status.hidden ).appendTo( openlayer.content );

        // Init layer opening
        _self.on( 'click', function ( event ) {
          event.preventDefault();

          if ( jQuery( options.body.tag ).data( options.data.body.status ) === options.body.status.hidden ) {
            methods.setStatus( options.body.status.visible );
            openlayer.content.addClass( options.openlayer.classes.status.visible );
          } else {
            openlayer.item.addClass( options.openlayer.classes.status.hidden );
            _content.removeClass( options.openlayer.classes.status.hidden );
          }

        });

        // Init layer closers
        openlayer.trigger.close.on( 'click', function( event ) {
          event.preventDefault();

          if ( debug )
            console.log( 'Closer click', event );

          methods.setStatus( options.body.status.hidden );
          openlayer.content.removeClass( options.openlayer.classes.status.visible );
        });

      },

      setStatus: function ( status ) {
        if ( debug )
          console.log( 'Set Status (before)', status, body.object.data() );

        // Set data status of body tag
        body.object.data( options.data.body.status, status );
        body.object.attr( 'data-' + options.data.body.status, status );

        if ( debug )
          console.log( 'Set Status (after)', status, body.object.data() );

        // Toggle layer status depending on body status
        if ( status == options.body.status.hidden ) {
          _content.addClass( options.openlayer.classes.status.hidden );
        } else {
          _content.removeClass( options.openlayer.classes.status.hidden );
        }
      }
    };

    return this.each(function(){
      methods.init(options);
    });

  }

})(jQuery);