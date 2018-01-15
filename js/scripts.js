$(document).ready(function(){

	$('.product-gallery').flickity({
		  // options
		autoPlay: 3000
	});

	$('.go-products').navScroll();

	$(window).load(function(){
      $('.preloader').fadeOut(1000); // set duration in brackets    
    });
    
});
