import http from 'http'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import { Server } from 'colyseus'
import { monitor } from '@colyseus/monitor'
// import socialRoutes from "@colyseus/social/express"
import { MyRoom } from './rooms/MyRoom'
import catchAsync from './utils/catchAsync'

dotenv.config({ path: './config.env' })

const port = Number(process.env.PORT || 2567)
const app = express()

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
)

// Connect to the DB
mongoose
  .connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection successful!'))

app.use(cors())
app.use(express.json())
const server = http.createServer(app)
const gameServer = new Server({
  server
})

// register your room handlers
gameServer.define('my_room', MyRoom)

/**
 * Register @colyseus/social routes
 *
 * - uncomment if you want to use default authentication (https://docs.colyseus.io/server/authentication/)
 * - also uncomment the import statement
 */
// app.use("/", socialRoutes);

// register colyseus monitor AFTER registering your room handlers
app.use('/colyseus', monitor())

gameServer.listen(port, '192.168.178.34')
console.log(`Listening on ws://localhost:${port}`)
