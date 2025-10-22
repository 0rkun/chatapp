import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("error in getAllContacts", error);
    res.status(500).json({ message: "server error" });
  }
};

export const getMessagesByUserId = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: userToChatId } = req.params;

    const messages = await Message.find({
      $or: [
        {
          senderId: myId,
          receiverId: userToChatId,
        },
        {
          senderId: userToChatId,
          receiverId: myId,
        },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages:", error);
    res.status(500).json({ error: "Interval server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!text && !image) {
      return res.status(400).json({ message: "Text or image is required" });
    }
    if (senderId.equals(receiverId)) {
      return res
        .status(400)
        .json({ message: "Can't send messages to yourself " });
    }
    const receiverExits = await User.exists({ _id: receiverId });
    if (!receiverExits) {
      return res.status(404).json({ message: "Receiver not found" });
    }
    let imageUrl;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const reveiverSocketId = getReceiverSocketId(receiverId);

    if (reveiverSocketId) {
      io.to(reveiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller", error);
    res.status(500).json({ message: "ınterval server" });
  }
};

// export const getChatPartners = async (req, res) => {
//   try {
//     const loggedInUserId = req.user._id;

//     const messages = await Message.find({
//       $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
//     });

//     const chatPartnerIds = [
//       ...new Set(
//         messages.map((msg) =>
//           msg.senderId.toString() === loggedInUserId.toString()
//             ? msg.receiverId.toString()
//             : msg.senderId.toString()
//         )
//       ),
//     ];

//     const chatPartners = await User.find({
//       _id: { $in: chatPartnerIds },
//     }).select("-password");

//     res.status(200).json(chatPartners);
//   } catch (error) {
//     console.log("Error in getChatPartners controller", error);
//     res.status(500).json({ message: "ınterval server" });
//   }
// };

export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    console.log("1. Logged in user ID:", loggedInUserId); // ✅

    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    });

    console.log("2. Messages found:", messages.length); // ✅
    console.log("3. Messages:", JSON.stringify(messages, null, 2)); // ✅

    const chatPartnerIds = new Set();

    messages.forEach((msg) => {
      console.log("4. Processing message:", msg._id); // ✅
      console.log("   senderId:", msg.senderId); // ✅
      console.log("   receiverId:", msg.receiverId); // ✅

      if (msg.senderId.toString() !== loggedInUserId.toString()) {
        chatPartnerIds.add(msg.senderId.toString());
      }
      if (msg.receiverId.toString() !== loggedInUserId.toString()) {
        chatPartnerIds.add(msg.receiverId.toString());
      }
    });

    console.log("5. Chat partner IDs:", Array.from(chatPartnerIds)); // ✅

    const chatPartners = await User.find({
      _id: { $in: Array.from(chatPartnerIds) },
    }).select("-password");

    console.log("6. Chat partners found:", chatPartners.length); // ✅
    console.log("7. Chat partners:", chatPartners); // ✅

    res.status(200).json(chatPartners);
  } catch (error) {
    console.log("Error in getChatPartners controller", error);
    res.status(500).json({ message: "internal server error" });
  }
};
