// Saves options to chrome.storage
function save_options() {
  console.log('save');
  var organize = document.getElementById('organize').value;
  console.log(organize);
  chrome.storage.sync.set({
    option: organize,
    // Update status to let user know options were saved.
  });
}
// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
// function restore_options() {
//   // Use default value color = 'red' and likesColor = true.
//   chrome.storage.sync.get({
//     option: 'name',
//   }, function(items) {
//     document.getElementById('organize').value = items.option;
//   });
// }
// document.getElementById('submit').addEventListener('click',
//     save_options);