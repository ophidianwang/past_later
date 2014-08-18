
//basic member
var lastTimeStamp = 0;

//send selectedString to background.js
function saveSelected(selectedString){
	//alert('content:saveSelected');
	var msg = {	"func":"save_selected",
				"selectedString":selectedString,
				};
	chrome.runtime.sendMessage(msg);
}

//copy listener
function copyListener(copyEvent){
	//prevent high frequency copy action & linux ctrl+c bug which would fire copy event twice
	//alert('content:copyListener!');
	if ((copyEvent.timeStamp-lastTimeStamp)<=200){
	  console.log('copy too frequently');
	  return;
	}
	lastTimeStamp = copyEvent.timeStamp;

	//send message to background
	var selected = window.getSelection().toString();
	if(selected.length > 256){
		console.log('selectedString is too long!');
		return;
	}

	saveSelected(selected);
}
document.addEventListener('copy',copyListener,true);


//paste certain text in javascript
function pasteNow(pasteString){
	//alert('content:pasteNow!'+pasteString);
	document.execCommand('inserttext', false, pasteString);
}

//listen manager, call different function depends on message.func
function listenManager(message, sender, response){
	switch(message.func){
		case 'paste':
			pasteNow(message.pasteString);
			break;
		
		default:
			alert('content default:' + message.func);
	}

}
chrome.runtime.onMessage.addListener(listenManager);