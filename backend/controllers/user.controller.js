import geminiResponse from "../gemini.js";
import User from "../models/user.model.js";
import moment from "moment";

// ✅ Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ message: "get current user error" });
  }
};

// ✅ Update assistant info
export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;
    let assistantImage;

    if (req.file) {
      assistantImage = await uploadOnCloudinary(req.file.path);
    } else {
      assistantImage = imageUrl;
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { assistantName, assistantImage },
      { new: true }
    ).select("-password");

    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ message: "update assistant error" });
  }
};

// ✅ Ask assistant (Gemini + Commands)
export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;
    const user = await User.findById(req.userId);
    user.history.push( command );
    user.save();
    const userName = user.name;
    const assistantName = user.assistantName;

    const result = await geminiResponse(command,assistantName, userName);
    console.log("Gemini raw response:", result);
    // Try extracting JSON from response
    const jsonMatch = result.match(/(\{[\s\S]*\})/);
    if (!jsonMatch) {
      return res
        .status(400)
        .json({ response: "sorry, i can't understand" });
    }

    const gemResult = JSON.parse(jsonMatch[0]);
    const type = gemResult.type;

    switch (type) {
      case "get-date":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `current date is ${moment().format("YYYY-MM-DD")}`,
        });
      case "get-time":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `current time is ${moment().format("hh:mm A")}`,
        });
      case "get-day":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `today is ${moment().format("dddd")}`,
        });
      case "get-month":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `current month is ${moment().format("MMMM")}`,
        });

      // ✅ External actions + generic responses
      case "google-search":
      case "youtube-search":
      case "youtube-play":
      case "general":
      case "calculator-open":
      case "instagram-open":
      case "facebook-open":
      case "weather-show":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: gemResult.response,
        });

      // ✅ Default fallback
      default:
        return res.json({
          response: "sorry, i can't understand",
        });
    }
    
  } catch (error) {
    console.error("askToAssistant error:", error);
    res.status(500).json({ response: "ask to assistant error" });
  }
};
