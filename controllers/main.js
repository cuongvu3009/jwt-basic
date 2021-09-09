// check username, password in post(login) require
// if exist create new jwt
// send back to front-end

// setup authentication so that only the request with jwt can access the dashboard
const jwt = require("jsonwebtoken");
const CustomAPIError = require("../errors/custom-error");

const login = async (req, res) => {
  const { username, password } = req.body;
  // mongoose validation
  // Joi
  // check in the controller

  if (!username || !password) {
    throw new CustomAPIError("Please provide email and password", 400);
  }

  // demo id
  const id = new Date().getDate();

  // infomation that will be sent to customer, keep this payload small to enhance ux
  const token = jwt.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.status(200).json({ msg: "user created", token });
};

const dashboard = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new CustomAPIError("No token valid", 401);
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const luckyNumber = Math.floor(Math.random() * 100);
    res.status(200).json({
      msg: `Hello ${decoded.username}`,
      secret: `Here is your secret number ${luckyNumber}`,
    });
  } catch (error) {
    throw new CustomAPIError("User not verified", 401);
  }
};

module.exports = { login, dashboard };
