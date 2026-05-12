const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("ChemAI server running");
});

app.post("/chat", async (req, res) => {

    try {

        const userMessage = req.body.message;

        console.log("User:", userMessage);

        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",

                headers: {
                    "Authorization":
                        `Bearer ${process.env.OPENROUTER_API_KEY}`,

                    "Content-Type":
                        "application/json",

                    "HTTP-Referer":
                        "https://railway.app",

                    "X-Title":
                        "ChemAI"
                },

                body: JSON.stringify({

                    model:
                        "google/gemma-3-27b-it:free",

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

        console.log(
            JSON.stringify(data, null, 2)
        );

        if (data.error) {

            return res.json({
                reply:
                    "OpenRouter lỗi: " +
                    data.error.message
            });
        }

        const reply =
            data.choices?.[0]?.message?.content;

        if (!reply) {

            return res.json({
                reply:
                    "Model không trả nội dung."
            });
        }

        res.json({
            reply
        });

    } catch (err) {

        console.log(err);

        res.json({
            reply:
                "Server crash."
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(
        "Server running on port " + PORT
    );
});
