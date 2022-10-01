const { Thought, User } = require("../models");
const thought404Message = (id) => `Thought with ID: ${id} not found!`
const thought200Message = (id) => `Thought with ID: ${id} has been deleted!`
const reaction200Message = (id) => `Reaction with ID: ${id} has been deleted!`


const thoughtController = {

    // get all thoughts
    getAllThought(req, res) {
        Thought.find({})
        .populate({ path: "reactions", select: "-__v" })
        .select("-__v")
        .sort({ _id: -1 })
        .then((dbThoughtData) => res.json(dbThoughtData))
        .catch(err =>  res.sendStatus(500).json(err))
    },

    // get thought by id
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
        .populate({ path: "reactions", select: "-__v" })
        .select("-__v")
        .then(dbThoughtData => dbThoughtData ? res.json(dbThoughtData) : res.status(404).json({ message: thought404Message(params.id) }))
        .catch(err => res.sendStatus(404).json(err))
    },

    // creates thought
    createThought({ body }, res) {
        Thought.create({ thoughtText: body.thoughtText, username: body.username })
        .then(({ _id }) => User.findOneAndUpdate({ _id: body.userId }, { $push: { thoughts: _id } }, { new: true }))
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => res.status(400).json(err))
    },

    // update thought
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .then(dbThoughtData => dbThoughtData ? res.json(dbThoughtData) : res.status(404).json({ message: thought404Message(params.id) }))
        .catch(err => res.status(400).json(err))
    },

    // delete thought
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
        .then(dbThoughtData => dbThoughtData ? res.json(thought200Message(dbThoughtData._id)) : res.status(404).json({ message: thought404Message(params.id) }))
        .catch(err => res.status(404).json(err));
    },

    // add reaction
    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: { reactionBody: body.reactionBody, username: body.username} } },
            { new: true, runValidators: true })
            .then(dbThoughtData =>  dbThoughtData ? res.json(dbThoughtData) : res.status(404).json({ message: thought404Message(params.id) }))
        .catch(err => res.status(400).res.json(err))
    },

    // remove reaction
    removeReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { _id: params.reactionId } } },
            { new: true})
        .then(dbThoughtData => dbThoughtData ? res.json(reaction200Message(params.thoughtId)) : res.status(404).json({ message: thought404Message(params.id) }))
        .catch(err => res.status(404).json(err))
    }

};

module.exports = thoughtController;