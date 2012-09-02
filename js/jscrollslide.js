/* 
*	Page Movement and Scrolling PLugin
*
*	Part of the Movement for Publication framework
*
* 	Gerry Straathof 2012 nosemonger@gmail.com
*	
* 	Modified jscrolltouch plugin by Damien Rottemberg
*/
(function($){
 "use strict";

 	
	 $.fn.jTouchMove = function (slideOn,scrollOn, useSlide) {


		        // basic movement structure
		function slideStart (previous,next,sWidth,sWX){
			if (useSlide) {
				previous.css('left',-sWidth+sWX+'px');     
				next.css('left',sWidth+sWX+'px'); 
			} else {
				previous.css('left',0+'px');     
				next.css('left',0+'px'); 
			}
	 	}	
		// basic movement structure
		function finshMovement (previous,next,slider){
			next.css('left','0').addClass('active');
			slider.removeClass('active').addClass('hidder').attr('style','');
			previous.addClass('hidder').attr('style','');
		}
		 return this.each(function(index) {
						  // The two concepts for each page
						  // scroller = text scrolling area
						  // slider = full-screen page
						  // previous = the page before the current
						  // next = the page after the current
						  // pull = the titlebar that pulls down the contents
						
				var scroller =      $(this).find('.article-scroller'),
					scrollee =      $(this).find('.article-scrollee'),
					height2 =       scrollee.height(),
					slider = 		$(this),
					articleNumber = index;


				//var   slideOn = true,
				var	moveActive = false;
					
				

				if (slideOn){
					var		previous = 	slider.prev(),
							next = 		slider.next();
				}
					 

				scroller.css({'overflow': 'auto','position':'relative'});
				scrollee.css({'overflow': 'auto','position':'relative'});
					  
				var height = 0;
				var cpos = scroller.scrollTop();
				scroller.scrollTop(100000);
				height = scroller.scrollTop();
				scroller.scrollTop(cpos);
					  
					  
				var c2pos = scrollee.scrollTop();
				scrollee.scrollTop(100000);
				height2 = scrollee.scrollTop();
				scrollee.scrollTop(c2pos);
					  
				var width = 0;
				var minWidth=(main.width())*0.15;
				var lpos = slider.scrollLeft();
				slider.scrollLeft(100000);
				width = slider.scrollLeft();
				slider.scrollLeft(lpos);
				var fullwidth = width + scroller.outerWidth();
									   
			//	var currentPage = JSON.parse(localStorage.getItem('currentPage'));
				var remover = $('.article-wrapper:eq(' + currentPage + ')');
    if (slider.has('.active')){ 
            slider.bind('mousedown touchstart',function(e){
            
				//e.stopPropagation();
				if(Modernizr.touch){
					if(e.originalEvent.touches && e.originalEvent.touches.length) {
				        e = e.originalEvent.touches[0];/*
				    } else if(e.originalEvent.changedTouches && e.originalEvent.changedTouches.length) {
				        e = e.originalEvent.changedTouches[0];*/
				    }
				}
				$('.article-wrapper').not('.active').addClass('hidder').attr('style','');
			
						
			//	var currentPage = JSON.parse(localStorage.getItem('currentPage'));
                     
                if (((currentPage-1) == articleNumber)||(slideOn==false)) {  
                        // only allow touches on active page
					if (slideOn == true){
					$('.active').removeClass('active');
					slider.addClass('active');
                }
				var sWidth = main.width();
                var scrollDirection = 0;
                var nextPage = 0;
                
				if (slideOn){		  
					slider.stop(false, true).addClass('active').removeClass('hidder');

					if(previous.is(':animated')){
						  previous.stop(true, true).css('style','');/*
					} else { 
						  previous.addClass('hidder');*/
					}
					
					if (next.is(':animated')){
						  next.stop(true, true).css('style','');/*
					} else {
						  next.addClass('hidder');*/
					}
					
					previous.removeClass('hidder');                
					next.removeClass('hidder'); 
					slideStart(previous,next,sWidth,0);
				}
                
                var	initX = e.pageX,
                    sX = e.pageX,
                    sWX = 0;

                var	initY = e.pageY,
                    sY = e.pageY,
                    sY2 = e.pageY,
                    sWY = 0;

                var prevsWX = 0; 	//stores the previous sWX
                var display = false;
                var displayed = false;

                cpos = scroller.scrollTop();
                c2pos = scrollee.scrollTop();
					
				};//else { console.log('these are different');}
					  
				slider.bind('mousemove touchmove ',function(ev){
							
					  if(Modernizr.touch && ev.originalEvent.touches.length){
						ev.preventDefault();
						if(ev.originalEvent.touches && ev.originalEvent.touches.length) {
					        ev = ev.originalEvent.touches[0];
					    } else  if(ev.originalEvent.changedTouches && ev.originalEvent.changedTouches.length) {
					        ev = ev.originalEvent.changedTouches[0];
					    } 
					  }	


					  var top = cpos-(ev.pageY-sY);
							  
					  var top2 = c2pos-(ev.pageY-sY2);
					  
					  var left =  lpos-(ev.pageX-sX);
					  
					  sWX = sWX-(sX-ev.pageX);
					  sX = ev.pageX;
					  
					  sWY = sWY-(sY-ev.pageY);
					  sY = ev.pageY;
					  sY2 = ev.pageY;
					  
					  var horDistance = Math.abs(sWX);
					  var verDistance = Math.abs(sWY);
							  
					  if (scrollDirection == 0){ // haven't checked direction yet
						  if (verDistance < horDistance) {
							  scrollDirection = 1; // moving horizontally
						  } else if ( verDistance > horDistance) {					  
							  scrollDirection = 2; // moving vertically
						  }
					  }
					  
					  if (scrollDirection == 2 && scrollOn==true){//set up the scrolling movement
						  //set up the scroll bars
						  scroller.scrollTop(top);
						  cpos = scroller.scrollTop(); 
							  
						  scrollee.scrollTop(top2);
						  c2pos = scrollee.scrollTop(); 
							  
						  sY = ev.pageY;
						  sY2 = ev.pageY;
					   }
							  
					  if (scrollDirection == 1 && slideOn==true){						
						  //set up the sideways movement
							  
							//var currentPage = JSON.parse(localStorage.getItem('currentPage'));
							slider.css('left',sWX+'px');	//page follows finger 

							slideStart(previous,next,sWidth,sWX);
					/*
							previous.css('left',-sWidth+sWX+'px');     
							next.css('left',sWidth+sWX+'px');                
						*/	
								//	checking to see if we are going in the same direction still          
							if (!((Math.abs(prevsWX)/prevsWX) == (Math.abs(sWX)/sWX))) {
							
							  if (sWX < 0) { 					//moving right
								  display = true;
								  nextPage = currentPage + 1;
							   }  else if (sWX>0) {				//moving Left
								  display = true;
								  nextPage = currentPage - 1;
								} else {
								}
							}
							prevsWX = sWX;
							} // 	end of same direction check
						 
					}); //end of sideways scroll check
                        
					  
                    slider.bind('mouseup touchend',function(ev){	
							slider.unbind('mousemove touchmove mouseup touchend');
							//display = false;
					/*		if(mobile && ev.originalEvent.touches){
								ev.preventDefault();
								ev = ev.originalEvent.touches[0];
							}
					*/		
							if (scrollDirection ==1 && slideOn==true){	
									// only perform horizontal changes
								var distance = Math.abs(initX-sX);
								
								if (nextPage < 1){		
									//	can't go past beginning
								  distance = 0; 
								} else if (nextPage >maxPage){	
									//	can't go past end
								  distance = 0; 
								}
								    
								if ((display==false)||(nextPage < 1)) {distance = 0}
								
								if (sWX == 0){
								  // do nothing
								} else if ( sWX>0 ) {			//are we moving the page to the left?
									if(distance>minWidth){ 
										//	move to new page if we moved 25% of the width
										currentPage = nextPage;
								    //    localStorage.setItem('currentPage',JSON.stringify(currentPage));
										slider.stop(true,true);
										previous.animate({'left':0+'px'},animTime/3,'easeOutQuint');
										slider.animate({'left':main.width()+'px'},animTime/3,'easeOutQuint',function(){
											finshMovement (next,previous,slider);
										});  
									}else{					//move back into place. Rehide the next/prev page afterwards
				                        slider.stop(true,true).animate({'left':'0px'},100,'easeOutQuint',function(){
                                            previous.css('style','').addClass('hidder');
                                        });
                                    } // end of left check
								  
								} else if ( sWX<0 ){			//are we moving the page to the right?
								    if(distance>minWidth){	
										//	move to new page if we moved more than 25%
										currentPage = nextPage;
								    //    localStorage.setItem('currentPage',JSON.stringify(currentPage));
										
										slider.stop(true,true);
										next.animate({'left':0+'px'},animTime/3,'easeOutQuint');
										
										slider.animate({'left':-main.width()+'px'},animTime/3,'easeOutQuint',function(){
											finshMovement (previous,next,slider);
											});
                                    }else{	//move back into place. Rehide the next/prev page afterwards
                                        slider.stop(true,true).animate({'left':'0px'},100,'easeOutQuint',function(){
                                            next.css('style','').addClass('hidder');
                                        }); 
								} //end of right check
							}// finished horizontal checks

							if (!Modernizr.touch){
								manageControls(currentPage);
							}
						}
					}); //end mouse/touch end
			}); //end mouse/touch start
}
		}); //end return each(?) function?
    } //end 'inner' function
    return;
})(jQuery); //  end it all…
