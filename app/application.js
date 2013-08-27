// Application bootstrapper.
Application = {

  initialize: function() {

    var HeaderSearchView = require('views/headerSearch_view');
    var FooterInfosView = require('views/footerInfos_view');
    var HomeView = require('views/home_view');
    var Router = require('lib/router');

    // Ideally, initialized classes should be kept in controllers & mediator.
    this.headerSearchView = new HeaderSearchView();
    this.homeView = new HomeView();
    this.footerInfosView = new FooterInfosView();
    this.router = new Router();

    if (typeof Object.freeze === 'function') Object.freeze(this);

  }
  
}

module.exports = Application;