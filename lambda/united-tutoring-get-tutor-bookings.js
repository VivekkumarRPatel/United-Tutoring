var AWS = require("aws-sdk");
const s3 = new AWS.S3();
var body = "";
AWS.config.update({
    region: "us-east-1"
});

var dynamodb = new AWS.DynamoDB({
    apiVersion: "2012-08-10"
});

//reference taken from - https://www.fernandomc.com/posts/eight-examples-of-fetching-data-from-dynamodb-with-node/
async function getSlotDetails(params) {
    return new Promise(function(resolve, reject) {
        dynamodb.getItem(params, function(err, data) {
            if (err) {
                console.log(err);
                resolve("");
            } else {
                resolve(data);
            }
        })
    });
}

async function getTutorBookings(id) {
    console.log(id)
    var bookingSet = new Set();

    try {
        var params = {
            TableName: "bookingdetails",
            FilterExpression: "tutorId = :id",
            ExpressionAttributeValues: {
                ":id": {
                    S: id
                }
            }
        };
        var result = await dynamodb.scan(params).promise(); //scan table to get all booking of that tutor's id
        console.log(JSON.stringify(result));
        for (let i = 0; i < result.Items.length; i++) {
            var studentId = "\"studentId\":\"" + result.Items[i].studentId.S + "\",";
            var slotId = "\"slotId\":\"" + result.Items[i].slotId.S + "\",";
            console.log(slotId)
            var paramsSlot = {
                TableName: 'slots',
                Key: {
                    'id': {
                        S: result.Items[i].slotId.S
                    }
                }
            };
            var slotdetails = await getSlotDetails(paramsSlot);
            console.log("slot details" + slotdetails.Item.startTime.S);
            var startTime = "\"startTime\":\"" + slotdetails.Item.startTime.S + "\",";
            var endTime = "\"endTime\":\"" + slotdetails.Item.endTime.S + "\",";
            var bookingStatus = "\"bookingStatus\":\"" + result.Items[i].bookingstatus.S + "\",";
            var bookingId = "\"bookingId\":\"" + result.Items[i].bookingId.S + "\",";
            var date = "\"date\":\"" + result.Items[i].slotDate.S + "\"";
            var booking = "{" + studentId + slotId + bookingStatus + startTime + endTime + bookingId + date + "}";

            bookingSet.add(booking);
        }


    } catch (error) {
        console.error(error);
    }


    return bookingSet;
}
exports.handler = async (event, context) => {

    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
        'access-control-allow-headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'access-control-allow-methods': 'OPTIONS,POST',
        'access-control-allow-origin': '*'
    };
    let bookingStr = "";
    try {
        var BookingList = await getTutorBookings(event.queryStringParameters.id);
        for (const booking of BookingList) {
            bookingStr = bookingStr + booking + ",";
        }
        body = '{"Bookings":[' + bookingStr.slice(0, -1) + ']}'; //forming JSON response string

    } catch (err) {
        statusCode = '400';
        body = err.message;
    } finally {
        body = body;
    }

    return {
        statusCode,
        body,
        headers,
    };
};
