import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema(
   {title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, required: true, default: "open", enum: ["open", "in_progress", "closed"] },
    priority: { type: String, required: true, default: "medium", enum: ["low", "medium", "high"] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    tags: [String],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        comment: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
   },
  { timestamps: true } 
);

export default mongoose.model("Ticket", TicketSchema);
