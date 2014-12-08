'use strict';

var util = require('util'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    db = mongoose.connection,
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

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function callback() {

    cardSchema = new Schema({
        version: Number,
        CardID: String,
        Tag: {
            Health: Number,
            Atk: Number,
            Cost: Number,
            CardSet: Number,
            Durability: Number,
            Class: Number,
            Race: Number,
            Faction: Number,
            CardType: Number,
            Rarity: Number,
            Recall: Number,
            AttackVisualType: Number,
            DevState: Number,
            EnchantmentBirthVisual: Number,
            EnchantmentIdleVisual: Number,

            TriggerVisual: Boolean,
            Elite: Boolean,
            Windfury: Boolean,
            Taunt: Boolean,
            Stealth: Boolean,
            Spellpower: Boolean,
            'Divine Shield': Boolean,
            Charge: Boolean,
            Summoned: Boolean,
            Freeze: Boolean,
            Enrage: Boolean,
            Deathrattle: Boolean,
            Battlecry: Boolean,
            Secret: Boolean,
            Combo: Boolean,
            Morph: Boolean,
            Collectible: Boolean,
            InvisibleDeathrattle: Boolean,
            OneTurnEffect: Boolean,
            Silence: Boolean,
            ImmuneToSpellpower: Boolean,
            AdjacentBuff: Boolean,
            GrantCharge: Boolean,
            HealTarget: Boolean,
            Aura: Boolean,
            Poisonous: Boolean,
            AIMustPlay: Boolean,
            AffectedBySpellPower: Boolean,

            CardTextInHand: String,
            CardName: String,
            CardTextInPlay: String,
            TargetingArrowText: String,
            ArtistName: String,
            FlavorText: String,
            HowToGetThisCard: String,
            HowToGetThisGoldCard: String,

            /* New enumIDs found in Hearthstone-2.x */

            unknown377: Number,
            unknown389: Number
        }
    });

    Card = mongoose.model('Card', cardSchema);

    Card.find({CardID: /^GVG/}, function (error, cards) {
        if (error) {
            console.error('Error: ', error);
        }

        cards.forEach(function (card) {
            console.log(card.CardID, card.Tag.CardName);
        });
    });
});
