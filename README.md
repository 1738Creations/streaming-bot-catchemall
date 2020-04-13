Streaming Bot - CatchEmAll
==========================
A collectible game users in stream chats can play. Helpful to keep users interested during slow streams, although it can clog up chat.

Every x minutes (6 to 8 default) a collectible will trigger and chat notified. There are 4 tiers of collectibles, each with different chances of spawning. Once spawned, users can shout '!catch' to try and collect it. The game ends after x seconds (10 default) or if a user wins the random number generator.

Each player has 2 turns per spawn, which could be enhanced to give specific players more chances. If a plyer wins, their details are logged to a local file and they get a shout out in public chat. This is a simple Node.js which should run on any system and doesn't need to be on the hosts machine.

Best used with Mixer as they support whispers. Twitch do, but it's a nightmare to get working and not worth the effort. 

Obviously by 'collectible' I mean Pokemon, but it's up to someone else to enter those names in the script.

This was originally written for Mixer then ported to Twitch. The coding is nearly identical. The big differences are connection methods and messaging.

Twitch doesn't fully support whispers, Mixer does. I created a new Twitch account and 3 days later I was still unable to send whispers. Apparently this is intentional as some form of anti-spam? It's ridiculous and greatly reduces the viability of this game. There's a Twitch script regardless.


LEGAL STUFF:
============
You do not have permission to use or modify any of the content in this reprository if...

...you are an e-beggar, tit streamer or someone who can't be bothered to try at real job and provide some worth to society. If you're the kind of person who is featured on the Mixer homepage then this is not for you. If you spend your time in the 'just chatting' portion of Twitch or have a pre-stream, this is not for you.

If in doubt, mail me with a link to verify your societal status.

If this breaks something or you get banned for using it, that's your problem not mine.


REQUIREMENTS:
=============
Each scripts is intended to run from an account, either Twitch or Mixer. You can create a new account or use your host account.

Scripts can be run from any machine. They don't need to be on the hosting computer and should work on Windows or Linux as they're Node.js scripts.


MIXER:
======
It's assumed users have followed the installation on the dev sites...
Ref: https://dev.mixer.com/guides/chat/introduction
Ref: https://dev.mixer.com/guides/chat/chatbot

Search the script for '<replace_me>' and replace the details as they're found:

- access: <replace_me>,
-- This can be found on the '/chatbot' link above by clicking the link in the matching code (simplest way of finding it)

- const targetChannelID = <replace_me>
-- This can be found: https://mixer.com/api/v1/channels/<channel_name>?fields=id
-- Obviously change 'channel_name' to the name of the channel you want to join

Run the script: node CatchEmAll-Bot_mixer.js
- When a collectible spawns, say '!catch' in chat to try and catch it
-- Users whould really whisper the bot with '!catch', however it will accept regular channel messages
- Users are whispered how many goes they have remaining and whether they have failed
- A win is announced globally in chat and logged to file with user id, name, date and capture details


TWITCH:
=======
It's assumed users have followed the installation on the dev sites...
Ref: https://dev.mixer.com/guides/chat/introduction


Search the script for '<replace_me>' and replace the details as they're found:

- username: <replace_me>
-- Name of the bot account

- password: <replace_me>
-- When logged in to the Twitch bot account, go to this page and connect:
--- https://twitchapps.com/tmi/
-- The entire string: 'oauth:oauth:jnmki23o9278h4kjhe9w843vew9ewaa7'

- channels: [ <replace_me> ]
-- Name of the channel to join as it appears in a browser such as: https://www.mixer.com/replace_me


Run the script: node CatchEmAll-Bot_twitch.js
- When a collectible spawns, say '!catch' in chat to try and catch it
- There's no feedback on Twitch for failing to catch due to the terrible way they restrict whispers
- A win is announced globally in chat and logged to file with user id, name, date and capture details


CONFIGURATION:
==============
Hopefully the comments in the code make some sense.

Rarities are: common, rare, epic and legendary. It would take a bit of effort to expand or reduce these, but not much. You can add as many or as few items to the rewards arrays at the top of the script as you want:
- CollectibleArrayCommon
- CollectibleArrayRare
- CollectibleArrayEpic
- CollectibleArrayLegendary

The chance of a particular rarity spawning are controlled by:
- ChangeOfCommonSpawning
- ChangeOfRareSpawning
- ChangeOfEpicSpawning
- ChangeOfLegendarySpawning

The chance of a user winning one of the randomly picked items in one of these arrays is from 0 to 1:
- ChangeOfCommonSpawning = n/a (100)
- ChangeOfRareSpawning = 0.7;
- ChangeOfEpicSpawning = 0.35;
- ChangeOfLegendarySpawning = 0.15;

The number of chances per spawn is set with 'DefaultChancesPerUser'. As noted in the script, this could be expanded to reward subscribers or followers with more attempts.

Functions with 'setTimeout' control when the game starts and how long before the spawn stays active. There are 2 start points. The first is when the bot launches. This was a personal preference as I'd like it different than the global setting which is between 2 random numbers (spawn every 6 to 8 minutes).


LIVE DEMO:
==========
Available on request. I have a Mixer and Twitch demo channel used for developing and testing stream tools:
- https://mixer.com/1738_Creations
- https://www.twitch.tv/1738_creations

...the bots only run when I stream. If you'd like a demo then send a request (1738creations@gmail.com) with the stream name and I'll set them up. My scripts are customised to run a South Park Chinpokomon style game.



======================

Shout out Sean Ranklin

Pig-ups Liquid Richard.


Covid19 isn't a threat. The numbers don't lie, people do. Stop using social media and supporting mainstream fake news. The WHO are corrupt.