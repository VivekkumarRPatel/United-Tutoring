const AWS = require('aws-sdk');

var dynamodb = new AWS.DynamoDB({
    apiVersion: '2012-08-10'
});

async function saveBooking(bookingno, tutorid, studentid, status,slotId,slotdate) {

       let date = new Date().toLocaleString();
        
        var bookingdetails = {
        'bookingId': {
            S: bookingno
        },
        'tutorId': {
            S: tutorid
        },
        'studentId': {
            S: studentid
        },
        'bookingstatus': {
            S: status
        },
        'slotId': {
            S: slotId
        },
        'reqMadeOn': {
            S: date
        },
        'slotDate': {
            S: slotdate
        }
    };

    var params = {
        TableName: 'bookingdetails',
        Item: bookingdetails
    };

    return new Promise(function(resolve, reject) {
        //reference taken from - https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/dynamodb-example-table-read-write.html
        dynamodb.putItem(params, function(err, data) {
            if (err) {
                console.log(err)
                resolve(false);
            }
            else {
                resolve(true);
            }
        })


    });
}

exports.handler = async (event) => {
    
    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
        'access-control-allow-headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'access-control-allow-methods': 'OPTIONS,POST',
        'access-control-allow-origin': '*'
    };
    
        body = JSON.parse(event.body);
        let tutorid = body.tutorid;
        let studentid = body.studentid;
        let slotid = body.slotid;
        let slotDate = body.slotDate;
        let status="PENDING"; //booking will first be in pending status
        let bookingno="b"+Math.random().toString().substring(2, 8); //generating booking number
    
        const customRes={slotBooked:false,message:""}
        
        try{
            await saveBooking(bookingno, tutorid, studentid, status,slotid,slotDate);
            console.log("Booking done succesfully");
            customRes.slotBooked=true;
            customRes.message="Booking request for the slot has been sent to the tutor for approval";
        }catch(err){
            customRes.message="Error while saving slotbooking";
        }

    const response = {
        statusCode: 200,
        body: JSON.stringify(customRes),
        headers
    };
    return response;
};
