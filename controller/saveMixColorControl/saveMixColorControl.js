const Color = require("../../mongodb/savedMixColorMongo/saveMixeColorMongo");
const Signup = require('../../mongodb/signupMongo/signupMongo');

const saveMixColor = async (req, res) => {
  try {
    const { permanentId, selectedColors, mixedColorHex } = req.body;

   
    if (!permanentId) {
      throw new Error("Permanent ID is not present");
    }

    // Fetch the user details using the permanentId
    const user = await Signup.findOne({permanentId});
    if (!user) {
      throw new Error("User not found");
    }

    const colorCount = await Color.countDocuments();

    
    const newColor = new Color({
      permanentId: permanentId,
      colors: selectedColors,
      mixedColorHex: mixedColorHex,
      userName: user.name, 
      userPhone: user.phone ,
      colorNumber: colorCount + 1
    });

    const savedColor = await newColor.save();
    if (!savedColor) {
      throw new Error("Failed to save color data");
    }

    res
      .status(200)
      .json({ message: "Color data stored successfully", data: savedColor });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to store color data" });
  }
};

const getsaveColor = async (req, res) => {
  try {
    // Extract permanentId from the cookie
    const permanentId = req.cookies.permanentId;

    if (!permanentId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Retrieve saved colors associated with the given permanentId
    const savedColors = await Color.find({ permanentId });

    // Check if there are any saved colors
    if (savedColors.length === 0) {
      return res.status(404).json({
        message: "No saved colors found for the provided permanent ID",
      });
    }

    // Extract required fields from each color document
    const colorData = savedColors.map((color) => ({
      selectedColors: color.colors.map((selectedColor) => ({
        hex: selectedColor.hex,
        shade: selectedColor.shade,
        intensity: selectedColor.intensity,
      })),
      mixedColorHex: color.mixedColorHex,
    }));

    // Return the color data
    res.status(200).json({ colorData });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch saved colors" });
  }
};

module.exports = getsaveColor;


const getDataMachine = async (req, res) => {
  try {
    const savedColors = await Color.find({ fetched: false }).limit(1);

    if (savedColors.length === 0) {
      return res.status(200).json({
        success: true,
        message: "All data fetched, wait for new data entry",
        type: "Product",
        colorData: {},
      });
    }

    const colorIds = savedColors.map((color) => color._id);

    await Color.updateMany(
      { _id: { $in: colorIds } },
      { $set: { fetched: true } }
    );

    const colorData = {
      products: savedColors.map((storeOrder) => ({
        id: storeOrder._id.toString(),
        shade: storeOrder.colors?.map((selectedColor) => ({
          hex: selectedColor.hex || "#000000",
          shade: selectedColor.shade || "K",
          intensity: selectedColor.intensity || "100",
          _id: selectedColor._id.toString(),
        })) || [],
        mixColor: storeOrder.mixedColorHex || "#000000",
        phoneNumber: storeOrder.userPhone || "8264906866",
        userName: storeOrder.userName, 
      
        colorNumber:storeOrder.colorNumber
      })),
    };

    res.status(200).json({
      success: true,
      message: "Product data fetched and updated successfully.",
      type: "Product",
      colorData: colorData,
    });

  } catch (error) {
    console.error("Error:", error.stack);
    res.status(500).json({ error: "Failed to fetch saved colors" });
  }
};


module.exports = { saveMixColor, getsaveColor, getDataMachine };
