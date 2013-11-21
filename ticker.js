/*
	by liz
*/

window.Ticker = (function(window, undefined){

	var tickId = 0,
		tickers = [],
		timerId = null,

		requestAnimFrame,
		cancelAnimFrame,

		settings = {
			useRAF : true,
			interval : 1000 / 60
		};
	
	(function(){
		var vendors = 'ms moz webkit o'.split(' '),
			i = 0,
			len = vendors.length;

		if(settings.useRAF){
			for(; i < len && !requestAnimFrame; i++){
				requestAnimFrame = window[vendors[i] + 'RequestAnimationFrame'];
				cancelAnimFrame = window[vendors[i] + 'CancelAnimationFrame'] || window[vendors[i] + 'CancelRequestAnimationFrame'];
			}
		}

		requestAnimFrame || (requestAnimFrame = function(callback){
			return window.setTimeout(callback, settings.interval);
		});

		cancelAnimFrame || (cancelAnimFrame = function(timerId){
			return window.clearTimeout(timerId);
		});
	})();
	
	function tick(){
		var ticker,
			i = 0,
			len = tickers.length;
			
		for(; i < len; i++){
			ticker = tickers[i];
			ticker.callback.call(ticker.context);
		}
	}

	function run(){
		timerId = requestAnimFrame(arguments.callee);
		tick();
	}
	
	function stop(){
		cancelAnimFrame(timerId);
		timerId = null;
	}

	return {
		add : function(callback, context){
			callback.tickId = callback.tickId || 'tick-' + tickId++;
			tickers.push({
				callback : callback,
				context : context || window
			});

			if(tickers.length == 1) run();
		},
		
		remove : function(callback){
			var ticker,
				i = 0,
				len = tickers.length;

			if(!callback){
				tickers = [];
			}else{
				if(!callback.tickId) return;

				for(; i < len; i++){
					ticker = tickers[i];
					if(callback.tickId == ticker.callback.tickId){
						tickers.splice(i, 1);
						break;
					}
				}
			}
			
			if(!tickers.length){
				stop();
			}
		}
	}
		
})(this)