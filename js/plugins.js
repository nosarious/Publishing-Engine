//fgnass.github.com/spin.js#v1.2.2
(function(window, document, undefined) {

/**
 * Copyright (c) 2011 Felix Gnass [fgnass at neteye dot de]
 * Licensed under the MIT license
 */

  var prefixes = ['webkit', 'Moz', 'ms', 'O'], /* Vendor prefixes */
      animations = {}, /* Animation rules keyed by their name */
      useCssAnimations;

  /**
   * Utility function to create elements. If no tag name is given,
   * a DIV is created. Optionally properties can be passed.
   */
  function createEl(tag, prop) {
    var el = document.createElement(tag || 'div'),
        n;

    for(n in prop) {
      el[n] = prop[n];
    }
    return el;
  }

  /**
   * Inserts child1 before child2. If child2 is not specified,
   * child1 is appended. If child2 has no parentNode, child2 is
   * appended first.
   */
  function ins(parent, child1, child2) {
    if(child2 && !child2.parentNode) ins(parent, child2);
    parent.insertBefore(child1, child2||null);
    return parent;
  }

  /**
   * Insert a new stylesheet to hold the @keyframe or VML rules.
   */
  var sheet = (function() {
    var el = createEl('style');
    ins(document.getElementsByTagName('head')[0], el);
    return el.sheet || el.styleSheet;
  })();

  /**
   * Creates an opacity keyframe animation rule and returns its name.
   * Since most mobile Webkits have timing issues with animation-delay,
   * we create separate rules for each line/segment.
   */
  function addAnimation(alpha, trail, i, lines) {
    var name = ['opacity', trail, ~~(alpha*100), i, lines].join('-'),
        start = 0.01 + i/lines*100,
        z = Math.max(1-(1-alpha)/trail*(100-start) , alpha),
        prefix = useCssAnimations.substring(0, useCssAnimations.indexOf('Animation')).toLowerCase(),
        pre = prefix && '-'+prefix+'-' || '';

    if (!animations[name]) {
      sheet.insertRule(
        '@' + pre + 'keyframes ' + name + '{' +
        '0%{opacity:'+z+'}' +
        start + '%{opacity:'+ alpha + '}' +
        (start+0.01) + '%{opacity:1}' +
        (start+trail)%100 + '%{opacity:'+ alpha + '}' +
        '100%{opacity:'+ z + '}' +
        '}', 0);
      animations[name] = 1;
    }
    return name;
  }

  /**
   * Tries various vendor prefixes and returns the first supported property.
   **/
  function vendor(el, prop) {
    var s = el.style,
        pp,
        i;

    if(s[prop] !== undefined) return prop;
    prop = prop.charAt(0).toUpperCase() + prop.slice(1);
    for(i=0; i<prefixes.length; i++) {
      pp = prefixes[i]+prop;
      if(s[pp] !== undefined) return pp;
    }
  }

  /**
   * Sets multiple style properties at once.
   */
  function css(el, prop) {
    for (var n in prop) {
      el.style[vendor(el, n)||n] = prop[n];
    }
    return el;
  }

  /**
   * Fills in default values.
   */
  function merge(obj) {
    for (var i=1; i < arguments.length; i++) {
      var def = arguments[i];
      for (var n in def) {
        if (obj[n] === undefined) obj[n] = def[n];
      }
    }
    return obj;
  }

  /**
   * Returns the absolute page-offset of the given element.
   */
  function pos(el) {
    var o = {x:el.offsetLeft, y:el.offsetTop};
    while((el = el.offsetParent)) {
      o.x+=el.offsetLeft;
      o.y+=el.offsetTop;
    }
    return o;
  }

  /** The constructor */
  var Spinner = function Spinner(o) {
    if (!this.spin) return new Spinner(o);
    this.opts = merge(o || {}, Spinner.defaults, defaults);
  },
  defaults = Spinner.defaults = {
    lines: 12, // The number of lines to draw
    length: 7, // The length of each line
    width: 5, // The line thickness
    radius: 10, // The radius of the inner circle
    color: '#000', // #rgb or #rrggbb
    speed: 1, // Rounds per second
    trail: 100, // Afterglow percentage
    opacity: 1/4,
    fps: 20
  },
  proto = Spinner.prototype = {
    spin: function(target) {
      this.stop();
      var self = this,
          el = self.el = css(createEl(), {position: 'relative'}),
          ep, // element position
          tp; // target position

      if (target) {
        tp = pos(ins(target, el, target.firstChild));
        ep = pos(el);
        css(el, {
          left: (target.offsetWidth >> 1) - ep.x+tp.x + 'px',
          top: (target.offsetHeight >> 1) - ep.y+tp.y + 'px'
        });
      }
      el.setAttribute('aria-role', 'progressbar');
      self.lines(el, self.opts);
      if (!useCssAnimations) {
        // No CSS animation support, use setTimeout() instead
        var o = self.opts,
            i = 0,
            fps = o.fps,
            f = fps/o.speed,
            ostep = (1-o.opacity)/(f*o.trail / 100),
            astep = f/o.lines;

        (function anim() {
          i++;
          for (var s=o.lines; s; s--) {
            var alpha = Math.max(1-(i+s*astep)%f * ostep, o.opacity);
            self.opacity(el, o.lines-s, alpha, o);
          }
          self.timeout = self.el && setTimeout(anim, ~~(1000/fps));
        })();
      }
      return self;
    },
    stop: function() {
      var el = this.el;
      if (el) {
        clearTimeout(this.timeout);
        if (el.parentNode) el.parentNode.removeChild(el);
        this.el = undefined;
      }
      return this;
    }
  };
  proto.lines = function(el, o) {
    var i = 0,
        seg;

    function fill(color, shadow) {
      return css(createEl(), {
        position: 'absolute',
        width: (o.length+o.width) + 'px',
        height: o.width + 'px',
        background: color,
        boxShadow: shadow,
        transformOrigin: 'left',
        transform: 'rotate(' + ~~(360/o.lines*i) + 'deg) translate(' + o.radius+'px' +',0)',
        borderRadius: (o.width>>1) + 'px'
      });
    }
    for (; i < o.lines; i++) {
      seg = css(createEl(), {
        position: 'absolute',
        top: 1+~(o.width/2) + 'px',
        transform: 'translate3d(0,0,0)',
        opacity: o.opacity,
        animation: useCssAnimations && addAnimation(o.opacity, o.trail, i, o.lines) + ' ' + 1/o.speed + 's linear infinite'
      });
      if (o.shadow) ins(seg, css(fill('#000', '0 0 4px ' + '#000'), {top: 2+'px'}));
      ins(el, ins(seg, fill(o.color, '0 0 1px rgba(0,0,0,.1)')));
    }
    return el;
  };
  proto.opacity = function(el, i, val) {
    if (i < el.childNodes.length) el.childNodes[i].style.opacity = val;
  };

  /////////////////////////////////////////////////////////////////////////
  // VML rendering for IE
  /////////////////////////////////////////////////////////////////////////

  /** 
   * Check and init VML support
   */
  (function() {
    var s = css(createEl('group'), {behavior: 'url(#default#VML)'}),
        i;

    if (!vendor(s, 'transform') && s.adj) {

      // VML support detected. Insert CSS rules ...
      for (i=4; i--;) sheet.addRule(['group', 'roundrect', 'fill', 'stroke'][i], 'behavior:url(#default#VML)');

      proto.lines = function(el, o) {
        var r = o.length+o.width,
            s = 2*r;

        function grp() {
          return css(createEl('group', {coordsize: s +' '+s, coordorigin: -r +' '+-r}), {width: s, height: s});
        }

        var g = grp(),
            margin = ~(o.length+o.radius+o.width)+'px',
            i;

        function seg(i, dx, filter) {
          ins(g,
            ins(css(grp(), {rotation: 360 / o.lines * i + 'deg', left: ~~dx}),
              ins(css(createEl('roundrect', {arcsize: 1}), {
                  width: r,
                  height: o.width,
                  left: o.radius,
                  top: -o.width>>1,
                  filter: filter
                }),
                createEl('fill', {color: o.color, opacity: o.opacity}),
                createEl('stroke', {opacity: 0}) // transparent stroke to fix color bleeding upon opacity change
              )
            )
          );
        }

        if (o.shadow) {
          for (i = 1; i <= o.lines; i++) {
            seg(i, -2, 'progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)');
          }
        }
        for (i = 1; i <= o.lines; i++) {
          seg(i);
        }
        return ins(css(el, {
          margin: margin + ' 0 0 ' + margin,
          zoom: 1
        }), g);
      };
      proto.opacity = function(el, i, val, o) {
        var c = el.firstChild;
        o = o.shadow && o.lines || 0;
        if (c && i+o < c.childNodes.length) {
          c = c.childNodes[i+o]; c = c && c.firstChild; c = c && c.firstChild;
          if (c) c.opacity = val;
        }
      };
    }
    else {
      useCssAnimations = vendor(s, 'animation');
    }
  })();

  window.Spinner = Spinner;

})(window, document);
 
 /*global jQuery */
