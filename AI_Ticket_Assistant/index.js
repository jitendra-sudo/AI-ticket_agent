import express from 'express';
import mongoose  from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import ticketRoutes from './Routes/ticket.js';
import userRoute from './Routes/user.js';
import { serve } from 'inngest/express';
import { inngest } from './Inngest/client.js';
import { onUserSignup }  from "./Inngest/on-signup.js";
import { onTicketCreate } from './Inngest/on-ticket-create.js';
dotenv.config();  

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/auth', userRoute);
app.use('/api/tickets', ticketRoutes);
app.use("/api/inngest" , serve({
  client: inngest,
  functions:[onUserSignup , onTicketCreate]
}) );

mongoose.connect(process.env.MONGO_URL)
.then(() => {
  console.log(`'MongoDB connected'`)
})
.catch((err) => {
  console.log('MongoDB connection error:', err)
})

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port http://localhost:${process.env.PORT}`)
})

