'use strict';

var fs = require('fs'),
    xml2js = require('xml2js');




function doit(callback) {
    fs.readFile(__dirname + '/xml/enUS.xml', function (readError, xml) {
        var parser = new xml2js.Parser();

        parser.parseString(xml, function (parseError, result) {
            var json = {},
                temporaryObject,
                processError = false;

            json.cards = [];




            function processTag(tags) {
                /*
                 * Type: Array of Objects
                 *
                 * Example Raw data:
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
                 */

                /*
                 * knownTags is only needed to notify that new tags exist.
                 * There is no functional need to do this outside of
                 * notification purproses.
                 */
                var knownTags = [
                        'AdjacentBuff', 'AffectedBySpellPower', 'AIMustPlay', 'ArtistName',
                        'Atk', 'AttackVisualType', 'Aura', 'Battlecry', 'CardName', 'CardSet',
                        'CardTextInHand', 'CardTextInPlay', 'CardType', 'Charge', 'Class',
                        'Collectible', 'Combo', 'Cost', 'Deathrattle', 'DevState', 'Divine Shield',
                        'Durability', 'Elite', 'EnchantmentBirthVisual', 'EnchantmentIdleVisual',
                        'Enrage', 'Faction', 'FlavorText', 'Freeze', 'GrantCharge', 'HealTarget',
                        'Health', 'HowToGetThisCard', 'HowToGetThisGoldCard', 'ImmuneToSpellpower',
                        'InvisibleDeathrattle', 'Morph', 'OneTurnEffect', 'Poisonous', 'Race',
                        'Rarity', 'Recall', 'Secret', 'Silence', 'Spellpower', 'Stealth', 'Summoned',
                        'TargetingArrowText', 'Taunt', 'TriggerVisual', 'Windfury'
                    ];

                temporaryObject.Tag = {};

                tags.forEach(function (tag) {
                    if (knownTags.indexOf(tag.$.name) === -1) {
                        console.log('NEW TAG FOUND! - %s %s', tag.$.name, JSON.stringify(tag));
                        processError = true;
                    }

                    switch (tag.$.type || tag._.type) {
                        case 'AttackVisualType':
                            /*
                             * {"$":{"name":"AttackVisualType","enumID":"251","type":"AttackVisualType","value":"9"}}
                             *
                             * Values: 1-9
                             * The value will be parsed as a Number
                             */

                        case 'CardSet':
                            /*
                             * {"$":{"name":"CardSet","enumID":"183","type":"CardSet","value":"16"}}
                             *
                             * Values: 2-5, 7-8, 11-12, 16
                             * The value will be parsed as a Number
                             */

                        case 'CardType':
                            /*
                             * {"$":{"name":"CardType","enumID":"202","type":"CardType","value":"10"}}
                             *
                             * Values: 3-7, 10
                             * The value will be parsed as a Number
                             */

                        case 'Class':
                            /*
                             * {"$":{"name":"Class","enumID":"199","type":"Class","value":"11"}}
                             *
                             * Values: 0, 2-11
                             * The value will be parsed as a Number
                             */

                        case 'DevState':
                            /*
                             * {"$":{"name":"DevState","enumID":"268","type":"DevState","value":"2"}}
                             *
                             * Values: 2
                             * The value will be parsed as a Number
                             */

                        case 'EnchantmentVisualType':
                            /*
                             * {"$":{"name":"EnchantmentBirthVisual","enumID":"330","type":"EnchantmentVisualType","value":"3"}}
                             *
                             * Values: 0-3
                             * The value will be parsed as a Number
                             */

                        case 'Faction':
                            /*
                             * {"$":{"name":"Faction","enumID":"201","type":"Faction","value":"3"}}
                             *
                             * Values: 1-3
                             * The value will be parsed as a Number
                             */

                        case 'Race':
                            /*
                             * {"$":{"name":"Race","enumID":"200","type":"Race","value":"24"}}
                             *
                             * Values: 14-15, 20-21, 23-24
                             * The value will be parsed as a Number
                             */

                        case 'Rarity':
                            /*
                             * {"$":{"name":"Rarity","enumID":"203","type":"Rarity","value":"5"}}
                             *
                             * Values: 0-5
                             * The value will be parsed as a Number
                             */

                        case 'Number':
                            /*
                             * {"$":{"name":"Health","enumID":"45","type":"Number","value":"99"}}
                             *
                             * Values: Number
                             * The value will be parsed as a Number
                             */
                            temporaryObject.Tag[tag.$.name] = +tag.$.value;
                            break;

                        case 'Bool':
                            /*
                             * {"$":{"name":"AIMustPlay","enumID":"367","type":"Bool","value":"1"}}
                             *
                             * Values: 0-1
                             * The value will be parsed as a Bool
                             * 0 is FALSE
                             * 1 is TRUE
                             */
                            temporaryObject.Tag[tag.$.name] = tag.$.value ? true : false;
                            break;

                        case 'String':
                            /*
                             * {"_":"blaarghghLLGHRHARAAHAHHH!!","$":{"name":"FlavorText","enumID":"351","type":"String"}}
                             *
                             * Values: String
                             * The value will be parsed as a String
                             */
                            temporaryObject.Tag[tag.$.name] = tag._;
                            break;

                        default:
                            console.log('NEW TAG TYPE FOUND! - %s %s', tag.$.type || tag._.type, JSON.stringify(tag));
                            processError = true;
                    }
                });
            }




            function processPower(powers) {
                /*
                 * Type: Array of Object
                 *
                 * Example Raw data:
                 *
                 *     Power [
                 *         {
                 *             "$": {"definition": "abd20d6f-3dd8-43b8-91c9-122229719018"},
                 *             "PlayRequirement": [
                 *                 {"$":{"reqID":"11","param":""}},
                 *                 {"$":{"reqID":"1","param":""}}
                 *             ]
                 *         }
                 *     ]
                 */

                /*
                 * knownProperties is only needed to notify that new properties
                 * exist.  There is no functional need to do this outside of
                 * notification purproses.  This is not comprehensive either.
                 */
                var knownProperties = ['$', 'PlayRequirement'];

                temporaryObject.Power = [];

                powers.forEach(function (power) {
                    var temporaryPowerObject = {},
                        key;

                    for (key in power) {
                        if (knownProperties.indexOf(key) === -1) {
                            console.log('NEW POWER PROPERTY FOUND! - %s %s', key, JSON.stringify(power));
                            processError = true;
                        }
                    }

                    temporaryPowerObject.definition = power.$.definition;

                    if (Array.isArray(power.PlayRequirement)) {
                        temporaryPowerObject.PlayRequirement = [];

                        power.PlayRequirement.forEach(function (playRequirement) {
                            temporaryPowerObject.PlayRequirement.push({
                                reqID: +playRequirement.$.reqID,
                                param: parseInt(playRequirement.$.param, 10)
                            });
                        });
                    }

                    temporaryObject.Power.push(temporaryPowerObject);
                });
            }




            function processDollar(dollar) {
                var knownProperties = ['version', 'CardID'],
                    key;

                for (key in dollar) {
                    if (knownProperties.indexOf(key) === -1) {
                        console.log('NEW DOLLAR ($) PROPERTY FOUND! = %s %s', key, JSON.stringify(dollar));
                        processError = true;
                    }

                    if (key === 'version') {
                        temporaryObject[key] = +dollar[key];
                    } else {
                        temporaryObject[key] = dollar[key];
                    }
                }
            }




            function processEntity(entity) {
                var property;

                /* make sure we are working with a clean object */
                temporaryObject = {};

                for (property in entity) {
                    switch (property) {
                        case 'Tag':
                            processTag(entity[property]);
                            break;

                        case 'Power':
                            processPower(entity[property]);
                            break;

                        case 'ReferencedTag':
                        case 'TriggeredPowerHistoryInfo':
                        case 'EntourageCard':
                            break;

                        case 'MasterPower':
                            temporaryObject[property] = entity[property];
                            break;

                        case '$':
                            processDollar(entity[property]);
                            break;

                        default:
                            console.log('NEW PROPERTY FOUND! - %s', property, JSON.stringify(entity[property]));
                            processError = true;
                    }
                }


                /*
                 * See http://stackoverflow.com/questions/728360/most-elegant-way-to-clone-a-javascript-object
                 * for more details on what this is doing.  I choose to go with
                 * the following solution since I know that I do not have any
                 * functions in temporaryObject.
                 */
                json.cards.push(JSON.parse(JSON.stringify(temporaryObject)));
            }


            result.CardDefs.Entity.forEach(processEntity);


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










// function processProperty(item) {
//     switch (property) {
//         case 'ReferencedTag':
//             /*
//              * Type: array of objects
//              *
//              * Raw data:
//              *
//              *     ReferencedTag [
//              *         {"$":{"name":"Taunt","enumID":"190","type":"Bool","value":"1"}},
//              *         {"$":{"name":"Charge","enumID":"197","type":"Bool","value":"1"}}
//              *     ]
//              *
//              * This one has an unfortunate name :/
//              *
//              *     ReferencedTag [
//              *         {"$":{"name":"Cant Be Damaged","enumID":"240","type":"Bool","value":"1"}}
//              *     ]
//              *
//              *
//              * Example on temporaryObject:
//              *
//              *     {
//              *         "ReferencedTag": {
//              *             "Taunt": true,           <-- This is a Boolean since the `type` is `Bool`
//              *             "Charge": true
//              *         }
//              *     }
//              *
//              *
//              * Alternate proposal: TODO: I don't remember if properties can start with a number, google this
//              *
//              *     {
//              *         "ReferencedTag": {
//              *             "240": {"name": "Cant Be Damaged", "value": true}
//              *         }
//              *     }
//              *
//              *     {
//              *         "ReferencedTag": {
//              *             "190": {"name": "Taunt", "value": true},
//              *             "197": {"name": "Charge", "value": true}
//              *         }
//              *     }
//              */
//             // temporaryObject[property].
//             break;
//
//         case 'TriggeredPowerHistoryInfo':
//             /*
//              * Type: array of objects
//              *
//              * Raw data:
//              *
//              *     TriggeredPowerHistoryInfo [
//              *         {"$":{"effectIndex":"0","showInHistory":"False"}},
//              *         {"$":{"effectIndex":"1","showInHistory":"False"}}
//              *     ]
//              *
//              *
//              * Example on temporaryObject:
//              *
//              *     {
//              *         "TriggeredPowerHistoryInfo": [
//              *             {"effectIndex": 0, "showInHistory": false},
//              *             {"effectIndex": 1, "showInHistory": false}
//              *         ]
//              *     }
//              */
//             // temporaryObject[propery].
//             break;
//
//         case 'EntourageCard':
//             /*
//              * Type: array of objects
//              *
//              * Raw data:
//              *
//              *     EntourageCard [{"$":{"cardID":"NEW1_032"}},{"$":{"cardID":"NEW1_033"}},{"$":{"cardID":"NEW1_034"}}]
//              *
//              *
//              * Example on temporaryObject:
//              *
//              *     {
//              *         "EntourageCard": [
//              *             {"cardID": "NEW1_032"},
//              *             {"cardID": "NEW1_033"},
//              *             {"cardID": "NEW1_034"}
//              *     }
//              */
//             // temporaryObject[property].
//             break;
//     }
// }