/*!	
* FitText.js 1.0
*
* Copyright 2011, Dave Rupert http://daverupert.com
* Released under the WTFPL license 
* http://sam.zoy.org/wtfpl/
*
* Date: Thu May 05 14:23:00 2011 -0600
*/

(function($,sr){
 
  // debouncing function from John Hann
  // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
  var debounce = function (func, threshold, execAsap) {
      var timeout;
 
      return function debounced () {
          var obj = this, args = arguments;
          function delayed () {
              if (!execAsap)
                  func.apply(obj, args);
              timeout = null; 
          };
 
          if (timeout)
              clearTimeout(timeout);
          else if (execAsap)
              func.apply(obj, args);
 
          timeout = setTimeout(delayed, threshold || 100); 
      };
  }
	// smartresize 
	jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };
 
})(jQuery,'smartresize');

(function( $ ){

	$.fn.fitText = function( kompressor ) {

			return this.each(function(){
				var $this = $(this);                                      // store the object
				var fontResize = origFontSize = $this.css('font-size');   // init the font sizes
				var compressor = kompressor || 1;                         // set the compressor

        // Resizer() resizes items based on the object width divided by the compressor * 10
				var resizer = function ( obj ) {
					fontResize =  obj.width() / (compressor*10);
					fontResize = (fontResize >= origFontSize)?  origFontSize : fontResize; 
					obj.css('font-size',fontResize);
				}

				// Call once to set.
				resizer($this);

				// Call on resize. Opera debounces their resize by default. 
      	$(window).smartresize(function() {
					resizer($this);
      	});
			});

	};

})( jQuery );



