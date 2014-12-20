# Hearthstone API
The goal of this project is to have a [RESTful API][restful] for all of the
cards in the [Blizzard][blizzard] game [Hearthstone][hearthstone].

This project is under active development and the goal is to have a working API
available on the internet in December 2014.

Currently this only supports the enUS locale.  There will be support for all of
the other languages in the future.

**Last Build:** [![Circle CI](https://circleci.com/gh/jamsyoung/hearthstone-api/tree/master.svg?style=svg&circle-token=9290e611b5e2079bd4e55a85b07b5f52b3de0743)](https://circleci.com/gh/jamsyoung/hearthstone-api/tree/master)



---




## Table of Contents
- [Consumer Notes][consumer-notes]
- [Developer Notes][developer-notes]
  - [Requirements][requirements]
  - [How to setup hearthstone-api for development][howto-setup]
  - [How to create the JSON file][howto-json]
  - [How to extract the XML from the Hearthstone app][howto-xml]




---




## Consumer Notes
Details will be posted here as soon as a release version is available on how to
use the API.




---




## Developer Notes
This section is here for when I forget what I did, and for other developers that
may want to contribute to this project. :smile:

This assumes you are on OS X.


### Requirements
- [NodeJS][node] 0.10.33 _(probably works with any 0.10.x version)_
- [Disunity][disunity] 0.3.4
- [jq][jq] 1.4

There are scripts in this project that will assume that `jq` is installed and
available in your $PATH.  The Disunity and heartstone-api directories should
both be on the same level.

You will need to `chmod +x disunity.sh` after extracting the disunity release.


### How to setup hearthstone-api for development
```bash
$ npm install
```


### How to extract the XML from the Hearthstone app
```bash
$ npm run extract-game-data
```


### How to create the JSON file
```bash
$ npm run create-json
```




[blizzard]: http://blizzard.com
[disunity]: https://github.com/ata4/disunity/releases
[hearthstone]: https://battle.net/hearthstone
[jq]: http://stedolan.github.io/jq/
[node]: http://nodejs.org
[restful]: http://en.wikipedia.org/wiki/Representational_state_transfer


[consumer-notes]: https://github.com/jamsyoung/hearthstone-api#consumer-notes
[developer-notes]: https://github.com/jamsyoung/hearthstone-api#developer-notes
[requirements]: https://github.com/jamsyoung/hearthstone-api#requirments
[howto-setup]: https://github.com/jamsyoung/hearthstone-api#how-to-setup-hearthstone-api-for-development
[howto-json]: https://github.com/jamsyoung/hearthstone-api#how-to-create-the-json-file
[howto-xml]: https://github.com/jamsyoung/hearthstone-api#how-to-extract-the-xml-from-the-hearthstone-app
