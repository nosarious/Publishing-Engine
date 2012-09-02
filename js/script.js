
/* 
*   Main system to control the published document
*
*   Part of the Movement for Publication framework
*
*   Gerry Straathof 2012 nosemonger@gmail.com
*   
*/

  $('#spinner').css('top',$(document).height()/2-100).css('left',$(document).width()/2-100);			  
			var opts = {
				lines: 12, // The number of lines to draw
				length: 30, // The length of each line
				width: 15, // The line thickness
				radius: 25, // The radius of the inner circle
				color: '#ffffff', // #rbg or #rrggbb
				speed: 1, // Rounds per second
				trail: 100, // Afterglow percentage
				shadow: true // Whether to render a shadow
			};
			var target = document.getElementById('spinner');
			
			var spinner = new Spinner(opts).spin(target);


/* 
    this is supposed to speed up touch controls. 
    I am not sure if it works
*/
    FastButton = function(element, handler) {
      this.element = element;
      this.handler = handler;

      element.addEventListener('touchstart', this, false);
      element.addEventListener('click', this, false);
    };
    FastButton.prototype.handleEvent = function(event) {
      switch (event.type) {
        case 'touchstart': this.onTouchStart(event); break;
        case 'touchmove': this.onTouchMove(event); break;
        case 'touchend': this.onClick(event); break;
        case 'click': this.onClick(event); break;
      }
    };
    FastButton.prototype.onTouchStart = function(event) {
      event.stopPropagation();

      this.element.addEventListener('touchend', this, false);
      document.body.addEventListener('touchmove', this, false);

      this.startX = event.touches[0].clientX;
      this.startY = event.touches[0].clientY;
    };
    FastButton.prototype.onTouchMove = function(event) {
      if (Math.abs(event.touches[0].clientX - this.startX) > 10 ||
          Math.abs(event.touches[0].clientY - this.startY) > 10) {
        this.reset();
      }
    };

    FastButton.prototype.onClick = function(event) {
      event.stopPropagation();
      this.reset();
      this.handler(event);

      if (event.type == 'touchend') {
        clickbuster.preventGhostClick(this.startX, this.startY);
      }
    };

    FastButton.prototype.reset = function() {
      this.element.removeEventListener('touchend', this, false);
      document.body.removeEventListener('touchmove', this, false);
    };
    clickbuster = function(){}
    clickbuster.preventGhostClick = function(x, y) {
      clickbuster.coordinates.push(x, y);
      window.setTimeout(clickbuster.pop, 2500);
    };

    clickbuster.pop = function() {
      clickbuster.coordinates.splice(0, 2);
    };
    clickbuster.onClick = function(event) {
      for (var i = 0; i < clickbuster.coordinates.length; i += 2) {
        var x = clickbuster.coordinates[i];
        var y = clickbuster.coordinates[i + 1];
        if (Math.abs(event.clientX - x) < 25 && Math.abs(event.clientY - y) < 25) {
          event.stopPropagation();
          event.preventDefault();
        }
      }
    };

/* 
    this is supposed to prevent default clicks. 
*/
  document.addEventListener('click', clickbuster.onClick, true);
  clickbuster.coordinates = [];

  $(document).bind('touchmove', false);

/* 
    this activated the image backdrop resizing routine. 
*/

  jQuery.event.add(window, "orientationchange", updateOrientation);
  jQuery.event.add(window, "load", updateOrientation);
  jQuery.event.add(window, "resize", updateOrientation);