/* 
 * Jester JavaScript Library v0.2
 * http://github.com/plainview/Jester
 *
 * Easy JavaScript gesture recognition.
 * 
 * Copyright (c) 2010 Scott Seaward
 * Released under MIT License
 */
(function(container, undefined) {
    container["Jester"] = {
        cache : {},
        cacheId : "Jester" + (new Date()).getTime(),
        guid : 0,

        // The Jester constructor
        Watcher : function(element, options) {

            var that = this,
                cacheId = Jester.cacheId,
                cache = Jester.cache,
                gestures = "swipe flick tap doubletap pinchnarrow pinchwiden pinchend";

            if(!element || !element.nodeType) {
                throw new TypeError("Jester: no element given.");
            }

            // if this element hasn't had Jester called on it before,
            // set it up with a cache entry and give it the expando
            if(typeof element[cacheId] !== "number") {
                element[cacheId] = Jester.guid;
                Jester.guid++;
            }

            var elementId = element[cacheId];

            if(!(elementId in cache)) {
                Jester.cache[elementId] = {};
            }

            var elementCache = Jester.cache[elementId];

            if(!("options" in elementCache)) {
                elementCache["options"] = {};
            }

            options = options || elementCache.options || {};

            // cache the option values for reuse or, if options already
            // exist for this element, replace those that have been
            // specified
            if(elementCache.options !== options) {
                for(prop in options) {
                    if(elementCache.options[prop]) {
                        if(elementCache.options[prop] !== options[prop]) {
                            elementCache.options[prop] = options[prop];
                        }
                    }
                    else {
                        elementCache.options[prop] = options[prop];
                    }
                }
            }

            // 
            if(!("eventSet" in elementCache) || !(elementCache["eventSet"] instanceof Jester.EventSet)) {
                elementCache["eventSet"] = new Jester.EventSet(element);
            }

            if(!elementCache["touchMonitor"]) {
                elementCache["touchMonitor"] = new Jester.TouchMonitor(element);
            }

            var events = elementCache.eventSet;
            var touches = elementCache.touchMonitor;

            this.id = element[cacheId];

            this.bind = function(evt, fn) {
                if(evt && typeof evt === "string" && fn && fn.constructor === Function) {
                    events.register(evt, fn);
                }
                return this;
            };

            // create shortcut bind methods for all gestures
            gestures.split(" ").forEach(function(gesture) {
                this[gesture] = function(fn) {
                    return this.bind(gesture, fn);
                };
            }, that);

            this.start = function(fn) {
                return this.bind("start", fn);
            };

            this.during = function(fn) {
                return this.bind("during", fn);
            };

            this.end = function(fn) {
                return this.bind("end", fn);
            };

            // wrapper to cover all three pinch methods
            this.pinch = function(fns) {
                if(typeof fns !== "undefined") {
                    // if its just a function it gets assigned to pinchend
                    if(fns.constructor && fns.constructor === Function) {
                        that.pinchend(fns);
                    }
                    else if(typeof fns === "object") {
                        var method;
                        "narrow widen end".split(" ").forEach(function(eventExt) {
                            method = "pinch" + eventExt;
                            if(fns[eventExt] && fns[eventExt].constructor && fns[eventExt].constructor === Function) {
                                that[method](fns[eventExt]);
                            }
                        });
                    }
                }
            };

            this.halt = function() {
                touches.stopListening();
                events.clear();
                delete elementCache["eventSet"];
                delete elementCache["touchMonitor"];
            };
        },
        EventSet : function(element) {
            var cacheId = Jester.cacheId,
                elementId = element[cacheId],
                cache = Jester.cache,
                elementCache = cache[elementId];

            // all event names and their associated functions in an array i.e. "swipe" : [fn1, fn2, fn2]
            var eventsTable = {};
            this.eventsTable = eventsTable;

            // register a handler with an event
            this.register = function(eventName, fn) {
                // if the event exists and has handlers attached to it, add this one to the array of them
                if(eventsTable[eventName] && eventsTable[eventName].push) {
                    // make sure multiple copies of the same handler aren't inserted
                    if(!~eventsTable[eventName].indexOf(fn)) {
                        eventsTable[eventName].push(fn);
                    }
                }
                else {
                    // create a new array bound to the event containing only the handler passed in
                    eventsTable[eventName] = [fn];
                }
            };

            this.release = function(eventName, fn) {
                if(typeof eventName === "undefined") return;

                // if a handler hasn't been specified, remove all handlers
                if(typeof fn === "undefined") {
                    for(handlers in eventsTable.eventName) {
                        delete eventsTable.eventName[handlers];
                    }
                }
                else {
                    // pull the given handler from the given event
                    if(eventsTable[eventName] && ~eventsTable[eventName].indexOf(fn))
                    {
                        eventsTable[eventName].splice(eventsTable[eventName].indexOf(fn), 1);
                    }
                }

                // if the event has no more handlers registered to it, get rid of the event completely
                if(eventsTable[eventName] && eventsTable[eventName].length == 0) {
                    delete eventsTable[eventName];
                }
            };

            // completely remove all events and their handlers
            this.clear = function() {
                var events;
                for(events in eventsTable) {
                    delete eventsTable[events];
                }
            };

            // get all the handlers associated with an event
            // return an empty array if nothing is registered with the given event name
            this.getHandlers = function(eventName) {
                if(eventsTable[eventName] && eventsTable[eventName].length) {
                    return eventsTable[eventName];
                }
                else {
                    return [];
                }
            };

            // inject an array of handlers into the event table for the given event
            // this will klobber all current handlers associated with the event
            this.setHandlers = function(eventName, handlers) {
                eventsTable[eventName] = handlers;
            };

            // execute all handlers associated with an event, passing each handler the arguments provided after the event's name.
            this.execute = function(eventName) {
                if(typeof eventName === "undefined") return;

                // if the event asked for exists in the events table
                if(eventsTable[eventName] && eventsTable[eventName].length) {
                    // get the arguments sent to the function
                    var args = Array.prototype.slice.call(arguments, 1);

                    // iterate throuh all the handlers
                    for(i = 0; i < eventsTable[eventName].length; i++) {
                        // check current handler is a function
                        if(eventsTable[eventName][i].constructor == Function) {
                            // execute handler with the provided arguments
                            eventsTable[eventName][i].apply(element, args);
                        }
                    }
                }
            };
        },

        TouchMonitor : function(element, events)
        {
            var cacheId = Jester.cacheId,
                elementId = element[cacheId],
                cache = Jester.cache,
                elementCache = cache[elementId],
                opts = elementCache.options;

            opts.move           = opts.move                 ||    {};
            opts.scale          = opts.scale                ||    {};

            opts.tapDistance    = opts.tapDistance          ||    0;
            opts.tapTime        = opts.tapTime              ||    20;

            opts.doubleTapTime  = opts.doubleTapTime        ||    300;

            opts.swipeDistance  = opts.swipeDistance        ||    200;

            opts.flickTime      = opts.flickTime            ||    300;
            opts.flickDistance  = opts.flickDistance        ||    200;

            opts.deadX          = opts.deadX                ||    0;
            opts.deadY          = opts.deadY                ||    0;

            if(opts.capture !== false) opts.capture = true;
            if(typeof opts.preventDefault !== "undefined" && opts.preventDefault !== false) opts.preventDefault = true;
            if(typeof opts.preventDefault !== "undefined" && opts.stopPropagation !== false) opts.stopPropagation = true;

            var eventSet = elementCache.eventSet;

            var touches;
            var previousTapTime = 0;

            var touchStart = function(evt) {
                evt.preventDefault();           //this line added by myself.
                touches = new Jester.TouchGroup(evt);

                eventSet.execute("start", touches, evt);

                if(opts.preventDefault) evt.preventDefault();
                if(opts.stopPropagation) evt.stopPropagation();
            };

            var touchMove = function(evt) {
                touches.update(evt);
                
                eventSet.execute("during", touches, evt);

                if(opts.preventDefault) evt.preventDefault();
                if(opts.stopPropagation) evt.stopPropagation();

                if(touches.numTouches() == 2) {
                    // pinchnarrow
                    if(touches.delta.scale() < 0.0) {
                        eventSet.execute("pinchnarrow", touches);
                    }

                    // pinchwiden
                    else if(touches.delta.scale() > 0.0) {
                        eventSet.execute("pinchwiden", touches);
                    }
                }
            };

            var touchEnd = function(evt) {

                eventSet.execute("end", touches, evt);

                if(opts.preventDefault) evt.preventDefault();
                if(opts.stopPropagation) evt.stopPropagation();

                if(touches.numTouches() == 1) {
                    // tap
                    if(touches.touch(0).total.x() <= opts.tapDistance && touches.touch(0).total.y() <= opts.tapDistance && touches.touch(0).total.time() < opts.tapTime) {
                        eventSet.execute("tap", touches);
                    }
    
                    // doubletap
                    if(touches.touch(0).total.time() < opts.tapTime) {
                        var now = (new Date()).getTime();
                        if(now - previousTapTime <= opts.doubleTapTime) {
                            eventSet.execute("doubletap", touches);
                        }
                        previousTapTime = now;
                    }

                    // swipe
                    if(Math.abs(touches.touch(0).total.x()) >= opts.swipeDistance) {
                        var swipeDirection = touches.touch(0).total.x() < 0 ? "left" : "right";
                        eventSet.execute("swipe", touches, swipeDirection);
                    }

                    // flick
                    if(Math.abs(touches.touch(0).total.x()) >= opts.flickDistance && touches.touch(0).total.time() <= opts.flickTime) {
                        var flickDirection = touches.touch(0).total.x() < 0 ? "left" : "right";
                        eventSet.execute("flick", touches, flickDirection);
                    }
                }
                else if(touches.numTouches() == 2) {
                    // pinchend
                    if(touches.current.scale() !== 1.0) {
                        var pinchDirection = touches.current.scale() < 1.0 ? "narrowed" : "widened";
                        eventSet.execute("pinchend", touches, pinchDirection);
                    }
                }
            };

            var stopListening = function() {
                element.removeEventListener("touchstart", touchStart, opts.capture);
                element.removeEventListener("touchmove", touchMove, opts.capture);
                element.removeEventListener("touchend", touchEnd, opts.capture);
            };

            element.addEventListener("touchstart", touchStart, opts.capture);
            element.addEventListener("touchmove", touchMove, opts.capture);
            element.addEventListener("touchend", touchEnd, opts.capture);

            return {
                stopListening: stopListening
            };
        },

        TouchGroup : function(event) {
            var that = this;
    
            var numTouches = event.touches.length;
        
            var midpointX = 0;
            var midpointY = 0;
    
            var scale = event.scale;
            var prevScale = scale;
            var deltaScale = scale;

            for(var i = 0; i < numTouches; i++) {
                this["touch" + i] = new Jester.Touch(event.touches[i].pageX, event.touches[i].pageY);
                midpointX = event.touches[i].pageX;
                midpointY = event.touches[i].pageY;
            }

            function getNumTouches() {
                return numTouches;
            }

            function getTouch(num) {
                return that["touch" + num];
            }

            function getMidPointX() {
                return midpointX;
            }
            function getMidPointY() {
                return midpointY;
            }
            function getScale() {
                return scale;
            }
            function getPrevScale() {
                return prevScale;
            }
            function getDeltaScale() {
                return deltaScale;
            }

            function updateTouches(event) {
                var mpX = 0;
                var mpY = 0;
    
                for(var i = 0; i < event.touches.length; i++) {
                    if(i < numTouches) {
                        that["touch" + i].update(event.touches[i].pageX, event.touches[i].pageY);
                        mpX += event.touches[i].pageX;
                        mpY += event.touches[i].pageY;
                    }
                }
                midpointX = mpX / numTouches;
                midpointY = mpY / numTouches;

                prevScale = scale;
                scale = event.scale;
                deltaScale = scale - prevScale;
            }

            return {
                numTouches: getNumTouches,
                touch: getTouch,
                current: {
                    scale: getScale,
                    midX: getMidPointX,
                    midY: getMidPointY
                },
                delta: {
                    scale: getDeltaScale
                },
                update: updateTouches
            };
        },

        Touch : function(_startX, _startY) {
            var that = this;

            var startX = _startX,
                startY = _startY,
                startTime = now(),
                currentX = startX,
                currentY = startY,
                currentTime = startTime,
                currentSpeedX = 0,
                currentSpeedY = 0,
                prevX = startX,
                prevY = startX,
                prevTime = startTime,
                prevSpeedX = 0,
                prevSpeedY = 0,
                deltaX = 0,
                deltaY = 0,
                deltaTime = 0,
                deltaSpeedX = 0,
                deltaSpeedY = 0,
                totalX = 0,
                totalY = 0,
                totalTime = 0;

            // position getters
            function getStartX() {
                return startX;
            }
            function getStartY() {
                return startY;
            }
            function getCurrentX() {
                return currentX;
            }
            function getCurrentY() {
                return currentY;
            }
            function getPrevX() {
                return prevX;
            }
            function getPrevY() {
                return prevY;
            }
            function getDeltaX() {
                return deltaX;
            }
            function getDeltaY() {
                return deltaY;
            }
            function getTotalX() {
                return totalX;
            }
            function getTotalY() {
                return totalY;
            }

            // time getters
            function now() {
                return (new Date()).getTime();
            }
            function getStartTime() {
                return startTime;
            }
            function getCurrentTime() {
                return currentTime;
            }
            function getPrevTime() {
                return prevTime;
            }
            function getDeltaTime() {
                return deltaTime;
            }
            function getTotalTime() {
                return totalTime;
            }

            // speed getters
            function getCurrentSpeedX() {
                return currentSpeedX;
            }
            function getCurrentSpeedY() {
                return currentSpeedY;
            }
            function getPrevSpeedX() {
                return prevSpeedX;
            }
            function getPrevSpeedY() {
                return prevSpeedY;
            }
            function getDeltaSpeedX() {
                return deltaSpeedX;
            }
            function getDeltaSpeedY() {
                return deltaSpeedY;
            }

            return {
                start: {
                    x: getStartX,
                    y: getStartY,
                    speedX: 0,
                    speedY: 0,
                    time: getStartTime
                },
                current: {
                    x: getCurrentX,
                    y: getCurrentY,
                    time: getCurrentTime,
                    speedX: getCurrentSpeedX,
                    speedY: getCurrentSpeedY
                },
                prev: {
                    x: getPrevX,
                    y: getPrevY,
                    time: getPrevTime,
                    speedX: getPrevSpeedX,
                    speedY: getPrevSpeedY
                },
                delta: {
                    x: getDeltaX,
                    y: getDeltaY,
                    speedX: getDeltaSpeedX,
                    speedY: getDeltaSpeedY,
                    time: getDeltaTime
                },
                total: {
                    x: getTotalX,
                    y: getTotalY,
                    time: getTotalTime
                },
                update: function(_x, _y) {
                    prevX = currentX;
                    prevY = currentY;
                    currentX = _x;
                    currentY = _y;
                    deltaX = currentX - prevX;
                    deltaY = currentY - prevY;
                    totalX = currentX - startX;
                    totalY = currentY - startY;

                    prevTime = currentTime;
                    currentTime = now();
                    deltaTime = currentTime - prevTime;
                    totalTime = currentTime - startTime;

                    prevSpeedX = currentSpeedX;
                    prevSpeedY = currentSpeedY;
                    currentSpeedX = deltaX / (deltaTime/1000);
                    currentSpeedY = deltaY / (deltaTime/1000);
                    deltaSpeedX = currentSpeedX - prevSpeedX;
                    deltaSpeedY = currentSpeedY - prevSpeedY;    
                }
            }
        }
    };

    container["jester"] = function(el, opts) {
        return new Jester.Watcher(el, opts);
    };

}(window));

