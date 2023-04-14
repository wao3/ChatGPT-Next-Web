import { NextRequest } from "next/server";

const OPENAI_URL = "api.openai.com";
const DEFAULT_PROTOCOL = "https";
const PROTOCOL = process.env.PROTOCOL ?? DEFAULT_PROTOCOL;
const BASE_URL = process.env.BASE_URL ?? OPENAI_URL;
const GPT4_URL = process.env.GPT4_URL;
const GPT4_KEY = process.env.GPT4_KEY;

export async function requestOpenai(req: NextRequest) {
  const openaiPath = req.headers.get("path");

  let apiKey = req.headers.get("token");
  let baseUrl = BASE_URL;
  const useGPT4 = req.headers.get("gpt4");
  if (useGPT4?.length && GPT4_URL?.length && GPT4_KEY?.length) {
    baseUrl = GPT4_URL;
    apiKey = GPT4_KEY;
  }

  if (!baseUrl.startsWith("http")) {
    baseUrl = `${PROTOCOL}://${baseUrl}`;
  }

  console.log("[Proxy] ", openaiPath);
  console.log("[Base Url]", baseUrl);

  return fetch(`${baseUrl}/${openaiPath}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    method: req.method,
    body: req.body,
  });
}
