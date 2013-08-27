var application = require('application');

module.exports = Backbone.Router.extend({


  routes: {
    '': 'home'
  },

  home: function() {
    $('#site').addClass('home');
  	this.structure();
    application.homeView.render();
  },

  structure: function(){
  	application.headerSearchView.render();
  	application.footerInfosView.render();
  }

});
