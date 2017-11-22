  $(function(){
$("#addClass").click(function () {
          $('#qnimate').addClass('popup-box-on');
            });
          
            $("#removeClass").click(function () {
          $('#qnimate').removeClass('popup-box-on');
            });
  })


  var accessToken = "e2afac268d1744ebaec66287f865c15d";
		var baseUrl = "https://api.api.ai/v1/";
		$(document).ready(function() {
			$("#status_message").keypress(function(event) {
				if (event.which == 13) {
					event.preventDefault();
					var textvar = $("#status_message").val();
					$("#chatbox").append(textvar);
					send();
				}
			});
			$("#rec").click(function(event) {
				switchRecognition();
			});
		});
		var recognition;
		function startRecognition() {
			recognition = new webkitSpeechRecognition();
			recognition.onstart = function(event) {
				updateRec();
			};
			recognition.onresult = function(event) {
				var text = "";
			    for (var i = event.resultIndex; i < event.results.length; ++i) {
			    	text += event.results[i][0].transcript;
			    }
			    setInput(text);
				stopRecognition();
			};
			recognition.onend = function() {
				stopRecognition();
			};
			recognition.lang = "en-US";
			recognition.start();
		}
	
		function stopRecognition() {
			if (recognition) {
				recognition.stop();
				recognition = null;
			}
			updateRec();
		}
		function switchRecognition() {
			if (recognition) {
				stopRecognition();
			} else {
				startRecognition();
			}
		}
		function setInput(text) {
			$("#status_message").val(text);
			send();
		}
		function updateRec() {
			$("#rec").text(recognition ? "Stop" : "Speak");
		}
		function send() {
			var text = $("#status_message").val();
			$.ajax({
				type: "POST",
				url: baseUrl + "query?v=20150910",
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				headers: {
					"Authorization": "Bearer " + accessToken
				},
				data: JSON.stringify({ query: text, lang: "en", sessionId: "somerandomthing" }),
				success: function(data) {
					setResponse(JSON.stringify(data, undefined, 2));
				},
				error: function() {
					setResponse("Internal Server Error");
				}
			});
			setResponse("Loading...");
		}
		function setResponse(val) {
			$("#response").text(val);
			$("#status_message").val('');
			var obj = jQuery.parseJSON(val);
			$("#chatbox").addClass("direct-chat-msg doted-border");
			$("#chatbox").append(obj.result.fulfillment.speech);

			
		}
