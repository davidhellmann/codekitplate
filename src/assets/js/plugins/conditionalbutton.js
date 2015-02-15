/*
 * @version: 0.1beta
 * @author: scremer@fork.de
 *
 */

(function(jQuery){

    var pluginName = 'ConditionalButton';

    jQuery.fn.ConditionalButton = function(options){

        var _self     = this;
        var debug     = false;

        var affectedForm = null;

        var fullfilledDependencyNum = 0;
        var dependencies = [];
        var dependencyValues = {};

        var methods = {

            /**
             * Init Method
             */
            init: function() {

                // Init if debug logging is enabled
                debug = ( _self.data( 'debug' ) && window.console ) ? _self.data( 'debug' ) : false;

                // get the dependencies from the options
                dependencies = (typeof options.dependsonfields !== 'undefined')? options.dependsonfields.split(",") : [];

                //get the form
                affectedForm = _self.closest("form");

                //append update handlers to all dependencies
                for(var i = 0, len = dependencies.length; i < len; i++){

                    //get the dependency from the dom
                    affectedForm.find(dependencies[i]).on("change", function(){

                        //set the element groups
                        var booleanValueElements = ["checkbox", "radio"];
                        var stringValueElements = ["input", "textarea", "select"];


                        //Get the dependency
                        var dependency = jQuery(this);

                        //remember the dependency key
                        var dependencyKey = dependency.attr("id");
                        if(typeof dependencyKey === "undefined") {
                            dependencyKey = dependency.attr("name");
                        }


                        //get the field type of the dependency
                        var fieldType = dependency.attr("type");
                        if(typeof fieldType === "undefined") {

                            if(dependency.is("select")) {

                                fieldType = "select";
                            }
                            else if(dependency.is("textarea")) {

                                fieldType = "textarea";
                            }
                        }
                        else {

                            if(jQuery.inArray(fieldType, booleanValueElements) <= -1) { //TODO Should be changed to recognize email, password, submit etc.

                                fieldType = "input";
                            }
                        }


                        //check if the field is filled
                        if( (jQuery.inArray(fieldType, booleanValueElements) > -1 && dependency.is(":checked")) ||
                            (jQuery.inArray(fieldType, stringValueElements) > -1 && dependency.val())
                        ){

                            //check if the value has not yet been set
                            if(typeof dependencyValues[dependencyKey] === "undefined" || dependencyValues[dependencyKey] == null) {

                                //remember the value of the dependency
                                dependencyValues[dependencyKey] = dependency.val();

                                //raise the number of fullfilled dependencies
                                fullfilledDependencyNum++;
                            }
                        }
                        else {

                            //remove the remembered dependency calue
                           dependencyValues[dependencyKey] = null;

                            //lower the number of fullfilled dependencies
                            fullfilledDependencyNum--;
                        }

                        //update the button
                        methods.updateButton();
                    });
                }
            },

            /**
             * Method updating the button depending on all depedencies being fullfilled
             */
            updateButton: function() {

                if(fullfilledDependencyNum == dependencies.length) {

                    _self.removeAttr("disabled").removeClass("button--disabled");
                }
                else {

                    _self.attr("disabled", "disabled").addClass("button--disabled");
                }
            }
        };

        return this.each(function(){
            methods.init(options);
        });
    }

})(jQuery);