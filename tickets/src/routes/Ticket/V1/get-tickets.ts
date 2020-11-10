import express,{Request,Response,NextFunction} from 'express';
import {TicketRepo} from '../../../db/repo/ticketRepo';

const router = express.Router();

// GET /api/ticket/v1/get-tickets
router.get('/',async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const tickets = await TicketRepo.getTickets();
        res.status(200).send({msg:'ticket fetched successfully',tickets:tickets.map((t:any)=>TicketRepo.mapDocToObj(t))});
    }catch(err){
        next(err);
    }
});



export {router as getTicketsRouter};