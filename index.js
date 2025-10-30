import app from "./src/app.js";
import LoggerService from "./src/Application/Services/LoggerService.js";

const logger = LoggerService.Logger();

// Port configuration
const PORT = process.env.PORT || 8080;

// Server init
app.listen(PORT, () => {
    logger.info(`Server listening on http://localhost:${PORT}`);
});