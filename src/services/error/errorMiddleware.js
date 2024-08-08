export default function (err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || "Unknown error";
  if (status === 500) console.error(err);
  return res.status(status).json({ message });
}
