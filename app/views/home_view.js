var View = require('./view');
var template = require('./templates/home');

module.exports = View.extend({

  el: '#content',

  template: template,

	initialize: function(){

		var view = this;

    view.carrouselRun();

  },

  events: {
    
	},

	carrouselRun: function(e){

		var view, viewEl, carrouselContainer;

		view = this;
		viewEl = view.$el;
		carrouselContainer = viewEl.find('.meaBlocks');

		console.log('viewEl');
    console.log(viewEl);
		console.log(carrouselContainer);

	}
  
});
