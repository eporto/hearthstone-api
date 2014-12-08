'use strict';

var util = require('util'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    cardData = require('./json/enUS').cards,
    cardSchema,
    Card,
    username = process.env.MONGODB_USERNAME,
    password = process.env.MONGODB_PASSWORD,
    host = process.env.MONGODB_HOST,
    port = process.env.MONGODB_PORT,
    database = process.env.MONGODB_DATABASE;


if (!username || !password || !host || !port || !database) {
    console.error('Environment not configured.');
    process.exit(1);
}


mongoose.connect(util.format('mongodb://%s:%s@%s:%s/%s', username, password, host, port, database));


cardSchema = new Schema({
    version: Number,
    CardID: String,
    Tag: {
        CardName: String,
        CardSet: Number,
        CardType: Number,
        Faction: Number,
        Rarity: Number,
        Cost: Number,
        Atk: Number,
        Health: Number,
        AttackVisualType: Number,
        CardTextInHand: String,
        DevState: Number,
        Collectible: Boolean,
        EnchantmentBirthVisual: Number,
        EnchantmentIdleVisual: Number,
        ArtistName: String,
        HowToGetThisGoldCard: String,
        FlavorText: String,
        Taunt: Boolean
    }
});


Card = mongoose.model('Card', cardSchema);


function fillDatastore(callback) {
    cardData.forEach(function (item) {
        var card = new Card({
                version: item.version,
                CardID: item.CardID,
                Tag: {
                    CardName:               item.Tag.CardName,
                    CardSet:                item.Tag.CardSet,
                    CardType:               item.Tag.CardType,
                    Faction:                item.Tag.Faction,
                    Rarity:                 item.Tag.Rarity,
                    Cost:                   item.Tag.Cost,
                    Atk:                    item.Tag.Atk,
                    Health:                 item.Tag.Health,
                    AttackVisualType:       item.Tag.AttackVisualType,
                    CardTextInHand:         item.Tag.CardTextInHand,
                    DevState:               item.Tag.DevState,
                    Collectible:            item.Tag.Collectible,
                    EnchantmentBirthVisual: item.Tag.EnchantmentBirthVisual,
                    EnchantmentIdleVisual:  item.Tag.EnchantmentIdleVisual,
                    ArtistName:             item.Tag.ArtistName,
                    HowToGetThisGoldCard:   item.Tag.HowToGetThisGoldCard,
                    FlavorText:             item.Tag.FlavorText,
                    Taunt:                  item.Tag.Taunt
                }
            });

        card.save(function (error) {
            if (error) {
                console.log(error);
                process.exit(1);
            }
        });
    });

    callback();
}




fillDatastore(function () {
    console.log('Done, you can probably hit ctrl-c by the time you have read this.');

    /*
     * This is not implemented correctly.  This will close the connection before
     * all the records are saved to the datastore.  TODO: fix this
     */
    // mongoose.connection.close();
});
