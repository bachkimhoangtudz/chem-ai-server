const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server OK");
});

app.post("/chat", async (req, res) => {

    try {

        const userMessage = req.body.message;

        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",

                headers: {
                    "Authorization":
                        `Bearer ${process.env.OPENROUTER_API_KEY}`,

                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    model:
                        "deepseek/deepseek-chat-v3-0324:free",

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

        res.json({
            reply:
                data.choices[0].message.content
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
