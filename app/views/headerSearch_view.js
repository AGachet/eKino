var View = require('./view');
var template = require('./templates/headerSearch');

module.exports = View.extend({

  el: '#header .search',
  template: template
  
});