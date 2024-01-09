const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');
const { time } = require('console');

const ReactionSchema = new Schema({
    reactionID: {
        type:Schema.Types.ObjectId,
        default: () => new Types.ObjectId(),
    },
    reactionBody: {
        type:String,
        required:true,
        maxlength: 280,
    },
    username: {
        type:String,
        required:true,
    },
    createdAt: {
        type:Date,
        default: Date.now,
        get:(timestamp) => dateFormat(timestamp),
    },
},
    {
        toJSON:{
            getters:true,
        },
        id:false,
    }
    );

    const ThoughtSchema = new Schema({
        thoughtText: {
            type:String,
            required: true,
            minlength: 1,
            maxlength: 280,
        },
        createdAt: {
            type:Date,
            default: Date.now,
            get:(timestamp) => dateFormat(timestamp),
        },
        username: {
            type:String,
            required:true,
        },
        reactions:[ReactionSchema],
    },
    {
        toJSON:{
            virtuals:true,
            getters:true,
        },
        id:false,
    }
    );

    ThoughtSchema.virtuals('reactionCount'),get(function() {
        return this.reactions.length;
    });

    const Thought = model('Thought', ThoughtSchema);

    module.export = Thought;