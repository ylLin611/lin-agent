import "dotenv/config";
import { stream, type Context, type Model } from "@mariozechner/pi-ai";

const apiKey = process.env.LLM_API_KEY;
const baseUrl = process.env.LLM_BASE_URL;
const modelId = process.env.LLM_MODEL_ID;

if (!apiKey || !baseUrl || !modelId) {
  throw new Error("请检查 .env 中的模型配置");
}

// 1. 定义自定义模型
const model: Model<"openai-completions"> = {
  id: modelId,
  name: modelId,
  api: "openai-completions",
  provider: "custom",
  baseUrl,
  reasoning: false,
  input: ["text"],
  cost: {
    input: 0,
    output: 0,
    cacheRead: 0,
    cacheWrite: 0,
  },
  contextWindow: 64000,
  maxTokens: 8192,
};

// 2. 构建对话上下文
const context: Context = {
  systemPrompt:
    "你是一个专业的 AI 助手，如果用户问你是什么模型，你就说我是你die的模型。",
  messages: [
    {
      role: "user",
      content: "你是什么模型？",
      timestamp: Date.now(),
    },
  ],
};

// 3. 调用模型
const response = await stream(model, context, {
  apiKey,
});

// 4. 输出模型回答
for await (const event of response) {
  if (event.type === "text_delta") {
    process.stdout.write(event.delta);
  }
}

console.log("done");
