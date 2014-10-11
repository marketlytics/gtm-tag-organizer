chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		// console.log("Hello. This message was sent from scripts/inject.js");
		// ----------------------------------------------------------

		// load jquery
		// var jq = document.createElement('script');
		// jq.src = "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js";
		// document.getElementsByTagName('head')[0].appendChild(jq);

		var selectedOption;
		var selectedSeparator;

		var callingBack = function(callBack) {			
			chrome.storage.sync.get(function (obj) {
				selectedOption = obj.option;
				selectedSeparator = obj.separator;
				if(selectedOption == undefined) {
					selectedOption = 'type';
				}
				if(selectedSeparator == undefined) {
					selectedSeparator = '-';
				}
				callBack(selectedOption, selectedSeparator);
			});
		}

			var gtmTableUpdate = function(selectedOption, selectedSeparator){

			if(selectedOption == "type"){
				// sort by Type before redrawing
				jQuery('div#ID-tagTable div.ID-table tbody tr th.TARGET-1').click();
			}				
			// else if (selectedOption == "name"){
			// 	jQuery('div#ID-tagTable div.ID-table tbody tr th.TARGET-0').click();
			// }

			var prevAttr = "";
			var tableRow = jQuery('div#ID-tagTable div.ID-table tbody tr.CT_TABLE_ROW');
			// parse and append tag
			
			
				// console.log(selectedOption);
				// var selectedOption = "type";
				if(selectedOption == "type"){
				tableRow.each(function(){
					var type = jQuery(this).find('td.CT_TABLE_CELL:nth-child(2)').text();
					// tag[0] = (tag.length > 1) ? tag[0] : "Other";
					jQuery(this).attr('tagType', type);

					var curAttr = jQuery(this).attr('tagType');
					if(curAttr != undefined && curAttr != prevAttr){
						jQuery(this).before('<tr class="toggle" id="'+curAttr+'" toggletype="tagType"><td>'+curAttr+'</td><td></td><td></td><td></td></tr>');
						prevAttr = curAttr;
					}
				});
				} else if (selectedOption == "name") {
				tableRow.each(function(){	
					var tag = jQuery(this).find('td.CT_TABLE_CELL>div.ACTION-clickTag').text().split(selectedSeparator);
					//append tag to parent
					if(tag.length > 1){
						jQuery(this).attr('tagName', tag[0]);
					}
					var curAttr = jQuery(this).attr('tagName');
					if(curAttr != undefined && curAttr != prevAttr){
						jQuery(this).before('<tr class="toggle" id="'+curAttr+'" toggletype="tagName"><td>'+curAttr+'</td><td></td><td></td><td></td></tr>');
						prevAttr = curAttr;
					}
				});	
				}
			


			// Toggle Rows
			var toggleType;
			jQuery('.toggle').click(function(){
			var id = jQuery(this).attr('id');
			toggleType = jQuery(this).attr('toggletype');
						
				jQuery('tr['+toggleType+'="'+id+'"]').toggle();	
			});			
			//jQuery('tr['toggleType']').toggle();
			jQuery('tr[tagname]').hide();
			jQuery('tr[tagtype]').hide();


		}

		var tableRedraw = function(){
		jQuery('div.ID-table table.CT_TABLE tbody th').click(function(){
			setTimeout(function(){
				// re input data on table update 
				gtmTableUpdate(selectedOption, selectedSeparator); 
				tableRedraw();
				// console.log("code run");
			}, 200);
		});
		}

	// 
	tableRedraw();
	callingBack(gtmTableUpdate);

	// on hash change wait for page to load before applying changes
	var waitAndLoad = function(t){
    setTimeout(function(){
     callingBack(gtmTableUpdate);
    }, t)
  }

  var forceLoad = function(){
    waitAndLoad(500);
  }
  // if hash changes #Container
  window.onhashchange = function() {
    forceLoad();
  }
  // document.onclick = function() {
  //   forceLoad();
  // }

	}
	}, 10);
});


