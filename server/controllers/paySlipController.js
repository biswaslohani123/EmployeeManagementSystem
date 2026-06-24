import Employee from "../models/EmployeeModel.js";
import PaySlip from "../models/paySlip.js";

// create payslip 
//post /api/payslips
export const createPaySlip = async (req, res) => {
    
    try {

        const {employeeId, month, year, basicSalary, allowances, deductions} = req.body;

        if (!employeeId || !month || !year || !basicSalary) {
            return res.status(400).json({error: "Missing fields."})
        }

        const netSalary = Number(basicSalary) + Number(allowances || 0) - Number(deductions || 0)

        const payslip = await PaySlip.create({
            employeeId,
            month: Number(month),
            year: Number(year),
            basicSalary: Number(basicSalary),
            allowances: Number(allowances || 0),
            deductions: Number(allowances || 0),
            netSalary
        })

        return res.json({success: true, data: payslip})

    } catch (error) {

        return res.json({success: false, error: "Failed"})
        
    }
}

// get payslip 
//get /api/payslips
export const getPaySlips = async (req, res) => {

    try {

        const session = req.session;
        const isAdmin = session.role === 'ADMIN';
        if (isAdmin) {

            const payslips = await PaySlip.find().populate("employeeId").sort({createdAt: -1});

            const data = payslips.map((p) => {

                const obj = p.toObject();
                return {
                    ...obj,
                    id: obj._id.toString(),
                    employee: obj.employeeId,
                    employeeId: obj.employeeId?._id?.toString()
                } 
            } )

            return res.json({data})
            
        }else{

            const employee = await Employee.findOne({userId: session.userId})

            if (!employee) {

                return res.json({success: false, error: "Not found"})
            }

            const payslips = await PaySlip.find({employeeId: employee._id}).sort({createdAt: -1});

            return res.json({success: true, data: payslips})
        }
        
    } catch (error) {

        return res.json({success: false, error: "Failed"})
        
    }

}

// get payslip by ID
//get /api/payslips
export const getPaysSlipById = async (req, res) => {

    try {
        
        const payslip = await PaySlip.findById(req.params.id).populate("employeeId").lean()

        if (!payslip) {

            return res.json({success: false, error: "Not found"})
            
        }

        const result = {
            ...payslip,
            id: payslip._id.toString(),
            employee: payslip.employeeId,
        }

        return res.json(result)

    } catch (error) {

        return res.json({success: false, error: "Failed"})
        
    }

}



