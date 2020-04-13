// For connecting to Twitch
const tmi = require('tmi.js');

// For writing files
const fs = require('fs');

// Hide the last game
CSSUpdate("hidden", null);
// Reset data on the HTML for a new game
HTMLUpdate(1, "");

// CssVisibility = visible/hidden
// CssImage = index in 
function CSSUpdate(CssVisibility, CssImage) {
	// Before we do anything in the game, we want to hide the previous game
	// Try to read the CSS file for styling
	try {
		var data = fs.readFileSync('index.css', 'utf8');
	} catch(e) {
		console.log('Error:', e.stack);
	}
	
	if (CssImage == null)
	{
		// Pull out the data we don't want to change, stripping out existing answers and questions
		var CssVisibilityBefore = data.substring(0, (data.lastIndexOf("/*mvis*/")+8));
		var CssVisibilityAfter = data.substring(data.lastIndexOf("/*/mvis*/"), data.length);

		// Build the HTML output, inserting our questions and answers
		var CompiledHTMLData = CssVisibilityBefore + CssVisibility + CssVisibilityAfter;
	}
	else
	{
		// Pull out the data we don't want to change, stripping out existing answers and questions
		var CssVisibilityBefore = data.substring(0, (data.lastIndexOf("/*mvis*/")+8));
		var CssURLBefore = data.substring(data.lastIndexOf("/*/mvis*/"), (data.lastIndexOf("/*i-add*/")+9));
		var CssURLAfter = data.substring(data.lastIndexOf("/*/i-add*/"), data.length);

		// Build the HTML output, inserting our questions and answers
		var CompiledHTMLData = CssVisibilityBefore + CssVisibility + CssURLBefore + "url(\"" + CssImage + "\")" + CssURLAfter;
	}

	// Write the CSS with our compiled data
	fs.writeFileSync('index.css', CompiledHTMLData, (err) => {
	if (err) throw err;
		console.log('Error writing to file.');
		console.log(err);
	});
	// \END of file write
}

// Update the HTML
// TypeOfUpdate = 1 (info) 2 (winner announce)
// PlayerInfo = text or "", if empty we assume no winner
function HTMLUpdate(TypeOfUpdate, PlayerInfo) {
	// Before we do anything in the game, we want to hide the previous game
	// Try to read the CSS file for styling
	try {
		var data = fs.readFileSync('index.html', 'utf8');
	} catch(e) {
		console.log('Error:', e.stack);
	}
	
	// Pull out the data we don't want to change, stripping out existing answers and questions
	var HTMLTextBefore = data.substring(0, (data.lastIndexOf("<!--text-->")+11));
	var HTMLTextAfter = data.substring(data.lastIndexOf("<!--/text-->"), data.length);
	
	if (TypeOfUpdate == 1)
	{
		var UpdatedHTMLText = "Shout <b>!throw</b> in chat to catch it!";
	}
	else // Assume 2 as no other options
	{
		if (PlayerInfo == "")
		{
			var UpdatedHTMLText = "Game over. No winners!";
		}
		else
		{
			var UpdatedHTMLText = PlayerInfo + " won!!";
		}
	}
	
	// Build the HTML output, inserting our questions and answers
	var CompiledHTMLData = HTMLTextBefore + UpdatedHTMLText + HTMLTextAfter;

	// Write the CSS with our compiled data
	fs.writeFileSync('index.html', CompiledHTMLData, (err) => {
	if (err) throw err;
		console.log('Error writing to file.');
		console.log(err);
	});
	// \END of file write
}



