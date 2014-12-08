# Hearthstone API
The goal of this project is to have a [RESTful API][restful] for all of the
cards in the [Blizzard][blizzard] game [Hearthstone][hearthstone].

This project is under active development and the goal is to have a working API
available on the internet in December 2014.

Stay tuned.

![](http://us.battle.net/hearthstone/static/images/home/header-bg-small-gvg.jpg)




---




## Table of Contents
- [Consumer Notes][consumer-notes]
- [Developer Notes][developer-notes]
  - [Requirements][requirements]
  - [How to setup for development][howto-setup]
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


### Requirments
- [NodeJS][node] 0.10.33 _(probaby works with any 0.10.x version)_
- [Disunity][disunity]
- [jq][jq] 1.4 _(not required, but highly recommended)_


### How to setup for development
```bash
$ npm install
```


### How to create the JSON file
```bash
$ npm run create-json
```


### How to extract the XML from the Hearthstone app
Coming Soon.




[blizzard]: http://blizzard.com
[disunity]: https://github.com/ata4/disunity
[hearthstone]: https://battle.net/hearthstone
[jq]: http://stedolan.github.io/jq/
[node]: http://nodejs.org
[restful]: http://en.wikipedia.org/wiki/Representational_state_transfer


[consumer-notes]: /relative-link-tbd
[developer-notes]: /relative-link-tbd
[requirements]: /relative-link-tbd
[howto-setup]: /relative-link-tbd
[howto-json]: /relative-link-tbd
[howto-xml]: /relative-link-tbd
