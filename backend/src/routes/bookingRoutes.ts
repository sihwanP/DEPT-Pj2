import { Router } from 'express';
import {
    getBookings,
    createBooking,
    updateBookingStatus,
    settleBooking,
    deleteBooking
} from '../controllers/bookingController';

const router = Router();

router.get('/', getBookings);
router.post('/', createBooking);
router.patch('/:id/status', updateBookingStatus);
router.post('/:id/settle', settleBooking);
router.delete('/:id', deleteBooking);

export default router;