// The chance of any of these spawning incrememnts in 1, hardcoded in the 'start' function
// Common always has a change of '1' or '100%' as it's the default selection
var ChanceOfCommonWin = 5; // 1 in this_number
var CollectibleArrayCommon = [
	['Common Collectible 1', 'images/common-01.png'],
	['Common Collectible 2', 'images/common-02.png'],
	['Common Collectible 3', 'images/common-03.png'],
	['Common Collectible 4', 'images/common-04.png'],
	['Common Collectible 5', 'images/common-05.png'],
	['Common Collectible 6', 'images/common-06.png'],
	['Common Collectible 7', 'images/common-07.png'],
	['Common Collectible 8', 'images/common-08.png'],
	['Common Collectible 9', 'images/common-09.png'],
	['Common Collectible 10', 'images/common-10.png'],
	['Common Collectible 11', 'images/common-11.png'],
	['Common Collectible 12', 'images/common-12.png'],
	['Common Collectible 13', 'images/common-13.png'],
	['Common Collectible 14', 'images/common-14.png']
];
var ChangeOfRareSpawning = 0.4 // 60% chance of common spawning - sort of, see the start game function for more info
var ChanceOfRareWin = 8; // 1 in this_number
var CollectibleArrayRare = [
	['Rare Collectible 1', 'images/rare-01.png'],
	['Rare Collectible 2', 'images/rare-02.png'],
	['Rare Collectible 3', 'images/rare-03.png'],
	['Rare Collectible 4', 'images/rare-04.png'],
	['Rare Collectible 5', 'images/rare-05.png'],
	['Rare Collectible 6', 'images/rare-06.png'],
	['Rare Collectible 7', 'images/rare-07.png'],
	['Rare Collectible 8', 'images/rare-08.png']
]
var ChangeOfEpicSpawning = 0.15;
var ChanceOfEpicWin = 13; // 1 in this_number
var CollectibleArrayEpic = [
	['Epic Collectible 1', 'images/epic-01.png'],
	['Epic Collectible 2', 'images/epic-02.png'],
	['Epic Collectible 3', 'images/epic-03.png'],
	['Epic Collectible 4', 'images/epic-04.png'],
	['Epic Collectible 5', 'images/epic-05.png']
]
var ChangeOfLegendarySpawning = 0.05;
var ChanceOfLegendaryWin = 20; // 1 in this_number
var CollectibleArrayLegendary = [
	['Legendary Collectible 1', 'images/legendary-01.png'],
	['Legendary Collectible 2', 'images/legendary-02.png'],
	['Legendary Collectible 3', 'images/legendary-03.png']
]

var UsersInPlayArray = []; // Who has thrown a ball this spawn
var GameHasStarted = false; // If a game is in progress

// This is copied from the ChanceOf<rarity>Win variables above
// Used for random number generation when the user attempts to catch the collectible
var MaxChanceOfWinningGlobal = 0;

var DefaultChancesPerUser = 2; // How many balls users get to throw per spawn

// These are used for announcing to chat and saving to file, set in game start function
var SelectedRarity = "";
var SelectedCollectible = "";

// Users need to match against this number to win, generated in game start function
var NumberUsersNeedsToMatch = 0


// Twitch
// Define configuration options
const opts = {
	identity: {
		username: <replace_me>, // Name of the bot account, example: username: 'accountname'
		password: <replace_me> // Auth token of the bot account, example: password: 'oauth:4seeee33535ewer35tewrw334'
	},
	channels: [
		<replace_me> // Name of channel to join, example: 'channel_name'
	]
};

// Twitch
// Create a client with our options
const client = new tmi.client(opts);

// Twitch
// Register our event handlers (defined below)
client.on('connected', onConnectedHandler);
client.on('message', onMessageHandler);
// Twitch won't allow 'new' (I've been registered for 3 days and can't whisper) users to whisper, so this ruins the game and users have to spam chat
//client.on('whisper', onWhisperHandler);

// Twitch
// Connect the bot to Twitch
client.connect();


// No Twitch functions below this lineHeight
// ------------------------------------


// As noted above when declaring this listener, we can't reliably handle whispers on Twitch...
//function onWhisperHandler() {
	// Do stuff here...
//}


