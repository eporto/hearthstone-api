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


            function processEntity(entity) {


                function processProperty(item) {
                    /*
                     * STEP 4: Process the complex properties.  This is going to
                     * be drastically refactored so avoid the mirrored switch
                     * statements that current exist in processEntity and in
                     * processProperty.
                     *
                     * Each known case ends with data being added onto
                     * temporaryObject.
                     */
                    switch (property) {
                        case 'Tag':
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

                        case 'MasterPower':
                            /*
                             * Type: string - Yeah, I know, looks like an array right?  typeof item returns 'string' though.
                             *
                             * Raw Data:
                             *
                             *     MasterPower ["6c5c7b20-6aa1-44d5-9ab2-fcf6755877dc"]
                             *
                             * Example on temporaryObject:
                             *
                             *     {
                             *         "MasterPower": "6c5c7b20-6aa1-44d5-9ab2-fcf6755877dc"
                             *     }
                             */
                            temporaryObject[property] = item;
                            break;

                        default:
                            console.log('NEW PROPERTY FOUND! - %s', property, JSON.stringify(entity[property]));
                            processError = true;
                    }
                }


                /*
                 * Apparently a function can not be between a var declaration
                 * and a for..in loop without causing a JSHint error saying that
                 * the variable in the for..in is not declared and will be
                 * global.  See JSHint error W088 for more details.  To get
                 * around this, the var declaration block is moved below the
                 * function declaration.  This goes against the concept of
                 * always having the var declaration as the first block in a
                 * function, but at least it does not throw a JSHint error
                 * anymore.
                 *
                 * Yes, I tried several other variations, but they all resulted
                 * in other JSHint errors.
                 */
                var temporaryObject = {},
                    property;


                /* STEP 2: Loop over each property of the card (entity) */
                for (property in entity) {
                    temporaryObject[property] = {};

                    switch (property) {
                        /*
                         * STEP 3: If a known property is complex, process
                         * it separatley.
                         */
                        case 'Tag':
                        case 'Power':
                        case 'ReferencedTag':
                        case 'TriggeredPowerHistoryInfo':
                        case 'EntourageCard':
                        case 'MasterPower':
                            entity[property].forEach(processProperty);
                            break;

                        /*
                         * STEP 3: If a known property is not complext, just
                         * add it to the temporaryObject as is.
                         */
                        case '$':
                            /*
                             * TODO: pull the items off $ and add them directly
                             * to temporaryObject
                             */
                            temporaryObject[property] = entity[property];
                            break;

                        /*
                         * STEP 3: If the property is unknown, alert that a new
                         * property has been found that needs to be supported.
                         */
                        default:
                            console.log('NEW PROPERTY FOUND! - %s', property, JSON.stringify(entity[property]));
                            processError = true;
                    }
                }


                /*
                 * STEP 4/5 (depending on what path was executed): push the
                 * temporaryObject onto the json.cards array.
                 *
                 * See http://stackoverflow.com/questions/728360/most-elegant-way-to-clone-a-javascript-object
                 * for more details on what this is doing.  I choose to go with
                 * the following solution since I know that I do not have any
                 * functions in temporaryObject.
                 */
                json.cards.push(JSON.parse(JSON.stringify(temporaryObject)));
            }


            /* STEP 1: Loop over each card, aka entity */
            result.CardDefs.Entity.forEach(processEntity);


            /* STEP 5/6 (depending on what path was exectued):  Call the
             * callback, which will either act on the error, or the generated
             * json object.
             */
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
