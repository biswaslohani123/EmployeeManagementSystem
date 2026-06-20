import Employee from "../models/EmployeeModel.js";
import bcrypt from 'bcrypt'
import User from '../models/User.js'


// get Employee
const getEmployees = async (req, res) => {

    try {

        const {department} = req.query;
        const  where = {}
        if (department) {

            where.department = department
            
        }  
        
        const employees = (await Employee.find(where)).toSorted({createdAt: -1}).populate("userId", "email role").lean();

        const result = employees.map((emp) => ( {
          
            ...emp,
            id: emp._id.toString(),
            user: emp.userId ? {email: emp.userId.email, role:emp.userId.role} : nulla

        } ));

        return res.status(201).json({success: true, employees});


    } catch (error) {

        return res.status(500).json({error: "Failed to fetch employee"})
        
    }
}

// create Employee
const createEmployee = async (req, res) => {

    try {

        const {firstName, lastName, email, phone, position, department, basicSalary, allowances, deductions, joinDate, password, role, bio} = req.body;

        if (!email || !password || !firstName || !lastName) {

            return res.status(400).json({error: "Missing required fields."})
            
        }

        const hashed = await bcrypt.hash(password, 10)
        const user = await User.create({
            email,
            password: hashed,
            role: role || "EMPLOYEE"
        })

        // employee data

        const employee = await Employee.create({

            userId: user._id,
            firstName,
            lastName,
            email,
            phone,
            position,
            department: department || "Engineering",
            basicSalary: Number(basicSalary) || 0,
            allowances: Number(allowances) || 0,
            deductions: Number(deductions) || 0,
            joinDate: new Date(),
            bio: bio || ""

        });

        return res.status(201).json({success: true,employee})

    } catch (error) {

        if (error.code === 11000) {

            return res.status(400).json({error: "Email already exists"})
            
        }

        console.error("Create employee error: ", error)

        return res.status(500).json({error: "Failed to create employee."})
    }

}

// update employee
//put /api/employees/:id

const updateEmployee = async (req, res) => {

   try {

        
        const {id} = req.params;
        const {firstName, lastName, email, phone, position, department, basicSalary, allowances, deductions, password, role, bio, employeeStatus} = req.body;

        const employee = await Employee.findById(id);
        if (!employee) {

            return res.status(404).json({error: "Employee not found"})
            
        }

       

        // employee data

         await Employee.findByIdAndUpdate(id, {

            
            firstName,
            lastName,
            email,
            phone,
            position,
            department: department || "Engineering",
            basicSalary: Number(basicSalary) || 0,
            allowances: Number(allowances) || 0,
            deductions: Number(deductions) || 0,
            employeeStatus: new employeeStatus || "ACTIVE",
            bio: bio || ""

        });

        // update user record
        const userUpdate = {email};

        if (role) {

            userUpdate.role = role
        }


        if (password) {

            userUpdate.password = await bcrypt.hash(password, 10)
            
        }

        await User.findByIdAndUpdate(employee.userId, userUpdate)

        return res.json({success: true})

    } catch (error) {

        if (error.code === 11000) {

            return res.status(400).json({error: "Email already exists"})
            
        }

        console.error("Create employee error: ", error)

        return res.status(500).json({error: "Failed to update  employee."})
    }
}

// deleteEmployee
// delete /api/employees/:id

const deleteEmployee = async (req, res) => {

    try {

        const {id} = req.params;

        const employee = await Employee.findById(id);
        if (!employee) {

            return res.status(404).json({error: "Employee not found."})
            
        }

        employee.isDeleted = true;
        employee.employeeStatus = "INACTIVE"
        await employee.save()
        return res.json({success: true})

    } catch (error) {

        return res.status(500).json({error: "Failed to delete employee"})
        
    }

}


export {getEmployees, createEmployee, updateEmployee, deleteEmployee};