// Received a message. This event is fired whenever you receive a chat, action or whisper message
function onMessageHandler (channel, userstate, msg, self) {

	// Ignore messages from the bot, which shouldn't be an issue but calling it regardless
	if (self)
	{ return; }
	
	// Remove any extra padding to the message since Twitch doesn't
	const commandName = msg.trim();
	
	//As we can't reliably handle whispers in Twitch, we're don't need to check whether users are in the same channel
	
	// We're going to check the type of message - we only care about general chat messages
	switch(userstate["message-type"])
	{
		case "action":
            // This is an action message..
            break;

        case "chat":
			// If a user says '!catchemall' we whisper them with info about the bot/game
			if (commandName.toLowerCase() === '!catchemall') {
				// Not a good idea to spam chat with this, but it's an option. Depends how big your channel is
				//client.say(opts.channels[0], "Collectibles randomly spawn in chat. When they do you'll have 10 seconds to catch it by shouting !catch. 2 balls per user. See stream info for more details.");
			}
			
			// This is the trigger for user interaction; '!catch'
			// We know the user is in out chat channel...
			// We need to check if a game has started, if the user has thrown any balls then check if they're a winner or message them that they have no remining chances
			else if (commandName.toLowerCase() === ('!ball'))
			{
				if (GameHasStarted == true)
				{
					// Variable for determining whether the user has played this round - 0 for not found
					var HasUserPlayedThisSession = 0;

					// Check if user has played this session
					// Look through the array count the number of times this users name appears (if any)
					// We could use a 2D array ( [[][].[]] ), however that would require extra coding to append the data
					// ...this way we keep it short and simple as the array is cleared on game end anyway
					for (const [index, content] of UsersInPlayArray.entries()) {
						if ( content === userstate['user-id'] ) {
							HasUserPlayedThisSession += 1; // Sets it to the number of times the user has played this round
						}
					}

					// If the user has goes left, let them play
					// ...if we wanted to give followers of subscribers more attempts, we could case them here and add numbers to 'DefaultChancesPerUser'
					if (HasUserPlayedThisSession < DefaultChancesPerUser)
					{

						// Add the user to the array, reducing the number of goes by 1
						UsersInPlayArray.push(userstate['user-id']);

						// Get a random number between 0 and the 'ChanceOfWinningGlboal' variable
						var LocalUserGuess = Math.floor(Math.random() * MaxChanceOfWinningGlobal);

						// Winner
						if (LocalUserGuess == NumberUsersNeedsToMatch){

							// Set the game stopped flag immediately
							// This is also set in the end game function, but this makes it instant
							GameHasStarted = false;

							// Update the text to show who won
							HTMLUpdate(2, userstate['display-name']);

							// Send glboal message to chat indicating who the winner is
							client.say(opts.channels[0], userstate['display-name'] + " caught the " + SelectedRarity + " '" + SelectedCollectible + "' FBtouchdown");

							// We want the date to log in the file for future reference
							var date = new Date();

							// Write the player details to a local file (csv)
							fs.appendFile("winners.csv", userstate['user-id'] + "," + userstate['display-name'] + "," + SelectedRarity + "," + SelectedCollectible + "," + date + "\n", (err) => {
								// Break if file writing error
								if (err) throw err;

								// Log to output window that a winner has been found in case the host can't keep up with chat
								console.log("Winner written to file:");
								console.log(userstate['display-name'] + "," + SelectedRarity + "," + SelectedCollectible);
							});
						}

						// Loser
						else
						{
							// We don't want to announce to chat that the user has lost since that would cause too much spam
							// ...if we could reliably whisper, we could do that as we do in Mixer. But we can't.
						}
					}
					
					// The user has no attempts left, but we can't whisper them...
					else
					{
						// Would be nice if whispers worked reliably
					}
					
				}
				
				// Game has not started, yet again... whispers
				else
				{
					// Would be nice if whispers worked reliably
				}
		
			}
            break;
			
        case "whisper":
			// We can also handle whispers here, but we don't care about them
            break;
			
        default:
            // Should never get here
			console.log("Unknown command message - should never get here");
            break;
    }
}


// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
	// Starts the game
	// (function, time before game starts in ms, joinChat)
	// ...if set too low (less than a second) it may not fire the initial chat message as the bot can take a while to join chat
	setTimeout(startCollectibleGame, 240000); // 4 minutes (240000) from boot/joining channel

	// Optional; announces to chat the bot is now online
	client.say(opts.channels[0], "/me Collectible bot online!");
}


