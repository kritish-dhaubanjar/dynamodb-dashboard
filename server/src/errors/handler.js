export default function (error, req, res, next) {
  if (error.isJoi) {
    return res.status(422).json(error);
  }

  return res.status(400).json(error);
}
