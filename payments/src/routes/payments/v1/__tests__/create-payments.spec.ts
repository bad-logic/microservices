

import { OrderStatus } from '@rbtickets/sharedlib';
import { ObjectID } from 'mongodb';
import {OrderRepo} from '../../../../db/repo/orderRepo';
import { PaymentRepo } from '../../../../db/repo/paymentRepo';
import {stripe} from '../../../../stripe';

const setup = async ()=>{
    const orderId = new ObjectID().toHexString();
    const userId = new ObjectID().toHexString();
    const order = await OrderRepo.createOrder(orderId,OrderStatus.Created,new ObjectID().toHexString(),25,userId);
    return {order,orderId,userId};
}

const cancelOrder = async (orderId)=>{
    return await OrderRepo.cancelOrder(orderId);
}

describe('testing the create payment api',()=>{

    it('should return authentication error if cookie is not provided',async()=>{
        const res = await global.server()
        .post('/api/payments/v1/new-payment')
        .send({});
        expect(res.status).toEqual(401);
    });

    it('should return validation error if orderId or token is not provided',async()=>{
        const {userId} = await setup();
        const res = await global.server()
        .post('/api/payments/v1/new-payment')
        .set('Cookie',global.mockCookie(userId))
        .send({});
        expect(res.body.errors.length).toEqual(2);
        expect(res.body.errors[0].field).toBe('orderId');
        expect(res.body.errors[1].field).toBe('token');
    });

    it('should return 404 error if order is not found',async()=>{
        const {userId} = await setup();
        const res = await global.server()
        .post('/api/payments/v1/new-payment')
        .set('Cookie',global.mockCookie(userId))
        .send({
            orderId: new ObjectID().toHexString(),
            token:'somerandomSTRINgs'
        });
        expect(res.status).toEqual(404);
    });

    it('should return 401 error if your try to pay for others order',async()=>{
        const {orderId} = await setup();
        const res = await global.server()
        .post('/api/payments/v1/new-payment')
        .set('Cookie',global.mockCookie(new ObjectID().toHexString()))
        .send({
            orderId: orderId,
            token:'somerandomSTRINgs'
        });
        expect(res.status).toEqual(401);
    });

    it('should return 400 Bad Request error if your try to pay for cancelled order',async()=>{
        const {orderId,userId} = await setup();
        await cancelOrder(orderId);
        const res = await global.server()
        .post('/api/payments/v1/new-payment')
        .set('Cookie',global.mockCookie(userId))
        .send({
            orderId: orderId,
            token:'somerandomSTRINgs'
        });
        expect(res.status).toEqual(400);
    });

    it('should successfully pay for the order',async()=>{
        const {order,orderId,userId} = await setup();
        const res = await global.server()
        .post('/api/payments/v1/new-payment')
        .set('Cookie',global.mockCookie(userId))
        .send({
            orderId: orderId,
            token:'tok_visa' // always works or passess for stripe account in test mode 
        });
        expect(res.status).toEqual(201);
        expect((stripe.charges.create as jest.Mock).mock.calls[0][0].currency).toEqual('usd');
        expect((stripe.charges.create as jest.Mock).mock.calls[0][0].amount).toEqual(order.price*100);
        expect((stripe.charges.create as jest.Mock).mock.calls[0][0].source).toEqual('tok_visa');
        expect(stripe.charges.create).toHaveBeenCalled();
        expect(stripe.charges.create).toHaveBeenCalledTimes(1);
        const payment = await PaymentRepo.getPaymentByOrderId(orderId);
        expect(payment).not.toBeNull();
    });
});