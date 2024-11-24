import User from "../models/user.js";
import bcrypt from "bcrypt";
import { generateToken } from "../auth/auth.js";
import { ROLES } from "../utils/constants.js";

const allowedRoles = [ROLES.ADMIN, ROLES.PHYSIO, ROLES.PATIENT];

// Utility function to check if a user exists and return their data
const findUserByLogin = async (login) => {
    return await User.findOne({ login: login });
};

// Utility function to hash passwords
const hashPassword = async (password) => {
    return await bcrypt.hash(password, await bcrypt.genSalt(10));
};

// Utility function to validate user data
const validateUserData = async (userData) => {
    const { login, password, rol } = userData;

    if (!login || !password || !rol) return "Missing required fields.";
    if (!allowedRoles.includes(rol)) return "Invalid role.";
    if (await findUserByLogin(login)) return "User already exists";
    
    return null;
};

// Creates a new user and returns null if there was an error or the user if it could create it
const createUser = async (userData) => {
    const error = validateUserData(userData);
    if (error) {
        return null;
    }

    const { login, password, rol } = userData;

    const newUser = new User({
        login: login.trim(),
        password: await hashPassword(password),
        rol,
    });

    await newUser.save();
    return newUser;
};

// Checks if the user exists and returns a token
const logUser = async (req, res) => {
    const { login, password } = req.body;
    
    // I would add a 400 error here that checks all data was sent
    
    try {
        const user = await findUserByLogin(login);
        if (!user) return res.status(401).json({ error: "Incorrect login." });
        
        const test = await bcrypt.compare(password, user.password);
        if (!test) return res.status(401).json({ error: "Incorrect password." });
        
        res.status(200).send({ result: generateToken(user) });
    } catch (error) {
        res.status(500).json({ error: "An error occurred. Please try again later." });
    }
};

// Registers an array of users in the database
// const registerUsers = async (req, res) => {
//     try {
//         const { users } = req.body;

//         if (!Array.isArray(users) || users.length === 0) {
//             return res.status(400).json({ error: "The 'users' field must be a non-empty array." });
//         }

//         const results = await Promise.all(users.map(async (userData) => {
//             const newUser = await createUser(userData);
//             if (!newUser) {
//                 return { login: userData.login || null, error: "Failed to create user." };
//             }
//             return { login: newUser.login, message: "User created successfully." };
//         }));

//         res.status(201).json({ results });
//     } catch (error) {
//         res.status(500).json({ error: "An error occurred while saving users." });
//     }
// };

// export { logUser, registerUsers, createUser };
export { logUser, createUser };