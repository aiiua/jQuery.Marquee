/*
	by liz
	Requires: jQuery 1.7.2+
*/

(function($, window, undefined){

var htmlTmpl = [
		'<div class="marquee-wraper">',
			'<div class="marquee-shadow">{orig}</div>',
			'<div class="marquee-shadow">{orig}</div>',
		'</div>'
	].join(''),

	defaults = {
		horizontal : false,
		speed : 1,
		autoPlay : true,
		hover : true
	};

function Marquee($el, options){
	var self = this;

	this.options = $.extend({}, defaults, options || {});
	this.started = false;
	this.horizontal = this.options.horizontal;


	this.$marquee = $el;

	this.orig = $.trim(this.$marquee.html());
	this.html = htmlTmpl.replace(/{orig}/g, this.orig);
	
	this.$wraper = $(this.html);
	this.$marquee.empty().append(this.$wraper);

	function setLayout(dimension){
		var $marquee = self.$marquee,
			$wraper = self.$wraper,
			$shadow = $wraper.find('.marquee-shadow');

		self.inner = $shadow[dimension]();
		self.outer = self.options[dimension] || (self.options[dimension] = self.inner);

		if(self.inner < self.outer){
			$marquee.html(self.orig);
			return false;
		}

		$wraper[dimension](self.outer);

		return true;
	}


	if(!this.horizontal){
		if(!setLayout('height')) return;

		this.scroll = function(){
			var top = this.$wraper.scrollTop(),
				max = this.inner,
				speed = this.options.speed;
			
			top += speed;
			if(top >= max) top = 0;

			this.$wraper.scrollTop(top);
		};
	}else{
		this.$wraper.wrapInner('<div class="marquee-horizontal" />');

		if(!setLayout('width')) return;

		this.$wraper.find('.marquee-horizontal').width(2 * this.inner);


		this.scroll = function(){
			var left = this.$wraper.scrollLeft(),
				max = this.inner,
				speed = this.options.speed;
			
			left += speed;
			if(left >= max) left = 0;

			this.$wraper.scrollLeft(left);
		};
	}

	this.bind();
	
	if(this.options.autoPlay){
		this.start();
	}
}

Marquee.prototype = {
	
	start : function(){
		if(this.started) return;
		
		Ticker.add(this.scroll, this);
		this.started = true;
	},
	
	stop : function(){
		if(!this.started) return
		
		Ticker.remove(this.scroll);
		this.started = false;
	},
	
	bind : function(){
		this.$marquee
		.on('stop.marquee', $.proxy(this.stop, this))
		.on('start.marquee', $.proxy(this.start, this));

		if(this.options.hover){
			this.$marquee
			.on('mouseenter.marquee', function(){
				$(this).trigger('stop.marquee');
			})
			.on('mouseleave.marquee', function(){
				$(this).trigger('start.marquee');
			});
		}
	},
	
	unbind : function(){
		this.$marquee.off('.marquee');
	},
	
	reset : function(){
		this.unbind();
		this.stop();
		
		this.$marquee.html(this.orig);
	}
}

$.fn.marquee = function(options){
	if($.type(options) == 'string'){
		var marquee = this.data('marquee');
		if(!marquee) return;
		
		marquee[options] && marquee[options]();
		
		if(options == 'reset'){
			this.removeData('marquee');
		}
		
		return this;
	}

	return this.each(function(){
		var $el = $(this);
		$el.data('marquee', new Marquee($el, options));
	});
};
		
})(jQuery, window)