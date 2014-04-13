/**
 * jQuery Becomes Visible plugin.
 * 
 * @example
 * $('div').becomesVisible({
 * 		callback: function(elements) {
 * 			elements.addClass('isVisible');
 * 		},
 * 		delay: 500
 * });
 */
(function ($) {
	'use strict';

	/**
	 * @callback becomesVisibleCallback
	 * @param {jQueryObject} elements The elements as jQuery object which have been interpreted as visible.
	 */

	/**
	 * @param {object} options Object containing configuration for the plugin (optional).
	 * @param {integer} options.delay How long the element has to be visible (in milliseconds) before callback function executed.
	 * @param {boolean} options.completelyVisible Does the element have to be completely visible before callback can be triggered. Defaults to false which means that callback can be triggered once any part of the element is visible in viewport.
	 * @param {becomesVisibleCallback} options.callback The callback function which is executed when there are elements found which have been visible for the duration of the delay. Once element is interpreted as visible it will be given only once to this callback function.
	 */

	$.fn.becomesVisible = function (method) {
		// Method calling logic
		if(methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if(typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			this.each(function() {
				$(this).html('jQuery.becomesVisible plugin does not support method "' +  method + '"');
			});
		}
	};

	// private variables
	var
		methods,
		allOptions = {},
		checkElements,
		checkVisibleElements,
		isElementInViewport,
		defaultOptions = {
			// how long the element has to be visible before callback function executed
			delay: 1000,
			// does the element have to be completely visible before callback can be triggered,
			// defaults to false which means that callback can be triggered once any part
			// of the element is visible in viewport
			completelyVisible : false
		}
	;

	methods = {
		init : function(optionsParam) {
			var options = $.extend({}, defaultOptions, optionsParam);
			options.uid = 'becomes-visible-' + Math.random().toString(36).substr(2,9);
			options.visibleElements = [];
			options.$elements = this;
			options.reSelectElements = false;
			allOptions[options.uid] = options;
			$(window).on('becomesvisible.refresh load resize scroll', function() {
				checkElements(options);
			});
			checkElements(options);
		},
		refresh : function() {
			$.each(allOptions, function(uid, options) {
				options.reselectElements = true;
			});
			$(window).trigger('becomesvisible.refresh');
		}
	};

	checkElements = function (options) {
		if(options.reselectElements === true) {
			options.$elements = options.$elements = $(options.$elements.selector);
			options.reselectElements = false;
		}

		options.$elements.each(function (index, el) {
			var
				$el = $(el),
				timeout = options.delay
			;

			// Skip elements which are already marked as visible
			if($el.data(options.uid + '-is-visible') === 'true') {
				return true;
			}

			if (isElementInViewport(el, options)) {
				if (!$el.data(options.uid + '-appeared-in-viewport')) {
					// element appeared in viewport
					$el.data(options.uid + '-appeared-in-viewport', new Date().getTime());
					if (!$el.data(options.uid + '-timeout-id')) {
						$el.data(options.uid + '-timeout-id', setTimeout(function() {
							checkVisibleElements(options);
						}, timeout));
					}
				} else if (new Date().getTime() - $el.data(options.uid + '-appeared-in-viewport') >= timeout) {
					// element has been in viewport more than timeout
					$el.removeData([options.uid + '-timeout-id', options.uid + '-is-visible']);
					options.visibleElements.push(el);
				}
			} else {
				// element is not visible in viewport
				$el.removeData([options.uid + '-timeout-id', options.uid + '-appeared-in-viewport']);
			}
		});
	};

	checkVisibleElements = function (options) {
		checkElements(options);
		if (options.visibleElements.length > 0) {
			if (typeof options.callback === 'function') {
				var $visibleElements = $(options.visibleElements);
				$visibleElements.data(options.uid + '-is-visible', 'true');
				options.callback($visibleElements);
			}
			options.visibleElements = [];
		}
	};

	isElementInViewport = function (el, options) {
		var
			rect = el.getBoundingClientRect(),
			$window = $(window),
			windowHeight = $window.height(),
			windowWidth = $window.width()
		;
		
		if(options.completelyVisible === true) {
			// Return true if the whole element is completely visible in viewport
			return (
				rect.top >= 0 &&
				rect.left >= 0 &&
				rect.bottom <= windowHeight &&
				rect.right <= windowWidth
			);
		}
		
		// Return true if any part of the element is visible in viewport
		return (
			windowHeight - (rect.bottom - rect.height) > 0 &&
			rect.bottom > 0 &&
			windowWidth - (rect.right - rect.width) > 0 &&
			rect.right > 0
		);
	};

})(jQuery);