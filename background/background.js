/*
	this is background.js working at chrome's background environment
*/
//basic variables

var recordCount = 0;
var recordStorage = {};

function clearAll(){
	//alert('clearAll');
	for ( removeId in recordStorage){
		chrome.contextMenus.remove(removeId);
	}
	recordCount = 0;
	recordStorage = {};
	chrome.contextMenus.remove("sub_separator");
}

//basic menu
chrome.contextMenus.create({
	"id":"paste_later_root",
	"title": 'choose to pasteヽ(✿ﾟ▽ﾟ)ノ',
	"contexts": ['all']
});
chrome.contextMenus.create({
	"id":"paste_clear",
	"parentId":"paste_later_root",
	"title": 'clear records',
	"contexts": ['all'],
	"onclick": clearAll
});

function addSeparator(){
	chrome.contextMenus.create({
		"id":"sub_separator",
		"type":"separator",
		"parentId":"paste_later_root",
		"contexts": ['all']
	});
}

//send paste Request to content_script.js
function pasteRequest(info){
	//alert('background:pasteRequest');
	var pasteString = recordStorage[info.menuItemId];
	console.log(pasteString)
	
	chrome.tabs.getSelected(null,function(tab) {
		var msg = {	"func":"paste",
					"pasteString":pasteString
					};
		chrome.tabs.sendMessage(tab.id, msg);
	});

}

//add to contextMenu
function addMenu(selectedString){
	//alert('background:addMenu');
	for ( item in recordStorage){
		if(selectedString == recordStorage[item])
			return;
	}
	if(recordCount == 0)
		addSeparator();

	recordCount ++;
	if(recordCount > 10){
		//remove menu action whose id = "record_" + (recordCount-10);
		var removeId = "record_" + (recordCount-10);
		chrome.contextMenus.remove(removeId);
		delete recordStorage[removeId];
	}

	recordStorage["record_" + recordCount] = selectedString;

	//add selectedString pasting action to menu
	chrome.contextMenus.create({
		"id":"record_" + recordCount,
		"parentId":"paste_later_root",
		"title": selectedString,
		"contexts": ['all'],
		"onclick": pasteRequest
	});
}

//get select_string from content_script.js to save
function saveSelected(selectedString){
	//alert('background:saveSelected');
	if(selectedString.length == 0)
		return;
	addMenu(selectedString);
}

//listen manager, call different function depends on message.func
function listenManager(message, sender, response){
	//console.log(sender);
	switch(message.func){
		case 'save_selected':
			saveSelected(message.selectedString);
			break;
		default:
			alert('background default:' + message.func);
	}

}
chrome.runtime.onMessage.addListener(listenManager);
