import path from "path";
import { fileURLToPath } from "url";
import catchAsyncErrors from "../utils/catchAsyncErrors.js";
import { logUserAction, logUploadAction, logError } from "../middlewares/logger.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getHomePage = catchAsyncErrors(async (req, res, next) => {
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userID = req.user ? req.user.id : null; // If user is not logged in, userID will be null
    logUserAction('User accessed the home page', userID, ipAddress);  
    res.sendFile(path.join(__dirname, process.env.HOME_PAGE));
});

const registerPage = catchAsyncErrors(async (req, res, next) => {
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userID = req.user ? req.user.id : null; // If user is not logged in, userID will be null
    logUserAction("Register Page Requested", userID, ipAddress);
    res.sendFile(path.join(__dirname, process.env.REGISTER_PAGE));
});

export {
    getHomePage,
    registerPage            
};