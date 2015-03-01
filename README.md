# Hearthstone API
The goal of this project is to have a [RESTful API][restful] for all of the
cards in the [Blizzard][blizzard] game [Hearthstone][hearthstone].

This project is currently in an alpha state and is available for limited use.

[ ![Codeship Status](https://codeship.com/projects/5fb5bea0-6a9f-0132-6c6d-2e0b75730361/status?branch=master)](https://codeship.com/projects/53759)




---




## Table of Contents
- [How do I use this API][how-do-i-use]
- [Development Notes][development-notes]
  - [Requirements][requirements]
  - [How to setup hearthstone-api for development][howto-setup]
  - [How to create the JSON file][howto-json]
  - [How to extract the XML from the Hearthstone app][howto-xml]




---




## How do I use this API?

### Alpha Access
You will need a key to access the API.  You can get one at
https://jamsyoung.3scale.net.  Its free and limited to 100 requests a minute.
If you have any questions, [open a GitHub issue here][issues].



---




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



[blizzard]: http://blizzard.com
[disunity]: https://github.com/ata4/disunity/releases
[hearthstone]: https://battle.net/hearthstone
[jq]: http://stedolan.github.io/jq/
[node]: http://nodejs.org
[restful]: http://en.wikipedia.org/wiki/Representational_state_transfer


[how-do-i-use]: https://github.com/jamsyoung/hearthstone-api#how-do-i-use-this-api
[development-notes]: https://github.com/jamsyoung/hearthstone-api#develpment-notes
[requirements]: https://github.com/jamsyoung/hearthstone-api#requirments
[howto-setup]: https://github.com/jamsyoung/hearthstone-api#how-to-setup-hearthstone-api-for-development
[howto-json]: https://github.com/jamsyoung/hearthstone-api#how-to-create-the-json-file
[howto-xml]: https://github.com/jamsyoung/hearthstone-api#how-to-extract-the-xml-from-the-hearthstone-app
[issues]: https://github.com/jamsyoung/hearthstone-api/issues
