/*
 * @version: 0.1beta
 * @author: scremer@fork.de
 *
 */

(function(jQuery){

    var pluginName = 'Chosen';

    jQuery.fn.Chosen = function(options){

        var _self     = this;
        var debug     = false;

        var methods = {
            init: function() {

                // Init if debug logging is enabled
                debug = ( _self.data( 'debug' ) && window.console ) ? _self.data( 'debug' ) : false;


                // add chosen to the given element
                methods.create();
            },
            create: function() {
                _self.chosen({
                    allow_single_deselect: (typeof options.allowsingledeselect !== 'undefined') ? options.allowsingledeselect : false,
                    disable_search: (typeof options.disablesearch !== 'undefined') ? options.disablesearch : false,
                    disable_search_threshold: (typeof options.disablesearchthreshold !== 'undefined') ? options.disablesearchthreshold : 0,
                    enable_split_word_search: (typeof options.enablesplitwordsearch !== 'undefined') ? options.enablesplitwordsearch : true,
                    inherit_select_classes: (typeof options.inheritselectclasses !== 'undefined') ? options.inheritselectclasses : false,
                    max_selected_options: (typeof options.maxselectedoptions !== 'undefined') ? options.maxselectedoptions : Infinity,
                    no_results_text: (typeof options.noresultstext !== 'undefined') ? options.noresultstext : "No results match",
                    placeholder_text_multiple: (typeof options.placeholdertextmultiple !== 'undefined') ? options.placeholdertextmultiple : "Select Some Options",
                    placeholder_text_single: (typeof options.placeholdertextsingle !== 'undefined') ? options.placeholdertextsingle : "Select an Option",
                    search_contains: (typeof options.searchcontains !== 'undefined') ? options.searchcontains : false,
                    single_backstroke_delete: (typeof options.singlebackstrokedelete !== 'undefined') ? options.singlebackstrokedelete : true,
                    width: (typeof options.width !== 'undefined') ? options.width : "",
                    display_disabled_options: (typeof options.displaydisabledoptions !== 'undefined') ? options.displaydisabledoptions : true,
                    display_selected_options: (typeof options.displayselectedoptions !== 'undefined') ? options.displayselectedoptions : true
                });
            }
        };

        return this.each(function(){
            methods.init(options);
        });
    }

})(jQuery);