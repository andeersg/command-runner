/**
 * Handle all logic in app.
 *
 * @TODO https://github.com/electron/electron/blob/master/docs/api/shell.md#shellopenexternalurl
 */

(function($) {
  console.log('Initializing script');
  console.log('Fetching items');

  var items = [];
  var processList = [];
  var outputDiv = document.getElementById('processes');

  var data = fetchItems();
    
  // @TODO Use favorite data to build the array.
  data.forEach(function(item) {
    item = prepareItem(item);
    processList.push(item);
  });

  renderList(outputDiv, processList);

  console.log('Rendering items');

  $('#form-save').click(function() {
    var label = $('#form-label').val();
    var command = $('#form-command').val();

    var newItem = saveItem({ label: label, command: command });

    renderList(outputDiv, [newItem], true);

    $('#form-command').val('');
    $('#form-label').val('');
  });

  $('#processes').on('click', '.process', function() {
    var id = $(this).attr('data-id');
    var thisItem = processList[id];
    if (!thisItem.running) {
      var processItem = startFunction(thisItem);
      processList[id].process = processItem;
      processList[id].running = true;
      processList[id].startedTs = getTimestamp();

      $('.process__status', this).html('Running');
      $('.process__uptime', this).html(moment().format('HH:mm'));
    }
    else {
      // Stop process here.
      processList[id].process.kill();
      processList[id].running = false;

      $('.process__status', this).html('Stopped');
    }
  });

})(jQuery);
