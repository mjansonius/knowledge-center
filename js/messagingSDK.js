var windowKit = new windowKit({
	account: 89307955
	//skillId: 12341234 - optional skill ID
});
var userinput = '<input type="text" id="messageInput"/>'
let isScrolling;
let agentFirstText;

windowKit.connect();

windowKit.onReady( function () {
	console.log("ready");
	scrollBottom();
});

windowKit.onAgentTextEvent(function(text) {
	$('#caseyContainer').append('<div class="caseyText">' + text + '</div>');
	if (text.indexOf("whatever you'd like to search for") > -1) {
		displayInput();
	}
	console.log('Agent: ' + text);
	if (!agentFirstText) {
		agentFirstText = true;
		$("#botLoader").css('display', 'none');
	}
});

windowKit.onVisitorTextEvent(function(text) {
	$('#caseyContainer').append('<div class="consumerText">' + text + '</div>');
	var consumerTexts = document.getElementsByClassName('consumerText');
	var latestConsumerText = consumerTexts[consumerTexts.length - 1];
	scrollBottom();
	console.log('visitortext');
});

windowKit.onAgentRichContentEvent(function(content) {
  var structuredText = JsonPollock.render(content);
	$('#caseyContainer').append(structuredText);
	var scTexts = document.getElementsByClassName('lp-json-pollock');
	var latestScText = scTexts[scTexts.length - 1];
	scrollBottom();
	console.log('Agent: ', structuredText);
	JsonPollock.registerAction('link', function (linkObject) {
		var rawLink = linkObject.actionData.uri;
		var cleanLink = rawLink.replace('s.bcbot.io/r', 'knowledge.liveperson.com');
		window.open(cleanLink, "_blank");
		console.log(linkObject);
	});
	$('.lp-json-pollock-element-button').on('click', function () {
		var scText = $(this).text();
		if (scText.indexOf("View result") == -1) {
		windowKit.sendMessage(scText);
		}
		if (scText == "Search for something else") {
			displayInput();
		}
	});
});

function displayInput () {
	setTimeout (function () {
	$('#caseyContainer:last').append(userinput);
	var messageInput = document.getElementById('messageInput');
	 $('#messageInput').keydown(function (e) {
		 if (e.which == 13) {
			 var messageText = messageInput.value;
			 windowKit.sendMessage(messageText);
			 console.log('enter');
			 console.log(messageText);
			 $(this).attr('id', 'messageInputUsed');
		 }
	 });
}, 2000);
};

function scrollBottom () {
	if (!isScrolling) {
		isScrolling = true;
	var bottom = $('#caseyContainer').position().top + $('#caseyContainer').outerHeight(true);
		$('body, html').animate({ scrollTop: bottom, complete: function() { isScrolling = false; } }, 1000);
	}
	setTimeout (function () {
		isScrolling = false;
	}, 2000);
};

$(document).ready(function () {
	$('#bottomLink').click(function() {
		window.localStorage.clear();
    window.location.reload(true);
});
})