/* 
    this is the main system for activating the document. 
*/
$(document).ready(function(){ 

	var contentSet = true;	
				  
				  
	// shortcuts for accessing elements in jquery
	window.main = $("body");					
	window.fullpage = $(".fullPage");			
	window.contentWrapper = $('.content-wrapper');
	window.filler = $(".filler");
	window.fillerSmall = $(".fillerSmall");
	window.backdropImages = $(".backdrop>img"); //used to recenter backgrounds
	window.fitText = $("#fittext");
	window.pdContents = $('#pdContents');
	window.titleBlocked = $('.active').find('.titleBlock');
	
	window.animTime = 2000;
	window.maxPage = $('.article-wrapper').length;

	// Get a short-hand for our application cache object.
	var appCache = window.applicationCache;
	if (window.applicationCache) {
		applicationCache.addEventListener('error', appCacheError, false);
		applicationCache.addEventListener('checking', checkingEvent, false);
		applicationCache.addEventListener('noupdate', noUpdateEvent, false);
		applicationCache.addEventListener('downloading', downloadingEvent, false);
		applicationCache.addEventListener('progress', progressEvent, false);
		applicationCache.addEventListener('updateready', updateReadyEvent, false);
		applicationCache.addEventListener('cached', cachedEvent, false);
		/* unused variables 
		window.applicationCache.onerror = appCacheError;
		window.applicationCache.onchecking = checkingEvent;
		window.applicationCache.onnoupdate = noUpdateEvent;
		window.applicationCache.ondowloading = downloadingEvent;
		window.applicationCache.onprogress = progressEvent;
		window.applicationCache.onupdateready = updateReadyEvent;
		window.applicationCache.oncached = cachedEvent;
		*/
	}
	
	//disable text selection on entire body.
	disableSelection(document.body);
	  
    //defaults for browser types
	var webKit = false,
		mobile = false,
    swipeBusy = false;  
    
    //variables used for counting pages
  var newPage = 0,
		currentPage = 1, // the first page (cover)
		doOnce = 0,
		doTouch = false;
				  
	window.currentPage = 1;
	window.FullScrollDone = false;
	window.wrapperSize = false;
	window.scrollDone = 0;
	
	updateOrientation();
				  
	fitText.fitText(0.55); // for the title for the cover.

	jQuery.fx.interval = 60;
    
    // turn off image copying/draggin for backgrounds
    $('img').bind('dragstart', function(event) { event.preventDefault(); });
    	   
   	// build the table of contents
	buildContents();

    // set up the scroll/slide/pull-down for each page
    jPageMove();
	$('#wrapper_all').find('.article-wrapper').jTouchMove(true,true,true);
	$('#string').jPullDown();
	
	$('.active').toggleClass('active');
	$('.article-wrapper').not('.active').addClass('hidder');
	$('#article'+(currentPage)).addClass('active').removeClass('hidder');
				  
	// move to the current page.			  
//	moveTo(currentPage);
				  
	// timer to hide the spinner at the first load.	
	$(window).load(function(){
	   if (window.navigator.standalone == true) {
	   //not in safari
			var timer = 5000;
	   } else {
			var timer = 2500;	   
				   }
				   
		setTimeout ( function () {
			  spinner.stop();
			$('#spinner').addClass('hidder').css('z-index','-10'); 
				updateOrientation;
		},timer);  
	});	  

}); 
/*****************************************
 ***
 *** display invitation to save to home screen 
 *** after cache set up.
 ***
 ******************************************/

function cachedEvent(e) {
    alert('you may now save to home screen');
		//displayWord("Offline Enabled");
}

function appCacheError(e) {
		//displayOfflineError();
		//location.reload();
//	console.log('im broken');
		//displayWord("Error: " + e.value);
}

function checkingEvent(e) {
		//displayWord("Checking Update");
}
function noUpdateEvent(e) {
		//displayOfflineLabel();
		//displayWord("No Update");
}
function downloadingEvent(e) {
		//displayWord("Downloading");
}
function progressEvent(e) {
		//if (e.loaded)
			//displayWord("Files Cached: " + e.loaded);
}
function updateReadyEvent(e) {
		//displayOfflineLabel();
		//displayWord("Offline Enabled");
}

function displayOfflineLabel() {/*
    var label = document.getElementById("offline");
    label.style.display = "block";
    label.style.visibility = "visible";
								 */
}

function displayOfflineError() {/*
    var label = document.getElementById("offline");
    label.style.display = "block";
    label.style.visibility = "visible";
		//label.innerText = "AppCache Error";
								 */
}


/*
*
*  Build the table of contents
*
*   This uses the descriptor <t> and <p> 
*   to build contents buttons for pulldown
*   menu and contents page
*
*/

function buildContents(){
   
        var length = $('.article-wrapper').length+1;
        for( var i=0; i < length; i++){
                     var $test = $('#article'+(i));
                      if ($test.hasClass('beginning')){
                          //  console.log(i);
				  //  var $article = $("<div id="+i+" class=' button rounded-corners unselected-button contentButton'>");
				    var $article = $("<div id="+i+" class=' button rounded-corners unselected-button contentButton'>");
						  var $content = $test.find('.descriptor');
                          $content.clone().appendTo($article);
                          $article.clone().appendTo('#TOC');
                          $content.addClass('hidden');
                      }
            }
		$('#issue-container').find('.descriptor').css('display','none');
        var TOContents = $('#TOC');
		TOContents.clone().appendTo('#TOC2');
		TOContents.append('<div class="fillerExtra"><br><br><p></p><br></div>');
		$('#TOC2').append('<div class="fillerExtra"><br><br><p></p><br></div>');
		
		contentSet = false;// flag to indicate the contents are set
		
		pdContents.jTouchMove(false,true,true); // enable scrolling on pulldown contents.
}

