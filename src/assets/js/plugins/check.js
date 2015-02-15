/*
 * @version: 0.1beta
 * @author: hhofmann@fork.de
 *
 */

 var checkers = new Array();

(function(jQuery){

  var pluginName = 'Check'

  jQuery.fn.Check = function(options){

    var defaults = {
      data: {
        item: 'check-item',
        trigger: 'check-trigger',
        toggle: 'check-toggle',
        selectall: 'check-selectall',
        deselectall: 'check-selectnone',
        counttotal: 'check-counttotal',
        countselected: 'check-countselected',
      },
      item: {
        classes: {
          checked:  'checked',
          wrapper: '.itemGroup'
        },
        property: {
          checked: 'checked',
          state: 'checked'
        }
      },
      trigger: {
        classes: {
          istrigger: 'isTrigger',
          selected: 'selected',
          checked:  'checked'
        },
        property: {
          checked: 'checked',
          state: 'checked'
        }
      }
    };

    var _self         = this;
    var _items;

    var _triggers;
    var _toggle;

    var _selector_all;
    var _selector_none;

    var _count_total;
    var _count_selected;

    var options   = jQuery.extend(defaults, options);
    var counter   = 0;
    var init      = true;

    var debug       = false;

    var methods = {
      init: function() {
        
        // Init if debug logging is enabled
        debug = ( _self.data( 'debug' ) && window.console ) ? _self.data( 'debug' ) : false;

        _items    = _self.find( _self.data( options.data.item ) );

        _triggers = _self.find( _self.data( options.data.trigger ) );
        _toggle   = _self.find( _self.data( options.data.toggle ) );

        _selector_all  = _self.find( _self.data( options.data.selectall ) );
        _selector_none = _self.find( _self.data( options.data.deselectall ) );

        _count_total = _self.find( _self.data( options.data.counttotal ) );
        _count_selected = _self.find( _self.data( options.data.countselected ) );

        checkers[ _self.attr( 'id' ) ] = _self;
        methods.create();
      }
      ,create: function () {

        methods.parseItems();

        _triggers.each( function () {
          var trigger = jQuery( this ).addClass( options.trigger.classes.istrigger );

          trigger.on( 'change', function ( event ) {
            methods.parseTrigger( trigger );
          });
        });

        _items.each( function () {
          var item = jQuery( this );
          item.on( 'change', function ( event ) {
            var it = jQuery( this );
            var isChecked = it.is( ":" + options.item.property.state );

            methods.parseItems();

            var changeCollection = new Array();
            changeCollection = methods.checkElement( it, 'item', isChecked, changeCollection );
          });
        });

        _selector_all.each( function () {
          var selector = jQuery(this);
          selector.on( 'click', function ( event ) {
            event.preventDefault();
            methods.checkItems();
          });
        });

        _selector_none.each( function () {
          var deselector = jQuery(this);
          deselector.on( 'click', function ( event ) {
            event.preventDefault();
            methods.uncheckItems();
          });
        });
        
      }
      ,triggerChange: function ( changeCollection ) {
        if ( changeCollection.length > 0 ) {
          jQuery.each( changeCollection, function ( index, item ) {
            var trigger = jQuery( '#' + item );
            trigger.change();
          });
        }
        methods.parseItems();
      }
      ,selectTrigger: function ( trigger, select ) {
        var wrapper = trigger.closest( options.item.classes.wrapper );
        if ( select ) {
          trigger.addClass( options.trigger.classes.selected );
          wrapper.addClass( options.trigger.classes.selected );
        } else {
          trigger.removeClass( options.trigger.classes.selected );
          wrapper.removeClass( options.trigger.classes.selected );
        }
      }
      ,checkElement: function ( element, type, check, changeCollection ) {
        var wrapper = element.closest( options.item.classes.wrapper );

        if ( !element.prop( 'disabled' ) ) {
          element
            .prop( options.item.property.checked, check );
            
          if ( element.hasClass( options.trigger.classes.istrigger ) ) {
            if ( type == 'item' ) {
              changeCollection.push( element.attr( 'id' ) );
            }
          } else {
            element.removeClass( options.trigger.classes.selected );
            wrapper.removeClass( options.trigger.classes.selected );
            element.removeClass( options.trigger.classes.checked );
            wrapper.removeClass( options.trigger.classes.checked );
          }

          if ( check ) {
            element.addClass( options.item.classes.checked );
            wrapper.addClass( options.item.classes.checked );
          } else {
            element.removeClass( options.item.classes.checked );
            wrapper.removeClass( options.item.classes.checked );
          }

        }
        return changeCollection;
      }
      ,checkItems: function () {
        var changeCollection = new Array();
        _items.each( function () {
          var item = jQuery( this );
          changeCollection = methods.checkElement( item, 'item', true, changeCollection );          
        });
        methods.triggerChange( changeCollection );
      }
      ,uncheckItems: function () {
        var changeCollection = new Array();
        _items.each( function () {
          var item = jQuery( this );
          changeCollection = methods.checkElement( item, 'item', false, changeCollection );
        });
        methods.triggerChange( changeCollection );
      }
      ,checkTriggers: function ( checkItems ) {
        var changeCollection = new Array();
        _triggers.each( function () {
          var trigger = jQuery( this );
          changeCollection = methods.checkElement( trigger, 'trigger', true, changeCollection );
        });

        if ( checkItems ) {
          methods.checkItems();
        }
      }
      ,uncheckTriggers: function ( uncheckItems ) {
        var changeCollection = new Array();
        _triggers.each( function () {
          var trigger = jQuery( this );
          changeCollection = methods.checkElement( trigger, 'trigger', false, changeCollection );
        });

        if ( uncheckItems ) {
          methods.uncheckItems();
        }
      }
      ,parseTrigger: function ( trigger ) {
        var isChecked = trigger.is( ":" + options.trigger.property.state );

        if ( isChecked ) {
          methods.checkTriggers( true );
          if ( !_toggle.parent().hasClass( 'unfolded' ) ) {
            _toggle.trigger( 'click' );
          }
        } else {
          methods.uncheckTriggers( true );
        }

        methods.parseItems();
      }
      ,parseItems: function () {
        var isCheckedBefore = _triggers.is( ":" + options.trigger.property.state );

        if ( init ) {
          counter = _items.length;
          init = false;

          // Set Counter Output - Total
          if ( _count_total ) {
            _count_total.text( counter );
          }
        }

        // Count checked items
        var _cnt = 0;
        _items.each( function () {
          var item = jQuery( this );
          if ( item.is( ":" + options.item.property.state ) ) {
            ++_cnt;
          }
        });

        // Set Counter Output - Selected
        if ( _count_selected ) {
          _count_selected.text( _cnt );
        }

        // Select / Check trigger if has checked items
        if ( _cnt > 0 ) {
          _triggers.each( function () {
            var trigger = jQuery( this );
            methods.selectTrigger( trigger, true );
          });

          if ( _cnt == counter ) {
            methods.checkTriggers( false );
          } else {
            methods.uncheckTriggers( false );
          }
        } else {
          _triggers.each( function () {
            var trigger = jQuery( this );
            methods.selectTrigger( trigger, false );
          });

          methods.uncheckTriggers( false );
        }

        // Count selected items
        var _slct = 0;
        _items.each( function () {
          var item = jQuery( this );
          // console.log( item.attr( 'class' ) );
          if ( item.hasClass( options.trigger.classes.selected ) ) {
            ++_slct;
          }
        });

        // Select trigger if has selected items
        if ( _slct > 0 ) {
          _triggers.each( function () {
            var trigger = jQuery( this );
            methods.selectTrigger( trigger, true );
          });
        }

        var isCheckedAfter = _triggers.is( ":" + options.trigger.property.state );
        if ( isCheckedBefore != isCheckedAfter ) {

          var changeCollection = new Array();
          _triggers.each( function () {
            var trigger = jQuery( this );
            changeCollection.push( trigger.attr( 'id' ) );
          });

        }

      }
    };

    _self.updateTriggers = function () {
      methods.parseItems();
    };

    return this.each(function(){
      methods.init(options);
    });

  }

  // Initializer on window load event
  // via data-jsinit Selector
  $(window).on('load', function () {

    $('[data-jsinit*="'+ pluginName +'"]').each(function () {
      var $element = $(this)
      $element[pluginName]($element.data())
    });

  });

})(jQuery);