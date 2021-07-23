
import express from 'express'
import listEndpoints from 'express-list-endpoints'
import cors from 'cors'
import mongoose from 'mongoose'
import { badRequestMiddleware, catchAllErrorsMiddleware, notFoundMiddleware } from './errorMiddlewares.js'
import profilesRouter from './profile/index.js'
import postRouter from './post/index.js';
import experiencesRouter from './experiences/index.js';
import commentRouter from './comments/index.js'

const port = process.env.PORT || 3001;

const server = express();

// ===================== MIDDLEWARES =============================
server.use(cors());
server.use(express.json());

// ===================== ROUTES  =================================

server.use('/profile', profilesRouter)
server.use('/posts', postRouter)
server.use('/profile', experiencesRouter)
server.use('/comments', commentRouter);

// ===================== ERROR HANDLERS ==========================
server.use(notFoundMiddleware);
server.use(badRequestMiddleware);
server.use(catchAllErrorsMiddleware);
// ===============================================================

console.table(listEndpoints(server));

mongoose
  .connect(process.env.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() =>
    server.listen(port, () => {
      console.log(' ✅  Server is running on port: ' + port);
    })
  )
  .catch((err) => console.log(err));
