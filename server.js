const Http = require('http')
const app = require('./app/app');



const port =process.env.PORT||3000
const server = Http.createServer(app)
server.listen(port,console.log(`Server is runing on port : ${port}`))
