import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    const token = authHeader.split(" ")[1]; // 🔥 FIX HERE

    if (!token) {
      return res.status(401).json({ message: "Malformed token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();

  } catch (e) {
    console.log("TOKEN ERROR:", e.message);
    res.status(401).json({ message: "Invalid Token" });
  }
};

export default authMiddleware;