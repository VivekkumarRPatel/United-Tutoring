const AWS = require('aws-sdk');
var sns = new AWS.SNS();
const dynamodb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});
const jwt = require("jsonwebtoken");
const requestPromise = require("request-promise");
// var dynamodb = new AWS.DynamoDB({
//     apiVersion: '2012-08-10'
// });



async function updateBookingStatus(bookingId, status) {

    // var updateBookingParam = {
    //     'bookingId': {
    //         S: bookingId
    //     },
    //     'status': {
    //         S: status
    //     }
    // };


    const params = {
        TableName: "bookingdetails",
        // this is your DynamoDB Table 
        Key: {
            "bookingId": bookingId,
            //find the itemId in the table that you pull from the event 
        },
        UpdateExpression: "set bookingstatus = :bookingstatus",
        // This expression is what updates the item attribute 
        ExpressionAttributeValues: {
            ":bookingstatus": status,
            //create an Expression Attribute Value to pass in the expression above
        }
    };

    // var params = {
    //     TableName: 'bookingdetails',
    //     Item: updateBookingParam
    // };

    return new Promise(function(resolve, reject) {

        dynamodb.update(params, function(err, data) {
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


async function updateSlotStatus(slotId, status) {

 
    const params = {
        TableName: "slots",
        // this is your DynamoDB Table 
        Key: {
            "id": slotId,
            //find the itemId in the table that you pull from the event 
        },
        UpdateExpression: "set slotstatus = :slotstatus",
        // This expression is what updates the item attribute 
        ExpressionAttributeValues: {
            ":slotstatus": status,
            //create an Expression Attribute Value to pass in the expression above
        }
    };
    

    return new Promise(function(resolve, reject) {

        dynamodb.update(params, function(err, data) {
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



async function sendEmailNotification(emailIds,message,subject,topicArn) {
   console.log('in sendEmailNotification');
   console.log(emailIds);
   console.log(message);
   console.log(subject);
   console.log(topicArn);
return new Promise(function(resolve, reject) {
    var params = {
  Message: message,
  MessageAttributes: {
    'email': {
      DataType: 'String', 
     
      StringValue:emailIds
    }
   
  },
  MessageStructure: 'string',
  Subject: subject,
  TopicArn: topicArn
};
console.log("params"+params)
sns.publish(params, function(err, data) {
  if (err) {
               console.log(err);
                resolve(false);
            } else {
               console.log(data);
                resolve(true);
            }        
});
});
}

async function generateZoomLink(){
    return new Promise(function(resolve, reject) {
        const payload = {
        iss: "CV0weZ51RkmBp3R7VeVE2Q", //your API KEY
        exp: new Date().getTime() + 5000,
    };

    const token = jwt.sign(payload, "DGf8yITtA5jxHYDuMuDRcZCMKpfyKJ00elxP");

    var email = "patelvivek221996@gmail.com";

    var options = {
        method: "POST",
        uri: "https://api.zoom.us/v2/users/" + email + "/meetings",
        body: {
            topic: "Session booked", //meeting title
            type: 1,
            settings: {
                host_video: "true",
                participant_video: "true",
            },
        },
        auth: {
            bearer: token,
        },
        headers: {
            "User-Agent": "Zoom-api-Jwt-Request",
            "content-type": "application/json",
        },
        json: true, //Parse the JSON string in the response
    };
    requestPromise(options)
        .then(function (response) {
            console.log("response is: ", response);
            var tutorLink = response.start_url;
            var studentLink = response.join_url;
            resolve(tutorLink+","+studentLink);
            //res.send("create meeting result: " + JSON.stringify(response));
        })
        .catch(function (err) {
            // API call failed...
            console.log("API call failed, reason ", err);
        });
    });
}
exports.handler = async (event) => {
await generateZoomLink();
var topicArn = 'arn:aws:sns:us-east-1:861474768799:sendBookingUpdate';
    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
        'access-control-allow-headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'access-control-allow-methods': 'OPTIONS,POST',
        'access-control-allow-origin': '*'
    };

    body = JSON.parse(event.body);
    let bookingId = body.bookingId;
    let tutorId = body.tutorId;
    let studentId = body.studentId;
    let slotId = body.slotId;
    let action = body.action;
    console.log("HERERERERRE"+bookingId);

    if (action === "CONFIRM") {

        await updateSlotStatus(slotId, "BOOKED");
        await updateBookingStatus(bookingId, "CONFIRM");
        var links = await generateZoomLink();
        var tutorLink = links.split(',')[0];
        var studentLink = links.split(',')[1];
        var messageTutor = "zoom link:"+tutorLink;
        var messageStudent = "zoom link:"+studentLink;
        var subject = "Booking is Confirmed";
        //await sendEmailNotification('['+tutorId+']',messageTutor,subject,topicArn);
        //await sendEmailNotification('['+studentId+']',messageStudent,subject,topicArn);
        await sendEmailNotification(tutorId,messageTutor,subject,topicArn);
        await sendEmailNotification(studentId,messageStudent,subject,topicArn);
//send email to tutor n student 
    }
    else if (action === "REJECT") {
        await updateBookingStatus(bookingId, "REJECT");
         var message = "booking rejected";
         var subject = "Your Booking is Rejected";
         var emailId = '['+studentId+']';
         //await sendEmailNotification(emailId,message,subject,topicArn);
         await sendEmailNotification(emailId,message,subject,topicArn);
        //send email to student
    }


    const response = {
        statusCode: 200,
        body: JSON.stringify({ updateRequest: true }),
        headers,
    };
    return response;
};