//   ***************************************** 
//  manageControls on desktop
//  ******************************************

function manageControls (currentPage){ 
    // Hide left arrow if position is first slide
    if(currentPage==1){ $('#leftHead').hide() }
    else{ $('#leftHead').show() }
    // Hide right arrow if position is last slide
    if(currentPage==maxPage){ $('#rightHead').hide() }
    else{ $('#rightHead').show() }
}

/*****************************************
***
*** begin check for touch events
***
******************************************/

function isTouchDevice() {
    if (Modernizr.touch){
      return true;
   }else {
      return false;
   }
}

/*****************************************
 ***
 *** raise the pull-down menu
 ***
 ******************************************/
function raisePull(){
	pdContents.animate({'top':'-100%'},{duration:animTime/3});
	$('#string').animate({'top':'-43px'},{duration:animTime/3});
	return;
}


/*****************************************
 ***
 *** check for multiple 'actve' elements
 ***
 ******************************************/
function singleActive(){
	if ($('.active').length>1){
		$('#wrapper_all').find('.active').not($('#article'+(currentPage))).toggleClass('active').addClass('hidden');
	}
}

/*****************************************
 ***
 *** hide overlay and overlay text only
 ***
 ******************************************/
  function hideOverlay2(){
        $('#overlayText').css('visibility','hidden');
        $('#overlayed').css({'visibility':'hidden','opacity':'100'});
        $('#overlayer>img').remove();
        return false;
}
 
/*****************************************
 ***
 *** check handler on overlay on click
 ***
 ******************************************/ 
 function hideOverlay(){
    var holder = $('#overlayed');
    holder.on('click touchstart', function(event){
        timel = (new Date()).getTime();
        
        if ((timel-timee)>500){
            hideOverlay2();
        };
    });
}

/*****************************************
 ***
 *** start showing the images (second iteration)
 ***
 ******************************************/ 
 function startImages2(item){
    //   $('#instructions').addClass('hidden');
    
    var image = $(item);
				        
    var holder = $('#overlayed');
    
    var cWidth=$("body").width();
    var cHeight=$("body").height();	
    
    $('#overlayText').text('');
    
    $('#overlayText').css({'display':'block','visibility':'hidden','bottom':'25%','left':'25%' } );
                
    $(image).clone().appendTo('#overlayer').css({'border-radius':'5px','box-shadow':'0 0 10px #000000'});
    var content = $('#overlayer>img');
    var    info = $('#overlayText');
        
    $(content).removeClass('thumbImage').addClass('largestIcon');
    var iHeight = Math.round(($(content).outerHeight())/2),
        iWidth = Math.round(($(content).outerWidth())/2),
        gutterSide=Math.round((cWidth-iWidth)/2),
        gutterTop=Math.round((cHeight-iHeight)/2);
        
    content.css({'left': gutterSide+'px','top': gutterTop+'px','width':iWidth+"px",'height':iHeight+"px",'position':'absolute'} );
    var title = $(image).attr('title');
    
    $(info).text(title);
    
    $(info).css({'left':gutterSide+'px','bottom': gutterTop +'px','width':iWidth+'px','padding': 5 +'px','position':'absolute','z-index':'10'} );
        
    resizeIcon();
    
    holder.css('visibility','visible');
    if (title==""){
        $('#overlayText').css('visibility','hidden');
    } else {
        $(info).css('visibility','visible');
    }
    
    timee = (new Date()).getTime();

 }
 
 
/***********************************************
 * Disable Text Selection script- © Dynamic Drive DHTML code library (www.dynamicdrive.com)
 * This notice MUST stay intact for legal use
 * Visit Dynamic Drive at http://www.dynamicdrive.com/ for full source code
 ***********************************************/
function disableSelection(target){
	if (typeof target.onselectstart!="undefined") //IE route
		target.onselectstart=function(){return false}
    else if (typeof target.style.MozUserSelect!="undefined") //Firefox route
			target.style.MozUserSelect="none"
    else //All other route (ie: Opera)
				target.onmousedown=function(){return false}
				target.style.cursor = "default"
}

	//Sample usages
	//disableSelection(document.body) //Disable text selection on entire body
	//disableSelection(document.getElementById("mydiv")) //Disable text selection on element with id="mydiv"
	
