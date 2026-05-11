const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

app.post("/chat", async (req, res) => {
    try {
        const userMessage = req.body.message;

        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "meta-llama/llama-3.1-8b-instruct:free",
                    messages: [
                        {
                            role: "user",
                            content: userMessage
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        console.log(data);

        res.json({
            reply:
                data.choices?.[0]?.message?.content ||
                "AI không phản hồi"
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({
            error: "Server error"
        });
    }
});

app.get("/", (req, res) => {
    res.send("Server running");
});

app.listen(PORT, () => {
    console.log("Server running on " + PORT);
});
