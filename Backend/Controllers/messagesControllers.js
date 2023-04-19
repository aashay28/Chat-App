const Messages = require("../Models/messageModel");
module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });
    if (data)
      return res
        .status(201)
        .json({ status: true, message: "Data added successfully" });

    return res.status(400).json({ status: false, message: "Failed to add" });
  } catch (err) {
    res.status(400).json({ status: false, message: err });
    next(err);
  }
};
module.exports.getAllMessage = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json(projectedMessages);
  } catch (err) {
    res.status(400).json({ status: false, message: err });
    next(err);
  }
};
