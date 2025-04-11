import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import authRoute from './routes/auth.routes.js'
import healthCheckRouter from './routes/healthcheck.routes.js';
import projectRoute from './routes/project.route.js'
import noteRoute from './routes/note.route.js'
import taskRoute from './routes/task.routes.js'

const app = express();

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true,
  }))

app.use(express.json())
app.use(cookieParser())

app.use('/api/v1/health', healthCheckRouter);
app.use('/api/v1/auth',authRoute);
app.use('/api/v1/project',projectRoute);
app.use('/api/v1/task',taskRoute);


app.use('/api/v1/note',noteRoute);
export default app;