const validator = require("validator");

const validateSignupData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if(!firstName || !lastName){
        throw new Error("Name is required")
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Email is invalid")
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Password is not strong enough")
    }
};

const validateEditProfileData = (req) => {
    const allowedFields = ["firstName", "lastName", "emailId", "photoUrl","gender","age", "about", "skills"];

    const isEditAllowed = Object.keys(req.body).every((field) =>
        allowedFields.includes(field)
    );
    return isEditAllowed;
}

module.exports = {
    validateSignupData,
    validateEditProfileData
};