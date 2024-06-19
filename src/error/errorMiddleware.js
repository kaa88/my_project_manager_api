import { ApiError } from "./error.js";

export default function (err, req, res) {
  if (err instanceof ApiError)
    return res
      .status(err.status)
      .json({ message: err.message, errors: err.errors });
  return res.status(500).json({ message: "Unknown error" });
}
