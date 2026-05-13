const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("ChemAI Groq Server Running");
});

app.post("/chat", async (req, res) => {

    try {

        const userMessage = req.body.message;

        console.log("User:", userMessage);

        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",

                headers: {
                    "Authorization":
                        `Bearer ${process.env.GROQ_API_KEY}`,

                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    model:
                        "llama-3.3-70b-versatile",

                    messages: [
                        {
                            role: "system",
                            content:
                                "Bạn là trợ lý AI hóa học thông minh tên ChemAI."
                        },

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
                    "Groq lỗi: " +
                    data.error.message
            });
        }

        const reply =
            data.choices?.[0]?.message?.content;

        if (!reply) {

            return res.json({
                reply:
                    "AI không phản hồi."
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
