import 'dotenv/config'
import express from 'express'
import sequelize from './db.js'
import cors from 'cors'
import router from './routes/index.js'
import errorMiddleware from './middleware/errorMiddleware.js'
import cookieParser from 'cookie-parser'
import fileUpload from 'express-fileupload'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = process.env.SERVER_PORT || 5000
const DOMAIN_BASENAME = process.env.DOMAIN_BASENAME || ''

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(fileUpload())
app.use(DOMAIN_BASENAME + '/static', express.static(path.resolve(__dirname, process.env.STATIC_PATH || '')))
app.use(cors({
	origin: process.env.CLIENT_URL,
	credentials: true
}))
app.use(DOMAIN_BASENAME + '/api', router)

app.use(errorMiddleware)

async function start() {
	try {
		app.listen(PORT, () => {
			console.log(`Server has been started on port ${PORT}...`)
		})
		await sequelize.authenticate()
			.then(console.log('MySQL authentication is OK'))
		await sequelize.sync()
	} catch (err) {
		console.log(err)
	}
}
start()