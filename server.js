'use strict';

var pkg = require('./package'),
    hearthstoneInfo = require('./json/info'),
    restify = require('restify'),
    server = restify.createServer({name: 'Hearthstone API'}),
    deDECards = require('./models/cardSchema').createCollection('deDE-cards'),
    enGBCards = require('./models/cardSchema').createCollection('enGB-cards'),
    enUSCards = require('./models/cardSchema').createCollection('enUS-cards'),
    esESCards = require('./models/cardSchema').createCollection('esES-cards'),
    esMXCards = require('./models/cardSchema').createCollection('esMX-cards'),
    frFRCards = require('./models/cardSchema').createCollection('frFR-cards'),
    itITCards = require('./models/cardSchema').createCollection('itIT-cards'),
    koKRCards = require('./models/cardSchema').createCollection('koKR-cards'),
    plPLCards = require('./models/cardSchema').createCollection('plPL-cards'),
    ptBRCards = require('./models/cardSchema').createCollection('ptBR-cards'),
    ptPTCards = require('./models/cardSchema').createCollection('ptPT-cards'),
    ruRUCards = require('./models/cardSchema').createCollection('ruRU-cards'),
    zhCNCards = require('./models/cardSchema').createCollection('zhCN-cards'),
    zhTWCards = require('./models/cardSchema').createCollection('zhTW-cards');

require('./lib/mongoose');




if (!process.env.PORT) {
    console.error('Environment not set.  PORT is not defined!');
    process.exit(1);
}




server.pre(function (request, response, next) {
    console.log('[%s] "%s %s HTTP/%s" %s', new Date().toISOString(), request.method, request.url, request.httpVersion, request.headers['user-agent']);
    next();
});




function setLanguage(language) {
    switch (decodeURI(language)) {
        case 'deDE':
            return deDECards;

        case 'enGB':
            return enGBCards;

        case 'esES':
            return esESCards;

        case 'esMX':
            return esMXCards;

        case 'frFR':
            return frFRCards;

        case 'itIT':
            return itITCards;

        case 'koKR':
            return koKRCards;

        case 'plPL':
            return plPLCards;

        case 'ptBR':
            return ptBRCards;

        case 'ptPT':
            return ptPTCards;

        case 'ruRU':
            return ruRUCards;

        case 'zhCN':
            return zhCNCards;

        case 'zhTW':
            return zhTWCards;

        default:
            return enUSCards;
    }
}




function getAllCards(request, response, next) {
    var cards = setLanguage(request.params.language);

    cards.find({}, function (error, cards) {
        if (error) {
            console.error(error);
            response.send(error);
        }

        response.send(cards);
    });
}




function getCardsById(request, response, next) {
    var cards = setLanguage(request.params.language);

    cards.find({CardID: request.params.id}, function (error, cards) {
        if (error) {
            console.error(error);
            response.send(error);
        }

        response.send(cards);
    });
}




function getCardsByName(request, response, next) {
    var cards = setLanguage(request.params.language);

    cards.find({'Tag.CardName': decodeURI(request.params.name)}, function (error, cards) {
        if (error) {
            console.error(error);
            response.send(error);
        }

        response.send(cards);
    });
}




function getCardsByClass(request, response, next) {
    var cards = setLanguage(request.params.language);

    cards.find({'Tag.Class': request.params['class']}, function (error, cards) {
        if (error) {
            console.error(error);
            response.send(error);
        }

        response.send(cards);
    });
}




function getClasses(request, response, next) {
    var cards = setLanguage(request.params.language);

    cards.find().distinct('Tag.Class', function (error, classes) {
        if (error) {
            console.error(error);
            response.send(error);
        }

        response.send(classes);
    });
}




/* default enUS routes */
server.get('/rest/api/latest/cards', getAllCards);
server.get('/rest/api/latest/classes', getClasses);
server.get('/rest/api/latest/cards/class/:class', getCardsByClass);

server.get('/rest/api/latest/card/id/:id', getCardsById);
server.get('/rest/api/latest/card/name/:name', getCardsByName);


/* language specific routes */
server.get('/rest/api/latest/:language/cards', getAllCards);
server.get('/rest/api/latest/:language/classes', getClasses);
server.get('/rest/api/latest/:language/cards/class/:class', getCardsByClass);

server.get('/rest/api/latest/:language/card/id/:id', getCardsById);
server.get('/rest/api/latest/:language/card/name/:name', getCardsByName);




/* healthcheck */
server.get('/healthcheck', function (request, response, next) {
    response.send({'package': pkg, info: hearthstoneInfo});
});




server.listen(process.env.PORT, function () {
    console.log('%s listening at %s', server.name, server.url);
});
