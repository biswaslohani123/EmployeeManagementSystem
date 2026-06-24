import { Inngest } from "inngest";
import Attendance from "../models/attendance.js";
import Employee from "../models/EmployeeModel.js";
import leave from "../models/leave.Model.js";
import sendEmail from "../config/nodemailer.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "fullstack-ems" });

// auto checkout from employee
const autoCheckOut = inngest.createFunction(
  { id: "auto-check-out", triggers: [{ event: "/employee/check-out" }] },
  

  async ({ event, step }) => {
    const { employeeId, attendanceId } = event.data;

    // wait fot 9 hours
    await step.sleepUntil(
      "wait-for-the-9-hours",
      new Date(new Date().getTime() + 9 * 60 * 60 * 1000),
    );

    // get attendance data
    let attendance = await Attendance.findById(attendanceId);
    if (!attendance?.checkout) {
      //get employee data
      const employee = await Employee.findById(employeeId);

      // send  reminder email

     await sendEmail({
  to: employee.email,
  subject: "Attendance Check-Out Reminder",
  body: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
      <h2 style="color: #333;">Attendance Check-Out Reminder</h2>

      <p>Hello ${employee.name},</p>

      <p>
        This is a friendly reminder that you have not checked out for today's attendance.
      </p>

      <p>
        Please log in to the Employee Management System and complete your check-out process.
      </p>

      <div style="margin: 20px 0;">
        <a
          href="https://your-company-website.com"
          style="
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
          "
        >
          Check Out Now
        </a>
      </div>

      <p>
        If you have already checked out, please ignore this email.
      </p>

      <p>Thank you,<br/>HR Team</p>

      <hr />
      <small style="color: #777;">
        This is an automated email. Please do not reply to this message.
      </small>
    </div>
  `
});

      // After 10hours , marks attendance as checkout with status "LATE"

      await step.sleepUntil(
        "wait-for-the-1-hour",
        new Date(new Date().getTime() + 9 * 60 * 60 * 1000),
      );

      attendance = await Attendance.findById(attendanceId);

      if (!attendance?.checkout) {
        attendance.checkout =
          new Date(attendance.checkIn).getTime() + 4 * 60 * 60 * 1000;
        attendance.workingHours = 4;
        ((attendance.dayType = "Half Day"),
          (attendance.status = "LATE"),
          await attendance.save());
      }
    }
  },
);

// send email to admin , if admin does not take action on leave application within 24 hours

const leaveApplicationReminder = inngest.createFunction(
  { id: "leave-application-reminder", triggers: [ { event: "/leave/pending" }] },
 

  async ({ event, step }) => {
    const { leaveApplicationId } = event.data;

    // wait for 24 hours
    await step.sleepUntil(
      "wait-for-the-24-hours",
      new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    );

    const leaveApplication = await leave.findById(leaveApplicationId);

    if (leaveApplication?.status === "PENDING") {
      const employee = await Employee.findById(leaveApplication.employeeId);

      // send reminder emaol to admin take actioon on leave applicatiopn

      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `Leave Application Reminder`,
        body: "HEllo Admin"
      })
    }
  },
);

// cron: check attendane at 11:30 am ist and email absent employee

const attendanceReminderCron = inngest.createFunction(
  { id: "attendance-reminder-cron", triggers: [  { cron: "0 0 6 * * *" }] }, 
  // six oclock UTC = 11:30 AM IST

  async ({ step }) => {
    // step1 : get today date range

    const today = await step.run("get-today-date", () => {
      const startUTC = new Date(
        new Date().toLocaleDateString("en-CA", {
          timeZone: "Asia/Kathmandu",
        }) + "T00:00:00+05:45",
      );

      const endUTC = new Date(startUTC.getTime() + 24 * 60 * 60 * 1000);

      return {
        startUTC: startUTC.toISOString(),
        endUTC: endUTC.toISOString(),
      };
    });

    // step 2L Get al active , non-deleted employees
    const activeEmployees = await step.run("get-active-employees", async () => {
      const employees = await Employee.find({
        isDeleted: false,
        employmentStatus: "ACTIVE",
      }).lean();

      return employees.map((e) => ({
        _id: e._id.toString(),
        firstName: e.firstName,
        lastName: e.lastName,
        email: e.email,
        department: e.department,
      }));
    });

    // step 3 get employee id on approeves leave today

    const onLeaveIds = await step.run("get-on-leave-id", async () => {
      const leaves = await leave
        .find({
          status: "APPROVED",
          startDate: { $lte: new Date(today.endUTC) },
          endDate: { $gte: new Date(today.startUTC) },
        })
        .lean();

      return leave.map((l) => l.employeeId.toString());
    });

    // step 4 get employee if who alreadyu check in today

    const checkedInIds = await step.run("get-checked-in-ids", async () => {
      const attendances = await Attendance.find({
        date: { $gte: new Date(today.startDate), $lt: new Date(today.endDate) },
      }).lean();

      return attendances.map((a) => a.employeeId.toString());
    });

    // step5 filter absent employees not pn leave and not checked in

    const absentEmployees = activeEmployees.filter(
      (emp) => !onLeaveIds.includes(emp._id) && !checkedInIds.includes(emp._id),
    );

    // step 6 send reminr email
    if (absentEmployees.length > 0) {
      await step.run("send-reminder-emails", async () => {
        const emailPromises = absentEmployees.map((emp) => {
          // send email

          sendEmail({
            to: emp.email,
            subject: `Attendance Reminder - Please mark your attendance`,
            body: "Hello"
          })
        });
      });
    }

    return {
      totalActive: activeEmployees.length,
      onLeave: onLeaveIds.length,
      checkedIn: checkedInIds.length,
      absent: absentEmployees.length,
    };
  },
);

// Create an empty array where we'll export future Inngest functions
export const functions = [
  autoCheckOut,
  leaveApplicationReminder,
  attendanceReminderCron,
];
