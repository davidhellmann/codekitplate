/*
 * @version: 0.1beta
 * @author: dhellmann@fork.de
 *
 */

(function(jQuery){

  var pluginName = 'Tooltip'

  jQuery.fn.Tooltip = function(options){


    var defaults = {
      classes: {
        wrapper: 'tooltip__wrapper'
      }
    };

    var _self   = this;
    var debug   = false;
    var options = jQuery.extend(defaults, options);


    var methods = {
      init: function() {

        // Init if debug logging is enabled
        debug = ( _self.data( 'debug' ) && window.console ) ? _self.data( 'debug' ) : false;

        methods.create();
      },

      create: function () {

        _self.on( 'click', function ( event ) {
          event.preventDefault();
          _self.next('.' + options.classes.wrapper ).slideToggle(250);

        });
      }
    };

    return this.each(function(){
      methods.init(options);
    });

  }

})(jQuery);