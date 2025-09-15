import { inngest } from "../Inngest/client.js";
import Ticket from "../Modals/Ticket.js";

export const createTicket = async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title || !description) {
            return res.status(400).json({ message: 'Title and Description are required' });
        }

        const newTicket = Ticket.create({
            title,
            description,
            createdBy: req.user._id.toString()
        })

        return res.status(201).json({
            message: 'Ticket created successfully',
            ticket: newTicket
        })
    } catch (error) {
        console.error('Error creating ticket:', error);
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const getTickets = async ( req , res ) =>{
    try{
        const user = req.user;
        let tickets = [];
        if(user.role !== 'admin'){
            tickets = (await Ticket.find({}).populate("assignedTo" , ["email" , "_id"])).toSorted({createdAt: -1})
        }else{
           tickets =  await Ticket.find({ createdBy: user._id}).select("title description status createdAt").toSorted({createdAt: -1})
        }
        return res.status(200).json(tickets)
    }catch(error){
        console.error('Error fetching tickets:', error);
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const getTicket = async ( req ,res) =>{
    try{
        const user = req.user;
        let ticket ;

        if(user.role !== 'user'){
            ticket = await Ticket.findById(req.params.id).populate("assignedTo" , ["email" , "_id"])
        }else{
            ticket = await Ticket.findOne({ createdBy: user._id , _id: req.params.id}).select("title description status createdAt")
        }


        if(!ticket){
            return res.status(404).json({ message: 'Ticket not found' })
        }

        return res.status(200).json({ticket})
    } catch(error){
        console.error('Error fetching ticket:', error);
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}