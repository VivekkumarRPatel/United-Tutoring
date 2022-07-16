var AWS = require("aws-sdk");
const s3 = new AWS.S3();
var body = "";
AWS.config.update({
    region: "us-east-1"
});

var dynamodb = new AWS.DynamoDB({
    apiVersion: "2012-08-10"
});
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
                var result = await dynamodb.scan(params).promise();
                console.log(JSON.stringify(result));
                for (let i = 0; i < result.Items.length; i++) {
                    var studentId = "\"studentId\":\"" + result.Items[i].studentId.S + "\",";
                    var slotId = "\"slotId\":\"" + result.Items[i].slotId.S + "\",";
                    var bookingStatus = "\"bookingStatus\":\"" + result.Items[i].bookingstatus.S + "\",";
                    var date = "\"date\":\"" + result.Items[i].date.S + "\"";
                    var booking = "{"+studentId + slotId +bookingStatus+ date+"}";
                    console.log(booking);
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
    };
    let bookingStr="";
    try {
        var BookingList = await getTutorBookings(event.queryStringParameters.id);
            for (const booking of BookingList) {
                bookingStr = bookingStr + booking + ",";
            }
            body = '{"Bookings":[' + bookingStr.slice(0, -1) + ']}';
        
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
