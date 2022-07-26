const AWS = require('aws-sdk');

var dynamodb = new AWS.DynamoDB({
    apiVersion: '2012-08-10'
});

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
    let status = "PENDING";

    const searchParams = {

        "TableName": "bookingdetails",
        "FilterExpression": "#tutorId = :tutorIdValue  AND  #studentId = :studentIdValue AND #bookingstatus = :bookingstatusValue",

        "ExpressionAttributeNames": {
            "#tutorId": "tutorId",
            "#studentId": "studentId",
            "#bookingstatus": "bookingstatus"
        },

        "ExpressionAttributeValues": {
            ":tutorIdValue": { "S": tutorid },
            ":studentIdValue": { "S": studentid },
            ":bookingstatusValue": { "S": status }
        }
    }


    let data = null;
    let slotIdList = [];

    try {

        data = await dynamodb.scan(searchParams).promise();

        data.Items.forEach(function(item) {
            
            slotIdList.push(item.slotId.S);
        });

        console.log("Records retrieve successfully");
    }
    catch (err) {
        console.log("Error while retrieving records");
    }

    const response = {
        statusCode: 200,
        body: JSON.stringify(slotIdList),
        headers
    };
    return response;
};
