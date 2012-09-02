
//   ***************************************** 
//  pull down menu controls
//	******************************************
(function($){
	"use strict";
	$.fn.jPullDown = function () {
	return this.each(function(index) {
		// the pull down menu for the menu bar
		// pull = the titlebar that pulls down the contents

		var height = 		main.height(),
		pull = 		$(this),
		string = $('#string');
		var pullTop = 0;
		var height = 0;
		var width = 0;
		var minWidth=(main.width())*0.15;

	//	var currentPage = JSON.parse(localStorage.getItem('currentPage'));
		var remover = $('.article-wrapper:eq(' + currentPage + ')');


		pull.bind('mousedown touchstart',function(event){
			event.stopPropagation();

			if(Modernizr.touch){
				event = event.originalEvent.touches[0];
			}	

			height = main.height();
			var pullHeight = $(pull).outerHeight(); // height is different for each title
			var pullBottomMax = main.height();//-pullHeight; //the remainder of space	

			pdContents.css('height',pullBottomMax+'px');

			var initY = event.pageY,
				sY = event.pageY,
				sWY = 0;

			var prevsWY = 0,
				pullDistance = 0,
				pullCurrent = pull.offset(),
				pullPos = pull.offset().top;

			$(document).bind('mousemove touchmove ',function(event2){
				if(Modernizr.touch){
					event2.preventDefault();
					event2 = event2.originalEvent.touches[0];
				}	 

				pullPos = pull.offset().top;		 
				pullTop = pullPos - (event2.pageY-sY);

				sWY = sWY-(sY-event2.pageY);

				sY = event2.pageY; 

				pullDistance = Math.abs(sWY);
				var pullDirection =sWY/pullDistance;

				sY = event2.pageY;
				if (sY>(pullBottomMax-pullHeight)) sY = pullBottomMax;

				//	 pull.css('top',sY+'px');
				pdContents.css('top',-pullBottomMax+sY+'px');
				string.css('top',sY-43+'px');

			}); //end of pull-down scroll check
							
			$(document).bind('mouseup touchend',function(ev){	
				$(document).unbind('mousemove touchmove mouseup touchend');
				//	pull.unbind('mousemove touchmove mouseup touchend');
				if(Modernizr.touch){
					ev = ev.originalEvent.touches[0];
				}
				var pullHeight = $(pull).outerHeight(); // height is different for each title
				var pullBottomMax = $('body').height();//-pullHeight; //the remainder of space			 
				if ((pullDistance<5)) {
						pullDistance = 101;
					if (($('.hide-up').css('top') == '-100%')||(!($('.hide-up').css('top') == '0px'))){
						sWY = 5;
					} else {sWY = -5}
				}
				if (sWY>0) {// are we moving down?
				// console.log('moving down');
				if (pullDistance > 100) {
					//		 pull.animate({'top':pullBottomMax+'px'},{duration:animTime/10});
					pdContents.animate({'top':0+'px'},{duration:animTime/10});
					string.animate({'top':pullBottomMax-43+'px'},{duration:animTime/10});
				} else { 
					//		 pull.animate({'top':'0px'},{duration:animTime/10});
					pdContents.animate({'top':-pullBottomMax+'px'},{duration:animTime/10});
					string.animate({'top':-43+'px'},{duration:animTime/10});
				} // end of top check
				} else if (sWY<0){ //are we moving the page up?
				// console.log('moving up');
					if (pullDistance <100 && pullDistance!=0){
						//	 pull.animate({'top':pullBottomMax+'px'},{duration:animTime/10});
						pdContents.animate({'top':0+'px'},{duration:animTime/10});
						string.animate({'top':pullBottomMax-43+'px'},{duration:animTime/10});
					} else {
						//	 pull.animate({'top':'0px'},{duration:animTime/10});
						pdContents.animate({'top':-pullBottomMax+'px'},{duration:animTime/10});
						string.animate({'top':-43+'px'},{duration:animTime/10});
					} // end of bottom check
				}
			});
		}); //end pull bind
	}); //end return each(?) function?
 } //end 'inner' function
 return;
 })(jQuery); //  end it all…
