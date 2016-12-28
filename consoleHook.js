(function () {
	function getXMLHttpRequest() {
	    return window.XMLHttpRequest ? new window.XMLHttpRequest() : new ActiveXObject("MSXML2.XMLHTTP");
	};

	function reportError(data) {
		var request = getXMLHttpRequest();
        request.open('POST', 'http://127.0.0.1:9898/ErrorReport');
        request.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");

        request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
                //OK
            }
        };

        request.addEventListener("error", function (e) {
       		console("Error: " + e + " Could not load url.");
        }, false);

        request.send(JSON.stringify(data));
	};

	var logHook = console.log;
	console.log = function () {
		reportError({
        	type: 'ConsoleLog',
        	msg: arguments
        });
		logHook.apply(this, arguments);
	};

	var errorHook = console.error;
	console.error = function () {
		reportError({
        	type: 'ConsoleError',
        	msg: arguments
        });
		errorHook.apply(this, arguments);
	};

	window.onerror = function(msg, url, lineNo, columnNo, error) {
		try {
			var string = msg.toLowerCase();
		    var substring = "script error";
		    if (string.indexOf(substring) > -1){
		        console.log('Script Error: See Browser Console for Detail');
		    } else {
		        var message = [
		            'Message: ' + msg,
		            'URL: ' + url,
		            'Line: ' + lineNo,
		            'Column: ' + columnNo,
		            'Error Stack: ' + JSON.stringify(error.stack)
		        ].join(' - ');

		        reportError({
		        	type: 'WindowError',
		        	msg: message
		        });
		    }
		} catch (e) {
			console.log('Error: errorHook error: ', e.stack);
		}

	    return true;
	}
})();
