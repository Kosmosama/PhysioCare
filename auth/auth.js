import jwt from "jsonwebtoken";

// Function to generate token.
const generateToken = (login) => {
    return jwt.sign({login: login}, process.env.SECRET, {expiresIn: "1d"});
}

// Function to verify token.
const isTokenValid = (token) => {
    try {
        jwt.verify(token, process.env.SECRET);
        return true;
    } catch (error) {
        return false;
    }
}

// Function to protect routes.
const protectRoute = (req, res, next) => {
    const token = req.headers["authorization"];

    //#TOASK Suggestion (401)
    if (!token || !token.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided or invalid format." });
    }

    if (isTokenValid(token.split(" ")[1])) next();
    else res.status(403).json({ error: "Unauthorized access." });
}

export { generateToken, isTokenValid, protectRoute };