
module.exports = function (req, res, next) {
  const id = req.params.id;
  
  if (req.user.is_active) {
    return next();
  }
  
  if (id != req.user.id) {
    return res.status(400).send({
      message: "Faqat shaxsiy malumotlarni korishingiz mumkin",
    });
  }
  
  next();
};
