document.getElementById('submit').onclick = function () {
    save_options();
}

// Saves options to chrome.storage
function save_options() {
  var organize = document.getElementById('organize').value;
  var customSeparator = document.getElementById('customSeparator').value;
  console.log(customSeparator);
  chrome.storage.sync.set({
    option: organize,
    separator: customSeparator,
    // Update status to let user know options were saved.
  });
}


var settingValue = function() {
	chrome.storage.sync.get(function (obj) {
	  selectedOption = obj.option;
	  selectedSeparator = obj.separator;
	  if(selectedOption == undefined) {
	  	selectedOption = 'name';
	  }

	  if(selectedSeparator == undefined) {
	  	selectedSeparator = '-';
	  }
	  document.getElementById('organize').value = selectedOption;
	  document.getElementById('customSeparator').value = selectedSeparator;
	});
}

window.onload = settingValue;
