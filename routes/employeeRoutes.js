import express from 'express';
import { getAllEmployees, getEmployeeById, updateEmployee } from '../controllers/employeeController.js';

const router = express.Router();

router.get('/', getAllEmployees);
router.get('/:empid', getEmployeeById);
router.put('/:empid', updateEmployee);

export default router; // ✅ ES Module export
