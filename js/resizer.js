
/* 
*   Background image resizing and placement
*
*   Part of the Movement for Publication framework
*
*   Gerry Straathof 2012 nosemonger@gmail.com
*   
*/

function updateOrientation(){ //actions to take when orientation is changed.

    // give the height of the viewport to the various divs used
    // exception code is for the different browsers used.
    
    var cwidth = $(window).width()
    var cheight= $(window).height()
    
    
    //window.alert($(window).width()+' '+$(window).height());
    
    if (typeof(window.innerWidth)=='number'){
        var cwidth = window.innerWidth;
        var cheight= window.innerHeight;
    
    //window.alert(cwidth+' '+cheight);
    } 
    else if (document.documentElement && (document.documentElement.clientWidth ||document.documentElement.clientHeight)){
        var cwidth = document.documentElement.clientWidth;
        var cheight= document.documentElement.clientHeight;
        //window.alert('document.element '+cheight);
    }  else if (document.body && (document.body.clientWidth || document.body.clientHeight)){
        var cwidth=document.body.clientWidth;
        var cheight=document.body.clientHeight;
        //window.alert('document.body '+cheight);
    }
    
    main.css({'height':cheight+'px','width':cwidth+'px'}); 
    fullpage.css({'width':cwidth+'px','height':cheight+'px'});  
    
    $('.hide-up').css('height',cheight);
    $(".content-wrapper").css({'height':cheight+'px','width':cwidth+'px'});

    $(".filler").css('height',cheight*0.25);
    $(".fillerSmall").css('height',cheight*0.1);
    
    contentWrapper.css({'height':cheight+'px','width':cwidth+'px'}); 
    
    
    backdropImages.each(function(index){
        var realImage = this,
        iw = $(realImage).width(),
        ih = $(realImage).height(),
        iRatio = iw/ih,
        cRatio = cwidth/cheight;


        if (cRatio < iRatio) {
            $(realImage).css({"height":"100%", "width":"auto"});
        } else {
            $(realImage).css({"height":"auto", "width":"100%"});
        }           

        if ($(realImage).hasClass('bottomImage')){
            //console.log('bottomImage');
            $(realImage).css({'top':-Math.abs($(realImage).height()-cheight)+'px'});
        }else if ($(realImage).hasClass('topImage')){
            //console.log('topImage');
            $(realImage).css({'top':'0px'});
        }else {
            //console.log('middled');
            var gt=Math.round((cheight-$(realImage).height())/2);
            $(realImage).css({  'top':gt+'px'});
        }

        if ($(realImage).hasClass('rightImage')){
            //console.log('rightImage');
            $(realImage).css({'left':'0px'});
        }else if ($(realImage).hasClass('leftImage')){
            //console.log('leftImage');

            $(realImage).css({'left':(cwidth-$(realImage).width())+'px'});
        }else {
            //console.log('centered');
            var gs=Math.round((cwidth-$(realImage).width())/2)
            $(realImage).css({  'left':gs+'px'});
        }
    })
    if (!contentSet){
		$('.article-wrapper').find('.scroller-content').each(function(index){
            if ($(this).height() < main.height()){
				$(this).height(main.height()-10);
			}
		})
    }
//    resizeArticleScroll();
    recenterOverlay();
    if (FullScrollDone==true){
        setTimeout(function () { fullScroll.refresh() }, 0);
        fullScroll.scrollToElement('.active',100);
        }

    // resize article-scroll width and remove firefox scrollers
    $('.content-wrapper').each(function(){
        cwidth = cwidth*0.8;
        if ( cwidth > 960 ){cwidth = 960;}// console.log(cwidth)} else {console.log("nope")}
        $(this).css({'width':cwidth})
        var scroller = $(this).find('.article-scroller');
        var scrollCheck = $(scroller).find('.scroller-content');
        var totalWidth = scrollCheck.width()+parseInt(scrollCheck.css('left'))*2;
        var widthCheck = $(this).width();
                /* this check is to see if firefox has added scrollers to the main content */

        if (( widthCheck - totalWidth)> 0){
          $(this).css({'width': widthCheck+15});
          $(scroller).css({'width': widthCheck+15});
        }
    })

		//$('.active').toggleClass('active');
	$('#article'+(currentPage)).addClass('active').removeClass('hidder');
	$('.article-wrapper').not($('#article'+(currentPage))).addClass('hidder');
	
}

