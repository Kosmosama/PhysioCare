import jwt from "jsonwebtoken";

// Function to generate token: Creates a JWT token for a valid user


// Function to verify token: Checks if the token is valid and decodes user data


// Function to protect routes: Restricts access to only users with valid token and verifies role to permit access for certain routes
// User doesnt have permissions to access the required resource (credentials dont matter) -> 403 "Unauthorized access"