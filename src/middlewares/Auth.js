const adminAuth =(req, res, next) => {
    console.log("admin authorize is checked")
    const token = "xyz"
    const authorizedToken = token === "xyz";
    if(!authorizedToken) {
        res.status(401).send("Unauthorized")
    } else {
        next()
    }
}

const userAuth =(req, res, next) => {
    console.log("user authorize is checked")
    const token = "xyz"
    const authorizedToken = token === "xyz";
    if(!authorizedToken) {
        res.status(401).send("Unauthorized")
    } else {
        next()
    }
}

module.exports = {
    adminAuth,
    userAuth
}