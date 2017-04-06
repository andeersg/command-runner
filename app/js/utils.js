const spawn = require('child_process').spawn;
const Config = require('electron-config');
const config = new Config();
const moment = require('moment');

/**
 * Save item.
 */
var saveItem = function(object) {
  let items = config.get('favorites');

  if (typeof items == 'undefined') {
    items = [];
  }

  items.push(object);

  config.set('favorites', items);

  return prepareItem(object);
};

/**
 * Fetch items from store.
 */
var fetchItems = function() {
  let items = config.get('favorites');

  if (typeof items == 'undefined') {
    items = [];
  }

  return items;
};

var renderList = function(el, items, append) {
  var content = '';

  items.forEach(function(item, i) {
    content += loadTemplate(item, i);
  });

  if (typeof append !== 'undefined' && append) {
    el.innerHTML = el.innerHTML + content;
  }
  else {
    el.innerHTML = content;
  }
};

var startFunction = function(item) {
  var cmd = item.command.split(' ');
  var firstPart = cmd[0];
  cmd.splice(0, 1);

  var processItem = spawn(firstPart, cmd);

  return processItem;
};

var getTimestamp = function() {
  return moment();
}

var loadTemplate = function(item, i) {
  var tpl = '<article class="process" data-id="@id">';
  tpl += '<span class="process__label">@label</span>';
  tpl += '  <span class="process__cmd">@command</span>';
  tpl += '  <div class="process__info">';
  tpl += '    <span class="process__status">@status</span>';
  tpl += '    <span class="process__uptime"></span>';
  tpl += '  </div>';
  tpl += '</article>';

  let content = tpl
    .replace('@label', item.label)
    .replace('@command', item.command)
    .replace('@status', 'Stopped')
    .replace('@id', i);

  return content;
}

var prepareItem = function(item) {
  item.running = false;
  item.pid = false;
  item.startedTs = 0;

  return item;
}