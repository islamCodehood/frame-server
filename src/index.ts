import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
// import movieRoutes from "./routes/movie.routes";
import userRoutes from './routes/user.routes'
import storyRoutes from './routes/story.routes'
import dotenv from 'dotenv'
import helmet from 'helmet'
import morgan from 'morgan'

const app = express()
app.use(morgan('dev'))
app.use(helmet())
dotenv.config()

app.use(express.json({ limit: '30mb', strict: true }))
app.use(express.urlencoded({ limit: '30mb', extended: true }))

app.use(cors())

//movie route
// app.use("/movie", movieRoutes);
//user route
app.use('/user', userRoutes)
// app.use("/story", storyRoutes);
app.use('/story', storyRoutes)
app.get('/', (req, res) => {
  res.send('Hello')
})
mongoose
  .connect(process.env.CONNECTION_URL!)
  .then(() =>
    app.listen(process.env.PORT, () =>
      console.log(`server running at port: ${process.env.PORT}`)
    )
  )
  .catch((err) => {
    console.log(err.message)
  })
