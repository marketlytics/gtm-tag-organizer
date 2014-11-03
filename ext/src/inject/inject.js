chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		// console.log("Hello. This message was sent from scripts/inject.js");
		// ----------------------------------------------------------

		var selectedOption;
		var selectedSeparator;

		// fetch extensions settings from chrome storage
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
			if (selectedOption == "disable"){
				 return false;
			}

			if(selectedOption == "type"){

				// sort by Type before redrawing so the tags are ordered
				jQuery('div#ID-tagTable div.ID-table tbody tr th.TARGET-1').click();
			}			

			// } else if (selectedOption == "name"){
			// 	jQuery('div#ID-tagTable div.ID-table tbody tr th.TARGET-0').click();
			// }
									
			var prevAttr = "";
			var tableRow = jQuery('div#ID-tagTable div.ID-table tbody tr.CT_TABLE_ROW');				
			// console.log(selectedOption);				
			if(selectedOption == "type"){									
			
				tableRow.each(function(){
					var type = jQuery(this).find('td.CT_TABLE_CELL:nth-child(2)').text();					
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
					
					// if tag array doesnt have more than one item mark as other
					tag[0] = (tag.length > 1) ? tag[0] : "Other";
					
					//append tag to parent					
					jQuery(this).attr('tagName', tag[0]);
					
					var curAttr = jQuery(this).attr('tagName');
					if(curAttr != undefined && curAttr != prevAttr){
						jQuery(this).before('<tr class="toggle" id="'+curAttr+'" toggletype="tagName"><td>'+curAttr+'</td><td></td><td></td><td></td></tr>');
						prevAttr = curAttr;
					}
				});	
			}
			
			// //macrotable ID-macroTable future change for handling macro sorting
			// var tableRowMacro = jQuery('div#ID-macroTable div.ID-table tbody tr.CT_TABLE_ROW');
			// var prevMacro = "";
			// tableRowMacro.each(function(){
			// 	var type = jQuery(this).find('td.CT_TABLE_CELL:nth-child(2)').text();					
			// 	jQuery(this).attr('tagType', type);

			// 	var curAttr = jQuery(this).attr('tagType');
			// 	if(curAttr != undefined && curAttr != prevMacro){
			// 		jQuery(this).before('<tr class="toggle" id="'+curAttr+'" toggletype="tagType"><td>'+curAttr+'</td><td></td><td></td><td></td><td></td></tr>');
			// 		prevMacro = curAttr;
			// 	}
			// });


			// Toggle Rows
			var toggleType;
			jQuery('.toggle').click(function(){
				var id = jQuery(this).attr('id');
				toggleType = jQuery(this).attr('toggletype');
							
					jQuery('tr['+toggleType+'="'+id+'"]').toggle();	
			});			
			
			jQuery('tr[tagname]').toggle();
			jQuery('tr[tagtype]').toggle();
		}

		var tableRedraw = function(time){
			jQuery('div.ID-table table.CT_TABLE tbody th').click(function(){
				setTimeout(function(){

					// re input data on table update 
					// gtmTableUpdate(selectedOption, selectedSeparator);
					// only redraw if custom attribute is missing 
					if (jQuery('tr#ID-unusedId-row-0')[0].hasAttribute("tagtype") == false 
	    			&& jQuery('tr#ID-unusedId-row-0')[0].hasAttribute("tagname") == false){    		
	    			
	    			callingBack(gtmTableUpdate);		    			
	    		}    		     		
					
					tableRedraw();
					// console.log("code run tableRedraw");

				}, time);
			});
		}

	 
		tableRedraw(500);
		callingBack(gtmTableUpdate);

		// on hash change wait for page to load before applying changes
		var waitAndLoad = function(t){
	    setTimeout(function(){
	    	if (jQuery('tr#ID-unusedId-row-0')[0].hasAttribute("tagtype") == false 
	    		&& jQuery('tr#ID-unusedId-row-0')[0].hasAttribute("tagname") == false){    		    		
	    		tableRedraw(500);
	    		callingBack(gtmTableUpdate);	
	    		// console.log("hasAttribute force");    	
	    	}    		
	    }, t)
	  }

	  var forceLoad = function(){
	    waitAndLoad(500);
	    waitAndLoad(1500);    
	    waitAndLoad(2500);
	    waitAndLoad(5000);
	  }
	  // if hash changes #Container
	  window.onhashchange = function() {
	    forceLoad();
	    // console.log("code run onhashchange");
	  }
	  document.onclick = function() {
	    forceLoad();
	  	// console.log("code run onclick");
	  }

	}
	}, 10);
});


