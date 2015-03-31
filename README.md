# Hearthstone API
The goal of this project is to have a [RESTful API][restful] for all of the
cards in the [Blizzard][blizzard] game [Hearthstone][hearthstone].  This does
have support for all 14 languages that Hearthstone supports.  This includes
deDE, enGB, enUS, esES, esMX, frFR, itIT, koKR, plPL, ptBR, ptPT, ruRU, zhCN,
and zhTW.

This project is currently in an alpha state and is available for limited use.

[ ![Codeship Status](https://codeship.com/projects/5fb5bea0-6a9f-0132-6c6d-2e0b75730361/status?branch=master)](https://codeship.com/projects/53759)


--------------------------------------------------------------------------------


## Table of Contents
- [How do I use this API][how-do-i-use]
- [ID Mappings][id-mappings]
- [Development Notes][development-notes]
  - [Requirements][requirements]
  - [How to setup hearthstone-api for development][howto-setup]
  - [How to create the JSON file][howto-json]
  - [How to extract the XML from the Hearthstone app][howto-xml]


--------------------------------------------------------------------------------


## How do I use this API?

### Alpha Access
You will need a key to access the API.  You can get one at
https://jamsyoung.3scale.net.  Its free and limited to 100 requests a minute.
If you have any questions, [open a GitHub issue here][issues].


### Example Usage

```shell
$ curl -sS 'https://api-2445581159321.apicast.io:443/rest/api/latest/card/id/PRO_001?user_key=[YOUR_API_KEY]' | jq '.'
[
  {
    "_id": "54f1f512d61d7044ce6fcaa9",
    "version": 2,
    "CardID": "PRO_001",
    "__v": 0,
    "Tag": {
      "CardName": "Elite Tauren Chieftain",
      "CardSet": 11,
      "Rarity": 5,
      "CardType": 4,
      "Cost": 5,
      "Atk": 5,
      "Health": 5,
      "CardTextInHand": "<b>Battlecry:</b> Give both players the power to ROCK! (with a Power Chord card)",
      "HowToGetThisGoldCard": "Awarded at BlizzCon 2013.",
      "EnchantmentBirthVisual": 0,
      "EnchantmentIdleVisual": 0,
      "Collectible": true,
      "ArtistName": "Samwise Didier",
      "Elite": true,
      "FlavorText": "He's looking for a drummer.  The current candidates are: Novice Engineer, Sen'jin Shieldmasta', and Ragnaros the Firelord.",
      "Battlecry": true
    }
  }
]
```


--------------------------------------------------------------------------------


## ID Mappings

```
Classes       Card Sets          Card Types      Races                   Faction
------------  -----------------  --------------  ----------------------  -------
0  Developer  [        8      ]  [  4         ]  [                    ]  [ ]
2  Druid      [2 3       12 13]  [3 4 5 6   10]  [      17 20         ]  [3]
3  Hunter     [2 3 5     12 13]  [3 4 5 6 7 10]  [      17 20         ]  [3]
4  Mage       [2 3 5 7   12 13]  [3 4 5 6   10]  [      17            ]  [3]
5  Paladin    [2 3       12 13]  [3 4 5 6 7 10]  [      17            ]  [3]
6  Priest     [2 3       12 13]  [3 4 5 6   10]  [      17            ]  [3]
7  Rogue      [2 3       12 13]  [3 4 5 6 7 10]  [      17       23   ]  [3]
8  Shaman     [2 3       12 13]  [3 4 5 6 7 10]  [14    17    21      ]  [3]
9  Warlock    [2 3       12 13]  [3 4 5 6 7 10]  [   15 17            ]  [3]
10 Warrior    [1 3     8 12 13]  [3 4 5 6 7 10]  [      17            ]  [3]
11 Dream      [  3            ]  [  4 5       ]  [                  24]  [ ]


Card Sets                   Card Types          Races               Factions
---------------------       -------------       -------------       ----------
2  Basic                    3  Hero             14 Murloc           1 Horde
3  Expert                   4  Minion           15 Demon            2 Alliance
4  Reward                   5  Ability          17 Mechanical       3 Neutral
5  Missions                 6  Ability          20 Beast
7  Developer                7  Weapon           21 Totem
8  Developer                10 Hero Power       23 Pirate
11 Promo                                        24 Dragon
12 Curse of Naxxramas
13 Goblins vs Gnomes
14 Blackrock Mountain
16 Credits
```


--------------------------------------------------------------------------------


## Development Notes
If you just want to use the API, you don't need to care about this.  This is for
developers that want to contribute to the API itself.


### Requirements
- [NodeJS][node] 0.10.36 _(probably works with any 0.10.x version)_
- [Disunity][disunity] 0.3.4
- [jq][jq] 1.4

There are scripts in this project that will assume that `jq` is installed and
available in your $PATH.  The Disunity and heartstone-api directories should
both be on the same level.

You will need to `chmod +x disunity.sh` after extracting the disunity release.


### How to setup hearthstone-api for development

```shell
$ npm install
```


### How to extract the XML from the Hearthstone app

```shell
$ npm run extract-game-data
```


### How to create the JSON file

```shell
$ npm run create-json
```


## How to fill the datastore
This will currently fail if the datastore is not cleared prior to running this
script.

```shell
$ . set-env-conf
$ npm run fill-datastore
```


--------------------------------------------------------------------------------


## Useful queries

### Classes
```shell
$ curl -sS localhost:3000/rest/api/latest/cards | jq -c '.[].Tag | {Class}' | sort | uniq
```

### Card Sets
```shell
$ curl -sS localhost:3000/rest/api/latest/cards | jq -c '.[].Tag | {CardSet}' | sort | uniq
```

### Card Types
```shell
$ curl -sS localhost:3000/rest/api/latest/cards | jq -c '.[].Tag | {CardType}' | sort | uniq
```

### Races
```shell
$ curl -sS localhost:3000/rest/api/latest/cards | jq -c '.[].Tag | {Race}' | sort | uniq
```

### Factions
```shell
$ curl -sS localhost:3000/rest/api/latest/cards | jq -c '.[].Tag | {Faction}' | sort | uniq
```

### View all the cards in a set
```shell
$ curl -sS localhost:3000/rest/api/latest/cards | jq -c '.[].Tag | {CardName, CardSet, Collectible, Rarity, CardType, Cost, Atk, Health, Elite, CardTextInHand, Race, FlavorText}' | grep '"CardSet":14' | jq '.'
```


[blizzard]: http://blizzard.com
[disunity]: https://github.com/ata4/disunity/releases
[hearthstone]: https://battle.net/hearthstone
[jq]: http://stedolan.github.io/jq/
[node]: http://nodejs.org
[restful]: http://en.wikipedia.org/wiki/Representational_state_transfer

[how-do-i-use]: https://github.com/jamsyoung/hearthstone-api#how-do-i-use-this-api
[id-mappings]: https://github.com/jamsyoung/hearthstone-api#id-mappings
[development-notes]: https://github.com/jamsyoung/hearthstone-api#development-notes
[requirements]: https://github.com/jamsyoung/hearthstone-api#requirements
[howto-setup]: https://github.com/jamsyoung/hearthstone-api#how-to-setup-hearthstone-api-for-development
[howto-json]: https://github.com/jamsyoung/hearthstone-api#how-to-create-the-json-file
[howto-xml]: https://github.com/jamsyoung/hearthstone-api#how-to-extract-the-xml-from-the-hearthstone-app
[issues]: https://github.com/jamsyoung/hearthstone-api/issues
