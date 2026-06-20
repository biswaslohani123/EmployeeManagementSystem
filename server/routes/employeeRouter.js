import {Router } from 'express'
import { createEmployee, deleteEmployee, getEmployees, updateEmployee } from '../controllers/EmployeeController.js'

const employeeRouter = Router()

employeeRouter.get("/", getEmployees);
employeeRouter.get("/", createEmployee);
employeeRouter.put("/:id", updateEmployee);
employeeRouter.delete("/:id", deleteEmployee);

export default employeeRouter
