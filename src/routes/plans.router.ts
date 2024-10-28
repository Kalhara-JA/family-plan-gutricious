import { Router } from 'express';
import { createPlan, getPlanDetails, updatePlan, deletePlan } from '../controllers/plans.controller';

const planRouter = Router();

planRouter.post('/', createPlan);
planRouter.get('/:planId', getPlanDetails);
planRouter.put('/:planId', updatePlan);
planRouter.delete('/:planId', deletePlan);

export default planRouter;