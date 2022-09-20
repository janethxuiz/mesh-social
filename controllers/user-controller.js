const { User, Thought } = require("../models");

const userController = {
    getAllUser(req, res) {
        User.find({})
        .populate({
            path: "friends",
            select: "-__v",
        })
        .select("-__v")
        .sort({ _id: -1 })
        .then((dbUserData) => res.json(dbUserData))
        .catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
        .populate({
            path: "thoughts",
            select: "-__v",
        })
        .populate({
            path: "thoughts",
            select: "-__v",
        })
        .select("-__v")
        .then((dbUserData) => {
            if (!dbUserData) {
                return res
                .status(404)
                .json({ message: "No user with this if" });
            }
            res.json(dbUserData);
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    createUser({ body },res) {
        User.create(body)
        .then((dbUserData) => res.json(dbUserData))
        .catch((err) => res.json(err));
    },

    updateUser(req, res) {
        User.findOneAndUpdate(
          { _id: req.params.userId },
          { $set: req.body },
          { runValidators: true, new: true }
        )
          .then((user) =>
            !user
              ? res.status(404).json({ message: "No User find with this ID!" })
              : res.json(user)
          )
          .catch((err) => res.status(500).json(err));
      },
    
    // deleteUser({ params }, res) {
    //     User.findOneAndDelete({ _id: req.params.id })
    //     .then((dbUserData) => {
    //         if (!dbUserData) {
    //             return res.status(404).json({ message: "no user with this id"});
    //         }
    //         return Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });
    //     })
    //     .then(() => {
    //         res.json({ message: "user and thoughts deleted" });
    //     })
    //     .catch((err) => res.json(err));
    // },
    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.userId })
          .then((user) =>
            !user
              ? res.status(404).json({ message: "No User find with this ID!" })
              : Thought.deleteMany({ _id: { $in: user.thoughts } })
          )
          .then(() => res.json({ message: "User and Thought deleted!" }))
          .catch((err) => res.status(500).json(err));
    },

    addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $addToSet: { friends: params.friendId } },
            { new: true, runValidators: true }
        )
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({ message: "no user with this id"});
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => res.json(err));
    },

    removeFriend({ params }, res) {
        User.findOneAndDelete(
            { _id: params.userId },
            { $pull: { friends: params.friendId } },
            { new: true }
        )
        .then((dbUserData) => {
            if (!dbUserData) {
                return res.status(404).json({ message: "no user with this id"});
            }
            res.json(dbUserData);
        })
        .catch((err) => res.json(err));
    },
};

module.exports = userController;