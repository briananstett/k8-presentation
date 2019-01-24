/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.backwards_name = (req, res) => {
  if (!req.body || !req.body.name) {
    res.json({ error: "You need a body with your name in it" });
    return;
  }

  const name = req.body.name;
  const charArray = name.split("");
  const reverseArray = charArray.reverse();

  const backwardsName = reverseArray.join("");
  res.json({ backwardsName })
};
