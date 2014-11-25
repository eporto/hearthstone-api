'use strict';

var fs = require('fs'),
    xml2js = require('xml2js');




function doit(callback) {
    fs.readFile(__dirname + '/xml/enUS.xml', function (readError, xml) {
        var parser = new xml2js.Parser();

        parser.parseString(xml, function (parseError, result) {
            var json = {},
                processError = false;

            json.cards = [];

            result.CardDefs.Entity.forEach(function (entity) {
                var temporaryObject = {},
                    property;

                for (property in entity) {
                    temporaryObject[property] = {};

                    if (Array.isArray(entity[property])) {

                        entity[property].forEach(function (item) {

                            switch (typeof item) {
                                case 'object':
                                    switch (property) {
                                        /*
                                         * Type: array of objects
                                         *
                                         * Raw data:
                                         *
                                         *     Tag [
                                         *         {"_":"Thaddius","$":{"name":"CardName","enumID":"185","type":"String"}},
                                         *         {"$":{"name":"CardSet","enumID":"183","type":"CardSet","value":"12"}},
                                         *         {"$":{"name":"Rarity","enumID":"203","type":"Rarity","value":"5"}},
                                         *         {"$":{"name":"CardType","enumID":"202","type":"CardType","value":"4"}},
                                         *         {"$":{"name":"Cost","enumID":"48","type":"Number","value":"10"}},
                                         *         {"$":{"name":"Atk","enumID":"47","type":"Number","value":"11"}},
                                         *         {"$":{"name":"Health","enumID":"45","type":"Number","value":"11"}},
                                         *         {"$":{"name":"Elite","enumID":"114","type":"Bool","value":"1"}}
                                         *     ]
                                         *
                                         *
                                         * Example on temporaryObject:
                                         *
                                         *     {
                                         *         "Tag": {
                                         *             "CardName": "Thaddius",
                                         *             "CardSet": "12",         <-- This is a String since the `type` is `CardSet`
                                         *             "Rarity": "5",
                                         *             "CardType": "4",
                                         *             "Cost": 10,              <-- This is a Number since the `type` is `Number`
                                         *             "Atk": 11,
                                         *             "Health": 11,
                                         *             "Elite": true            <-- This is a Boolean since the `type` is `Bool`
                                         *         }
                                         *     }
                                         */
                                        case 'Tag':
                                            temporaryObject[property][item.$.name] = item._ || item.$.value;
                                            break;

                                        case 'Power':
                                            /*
                                             * Type: array of objects
                                             *
                                             * Raw data:
                                             *
                                             *     Power [
                                             *         {
                                             *             "$":{"definition":"ffa01d9c-6b4b-45c1-8563-5f1115e4c1a8"},
                                             *             "PlayRequirement":[
                                             *                 {"$":{"reqID":"11","param":""}},
                                             *                 {"$":{"reqID":"3","param":""}}
                                             *             ]
                                             *         },
                                             *         {
                                             *             "$":{"definition":"f4d448ad-f73c-4e00-b1b9-38fe7e375145"}
                                             *         }
                                             *     ]
                                             *
                                             *
                                             * Example on temporaryObject:
                                             *
                                             *     {
                                             *         "Power": [
                                             *             {
                                             *                 "definition": "ffa01d9c-6b4b-45c1-8563-5f1115e4c1a8",
                                             *                 "PlayRequirement": [
                                             *                     {
                                             *                         "reqID": 11  <-- This is a Number since the name of the field has "ID" in it
                                             *                     },
                                             *                     {
                                             *                         "reqId": 3
                                             *                     }
                                             *                 ]
                                             *             },
                                             *             {
                                             *                 "definition": "f4d448ad-f73c-4e00-b1b9-38fe7e375145"
                                             *             }
                                             *         ]
                                             *     }
                                             */
                                            temporaryObject[property].definition = item.$.definition;
                                            break;

                                        case 'ReferencedTag':
                                            /*
                                             * Type: array of objects
                                             *
                                             * Raw data:
                                             *
                                             *     ReferencedTag [
                                             *         {"$":{"name":"Taunt","enumID":"190","type":"Bool","value":"1"}},
                                             *         {"$":{"name":"Charge","enumID":"197","type":"Bool","value":"1"}}
                                             *     ]
                                             *
                                             * This one has an unfortunate name :/
                                             *
                                             *     ReferencedTag [
                                             *         {"$":{"name":"Cant Be Damaged","enumID":"240","type":"Bool","value":"1"}}
                                             *     ]
                                             *
                                             *
                                             * Example on temporaryObject:
                                             *
                                             *     {
                                             *         "ReferencedTag": {
                                             *             "Taunt": true,           <-- This is a Boolean since the `type` is `Bool`
                                             *             "Charge": true
                                             *         }
                                             *     }
                                             *
                                             *
                                             * Alternate proposal: TODO: I don't remember if properties can start with a number, google this
                                             *
                                             *     {
                                             *         "ReferencedTag": {
                                             *             "240": {"name": "Cant Be Damaged", "value": true}
                                             *         }
                                             *     }
                                             *
                                             *     {
                                             *         "ReferencedTag": {
                                             *             "190": {"name": "Taunt", "value": true},
                                             *             "197": {"name": "Charge", "value": true}
                                             *         }
                                             *     }
                                             */
                                            // temporaryObject[property].
                                            break;

                                        case 'TriggeredPowerHistoryInfo':
                                            /*
                                             * Type: array of objects
                                             *
                                             * Raw data:
                                             *
                                             *     TriggeredPowerHistoryInfo [
                                             *         {"$":{"effectIndex":"0","showInHistory":"False"}},
                                             *         {"$":{"effectIndex":"1","showInHistory":"False"}}
                                             *     ]
                                             *
                                             *
                                             * Example on temporaryObject:
                                             *
                                             *     {
                                             *         "TriggeredPowerHistoryInfo": [
                                             *             {"effectIndex": 0, "showInHistory": false},
                                             *             {"effectIndex": 1, "showInHistory": false}
                                             *         ]
                                             *     }
                                             */
                                            // temporaryObject[propery].
                                            break;

                                        case 'EntourageCard':
                                            /*
                                             * Type: array of objects
                                             *
                                             * Raw data:
                                             *
                                             *     EntourageCard [{"$":{"cardID":"NEW1_032"}},{"$":{"cardID":"NEW1_033"}},{"$":{"cardID":"NEW1_034"}}]
                                             *
                                             *
                                             * Example on temporaryObject:
                                             *
                                             *     {
                                             *         "EntourageCard": [
                                             *             {"cardID": "NEW1_032"},
                                             *             {"cardID": "NEW1_033"},
                                             *             {"cardID": "NEW1_034"}
                                             *     }
                                             */
                                            // temporaryObject[property].
                                            break;

                                        default:
                                            console.log('NEW PROPERTY FOUND! - %s', property, JSON.stringify(entity[property]));
                                            processError = true;
                                    }
                                    break;

                                default:
                                    temporaryObject[property] = item;
                            }
                        });
                    } else {
                        temporaryObject[property] = entity[property];
                    }
                }




                /*
                 * See http://stackoverflow.com/questions/728360/most-elegant-way-to-clone-a-javascript-object
                 * for more details on what this is doing.  I choose to go with
                 * the following solution since I know that I do not have any
                 * functions in temporaryObject.
                 */
                json.cards.push(JSON.parse(JSON.stringify(temporaryObject)));
            });

            callback(readError || parseError || processError, json);
        });

    });
}




doit(function (error, data) {
    if (!error) {
        console.log(JSON.stringify(data));
    } else {
        console.log('Error: %j', error);
    }
});
