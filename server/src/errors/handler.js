export default function(error, _req, res, _next) {
  console.error(error);

  if (error.isJoi) {
    return res.status(422).json(error);
  }

  return res.status(400).json(error);
}
