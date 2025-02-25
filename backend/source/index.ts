import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

/* Route Imports */
import productRoutes from './routes/productRoutes'
import customerRoutes from './routes/customerRoutes'
import salesRoutes from './routes/salesRoutes'
import purchasesRoutes from './routes/purchasesRoutes'
import userRoutes from './routes/userRoutes'

/* Configs */
dotenv.config()
const app = express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(morgan('common'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

/* Routes */
app.use('/products', productRoutes)
app.use('/customers', customerRoutes)
app.use('/sales', salesRoutes)
app.use('/purchases', purchasesRoutes)
app.use('/dashboard', userRoutes)

/* Server */
const port = process.env.PORT || 3001
app.listen(port, () => {
   console.log(`Server is running on port ${port}`)
})