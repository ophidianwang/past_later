//console.log('manual.js');

var keyMap = {};

var msg = {	"func":"list"
			};

var port = chrome.runtime.connect({name: "paste_later_manual"});

port.postMessage(msg);
port.onMessage.addListener(function(msg) {
	//console.log(msg);
	var html = '';
	var count=1;
	for (var property in msg) {
		//console.log(property);
		//console.log(msg[property]);

		if(count==10)
			count=0;

		var value = value = msg[property];
		if(value.length>50){
			value = value.substr(0,50);
			value += "(...)";
		}
			

		var oneRow ='<tr>'+
						'<td><span>' + value + '</span></td>' +
						'<td><span> ' + count + ' </span></td>' + 
					'</tr>';
		html += oneRow;

		//set key map
		keyMap[count] = property;

		count++;
	}
	$("#tbody").html(html);
});

window.onkeydown = function (e) {
	if(e.keyCode>57 || e.keyCode<48)
		return;
	//console.log(e);
	if(!keyMap[e.keyCode-48]){
		alert('no record');
		return;
	}

	var request = {	"func":"paste",
					"key":keyMap[e.keyCode-48]
					};

	port.postMessage(request);

	window.close();
}