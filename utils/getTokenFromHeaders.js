
const getTokenFromHeaders =(req)=>{
    const token = req?.headers?.authorization?.split(" ")[1]
    if (token === undefined) {
        return 'No Token Found in The Header'
    } else {
        return token
    }
}

module.exports =getTokenFromHeaders