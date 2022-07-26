var AWS = require("aws-sdk");
const s3 = new AWS.S3();

AWS.config.update({
    region: "us-east-1"
});
const dynamo = new AWS.DynamoDB.DocumentClient();
var dynamodb = new AWS.DynamoDB({
    apiVersion: "2012-08-10"
});
//reference taken from - https://stackoverflow.com/questions/41915438/node-js-aws-dynamodb-updateitem
async function updateItemDb(params) {
    return new Promise(function(resolve, reject) {
        dynamo.update(params, function(err, data) {
            if (err) resolve(false);
            else resolve(true);
        });
    });
}

async function setExpiredSlotStatus() {
        try {
            var dateToday = new Date();
            const is_before_date = (date1, date2) => date1 >= date2;
            var hours = dateToday.getHours();
            var minutes = dateToday.getMinutes();
            if(hours-10<0) {
             hours = '0'+hours;
            }
            var nowtime =hours+':'+minutes;
                var params = {
                    TableName: "slots"
                };
                //reference taken from - https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/dynamodb-example-query-scan.html
                var result = await dynamodb.scan(params).promise();
                console.log(JSON.stringify(result));
                for (let i = 0; i < result.Items.length; i++) {
                    var dateInDb = result.Items[i].date.S;
                    var dd = dateInDb.split('-')[0];
                    var mm = dateInDb.split('-')[1];
                    var yyyy = dateInDb.split('-')[2];
                    var isLessThanEqualToDate = is_before_date(new Date(dateToday.getFullYear(), dateToday.getMonth()+1, dateToday.getDate()), new Date(yyyy, mm, dd));
                    var timeInDb = result.Items[i].endTime.S;
                      var slotstatus = result.Items[i].slotstatus.S;
                    
                    if(isLessThanEqualToDate && timeInDb<nowtime ){
                        console.log(dateInDb);
                        console.log(timeInDb);
                        const params = {
                        TableName: "slots",
                        Key: {
                            "id": result.Items[i].id.S
                        },
                        UpdateExpression: "set slotstatus = :s",
                        ExpressionAttributeValues: {
                            ":s": 'EXPIRED'
                        },
                        ReturnValues: "UPDATED_NEW"
                        };
                        await updateItemDb(params);
                    }
                }
            } catch (error) {
                console.error(error);
            }
}
exports.handler = async (event, context) => {
    console.log("Running CRON job!");
    await setExpiredSlotStatus();
};
