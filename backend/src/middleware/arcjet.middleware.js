import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";
import { ENV } from "../lib/env.js";

export const arcjetProtection = async (req, res, next) => {
  if (ENV.NODE_ENV === "development") {
    return next();
  }
  try {
    const decision = await aj.protect(req, res);

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res
          .status(429)
          .json({ message: "Rate limit exceeded.Try again" });
      } else if (decision.reason.isBot) {
        return res.status(403).json({ message: "Access Denied" });
      } else {
        return res.status(403).json({
          message: "Acces denied by security policy",
        });
      }
    }

    if (decision.results.some(isSpoofedBot)) {
      return res.status(403).json({
        error: "Spoofed Bot detected",
        message: "Malicious bot activity detected",
      });
    }
    next();
  } catch (error) {
    console.log("arcjet protection error");
    next();
  }
};
