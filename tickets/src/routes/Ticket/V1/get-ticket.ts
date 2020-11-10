import express,{Request,Response,NextFunction} from 'express';
import {NotFoundError,allowAuthOnly} from '@rbtickets/sharedlib';
import {TicketRepo} from '../../../db/repo/ticketRepo';

const router = express.Router();

// GET /api/ticket/v1/get-ticket/:tId
router.get('/:tId',allowAuthOnly,async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const tick = await TicketRepo.getTicketById(req.params.tId);
        if(!tick) throw new NotFoundError('Ticket Not found');
        res.status(200).send({msg:'ticket fetched successfully',ticket:TicketRepo.mapDocToObj(tick)});
    }catch(err){
        next(err);
    }
});



export {router as getTicketRouter};