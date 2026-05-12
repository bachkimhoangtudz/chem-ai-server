const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const OPENROUTER_API_KEY =
    process.env.OPENROUTER_API_KEY;

app.post("/chat", async (req, res) => {

    try {

        const userMessage = req.body.message;

        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",

                headers: {
                    "Authorization":
                        `Bearer ${OPENROUTER_API_KEY}`,

                    "Content-Type":
                        "application/json",

                    "HTTP-Referer":
                        "https://railway.app",

                    "X-Title":
                        "ChemAI"
                },

                body: JSON.stringify({

                    model:
                        "model:
                        "deepseek/deepseek-chat-v3-0324:free",
                }
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

        const reply =
            data.choices?.[0]?.message?.content
            || "AI không phản hồi";

        res.json({
            reply
        });

    } catch (err) {

        console.log(err);

        res.json({
            reply: "Lỗi AI server"
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(
        "Server running on port " + PORT
    );
});
