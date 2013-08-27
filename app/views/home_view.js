var View = require('./view');
var template = require('./templates/home');

module.exports = View.extend({

  el: '#content',
  template: template
  
});
