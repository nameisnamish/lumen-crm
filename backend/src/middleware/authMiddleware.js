import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized - Missing or invalid token" });
  }

  try {
    const secret = process.env.JWT_SECRET || "ai_crm_dashboard_super_secret_jwt_key_2026";
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized - Token verification failed" });
  }
};
