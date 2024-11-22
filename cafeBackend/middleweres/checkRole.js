import dotenv from 'dotenv/config';

function checkRole(req, res, next) {
    // Ensure role is set in res.locals
    console.log("User role from token", res.locals.user.role);
    const role = res.locals.user?.role;
    const email = res.locals.user.email;

    // Check if the user is an admin
    if (role !== "admin") {
        return res.status(401).json({
            message : "An authorized for non admins"
        });  // Unauthorized for non-admins
    }
    console.log("Eligble user");

    // If admin, proceed to the next middleware or route handler
    next();
}



export default {checkRole}