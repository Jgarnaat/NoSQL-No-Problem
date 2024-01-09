const { Thought, User } = require('../models');

const thoughtController = {
    getAllTHoughts(req,res) {
        Thought.find({})
        .populate({
            path: 'reactions',
            select: '-__v'
        })
        .select('-__v')
        .sort({_id:-1})
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err=>{
            console.log(err);
            res.sendStatus(400);
        });
    },

    getThoughtById({params},res){
        Thought.findOne({ _id: params.id})
        .populate({
            path: 'reactions',
            select: '-__v'
        })
        .select('-__v')
        .sort({_id:-1})
        .then(dbThoughtData => {
            if(!dbThoughtData) {
                res.status(404).json({message: 'Sorry, no user with that id found!'});
                return
            }
            res.json(dbThoughtData);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    createThought({body},res) {
        Thought.create(body)
        .then(({_id}) => {
            return User.findOneAndUpdate(
                    {_id:body.userId},
                    {$push: {thoughts: _id}},
                    {new:true}
                
            );
        })
        .then(dbThoughtData => {
            if(!dbThoughtData) {
                res.status(404).json({message: 'Sorry, no user with that id found!'});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    updateThought({params,body}, res) {
        Thought.findOneAndUpdate({_id:params.id},body, {
            new:true,
            runValidators:true,
        })
        .then((dbThoughtData) => {
            if(!dbThoughtData) {
                res.status(404).json({message: 'Sorry, no thought with that id was found'});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    deleteThought({params}, res) {
        Thought.findOneAndDelete({_id:params.id})
        .then(dbThoughtData => {
            if(!dbThoughtData){
                res.status(404).json({message: 'Sorry, no thought with that id was found!'});
                return;
            }
            return User.findOneAndUpdate(
                {_id:params.userId},
                {$pull: {thoughts:params.id}},
                {new:true}
            )
        })
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({message: 'Sorry, no user with that id was found!'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(400)
        })
    },

    createReaction({params}, res){
        Thought.findOneAndUpdate(
            {_id:params.thoughtId},
            {$push:{reactions:body}},
            {new:true, runValidators:true}
        )
        .populate({path:'reactions',select:'-__v'})
        .select('-__v')
        .then(dbThoughtData => {
            if(!dbThoughtData) {
                res.status(404).json({message: 'Sorry, no thoughts with that id was found!'});
            }
            res.json(dbThoughtData) 
        })
        .catch(err => res.status(400).json(err))
    },

    deleteReaction({params}, res){
        Thought.findOneAndUpdate(
            {_id:params.thoughtId},
            {$pull: {reactions: {reactionId:params.reactionId}}},
            {new:true}
        )
        .then(dbThoughtData => {
            if(!dbThoughtData) {
                res.status(404).json({message:'Sorry no thought with that id was found'})
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    }
};

module.exports = thoughtController;
