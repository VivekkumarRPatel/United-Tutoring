const AWS = require('aws-sdk');

var dynamodb = new AWS.DynamoDB({
    apiVersion: '2012-08-10'
});
//reference taken from - https://momentjs.com/
const moment = require("moment");

async function saveSlotDetails(startTime, endTime, tutorId, date) {

    //Logic to calculate number of slots 
    const minutes = "60";
    let slotStartNumber = 1;

    let mementInterMediateEndTime = moment(startTime, "HH:mm").add(minutes, "minutes").format("HH:mm");
    let momentStartTime = moment(startTime, "HH:mm").format("HH:mm");
    let momentEndTime = moment(endTime, "HH:mm").format("HH:mm");

    var slots = [];

    while (moment(mementInterMediateEndTime, "HH:mm").isSameOrBefore(moment(momentEndTime, "HH:mm"))) {

        const slot = {
            PutRequest: {
                Item: {
                    "id": { "S": "S" + slotStartNumber + date+tutorId },
                    "startTime": { "S": momentStartTime },
                    "endTime": { "S": mementInterMediateEndTime },
                    "slotstatus": { "S": "OPEN" },
                    "tutorID": { "S": tutorId },
                    "date": { "S": date },
                }
            }
        }
        //coverted time range to one hour slots and pushing it to slots
        slots.push(slot);
        momentStartTime = mementInterMediateEndTime;
        mementInterMediateEndTime = moment(momentStartTime, "HH:mm").add(minutes, "minutes").format("HH:mm");
        slotStartNumber = slotStartNumber + 1;
    }


    const putparams = {
        RequestItems: {
            "slots": slots
        }
    };

    return new Promise(function(resolve, reject) {
        //reference taken from - https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/dynamodb-example-table-read-write-batch.html
        dynamodb.batchWriteItem(putparams, function(err, data) {
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


async function saveAvailability(startTime, endTime, date, tutorId) {

    var availability = {
        'id': {
            S: tutorId + date
        },
        'date': {
            S: date
        },
        'startTime': {
            S: startTime
        },
        'endTime': {
            S: endTime
        }
    };

    var params = {
        TableName: 'availability',
        Item: availability
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



exports.handler = async (event, context) => {

    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
        'access-control-allow-headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'access-control-allow-methods': 'OPTIONS,POST',
        'access-control-allow-origin': '*'
    };
    let customResponse = {
        itemFound: false
    };

    try {
        body = JSON.parse(event.body);
        let userId = body.id;
        let date = body.date;
        let startTime = body.startTime;
        let endTime = body.endTime;

        let key = userId + date;
       
        var searchParams = {
            TableName: 'availability',
            Key: {
                'id': { S: key }
            }
        }

        try {

            const data = await dynamodb.getItem(searchParams).promise();

            if (data.Item) {
                customResponse.itemFound = true; //if exists then return true and in UI error message will be shown
            }
            else {
                await saveAvailability(startTime, endTime, date, userId); //save availability 
                await saveSlotDetails(startTime, endTime, userId, date); //save slot details
            }
        }
        catch (err) {
            console.log("Error while retrieving get item");
        }

    }
    catch (err) {
        statusCode = '400';
        body = err.message;
    }
    finally {
        body = JSON.stringify(customResponse);
    }

    return {
        statusCode,
        body,
        headers,
    };
};
