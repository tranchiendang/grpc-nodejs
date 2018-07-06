const grpc = require("grpc");
const path = require("path");

const PROTO_PATH = path.join(__dirname, 'proto', 'work_leave.proto');

const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });
var protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
var wl_message = protoDescriptor.work_leave;

const server = new grpc.Server();

server.addService(wl_message.EmployeeLeaveDaysService.service, {
    eligibleForLeave(call, callback) {
        if(call.request.requested_leave_days > 0){
            if (call.request.accrued_leave_days > call.request.requested_leave_days) {
                callback(null, { eligible: true });
            } else {
                callback(null, { eligible: false });
            }-1
        } else {
            callback(new Error("Invalid requested days"));
        }
    },

    grantLeave(call, callback) {
        let granted_leave_days = call.request.requested_leave_days;
        let accrued_leave_days = call.request.accrued_leave_days - granted_leave_days;
    
        callback(null, {
            granted: true,
            granted_leave_days,
            accrued_leave_days
        });
    }
});

server.bind('0.0.0.0:3000', grpc.ServerCredentials.createInsecure());

server.start();
console.log('grpc server running on port: 3000');