const {Schema, model} = require('mongoose');

const UserSchema = new Schema(
    {
        username: {
            type:String,
            unique:true,
            trim:true,
            required: true,
        },
        email:{
            type:String,
            unique:true,
            required:true,
            match:[/.+@.+\..+/],
        },
        thoughts: [
            {
                type: Schema.types.ObjectId,
                ref:'Thought',
            },
        ],
        friends: [
            {
                type:Schema.Types.ObjectId,
                ref:'User'
            },
        ],
    },
    {
        toJSON: {
            virtuals: true,
        },
        id:false,
    }
);

UserSchema.virtual('friendCount').get(function() {
    return this.friend.length;
});

module.exports = User;