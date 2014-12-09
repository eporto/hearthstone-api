'use strict';

var mongoose = require('mongoose'),
    schema = {};


schema = mongoose.Schema({
    version: Number,
    CardID: String,
    Tag: {
        /* Numbers */
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

        /* Booleans */
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

        /* Strings */
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


module.exports = mongoose.model('cards', schema);
