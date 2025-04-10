import { Router } from 'express';
import { healthCheck } from '../controllers/healthcheck.controller.js';

const router = Router();

// Handle GET requests to the root of this router
router.get('/', healthCheck);

export default router;
