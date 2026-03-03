const express = require('express');
const cors = require('cors')

const http = require('http')
const app = express();

const {initSocket} = require('./controllers/Socket');



require('express-async-errors');
const connectDB = require('./db/connect')
const Login_Register = require('./routes/Login_Register_R'); 
require('dotenv').config();
const notFoundMiddleware = require('./middleware/NotFound')
const errorHandlerMiddleware = require('./middleware/error-handler')
const Tasks = require('./routes/TacheRouter')
const getPerInfoRout = require('./routes/getPerInfoRout')
const port =  process.env.PORT || 3000 ;
const Data = require('./routes/Data_Router')

app.use(cors({
  origin: 'http://localhost:3500', // autorise React
  credentials: true
}));

app.use(express.json());
app.use('/Images', express.static('Images'));

//Router

 app.use('/api/v1/auth',Login_Register);
 app.use('/api/v1/',getPerInfoRout)
 app.use('/api/v1/',Tasks)
 app.use('/api/v1/',Data)
 app.use(notFoundMiddleware)
 app.use(errorHandlerMiddleware)

// creat server .....
const server = http.createServer(app);
initSocket(server);

const start = async ()=>{
 
   try {
   await connectDB(process.env.URL_MONGODB)
   server.listen(port,()=>{console.log('port 3000 listen')}) 
   } catch (e) {
    
     console.log(e);

   }

}

start();