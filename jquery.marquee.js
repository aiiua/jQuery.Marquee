/*! Copyright (c) 2013 Liz Chow (http://www.liz-zero.org)
 * Licensed under the MIT License (LICENSE.txt).
 *
 *
 * Version: 1.0.0
 * 
 * Requires: jQuery 1.7.2+
 */
(function($, window, undefined){

$.fn.marquee = (function(){

	var timerId,
	
		htmlTmpl = [
			'<ul class="marquee-wrap">',
				'<li class="marquee-item">{orig}</li>',
				'<li class="marquee-item">{orig}</li>',
			'</ul>'
		].join('');
	
	function Marquee($el, options){
	
		this.options = options;
		this.started = false;
	
		this.$marquee = $el;
		this.orig = $.trim(this.$marquee.html());
		this.html = htmlTmpl.replace(/{orig}/g, this.orig);
		
		var $wraper = $(this.html).prependTo(this.$marquee.empty()),
			innerHeight  = $wraper.find('li.marquee-item').height(),
			outerHeight = options.height || (options.height = innerHeight);
		
		if(innerHeight < outerHeight){
			this.$marquee.html(this.orig);
			return;
		}
		
		this.$marquee.css({
			height:outerHeight,
			overflow:'hidden'
		});
		
		this.bind();
		
		var self = this;
		
		this.scroll = function(){
			var top = self.$marquee.scrollTop(),
				speed = self.options.speed;
			
			top += speed;
			if(top >= innerHeight) top = 0;

			self.$marquee.scrollTop(top);
		}
		
		if(options.autoPlay){
			this.start();
		}
	}
	
	Marquee.prototype = {
		start : function(){
			if(this.started) return;
			
			Marquee.add(this.scroll);
			this.started = true;
		},
		
		stop : function(){
			if(!this.started) return
			
			Marquee.remove(this.scroll);
			this.started = false;
		},
		
		bind : function(){
			if(!this.options.hover) return;
			
			this.$marquee
			.on('mouseenter.marquee', $.proxy(this.stop, this))
			.on('mouseleave.marquee', $.proxy(this.start, this));
		},
		
		unbind : function(){
			this.$marquee.off('.marquee');
		},
		
		reset : function(){
			this.unbind();
			this.stop();
			
			this.$marquee.html(this.orig);
			this.$marquee.removeAttr('style');
			this.$marquee.scrollTop(0);
		}
		
	}
	
	
	Marquee.timers = [];
	
	Marquee.tick = function(){
		var timer,
			timers = Marquee.timers;
			
		for(var i = 0, j = timers.length; i < j; i++){
			timer = timers[i];
			timer();
		}
	}
	
	Marquee.add = function(timer){
		Marquee.timers.push(timer);
		Marquee.start();
	}
	
	Marquee.interval = 1000 / 60;
	
	Marquee.start = function(){
		if(timerId) return;
		
		if(requestAnimationFrame){
			timerId = true;
			requestAnimationFrame(function(){
				if(timerId) requestAnimationFrame(arguments.callee);
				Marquee.tick();
			});
		}else{
			timerId = setInterval(Marquee.tick, Marquee.interval);
		}
	}
	
	Marquee.remove = function(timer){
		var timers = Marquee.timers;
		
		for(var i = 0, j = timers.length; i < j; i++){
			if(timer === timers[i]){
				timers.splice(i, 1);
				break;
			}
		}
		
		if(!timers.length){
			Marquee.stop();
		}
	}
	
	Marquee.stop = function(){
		if(timerId === true){
			timerId = false;
		}else{
			clearInterval(timerId);
			timerId = null;
		}
	}
	
	return function(options){
		options = $.extend({
			speed : 1,
			autoPlay : true,
			hover : true
		}, options || {});
		
		return this.each(function(){
			var $el = $(this);
			$el.data('marquee', new Marquee($el, options));
		});
	}
	
})();
		
})(jQuery, window)