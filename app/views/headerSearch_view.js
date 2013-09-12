var View = require('./view');
var template = require('./templates/headerSearch');

module.exports = View.extend({

  el: '#header .search',

  template: template,

  events: {
		'focusin  input' 				: 'displaySearchPan',
		'click button.close' 		: 'displaySearchPan',
	},

	/*
	 * 	Rewritte render function
	 */

	render: function() {

		var view, viewEl;

		view = this;
		viewEl = view.$el;

    viewEl.html(view.template());

  },

	/*
	 * 	Display search panel
	 */

	displaySearchPan : function(e){

		var view, viewEl, panel, isAskToClose;

		view = this;
		viewEl = view.$el;
		panel = viewEl.find('.searchPan');
		isAskToClose = (e.type === 'click') ? true : false;


		if (isAskToClose) {
			panel.removeClass('active');
		} else {
			panel.addClass('active');
		}

	}
  
});