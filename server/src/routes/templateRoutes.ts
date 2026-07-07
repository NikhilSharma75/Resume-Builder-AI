import express from 'express';
import { getTemplates, getTemplateById } from '../controllers/templateController';

const router = express.Router();

router.get('/', getTemplates);
router.get('/:id', getTemplateById);

export default router;
