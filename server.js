// server.js
import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
console.log("Loaded user:", process.env.IMGFLIP_USER);
console.log("Loaded pass:", process.env.IMGFLIP_PASS);
const app = express();

app.use(cors());
app.use(express.json());

// ✅ ROUTE: Get meme templates
app.get("/api/templates", async (req, res) => {
  try {
    const response = await fetch("https://api.imgflip.com/get_memes");
    const data = await response.json();
    res.json({ success: true, data: data.data }); // Send data.data
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ ROUTE: Generate meme
app.post("/api/generate", async (req, res) => {
  const { template_id, text0, text1 } = req.body;

  const params = new URLSearchParams();
  params.append("template_id", template_id);
  params.append("username", process.env.IMGFLIP_USER);
  params.append("password", process.env.IMGFLIP_PASS);
  params.append("text0", text0);
  params.append("text1", text1);

  try {
    const response = await fetch("https://api.imgflip.com/caption_image", {
      method: "POST",
      body: params,
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(5000, () => console.log("✅ Server running on http://127.0.0.1:5000"));
