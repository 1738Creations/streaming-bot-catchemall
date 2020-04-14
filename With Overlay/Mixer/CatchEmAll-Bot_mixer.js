// For connecting to Mixer
const Mixer = require('@mixer/client-node');
const ws = require('ws');

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


// Mixer
// Instantiate a new Mixer Client
// See the Mixer documentation for anything related to their system
// https://dev.mixer.com/
const client = new Mixer.Client(new Mixer.DefaultRequestRunner());

client.use(new Mixer.OAuthProvider(client, {
    tokens: {
        access: <replace_me>, // access: 'xxxj2kdl2j5er4il2rhew3i43lrhlwe423423',
        // Tokens retrieved via this page last for 1 year.
        expires: Date.now() + (365 * 24 * 60 * 60 * 1000)
    },
}));

// Mixer
// Joins the bot to chat
async function joinChat(userId, channelId) {
    const joinInformation = await getConnectionInformation(channelId);
    const socket = new Mixer.Socket(ws, joinInformation.endpoints).boot();

    return socket.auth(channelId, userId, joinInformation.authkey).then(() => socket);
}

// Mixer
// Returns body resposne of bot joining chat
async function getConnectionInformation(channelId) {
    return new Mixer.ChatService(client).join(channelId).then(response => response.body);
}

// Mixer
// ...gets details about users in chat
async function getUserInfo() {
    return client.request('GET', 'users/current').then(response => response.body);
}


// No Mixer functions below this lineHeight
// ------------------------------------


// Start the bot / join it to chat
getUserInfo().then(async userInfo => {
	// The ID of the channel  to join specific channel and verify users messaging the bot are in this channel
	const targetChannelID = <replace_me>; // example: targetChannelID = 123456789

	// Joins the bot to the channel
	const socket = await joinChat(userInfo.id, targetChannelID);

	// Starts the game
	// (function, time before game starts in ms, joinChat)
	// ...if set too low (less than a second) it may not fire the initial chat message as the bot can take a while to join chat
	setTimeout(startCollectibleGame, 240000, socket); // 4 minutes (240000) from boot/joining channel

    // Send a message once connected to chat.
	// Optional; announces to chat the bot is now online
	// We could whisper a new user whenever they join but it adds to the interaction if they have to ask the host/clients
    socket.call("msg", ["/me Collectible bot online!"]);

    // Looks for any chat message (main chat, whispers...)
	// For this game we don't care if people spam main chat with the command, if we did we'd force the bot to only listen for whispers
	// -- data.message.meta[0].whisper == true)
	// -- https://dev.mixer.com/reference/chat/events/chatmessage
    socket.on('ChatMessage', data => {

		// Verify the users are in our channel.
		// We don't want people whispering from another channel, silently ignore them
		if (data.channel == targetChannelID){
		
			// If the message has contents we can read
			if (data.message.message[0].data)
			{
				// Here we read the messages and branch off if we find one containing specific text
				// ...
				
				// If a user says '!catchemall' we whisper them with info about the bot/game
				if (data.message.message[0].data.toLowerCase().startsWith("!catchemall"))
				{
					socket.call("whisper", [data.user_name, "Collectibles randomly spawn in chat. When they do you'll have 10 seconds to catch it by shouting !catch. 2 balls per user. See stream info for more details."]);
				}

				// This is the trigger for user interaction; '!catch'
				// We know the user is in out chat channel...
				// We need to check if a game has started, if the user has thrown any balls then check if they're a winner or message them that they have no remining chances
				else if (data.message.message[0].data.toLowerCase().startsWith("!catch"))
				{

					// If the game has started we run some checks or whisper the user with an appropriate error message
					if (GameHasStarted == true)
					{

						// Variable for determining whether the user has played this round - 0 for not found
						var HasUserPlayedThisSession = 0;

						// Check if user has played this session
						// Look through the array count the number of times this users name appears (if any)
						// We could use a 2D array ( [[][].[]] ), however that would require extra coding to append the data
						// ...this way we keep it short and simple as the array is cleared on game end anyway
						for (const [index, content] of UsersInPlayArray.entries()) {
							if ( content === data.user_id ) {
								HasUserPlayedThisSession += 1; // Sets it to the number of times the user has played this round
							}
						}

						// If the user has goes left, let them play
						// ...if we wanted to give followers of subscribers more attempts, we could case them here and add numbers to 'DefaultChancesPerUser'
						if (HasUserPlayedThisSession < DefaultChancesPerUser) {

							// Add the user to the array, reducing the number of goes by 1
							UsersInPlayArray.push(data.user_id);

							// Get a random number between 0 and the 'ChanceOfWinningGlboal' variable
							var LocalUserGuess = Math.floor(Math.random() * MaxChanceOfWinningGlobal);

							// Winner
							if (LocalUserGuess == NumberUsersNeedsToMatch){

								// Set the game stopped flag immediately
								// This is also set in the end game function, but this makes it instant
								GameHasStarted = false;

								// Update the text to show who won
								HTMLUpdate(2, data.user_name);

								// Send glboal message to chat indicating who the winner is
								socket.call("msg", ["/me " + data.user_name + " caught the " + SelectedRarity + " '" + SelectedCollectible + "' :trophy"]);

								// We want the date to log in the file for future reference
								var date = new Date();

								// Write the player details to a local file (csv)
								fs.appendFile("winners.csv", data.user_id + "," + data.user_name + "," + SelectedRarity + "," + SelectedCollectible + "," + date + "\n", (err) => {
									// Break if file writing error
									if (err) throw err;

									// Log to output window that a winner has been found in case the host can't keep up with chat
									console.log("Winner written to file:");
									console.log(data.user_name + "," + SelectedRarity + "," + SelectedCollectible);
								});
							}

							// Loser
							else
							{
								// It may be better to comment this out/remove as it could trigger anti-spam if there are many players
								socket.call("whisper", [data.user_name, "Not good enough! You have " + (DefaultChancesPerUser - HasUserPlayedThisSession - 1) + " chance(s) remaining :spicy"]);
							}

						}

						// If the user has no more goes left, inform them with a whisper
						else
						{
							// It may be better to comment this out/remove as it could trigger anti-spam if there are many players
							socket.call("whisper", [data.user_name, "You have no chances remaining :facepalm"]);
						}
						
					}
					
					// Game has not started, whisper the user to inform them
					else
					{
						// It may be better to comment this out/remove as it could trigger anti-spam if there are many players
						socket.call("whisper", [data.user_name, "There are no collectibles in range :facepalm"]);
					}
				}
			}
		}
    });

    // Handle errors
    socket.on('error', error => {
        console.error('Socket error');
        console.error(error);
    });
});


