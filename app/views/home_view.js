var View = require('./view');
var template = require('./templates/home');

module.exports = View.extend({

  el: '#content',

  template: template,

	initialize: function(){


  },

  events: {
    'click .meaBlocks .slimCarrouselButton li' : 'carrouselRun'
	},

	/*
	 * 	Rewritte render function
	 */

	render: function() {

		var view, viewEl;

		view = this;
		viewEl = view.$el;

    viewEl.html(view.template());
    view.carrouselRun();

  },

	/*
	 * 	Carrousel Slim from MEA blocks
	 */

	carrouselRun: function(e, params){

		var view, viewEl, panelContainer, buttonsContainer, pansElemsList, currentPanPos, animateParams;

		view = this;
		viewEl = view.$el;
		panelContainer = viewEl.find('.meaBlocks .slimCarrouselPanel');
    buttonsContainer = viewEl.find('.meaBlocks .slimCarrouselButton');
		pansElemsList = panelContainer.find('li');
		currentPanPos = pansElemsList.index(panelContainer.find('.current'));

		// Parameters for animate function
		animateParams = { 
			elementOrigin : panelContainer.find('li').eq(0),
			totalPans : panelContainer.find('li').length,
			buttons : buttonsContainer,
			intervalPx : 100,
			intervalMs : 3000,
			duration : 1000,
			nextPosition : false
		}

		// Carrousel animation
		function animate(params) {

			var animation, elem, totalPosition, currentPosition, currentMargin, nextMargin, nextPosition, carrouselRunning;

			elem = animateParams.elementOrigin;
			totalPosition = ( params.totalPans - 1 ) * params.intervalPx;
			currentMargin = Math.abs(elem.css("margin-top").replace("px", ""));
			currentPosition = currentMargin / params.intervalPx;

			if (params.nextPosition === false) {
				nextMargin = (currentMargin < totalPosition) ? currentMargin + params.intervalPx : 0 ; 
			} else {
				nextMargin = params.nextPosition * params.intervalPx;
			}

			nextPosition = nextMargin / params.intervalPx;

			animation = elem.animate(
				{ marginTop: '-'+nextMargin+'px' },
				{ duration: params.duration }
			);

			$.when(animation).then(function(){
				params.buttons.find('li')
				.removeClass('current')
				.eq(nextPosition).addClass('current');
			});

		}		

		if (e !== undefined) {
			clearInterval(carrouselRunning);
			animateParams.nextPosition = $(e.currentTarget).index();
			animate(animateParams);
			animateParams.nextPosition = false;
		}

		carrouselRunning = setInterval(function(){
			animate(animateParams);
		}, animateParams.intervalMs);

	}
  
}); 



