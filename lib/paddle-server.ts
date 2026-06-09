import { Environment, LogLevel, Paddle } from "@paddle/paddle-node-sdk";

let paddleInstance: Paddle | null = null;

export function getPaddleClient(): Paddle {
  if (paddleInstance) return paddleInstance;
  const apiKey = process.env.PADDLE_API_KEY;
  if (!apiKey) throw new Error("PADDLE_API_KEY not set");
  paddleInstance = new Paddle(apiKey, {
    environment:
      process.env.NEXT_PUBLIC_PADDLE_ENV === "production"
        ? Environment.production
        : Environment.sandbox,
    logLevel: LogLevel.error,
  });
  return paddleInstance;
}
