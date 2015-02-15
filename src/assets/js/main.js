//= require "fastclick"
//= require "vendor/navigation"
//= require "vendor/slickslider"
//= require "vendor/sameheight"
//= require "vendor/layer"
//= require "vendor/tooltip"
//= require "vendor/chosen"
//= require "vendor/conditionalbutton"

var debug = false;

var plugins = Array(
  'Navigation',
  'Slickslider',
  'Layer',
  'Tooltip',
  'Chosen',
  'ConditionalButton'
);

// Initializer on window load event
// via data-jsinit Selector
$(window).on('load', function () {

  $.each( plugins, function ( index, value ) {

    var pluginName = value;

    $('[data-jsinit*="'+ pluginName +'"]').each(function () {
      var $element = $(this);

      if ( debug )
        console.log( 'INIT Plugin', $element, $element.data() );

      $element[pluginName]($element.data())
    });
  });

});


$(document).ready(function() {

  // Show TabNavi — David
  var tabs        = $('.tabNavi__main');
      tabsTrigger = $('.js_tabsTrigger');

  tabsTrigger.on('click', function(event) {
    event.preventDefault();

    tabsTrigger.toggleClass('open');
    tabsTrigger.next(tabs).stop().slideToggle(250);
  });


  // sameHeight
  $('*[data-sameheight="true"]').conformity();
  $(window).on("resize", function() {
    $('*[data-sameheight="true"]').conformity();
  });


  //account data hidden forms
  jQuery('.profileData .accountData #updateEmail').on('click', 'a.change, a.cancel', function(e){
    var toggleLink = jQuery(this);

    toggleLink.closest('#updateEmail').toggleClass('open');
    toggleLink.siblings('input[id*="email"]').focus();

    return false;
  });
  jQuery('.profileData .accountData #updatePassword').on('click', 'a.change, a.cancel', function(e){
    var toggleLink = jQuery(this);

    toggleLink.closest('#updatePassword').toggleClass('open');
    toggleLink.siblings('input[id*="current"]').focus();

    return false;
  });

});








// Jira Ticketing
jQuery.ajax({
  url: "https://jira.fork.de/s/d41d8cd98f00b204e9800998ecf8427e/en_UK-5tuaiv-1988229788/6155/68/1.4.0-m6/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs.js?collectorId=116cd410",
  type: "get",
  cache: true,
  dataType: "script"
});