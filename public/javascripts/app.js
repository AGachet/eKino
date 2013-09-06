(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("application", function(exports, require, module) {
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
});

;require.register("initialize", function(exports, require, module) {
var application = require('application');

$(function() {
  application.initialize();
  Backbone.history.start();
});

});

;require.register("lib/router", function(exports, require, module) {
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

});

;require.register("lib/view_helper", function(exports, require, module) {
// Put your handlebars.js helpers here.

});

;require.register("models/collection", function(exports, require, module) {
// Base class for all collections.
module.exports = Backbone.Collection.extend({});
});

;require.register("models/model", function(exports, require, module) {
// Base class for all models.
module.exports = Backbone.Model.extend({});
});

;require.register("views/footerInfos_view", function(exports, require, module) {
var View = require('./view');
var template = require('./templates/footerInfos');

module.exports = View.extend({
  el: 'footer .infos',
  template: template
});
});

;require.register("views/headerSearch_view", function(exports, require, module) {
var View = require('./view');
var template = require('./templates/headerSearch');

module.exports = View.extend({

  el: '#header .search',
  template: template
  
});
});

;require.register("views/home_view", function(exports, require, module) {
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




});

;require.register("views/templates/footerInfos", function(exports, require, module) {
var __templateData = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"topInfo\" >\n	<h1>IBIS</h1>\n	<div class=\"fbCount\"></div>\n</div>\n\n<div class=\"middleInfo\" >\n  <div class=\"columns\">\n  	<ul class=\"logos\">\n  		<li class=\"bestPrice\"></li>\n  	</ul>\n    <ul>\n      <li><h3>À PROPOS DES HÔTELS ibis</h3></li>\n      <li><a href=\"#\">Toutes nos destinations</a></li>\n			<li><a href=\"#\">Nous contacter</a></li>\n			<li><a href=\"#\">ibisrestaurant.com</a></li>\n    </ul>\n		<ul>\n			<li><h3>OFFRES SPÉCIALES DES HÔTELS ibis</h3></li>\n      <li><a href=\"#\">Newsletter ibis</a></li>\n      <li><a href=\"#\">Forfaits hôtels et activités</a></li>\n      <li><a href=\"#\">Offres week-end</a></li>\n      <li><a href=\"#\">Happy 20</a></li>\n      <li><a href=\"#\">Offres partenaires</a></li>\n      <li><a href=\"#\">Offre pour les sportifs</a></li>\n		</ul>\n		<ul>\n			<li><h3>PROFESSIONNELS</h3></li>\n			<li><a href=\"#\">Espace presse</a></li>\n			<li><a href=\"#\">Professionnels du voyage</a></li>\n			<li><a href=\"#\">Séminaires et réunions</a></li>\n		</ul>\n		<ul>\n			<li><h3>DÉVELOPPEMENT</h3></li>\n			<li><a href=\"#\">Affiliés</a></li>\n			<li><a href=\"#\">Management & Franchise</a></li>\n		</ul>\n  </div>\n  <div class=\"line\">\n  	<ul>\n  		<li><a href=\"#\">Consultez / Annulez une réservation</a></li>\n  		<li><a href=\"#\">FAQ</a></li>\n  		<li><a href=\"#\">Plan du site</a></li>\n  		<li><a href=\"#\">Mentions légales</a></li>\n  		<li><a href=\"#\">Données personnelles</a></li>\n  		<li><a href=\"#\">Emploi</a></li>\n  		<li><a href=\"#\">Groupe Accor</a></li>\n  	</ul>\n  </div>\n</div>\n\n<div class=\"botInfo\" >\n	<p>Reserver un hotel ibis, c'est la garantie d’un sejour tout confort dans une chaine d’hotels internationale : plus de 900 hotels vous accueillent partout dans le monde. Offrez-vous tous les services d'un hotel moderne à un prix economique pour vos voyages d’affaires, vos week-ends pas chers ou longs week-ends à Paris, Londres, Amsterdam ou Sao Paulo.</p>\n	<h3>Nos destinations</h3>\n	<p>Hôtel Paris   -   Hôtel Roissy aéroport Paris   -   Hôtel Lyon   -   Hôtel Londres   -   Hôtel Marseille   -   Hôtel Strasbourg   -   Hôtel Toulouse   -   Hôtel Bordeaux   -   Hôtel Bruxelles   -   Hôtel Nice   -   Hôtel Lille      Hôtel Casablanca   -   Hôtel Berlin   -   Hôtel Prague   -   Hôtel Budapest   -   Tous les hôtels ibis</p>\n</div>";
  });
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/headerSearch", function(exports, require, module) {
var __templateData = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<form>\n	<h3><span data-icon=\"s\"></span>Rechercher et réserver</h3>\n	<fieldset class=\"simpleSearch\">\n\n		<label for=\"destination\">Destination</label>\n		<input id=\"destination\" type=\"text\" placeholder=\"Ville / Pays / Code Hôtel\" value=\"\" name=\"destination\" />\n		<span data-icon=\"H\"></span>\n\n		<label for=\"arrival\">Arrivée</label>\n		<input id=\"arrival\" type=\"text\" value=\"\" name=\"arrival\" />\n		<span data-icon=\"c\"></span>\n\n		<label for=\"departure\">Départ</label>\n		<input id=\"departure\" type=\"text\" value=\"\" name=\"departure\" />\n		<span data-icon=\"c\"></span>\n\n	</fieldset>\n</form>";
  });
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/home", function(exports, require, module) {
var __templateData = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<ul class=\"splitMedia\">\n	<li>\n		<a href=\"#\">\n			<img src=\"/images/content/carrouselLarge/offreIbisVideo.jpg\" alt=\"lite la vidéo\" />\n		</a>\n	</li>\n</ul>\n<ul class=\"meaBlocks\">\n	<li>\n		<div class=\"meaContainer\">\n			<div class=\"meaHeader\">\n				<h3>TOP PROMOTIONS</h3>\n				<a href=\"#\">Voir toutes nos promotions</a><span data-icon=\"l\"></span>\n			</div>\n			<div class=\"meaContent\">\n				<ul class=\"slimCarrouselPanel\">\n					<li class=\"firstPan current\">\n						<div class=\"leftSide\">\n						  <img src=\"/images/content/carrouselSlim/photoLisb.jpg\" />\n						</div>\n						<div class=\"rightSide\">\n						  <a href=\"#\"><img src=\"/images/content/carrouselSlim/leftSide.jpg\" /></a>\n						</div>\n					</li>\n					<li class=\"secondPan\">\n						<div class=\"leftSide\">\n						  <img src=\"/images/content/carrouselSlim/photoLisb.jpg\" />\n						</div>\n						<div class=\"rightSide\">\n						  <a href=\"#\"><img src=\"/images/content/carrouselSlim/leftSide.jpg\" /></a>\n						</div>\n					</li>\n					<li class=\"thirdPan\">\n						<div class=\"leftSide\">\n						  <img src=\"/images/content/carrouselSlim/photoLisb.jpg\" />\n						</div>\n						<div class=\"rightSide\">\n						  <a href=\"#\"><img src=\"/images/content/carrouselSlim/leftSide.jpg\" /></a>\n						</div>\n					</li>\n				</ul>\n				<ul class=\"slimCarrouselButton\">\n					<li class=\"firstBut current\" data-icon=\"d\"></li>\n					<li class=\"secondBut \" data-icon=\"d\"></li>\n					<li class=\"thirdBut \" data-icon=\"d\"></li>\n				</ul>\n			</div>	\n		</div>\n	</li>\n	<li>\n		<div class=\"meaContainer\">\n			<div class=\"meaHeader\">\n				<h3>DECOUVREZ LES SERVICES SERVICES ibis</h3>\n				<a href=\"#\">Voir tous nos engagements</a><span data-icon='l'></span>\n			</div>\n			<div class=\"meaContent\">\n				<div class=\"leftSide\">\n				  <img src=\"/images/content/meaBlocks/ibisPhone.jpg\" />\n				</div>\n				<div class=\"rightSide\">\n					<p>ibis vous simplifie la vie ! Tout ibis depuis votre mobile</p>\n					<a href=\"#\">Créer votre compte</a>\n				</div>\n			</div>\n		</div>\n	</li>\n	<li>\n		<div class=\"meaContainer\">\n			<div class=\"meaHeader\">\n				<h3>VOTRE FIDÉLITÉ RÉCOMPENSÉE</h3>\n			</div>\n			<div class=\"meaContent\">\n				<div class=\"leftSide\">\n				  <img src=\"/images/content/meaBlocks/ibisCard.jpg\" />\n				</div>\n				<div class=\"rightSide\">\n					<p>Avantages, réductions, services exclusifs, ... nous récompensons votre fidélité !</p>\n					<a href=\"#\">En savoir plus</a>\n				</div>\n			</div>\n		</div>\n	</li>\n</ul>";
  });
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/view", function(exports, require, module) {
require('lib/view_helper');

// Base class for all views.
module.exports = Backbone.View.extend({
  initialize: function() {
    this.render = _.bind(this.render, this);
  },

  template: function() {},
  getRenderData: function() {},

  render: function() {
    this.$el.html(this.template(this.getRenderData()));
    this.afterRender();
    return this;
  },

  afterRender: function() {}
});

});

;
//@ sourceMappingURL=app.js.map