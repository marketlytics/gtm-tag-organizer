chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		console.log("Hello. This message was sent from scripts/inject.js");
		// ----------------------------------------------------------

		// load jquery
		// var jq = document.createElement('script');
		// jq.src = "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js";
		// document.getElementsByTagName('head')[0].appendChild(jq);
		var callingBack = function(callBack) {
			var selectedOption = ' ';
			chrome.storage.sync.get(function (obj) {
				selectedOption = obj.option;
				selectedSeparator = obj.separator;
				callBack(selectedOption, selectedSeparator);
			});
		}

			var gtmTableUpdate = function(selectedOption, selectedSeparator){
				if(selectedOption == undefined) {
					selectedOption = 'name';
				}
				if(selectedSeparator == undefined) {
					selectedSeparator = '-';
				}
			var prevAttr = "";

			// parse and append tag
			jQuery('div#ID-tagTable div.ID-table tbody tr.CT_TABLE_ROW').each(function(){
				var tag = jQuery(this).find('td.CT_TABLE_CELL>div.ACTION-clickTag').text().split(selectedSeparator);
				var type = jQuery(this).find('td.CT_TABLE_CELL:nth-child(2)').text();
				// tag[0] = (tag.length > 1) ? tag[0] : "Other";

				//append tag to parent
				if(tag.length > 1){
					jQuery(this).attr('tagGroup', tag[0]);
				}

				jQuery(this).attr('tagtype', type);

				console.log(selectedOption);
				// var selectedOption = "type";
				if(selectedOption == "type"){
					var curAttr = jQuery(this).attr('tagtype');
					if(curAttr != undefined && curAttr != prevAttr){
						jQuery(this).before('<tr class="toggle" id="'+curAttr+'"><td>'+curAttr+'</td><td></td><td></td><td></td></tr>');
						prevAttr = curAttr;
					}

				} else {
					var curAttr = jQuery(this).attr('tagGroup');
					if(curAttr != undefined && curAttr != prevAttr){
						jQuery(this).before('<tr class="toggle" id="'+curAttr+'"><td>'+curAttr+'</td><td></td><td></td><td></td></tr>');
						prevAttr = curAttr;
					}
				}
			});


			// Toggle Rows
			jQuery('.toggle').click(function(){
			var id = jQuery(this).attr('id');
			jQuery('tr[tagGroup="'+id+'"]').toggle();
			});

			jQuery('tr[taggroup]').toggle();
		}

		var tableRedraw = function(){
		jQuery('div.ID-table table.CT_TABLE tbody th').click(function(){
			setTimeout(function(){
			gtmTableUpdate(); tableRedraw();
			// console.log("code run");
			}, 500);
		});
		}

		tableRedraw();
		// gtmTableUpdate();
		callingBack(gtmTableUpdate);

	}
	}, 10);
});


