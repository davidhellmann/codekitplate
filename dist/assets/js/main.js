var debug=!1,plugins=Array("Navigation","Slickslider","Layer","Tooltip","Chosen","ConditionalButton");$(window).on("load",function(){$.each(plugins,function(a,t){var e=t;$('[data-jsinit*="'+e+'"]').each(function(){var a=$(this);debug&&console.log("INIT Plugin",a,a.data()),a[e](a.data())})})}),$(document).ready(function(){var a=$(".tabNavi__main");tabsTrigger=$(".js_tabsTrigger"),tabsTrigger.on("click",function(t){t.preventDefault(),tabsTrigger.toggleClass("open"),tabsTrigger.next(a).stop().slideToggle(250)}),$('*[data-sameheight="true"]').conformity(),$(window).on("resize",function(){$('*[data-sameheight="true"]').conformity()}),jQuery(".profileData .accountData #updateEmail").on("click","a.change, a.cancel",function(a){var t=jQuery(this);return t.closest("#updateEmail").toggleClass("open"),t.siblings('input[id*="email"]').focus(),!1}),jQuery(".profileData .accountData #updatePassword").on("click","a.change, a.cancel",function(a){var t=jQuery(this);return t.closest("#updatePassword").toggleClass("open"),t.siblings('input[id*="current"]').focus(),!1})});
//# sourceMappingURL=./main.js.map