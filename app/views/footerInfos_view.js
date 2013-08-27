var View = require('./view');
var template = require('./templates/footerInfos');

module.exports = View.extend({
  el: 'footer .infos',
  template: template
});