// Returns a random value between 2 numbers, used for odds calculations
function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Start the game
function startCollectibleGame(socket) {
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
	socket.call("msg", ["A wild " + SelectedRarity + " '" + SelectedCollectible + "' has appeared in chat :go"]);
 
	// Set the game has started flag so users can try to collect it

	// Start the game end timer
	// 10 seconds (10000 ms) for users to perform an action
	setTimeout(endCollectibleGame, 10000, socket);
}


// End the game if the time has run out
function endCollectibleGame(socket) {
	// If the game has started, announce the game over message to chat
	// We won't get this message if someone has won since the started flag is set to false before this
	if (GameHasStarted == true) {
		socket.call("msg", ["The wild " + SelectedRarity + " '" + SelectedCollectible + "' escaped chat :rip"]);
		
		// Update the text to show nobody won
		HTMLUpdate(2, "");
	}

	// Set the flag that the game has ended
	GameHasStarted = false;

	// Clear the players array so users can play again next round
	// Do it here to free up memory (not much) after the game ends
	UsersInPlayArray = [];
	
	// Remove the results screen after this time
	setTimeout(HideResultsScreen, 15000, socket)
}

//
function HideResultsScreen(socket) {
	// Hide the overlay
	CSSUpdate("hidden", null);
	// Reset the HTML for the next game
	HTMLUpdate(1, "");

	// Start another game in 8 to 10 minutes 
	setTimeout(startCollectibleGame, (randomIntFromInterval(360, 480) * 1000), socket); // 6 mins (360), 8 mins (480)
}