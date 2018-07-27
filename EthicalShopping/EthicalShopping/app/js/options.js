// Used for personal perference 

$(function () {
         $(".product-dropdown li a").click(function () {
             var selText = $(this).text();
             $(".selection").html(selText);
         });
