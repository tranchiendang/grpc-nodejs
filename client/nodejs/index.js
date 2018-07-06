const grpc = require('grpc');
const path = require('path');

const protoPath = path.join(__dirname, '../..', 'proto');
const wl_message = grpc.load({ root: protoPath, file: 'work_leave.proto' });

const client = new wl_message.work_leave.EmployeeLeaveDaysService('0.0.0.0:3000', grpc.credentials.createInsecure());

const employees = {
    valid: {
        employee_id: 1,
        name: 'John Kariuki',
        accrued_leave_days: 10,
        requested_leave_days: 4
    },
    ineligible: {
        employee_id: 1,
        name: 'John Kariuki',
        accrued_leave_days: 10,
        requested_leave_days: 20
    },
    invalid: {
        employee_id: 1,
        name: 'John Kariuki',
        accrued_leave_days: 10,
        requested_leave_days: -1
    },
    illegal: {
        foo: 'bar'
    }
};

client.eligibleForLeave(employees.valid, (err, res) => {
    if (!err){
        if (res.eligible) {
            client.grantLeave(employees.valid, (err, res) => {
                console.log(JSON.stringify(res));
            })
        } else {
            console.log("You are currently ineligible for leave days");
        }
    } else {
        console.log("Error: ", err.message);
    }
});