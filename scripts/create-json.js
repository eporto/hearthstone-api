'use strict';

var fs = require('fs'),
    xml2js = require('xml2js'),
    language = process.argv[2] || 'enUS';


function doit(language, callback) {
    fs.readFile(__dirname + '/../xml/' + language + '.xml', function (readError, xml) {
        var parser = new xml2js.Parser();

        parser.parseString(xml, function (parseError, result) {
            var json = {},
                temporaryObject,
                processError = false;

            json.cards = [];




            function processDollar(dollar) {
                var knownProperties = ['version', 'CardID'];

                Object.getOwnPropertyNames(dollar).forEach(function (key) {
                    if (knownProperties.indexOf(key) === -1) {
                        console.log('NEW DOLLAR ($) PROPERTY FOUND! = %s', JSON.stringify(dollar));
                        processError = true;
                    }

                    if (key === 'version') {
                        temporaryObject[key] = +dollar[key];
                    } else {
                        temporaryObject[key] = dollar[key];
                    }
                });
            }




            function processEntourageCard(entourageCards) {
                temporaryObject.EntourageCard = [];

                entourageCards.forEach(function (entourageCard) {
                    temporaryObject.EntourageCard.push({cardID: entourageCard.$.cardID});
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

                var knownProperties = ['$', 'PlayRequirement'];

                temporaryObject.Power = [];

                powers.forEach(function (power) {
                    var temporaryPowerObject = {},
                        key;

                    for (key in power) {
                        if (knownProperties.indexOf(key) === -1) {
                            console.log('NEW POWER PROPERTY FOUND! - %s', JSON.stringify(power));
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




            function processTag(tags) {
                /*
                 * Type: Array of Objects
                 *
                 * With Hearthstone-2.x, the xml format changed to not include
                 * a "name" and to only define the "type" if it is a String.
                 * Now everything is based on enumIDs, which luckily did exist
                 * before.  Without the previous version this would be next to
                 * impossible to determine what each enumID is specifically for.
                 *
                 * Here is a mapping of the old types and names to the enumIDs.
                 *
                 * This details below were generated by running the following
                 * command against the raw JSON conversion of the
                 * Hearthstone-1.x card xml file, which I happened to have
                 * generated on the update prior to Hearthstone-2.x being
                 * released.
                 *
                 *     node create-json.js | jq -c '.CardDefs.Entity[].Tag[] | {enumId: .["$"].enumID, name: .["$"].name, type: .["$"].type}' | sort | uniq
                 */
                var knownTypes = ['String', ''],
                    nameMapper = {};

                /*        enumID   v1 Name                     v1 Type                   Values */
                /*        ------   --------------------------  ------------------------  ---------------------------- */
                nameMapper['45'] = 'Health';                   /* Number */
                nameMapper['47'] = 'Atk';                      /* Number */
                nameMapper['48'] = 'Cost';                     /* Number */
                nameMapper['183'] = 'CardSet';                 /* CardSet                2-5, 7-8, 11-13, 16 */
                nameMapper['187'] = 'Durability';              /* Number */
                nameMapper['199'] = 'Class';                   /* Class                  0, 2-11 */
                nameMapper['200'] = 'Race';                    /* Race                   14-15, 17, 20-21, 23-24 */
                nameMapper['201'] = 'Faction';                 /* Faction                1-3 */
                nameMapper['202'] = 'CardType';                /* CardType               3-7, 10 */
                nameMapper['203'] = 'Rarity';                  /* Rarity                 0-5 */
                nameMapper['215'] = 'Recall';                  /* Number                 1 */
                nameMapper['251'] = 'AttackVisualType';        /* AttackVisualType       1-9 */
                nameMapper['268'] = 'DevState';                /* DevState               2 */
                nameMapper['330'] = 'EnchantmentBirthVisual';  /* EnchantmentVisualType  0-3 */
                nameMapper['331'] = 'EnchantmentIdleVisual';   /* EnchantmentVisualType  0-3 */

                nameMapper['32'] = 'TriggerVisual';            /* Bool                   0 FALSE / 1 TRUE - always */
                nameMapper['114'] = 'Elite';                   /* Bool                   0 FALSE / 1 TRUE */
                nameMapper['189'] = 'Windfury';                /* Bool                   0 FALSE / 1 TRUE - always 1 */
                nameMapper['190'] = 'Taunt';                   /* Bool                   0 FALSE / 1 TRUE - always 1 */
                nameMapper['191'] = 'Stealth';                 /* Bool                   0 FALSE / 1 TRUE - always 1 */
                nameMapper['192'] = 'Spellpower';              /* Bool                   0 FALSE / 1 TRUE - always 1 */
                nameMapper['194'] = 'Divine Shield';           /* Bool                   0 FALSE / 1 TRUE - always 1 */
                nameMapper['197'] = 'Charge';                  /* Bool                   0 FALSE / 1 TRUE - always 1 */
                nameMapper['205'] = 'Summoned';                /* Bool                   0 FALSE / 1 TRUE - always 1 */
                nameMapper['208'] = 'Freeze';                  /* Bool                   0 FALSE / 1 TRUE - always 1 */
                nameMapper['212'] = 'Enrage';                  /* Bool                   0 FALSE / 1 TRUE - always 1 */
                nameMapper['217'] = 'Deathrattle';             /* Bool                   0 FALSE / 1 TRUE - always 1 */
                nameMapper['218'] = 'Battlecry';               /* Bool                   0 FALSE / 1 TRUE - always 1 */
                nameMapper['219'] = 'Secret';                  /* Bool                   0 FALSE / 1 TRUE - always 1 */
                nameMapper['220'] = 'Combo';                   /* Bool                   0 FALSE / 1 TRUE - always 1 */
                nameMapper['293'] = 'Morph';                   /* Bool                   0 FALSE / 1 TRUE - always 1 */
                nameMapper['321'] = 'Collectible';             /* Bool                   0 FALSE / 1 TRUE */
                nameMapper['335'] = 'InvisibleDeathrattle';    /* Bool                   0 FALSE / 1 TRUE - always 1 */
                nameMapper['338'] = 'OneTurnEffect';           /* Bool                   0 FALSE / 1 TRUE - always 1 */
                nameMapper['339'] = 'Silence';                 /* Bool                   0 FALSE / 1 TRUE - always 1 */
                nameMapper['349'] = 'ImmuneToSpellpower';      /* Bool                   0 FALSE / 1 TRUE - always 1 */
                nameMapper['350'] = 'AdjacentBuff';            /* Bool                   0 FALSE / 1 TRUE - always 1 */
                nameMapper['355'] = 'GrantCharge';             /* Bool                   0 FALSE / 1 TRUE - Not used in Hearthstone-2.x */
                nameMapper['361'] = 'HealTarget';              /* Bool                   0 FALSE / 1 TRUE - always 1 */
                nameMapper['362'] = 'Aura';                    /* Bool                   0 FALSE / 1 TRUE - always 1 */
                nameMapper['363'] = 'Poisonous';               /* Bool                   0 FALSE / 1 TRUE - always 1 */
                nameMapper['367'] = 'AIMustPlay';              /* Bool                   0 FALSE / 1 TRUE - always 1 */
                nameMapper['370'] = 'AffectedBySpellPower';    /* Bool                   0 FALSE / 1 TRUE - always 1 */

                nameMapper['184'] = 'CardTextInHand';          /* String */
                nameMapper['185'] = 'CardName';                /* String */
                nameMapper['252'] = 'CardTextInPlay';          /* String */
                nameMapper['325'] = 'TargetingArrowText';      /* String */
                nameMapper['342'] = 'ArtistName';              /* String */
                nameMapper['351'] = 'FlavorText';              /* String */
                nameMapper['364'] = 'HowToGetThisCard';        /* String */
                nameMapper['365'] = 'HowToGetThisGoldCard';    /* String */

                /* New enumIDs found in Hearthstone-2.x */

                nameMapper['377'] = 'unknown377';  /* Found on Flame Leviathan and Burrowing Mine  1 - probably a Bool */
                nameMapper['389'] = 'unknown389';  /* Found on Dunemaul Shaman                     1 - probably a Bool */
                nameMapper['380'] = 'unknown380';  /* added in 2.4.0.8311               values range from 2314 to 2592 */
                nameMapper['401'] = 'unknown401';  /* added in 2.4.0.8311                          1 - probably a Bool */
                nameMapper['402'] = 'unknown402';  /* added in 2.4.0.8311                          1 - probabyy a Bool */

                temporaryObject.Tag = {};

                tags.forEach(function (tag) {
                    if (knownTypes.indexOf(tag.$.type) === -1) {
                        console.log('NEW TYPE FOUND! - %s', JSON.stringify(tag));
                        processError = true;
                    }

                    switch (tag.$.enumID) {
                        /*
                         * Unknowns
                         * These are new enumIDs that have been added since
                         * Hearthstone-1.x, so at this point I do not know what
                         * field they map to.  Will treat them as a generic
                         * number until a reason is found not to.
                         */
                        case '377':
                        case '380':  /* added in 2.4.0.8311 */
                        case '389':
                        case '401':  /* added in 2.4.0.8311 */
                        case '402':  /* added in 2.4.0.8311 */

                        /* Numbers */
                        case '45':   /* Health */
                        case '47':   /* Atk */
                        case '48':   /* Cost */
                        case '183':  /* CardSet */
                        case '187':  /* Durability */
                        case '199':  /* Class */
                        case '200':  /* Race */
                        case '201':  /* Faction */
                        case '202':  /* CardType */
                        case '203':  /* Rarity */
                        case '215':  /* Recall */
                        case '251':  /* AttackVisualType */
                        case '268':  /* DevState */
                        case '330':  /* EnchantmentBirthVisual */
                        case '331':  /* EnchantmentIdleVisual */
                            /*
                             * Values: Any Number
                             * The value will be parsed as a Number
                             */
                            temporaryObject.Tag[nameMapper[tag.$.enumID]] = +tag.$.value;
                            break;

                        /* Bools */
                        case '32':   /* TriggerVisual */
                        case '114':  /* Elite */
                        case '189':  /* Windfury */
                        case '190':  /* Taunt */
                        case '191':  /* Stealth */
                        case '192':  /* Spellpower */
                        case '194':  /* Divine Shield */
                        case '197':  /* Charge */
                        case '205':  /* Summoned */
                        case '208':  /* Freeze */
                        case '212':  /* Enrage */
                        case '217':  /* Deathrattle */
                        case '218':  /* Battlecry */
                        case '219':  /* Secret */
                        case '220':  /* Combo */
                        case '293':  /* Morph */
                        case '321':  /* Collectible */
                        case '335':  /* InvisibleDeathrattle */
                        case '338':  /* OneTurnEffect */
                        case '339':  /* Silence */
                        case '349':  /* ImmuneToSpellpower */
                        case '350':  /* AdjacentBuff */
                        case '355':  /* GrantCharge - DEPRECATED since 1.x */
                        case '361':  /* HealTarget */
                        case '362':  /* Aura */
                        case '363':  /* Poisonous */
                        case '367':  /* AIMustPlay */
                        case '370':  /* AffectedBySpellPower */
                            /*
                             * Values: 0-1
                             * The value will be parsed as a Bool
                             * 0 is FALSE
                             * 1 is TRUE
                             */
                            temporaryObject.Tag[nameMapper[tag.$.enumID]] = tag.$.value ? true : false;
                            break;

                        /* Strings */
                        case '184':  /* CardTextInHand */
                        case '185':  /* CardName */
                        case '252':  /* CardTextInPlay */
                        case '325':  /* TargetingArrowText */
                        case '342':  /* ArtistName */
                        case '351':  /* FlavorText */
                        case '364':  /* HowToGetThisCard */
                        case '365':  /* HowToGetThisGoldCard */
                            /*
                             * Values: String
                             * The value will be parsed as a String
                             */
                            temporaryObject.Tag[nameMapper[tag.$.enumID]] = tag._;
                            break;

                        default:
                            console.log('NEW ENUM ID FOUND! - %s', JSON.stringify(tag));
                            processError = true;
                    }
                });
            }




            function processEntity(entity) {
                /* make sure we are working with a clean object */
                temporaryObject = {};

                Object.getOwnPropertyNames(entity).forEach(function (property) {
                    switch (property) {
                        case '$':
                            processDollar(entity[property]);
                            break;

                        case 'EntourageCard':
                            processEntourageCard(entity[property]);
                            break;

                        case 'MasterPower':
                            temporaryObject[property] = entity[property];
                            break;

                        case 'Power':
                            processPower(entity[property]);
                            break;

                        case 'Tag':
                            processTag(entity[property]);
                            break;

                        case 'ReferencedTag':
                        case 'TriggeredPowerHistoryInfo':
                            break;

                        default:
                            console.log('NEW PROPERTY FOUND! - %s', property, JSON.stringify(entity[property]));
                            processError = true;
                    }
                });


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




doit(language, function (error, data) {
    if (!error) {
        console.log(JSON.stringify(data));
    } else {
        console.log('Error: %j', error);
    }
});
