const express = require("express");
const cors = require("cors");

const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());

const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);

app.get("/", (req, res) => {
    res.send("Server OK");
});

app.post("/chat", async (req, res) => {

    try {

        const userMessage = req.body.message;

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash"
        });

        const result = await model.generateContent(userMessage);

        const response = await result.response;

        const text = response.text();

        res.json({
            reply: text
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            reply: "AI Error"
        });
    }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
    console.log("Running on " + PORT);
});
