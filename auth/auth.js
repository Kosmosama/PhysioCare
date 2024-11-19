import jwt from "jsonwebtoken";

// Function to generate token.
const generateToken = (user) => {
    return jwt.sign({ login: user.login, role: user.role }, process.env.SECRET, { expiresIn: "1d" });
}

// Function to verify token.
const isTokenValid = (token) => {
    try {
        return jwt.verify(token, process.env.SECRET);
    } catch (error) {
        return null;
    }
}

// Function to protect routes.
const protectRoute = (...allowedRoles) => {
    return (req, res, next) => {
        const authHeader = req.headers["authorization"];

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Authorization header missing or invalid format." });
        }

        const token = authHeader.split(" ")[1];
        const decodedToken = isTokenValid(token);

        if (!decodedToken) {
            return res.status(403).json({ error: "Invalid or expired token." });
        }

        if (allowedRoles.length && !allowedRoles.includes(decodedToken.role)) {
            return res.status(403).json({ error: "Forbidden: Insufficient role privileges." });
        }

        req.user = decodedToken;

        next();
    };
};

export { generateToken, isTokenValid, protectRoute };