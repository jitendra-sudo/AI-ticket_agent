import {inngest} from './client.js';
import User from '../Modals/User.js';

export const onUserSignup = inngest.createFunction(
    {id: "on-user-signup" , retries: 3},
    {event: "user/signup"},
    async ({ event, step }) => {
        try{
            const  { email } = event.data;
            await step.run("get-user-by-email", async () => {
              const userObject = await User.findOne({ email });
              if(!userObject) throw new Error("User not found");

            });

            return userObject;

            await step.run("send-welcome-email", async () => {
                const subject = "Welcome to Inngest Ticketing System";
                const text = `Hello ${userObject.name},\n\nWelcome to Inngest Ticketing System! We're excited to have you on board.\n\nBest regards,\nThe Inngest Team`;
            });

            await sendMail(User.email, subject, text);


            return {success: true}
        } catch (error) {
            console.error("Error in onUserSignup:", error);
        }

    })  
