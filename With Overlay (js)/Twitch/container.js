// We'll check for updated data every half second since it doesn't take many resources

// For verifying HTML changes
var PreviousHTMLBody = "";

// For verifying CSS changes
var PreviousCSSBody = "";

// Declare the iframe, we'll find it in the dom on the page load function
var iframe = "";


function DoOnPageLoad() {
	// Get the iframe location for refreshing later
	iframe = document.getElementById('TheIframe');
	
	// Trigger the CSS and HTML updates
	RefreshHTML();
	RefreshCSS();
}


function RefreshHTML() {
	var promise = Promise.resolve();
	
	promise = promise.then(fetch('index.html', {mode: 'no-cors'})
		.then(res => res.text())
		.then((data) => {
			
			if (data != PreviousHTMLBody) {
				// Reload the iframe
				iframe.src = iframe.src;
				// Sets the old data to current for checking on the next loop!
				PreviousHTMLBody = data;
			}
		})
	 )

	promise.then(function(response){
		// Do it again
		setTimeout(RefreshHTML, 1000);
	});
}


function RefreshCSS() {
	var promise = Promise.resolve();

	promise = promise.then(fetch('index.css', {mode: 'no-cors'})
		.then(res => res.text())
		.then((data) => {

			if (data != PreviousCSSBody) {
				// Reload the iframe
				iframe.src = iframe.src;
				// Sets the old data to current for checking on the next loop!
				PreviousCSSBody = data;
			}
		})
	 )

	promise.then(function(response){
		// Do it again
		setTimeout(RefreshCSS, 1000);
	});
}
