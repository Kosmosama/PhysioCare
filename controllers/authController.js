import User from '../models/user.js';

// Show login form
const showLogin = async (req, res) => {
    return res.render('pages/login', {
        title: "Login"
    });
};

// Login
const login = async (req, res) => {
    const { login, password } = req.body;
    const errors = {};

    if (!login) errors.login = "Login is required.";
    if (!password) errors.password = "Password is required.";

    if (Object.keys(errors).length > 0) {
        return res.render('pages/login', {
            title: "Login - Error",
            errors,
            patient: { login }
        });
    }

    try {
        const user = await User.findOne({ login });

        if (!user || user.password !== password) {
            return res.render('pages/login', {
                title: "Login - Error",
                errors: { login: "Invalid login or password." },
                patient: { login }
            });
        }

        req.session.user = { login: user.login, rol: user.rol, id: user._id };

        return res.redirect('/');
    } catch (err) {
        res.status(500).render('pages/error', {
            title: "Error",
            error: `An error occurred while logging in.`,
            code: 500
        });
    }
};

// Logout
const logout = async (req, res) => {
    req.session.destroy();
    return res.redirect('/');
};

export { showLogin, login, logout };