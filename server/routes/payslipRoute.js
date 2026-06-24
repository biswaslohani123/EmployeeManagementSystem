import {Router} from 'express'
import { protect, protectAdmin } from '../middleware/auth.js'
import { createPaySlip, getPaySlips, getPaysSlipById } from '../controllers/paySlipController.js';

const paySlipRouter = Router()

paySlipRouter.post('/', protect, protectAdmin, createPaySlip);
paySlipRouter.get('/', protect, getPaySlips);
paySlipRouter.get('/:id', protect, getPaysSlipById)

export default paySlipRouter;