/*****************************************
 ***move the address bar up for mobile devices. doesn't work on ipad.
 ***
 ******************************************/ 
function MoveAddressBar(){
    if (!window.location.hash && window.addEventListener) {
        window.addEventListener("load", function(){
            window.scrollTo( 0, 1 );
            window.scrollTo( 0, 0 );
        }, false);
    }
}

//    
//  RESIZING
//

function resizeArticleScroll (){ 

    if (wrapperSize == true){ //only do this if touch device.
        var cheight = $("body").height();
        var cwidth = $("body").width();
        $('#issue-container').css({'top':0});
        $('#issue-container').css({'height':cheight+'px'});
        /*
        var scrollerWidth;
        var sliderWidth = cwidth*3;
         
          
        $('#slider-container').css({'width':sliderWidth+'px', 'height':cheight+'px'});      
        
        $('.sliderContent').css({'width':cwidth+'px','height':cheight+'px','left':cwidth+'px'});
        */
    }
}

//    
//  set up width and height of overlayed image
//
function resizeIcon (){ //resize small icon to fit screen
    if ($('#overlayed:has(img)')) {
        var image = $('#overlayer').find('.largestIcon');
        var cwidth = main.width();
        var cheight= main.height();
        var iheight = $(image).outerHeight();
        var iwidth = $(image).outerWidth();
        
        if (iwidth>iheight) { // set values for portrait
            portrait = false;
            } else { // set values for square or landscape
            portrait = true;
            }                
        ccwidth = cwidth*.75;
        ccheight=cheight*.75;        
        
        if (cwidth>cheight) { //screen wider
         //   var narrower = ((cwidth-cheight)/2);
            if (portrait) { // if landscape or square & screen wider
                image.css({'width':'auto','height':ccheight+'px'});
            } else { //if portrait & screen wider
                image.css({'width':ccheight+'px','height':'auto'});
            }
        } else { // screen taller
         //   var taller = ((cheight-cwidth)/2);
            if (portrait) { // if portrait & screen taller 
            image.css({'width':'auto','height':ccwidth+'px'});
            } else { //if landscape or square & screen wider
            image.css({'width':ccwidth+'px','height':'auto'});
            }
        }  
        var iheight = image.outerHeight(),
            iwidth = image.outerWidth(),
            twidth = image.width(),
            gutterSide=(cwidth-iwidth)/2,
            gutterTop=(cheight-iheight)/2;
        image.css({'left': gutterSide+'px','top': gutterTop+'px'}); 
		$('#overlayText').css({'left': gutterSide+'px', 'bottom':gutterTop-3+'px', 'width' : twidth-10+'px'});
    }
}  

//    
//  recenter overlay on orientation chage
//
function recenterOverlay (){
    window.scrollTo(0,-2);
    var cwidth = $("body").width();
    var cheight= $("body").height();
    var iheight = $(".largestIcon").outerHeight();
    var iwidth = $(".largestIcon").outerWidth();
    var twidth = $(".largestIcon").width();
    var gutterSide=(cwidth-iwidth)/2;
    var gutterTop=(cheight-iheight)/2;
    $(".largestIcon").css({'left': gutterSide+'px','top': gutterTop+'px'}); 
    $('#overlayText').css({'left': gutterSide+'px', 'bottom':gutterTop-3+'px', 'width' : twidth-10+'px'});
}

/* 
 *home-made lightbox for the engine
 * 
 */
(function($){
// "use strict";
	 $.fn.engineLightbox = function () {
		 return this.each(function() {
              // find an image
              // click on it to enlarge
              // show the caption if available
              
            var image = $(this);
            
            var holder = $('#overlayed');
			holder.css('visibility','hidden');

            
            image.off();
             
            image.on('touchstart',function(es){
                timer = (new Date()).getTime();
                
                    es.stopImmediatePropagation();
                image.on('touchend',function(el){	
                    el.stopImmediatePropagation();
                    //$(this).addClass('blackoutline');
                    image.off('touchstart touchend');
                    timee = (new Date()).getTime();
                    
                    //$(this).removeClass('blackoutline');
                    if ((timee-timer) < 250){ //do only if the up/down is less than half a second
                        startImages(this);   
                        return false;
                    }
                    return false;
                });
            });
                    
		}); //end return each(?) function?
} //end 'inner' function
return;
 
 })(jQuery); //  end it all…





