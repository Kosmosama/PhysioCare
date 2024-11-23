const checkEnvFile = () => {
    const requiredVars = ["DB_URL", "PORT", "SECRET"];
    const missingVars = requiredVars.filter((key) => !process.env[key]);

    if (missingVars.length > 0) {
        console.error(`Missing required environment variables: ${missingVars.join(", ")}`);
        process.exit(1);
    }
}

export { checkEnvFile };