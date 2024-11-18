import User from "../models/user.js";
import bcrypt from "bcrypt";
import { generateToken } from "../auth/auth.js";

// const allowedRoles = [Roles.ADMIN, Roles.PHYSIO, Roles.PATIENT];

// Utility function to check if a user exists and return their data
const findUserByLogin = async (login) => {
    return await User.findOne({ login: login.trim() });
};

// Utility function to hash passwords
// const hashPassword = async (password) => {
//     const salt = await bcrypt.genSalt(10);
//     return await bcrypt.hash(password, salt);
// };

// Utility function to validate user data
// const validateUserData = (userData) => {
//     const { login, password, role } = userData;
//     if (!login || !password || !role) {
//         return "Missing required fields.";
//     }
//     if (!allowedRoles.includes(role)) {
//         return "Invalid role.";
//     }
//     return null;
// };

// Checks if the user exists and returns a token
const logUser = async (req, res) => {
    try {
        const { login, password } = req.body;

        const user = await findUserByLogin(login);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Incorrect login credentials." });
        }

        res.status(200).json({ token: generateToken(user.login) });
    } catch (error) {
        //#TOASK Error 500 here? or 401 (remember field error not message)
        res.status(500).json({ message: "An error occurred. Please try again later." });
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
//             const error = validateUserData(userData);
//             if (error) {
//                 return { login: userData.login || null, error };
//             }

//             const { login, password, role } = userData;
//             if (await findUserByLogin(login)) {
//                 return { login, error: "User already exists." };
//             }

//             const newUser = new User({
//                 login: login.trim(),
//                 password: await hashPassword(password),
//                 role,
//             });

//             await newUser.save();
//             return { login, message: "User created successfully." };
//         }));

//         res.status(201).json({ results });
//     } catch (error) {
//         res.status(500).json({ error: "An error occurred while saving users." });
//     }
// };

// export { logUser, registerUsers };
export { logUser };