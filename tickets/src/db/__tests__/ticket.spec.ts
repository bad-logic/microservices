import {TicketRepo} from '../repo/ticketRepo';



describe('implements optimistic concurrency control',()=>{

    it('adds version to the newly created ticket',async()=>{

        const tick = await TicketRepo.createTicket('version test',12,'randomUserID');
        expect(tick.version).toBe(0);
    });

    it('updates the ticket and expects a version greater than previous',async()=>{

        const tick = await TicketRepo.createTicket('version test',12,'randomUserID');
        const firstTicket = await TicketRepo.updateTicket(tick._id,tick.userId,tick.version,{price:15});
        expect(firstTicket.version).toBe(1);
    });

    it('does not updates the ticket if version number is outdated',async()=>{
            // fetch same data twice
            const tick = await TicketRepo.createTicket('version test',12,'randomUserID');
            const tick1 = await TicketRepo.getTicketById(tick._id);
            const tick2 = await TicketRepo.getTicketById(tick._id);
            // update tick
            const firstTicket = await TicketRepo.updateTicket(tick1._id,tick1.userId,tick1.version,{price:15});
            expect(firstTicket.version).toBe(1);
           // update tick1
            const up = await TicketRepo.updateTicket(tick2._id,tick2.userId,tick2.version,{price:100});
            expect(up).toBe(null);
        });
});