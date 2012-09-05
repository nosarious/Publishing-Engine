/*
* Page movement and content button plugin
*
* Part of the Movement for Publication Engine
*
* Gerry Straathof 2012 nosemonger@gmail.com
*
*/

function jPageMove(){

	var vP = "";
	var transitionEnd = "TransitionEnd";
	if ($.browser.webkit) {
		vP = "-webkit-";
		transitionEnd = "webkitTransitionEnd";
	} else if ($.browser.msie) {
		vP = "-ms-";
	} else if ($.browser.mozilla) {
		vP = "-moz-";
		transitionEnd = "transitionend";
	} else if ($.browser.opera) {
		vP = "-o-";
		transitionEnd = "oTransitionEnd";
	}
		

		/*****************************************
		***
		*** Animate a button when it is pressed
		***
		******************************************/

		function animateButton(currentButton){
			var $thisButton = $(currentButton);
			$thisButton.addClass('selected');
		    setTimeout(function(){
				$thisButton.removeClass('selected').addClass('unselected-button');
			},1050);
		}
		/*****************************************
		 ***
		 *** moves to a specific 'page' desktop or non-webkit
		 ***
		 ******************************************/

		function moveTo(element){

			if (element > currentPage){
		        newPageRight(element);
		    } else if (element < currentPage) {
		        newPageLeft(element);
		    } 
		}

		/*****************************************
		 ***
		 *** New Page is on the left - used only for non webkit
		 ***
		 ******************************************/

		function newPageLeft(newPage){
		    newPageSides(newPage, false);
		}

		/*****************************************
		 ***
		 *** New Page is on the Right - used only for non webkit
		 ***
		 ******************************************/

		function newPageRight(newPage){
		    newPageSides(newPage, true);
		}

		/*****************************************
		 ***
		 *** Check for NewPageSides with newpage and direction
		 ***
		 ******************************************/
		function newPageSides(newPage, dir){ // dir true = right, false = left
			
		//	console.log("this is the current Page"+currentPage);
//			$('#wrapper_all').removeClass('accelerator').attr('style','');
			$('#wrapper_all').find('.article-wrapper').removeClass('active');
			$remover = $('#article'+(currentPage));
			$remover.addClass('active');
			$('#wrapper_all').find('.article-wrapper').not($($remover)).addClass('hidder');
			$('.active').removeClass('hidder');
			prevPage = currentPage;
			if (newPage>0) {
				currentPage = newPage;
			} else {
				currentPage = prevPage + (dir ? 1 : -1);
			}
			
			if (currentPage > window.maxPage){
				currentPage = window.maxPage;
			} else if (currentPage < 1){
				currentPage = 1;
			} else {
				$adder = $('#article'+(currentPage));
				if ($adder.is(':animated')){
					$adder.stop(true,true);
				}
				$adder.removeClass('hidder');
				$remover.addClass('remove').removeClass('active').css('style','');
				$adder.addClass('active').css('style','');
				if (pdContents.position().top<-200){
					animateSlide($remover,dir);
				} else {
					showSlideNow($remover);
				}
			//	localStorage.setItem('currentPage',JSON.stringify(currentPage));
			}
			newPage = 1;
//			$('#wrapper_all').addClass('accelerator');
		}

		/*****************************************
		 ***
		 *** Animate that puppy!
		 ***
		 ******************************************/

		function animateSlide(currentSlide,direction){
				//moveto chosen page in the direction
		    d = (direction) ? { left:'-100%' } : { left:'100%' };
		    //if no csstransitions or if firefox, don't use csstransitions
		    if(!Modernizr.csstransitions||(vP='-moz-')) {
				currentSlide.animate(d, animTime*0.5, 'easeOutQuint',function(){
					currentSlide
						.removeClass('remove')
						.addClass('hidder')
						.attr('style','');  
					clearButtons();						
				});  
			} else {
				currentSlide.addClass('accelerator');
		    //	console.log('using css transitions');
				currentSlide.css(vP+"transition", "all "+(animTime*0.35)+"ms ease-in-out");
				currentSlide.css(d, animTime*0.35);
				setTimeout(function(){
					currentSlide
						.removeClass('remove')
						.addClass('hidder')
						.attr('style','');  
					currentSlide.removeClass('accelerator');
				},animTime*0.5)
			//	if ($.isFunction(callback)) {
			//		object.bind(transitionEnd,function(){
			//		     object.unbind(transitionEnd);
					 //    callback();
			//		});
			//	} 
			}
		}

		/*****************************************
		 ***
		 *** show a new page 
		 ***
		 ******************************************/

		function showNewSlide(currentSlide){
			//localStorage.setItem('currentPage',JSON.stringify(currentSlide));
				//console.log('immediately to '+currentSlide);
				currentPage = currentSlide;
			$('.active').removeClass('active').addClass('hidder');
				//show page immediately
			$('#article'+(currentSlide))
				.attr('style','')
				.removeClass('hidder')
				.addClass('active'); 
			if (pdContents.position().top>-200){
				raisePull();
			}
		}

		/*****************************************
		 ***
		 *** clear any selected buttons
		 ***
		 ******************************************/

		function clearButtons(){
			$('.selected').toggleClass('selected');
		}

		

		function checkTouchEvents(element){
		    // **** tap content buttons to move to pages
		    var buttonSelect =$(element);
		    for(var i=0; i<buttonSelect.length;i++){
		        jester($(element)[i])
		        .tap(function(){
		            animateButton(this);
		            $('#wrapper_all').find('.article-wrapper').not($('.active')).attr('style','');
					var pageNow = parseInt($(this).attr("id")); 
					if (pdContents.position().top<-200){
					//	console.log('moveto');
						moveTo(pageNow);
					} else {
					//	console.log('pageNow');
						showNewSlide(pageNow);
					}
		             });
		    };
		}

		function checkDeskEvents(){
		    $('.active').removeClass('hidder');    
		    // ****  allow clicking on the previous on the article screen
		    $('#leftHead').on('click', function(event) { 
				animateButton(this);
				//  $('#overlayed').addClass('hidder');
				newPageLeft(currentPage-1);
				manageControls(currentPage);
			}); 
		    
		    // ****  allow clicking on the next on the article screens
		    $('#rightHead').on('click', function(event) { 
				animateButton(this);
	           //  $('#overlayed').addClass('hidder');
				newPageRight(currentPage+1);
				manageControls(currentPage);
	         }); 
		    
		    $('.contentButton').on('click',function(){   
				animateButton(this);
				$('#wrapper_all').find('.article-wrapper').not($('.active')).attr('style','');
				var pageNow = parseInt($(this).attr("id")); 
				if (pdContents.position().top<-200){
				//	console.log('moveto');
					moveTo(pageNow);
					manageControls(currentPage);
				} else {
				//	console.log('pageNow');
					showNewSlide(pageNow);
					manageControls(currentPage);
				}
             });    
		}

		// start reading the various buttons for activation

	    if(!Modernizr.touch) {
			manageControls (currentPage);
			checkDeskEvents();
		} else {
			$('#rightHead').hide();
			$('#leftHead').hide();
			checkTouchEvents($('#pdContents').find('.contentButton'));
			checkTouchEvents($('#TOC2').find('.contentButton'));
		}


	}//end plugin