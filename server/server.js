import express from 'express'
import cors from 'cors'
import "dotenv/config"
import multer from 'multer'

const app = express()
const PORT = process.env.PORT || 3000

// middleware
app.use(cors())
app.use(express.json())
app.use(multer().none())

// Routes
app.get('/', (req, res) => {
    res.send("SERVER IS RUNNING")
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    
})