// Returns a random value between 2 numbers, used for odds calculations
function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Start the game
function startCollectibleGame() {
	// I've tried to make the way collectibles are spawned as simple as possible while adding some rarity, not everyone is great at maths
	// Odds are based on '100'. So if 'ChangeOfLegendarySpawning' was '0.15' then there would be a 15 in 100 chance (not really)
	// ...in reality we would need to calculate the odds of all 4 chances together rather than basing it off a single random call
	// ...but i wanted to keep this simple so anyone could understand it and it's not as if we're gambling real money!

	// Randomly pick a rarity
	var RarityToSelect = Math.floor(Math.random() * 100 + 1) / 100; // +1 so we go from 1-100 instead of 0-99

	// Match the random rarity value against the chance of spawning
	if (RarityToSelect <= ChangeOfLegendarySpawning) // Legendary collectible
	{
			SelectedRarity = "legendary";
			
			// Randomly pick a collectible from the list
			var CollectibleToSelect = Math.floor(Math.random() * CollectibleArrayLegendary.length);
			SelectedCollectible = CollectibleArrayLegendary[CollectibleToSelect][0];
			
			// Set the image to display on stream
			var SelectedCollectibleImage = CollectibleArrayLegendary[CollectibleToSelect][1];
			
			NumberUsersNeedsToMatch = Math.floor(Math.random() * ChanceOfLegendaryWin);
			MaxChanceOfWinningGlobal = ChanceOfLegendaryWin;
	}
	else if (RarityToSelect <= ChangeOfEpicSpawning) // Rare collectible
	{
			SelectedRarity = "epic";
			
			// Randomly pick a collectible from the list
			var CollectibleToSelect = Math.floor(Math.random() * ((CollectibleArrayEpic.length-1) - 0 + 1) + 0);
			SelectedCollectible = CollectibleArrayEpic[CollectibleToSelect][0];

			// Set the image to display on stream
			var SelectedCollectibleImage = CollectibleArrayEpic[CollectibleToSelect][1];
			
			NumberUsersNeedsToMatch = Math.floor(Math.random() * ChanceOfEpicWin);
			MaxChanceOfWinningGlobal = ChanceOfEpicWin;
	}
	else if (RarityToSelect <= ChangeOfRareSpawning) // Epic collectible
	{
			SelectedRarity = "rare";
			
			// Randomly pick a collectible from the list
			var CollectibleToSelect = Math.floor(Math.random() * ((CollectibleArrayRare.length-1) - 0 + 1) + 0);
			SelectedCollectible = CollectibleArrayRare[CollectibleToSelect][0];

			// Set the image to display on stream
			var SelectedCollectibleImage = CollectibleArrayRare[CollectibleToSelect][1];
			
			NumberUsersNeedsToMatch = Math.floor(Math.random() * ChanceOfRareWin);
			MaxChanceOfWinningGlobal = ChanceOfRareWin;
	}
	else // Common collectible
	{
			SelectedRarity = "common"; // We can use this text in our messaging later
			
			// Randomly pick a collectible from the list
			var CollectibleToSelect = Math.floor(Math.random() * ((CollectibleArrayCommon.length-1) - 0 + 1) + 0);
			SelectedCollectible = CollectibleArrayCommon[CollectibleToSelect][0];
			
			// Set the image to display on stream
			var SelectedCollectibleImage = CollectibleArrayCommon[CollectibleToSelect][1];
			
			// Generate a number the players need to match with to win
			NumberUsersNeedsToMatch = Math.floor(Math.random() * ChanceOfCommonWin);
			
			// Copy the chance of winning max number to a global variable
			// We could have a case statement when the user plays their turn, but that would be additional processing
			MaxChanceOfWinningGlobal = ChanceOfCommonWin;
	}

	// Logging the rarity to the console so we can see when a spawn has happened and keep track of rarities
	console.log(SelectedRarity);
	
	// Set the game started flag
	GameHasStarted = true;
			
	// Update the css image and visibility
	CSSUpdate("visible", SelectedCollectibleImage);

	// Announce to chat that a collectible is available
	client.say(opts.channels[0], "A wild " + SelectedRarity + " '" + SelectedCollectible + "' has appeared in chat KAPOW")
 
	// Set the game has started flag so users can try to collect it

	// Start the game end timer
	// 10 seconds (10000 ms) for users to perform an action
	setTimeout(endCollectibleGame, 10000);
}


// End the game if the time has run out
function endCollectibleGame() {
	// If the game has started, announce the game over message to chat
	// We won't get this message if someone has won since the started flag is set to false before this
	if (GameHasStarted == true) {
		client.say(opts.channels[0], "The wild " + SelectedRarity + " '" + SelectedCollectible + "' escaped chat HSWP");
		
		// Update the text to show nobody won
		HTMLUpdate(2, "");
	}

	// Set the flag that the game has ended
	GameHasStarted = false;

	// Clear the players array so users can play again next round
	// Do it here to free up memory (not much) after the game ends
	UsersInPlayArray = [];
	
	// Remove the results screen after this time
	setTimeout(HideResultsScreen, 15000)
}

//
function HideResultsScreen() {
	// Hide the overlay
	CSSUpdate("hidden", null);
	// Reset the HTML for the next game
	HTMLUpdate(1, "");

	// Start another game in 8 to 10 minutes 
	setTimeout(startCollectibleGame, (randomIntFromInterval(360, 480) * 1000)); // 6 mins (360), 8 mins (480)
}