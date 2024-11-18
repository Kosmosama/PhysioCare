import jwt from "jsonwebtoken";

// Function to generate token.
const generateToken = (login) => {
    return jwt.sign({login: login, role: user.role }, process.env.SECRET, {expiresIn: "1d"});
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
const protectRoute = (...allowedRoles) => {
    return (req, res, next) => {
        const authHeader = req.headers["authorization"];

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "No token provided or invalid format." });
        }

        const token = authHeader.split(" ")[1];
        const decodedToken = isTokenValid(token);

        if (!decodedToken) {
            return res.status(403).json({ error: "Unauthorized access." });
        }

        if (allowedRoles.length && !allowedRoles.includes(decodedToken.role)) {
            return res.status(403).json({ error: "Forbidden: Insufficient role privileges." });
        }

        next();
    };
};

export { generateToken, isTokenValid, protectRoute };