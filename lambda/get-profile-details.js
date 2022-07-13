const AWS = require('aws-sdk');

var ddb = new AWS.DynamoDB({
    apiVersion: '2012-08-10'
});

//reference taken from - https://www.fernandomc.com/posts/eight-examples-of-fetching-data-from-dynamodb-with-node/
async function getUserDetails(params) {
    return new Promise(function(resolve, reject) {
        ddb.getItem(params, function(err, data) {
            if (err) {
                console.log(err);
                resolve("");
            } else {
                resolve(data);
            }
        })
    });
}

async function getTutorList(params) {
    return new Promise(function(resolve, reject) {
        console.log("here")
        ddb.scan(params, function(err, data) {
            if (err) {
                console.log(err);
            } else {
                
                var tutors = "{\"tutors\":[";
                data.Items.forEach(function(element) {
                    var firstName = "{\"firstName\":\"" + element.firstName.S + "\",";
                    var lastName = "\"lastName\":\"" + element.lastName.S + "\",";
                    var mobileNo = "\"mobileNo\":\"" + element.mobileNo.S + "\",";
                    var email = "\"email\":\"" + element.id.S + "\",";
                    var expyears = "\"expyears\":" + element.expyears.N + ",";
                    var expdesc = "\"expdesc\":\"" + element.expdesc.S + "\",";
                    var skills = "\"skills\":\"" + element.skills.S + "\"";
                    var tutor = firstName + lastName + mobileNo + email + expyears + expdesc + skills + "},";
                    tutors = tutors + tutor;
                });
                tutors = tutors.slice(0, -1);
                console.log("here es"+tutors);
                resolve(tutors + "]}");
            }
        })
    });
}

exports.handler = async (event, context) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));

    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
        'access-control-allow-headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'access-control-allow-methods': 'OPTIONS,POST',
        'access-control-allow-origin': '*'
    };

    if (JSON.parse(event.body).id) {
        var userType = JSON.parse(event.body).userType;

        if (userType.indexOf(',') != -1) {
            var paramsTutor = {
                TableName: 'tutor-details',
                Key: {
                    'id': {
                        S: JSON.parse(event.body).id
                    }
                }
            };
            var tutordetails = await getUserDetails(paramsTutor);
            var paramsStudent = {
                TableName: 'student-details',
                Key: {
                    'id': {
                        S: JSON.parse(event.body).id
                    }
                }
            };

            var studentdetails = await getUserDetails(paramsStudent);

            body = {
                "firstName": tutordetails.Item.firstName.S,
                "lastName": tutordetails.Item.lastName.S,
                "mobileNo": tutordetails.Item.mobileNo.S,
                "email": tutordetails.Item.id.S,
                "expyears": tutordetails.Item.expyears.S,
                "expdesc": tutordetails.Item.expdesc.S,
                "skills": tutordetails.Item.skills.S,
                "courses": studentdetails.Item.courses.S,
                "program": studentdetails.Item.program.S,
                "university": studentdetails.Item.university.S,
                "startyear": studentdetails.Item.startyear.S,
                "endyear": studentdetails.Item.endyear.S,
            };

        } else {
            if (userType === "tutor") {
                var paramsTutor = {
                    TableName: 'tutor-details',
                    Key: {
                        'id': {
                            S: JSON.parse(event.body).id
                        }
                    }
                };
                var tutordetails = await getUserDetails(paramsTutor);
                body = {
                    "firstName": tutordetails.Item.firstName.S,
                    "lastName": tutordetails.Item.lastName.S,
                    "mobileNo": tutordetails.Item.mobileNo.S,
                    "email": tutordetails.Item.id.S,
                    "expyears": tutordetails.Item.expyears.S,
                    "expdesc": tutordetails.Item.expdesc.S,
                    "skills": tutordetails.Item.skills.S
                };

            } else {
                var paramsStudent = {
                    TableName: 'student-details',
                    Key: {
                        'id': {
                            S: JSON.parse(event.body).id
                        }
                    }
                };

                var studentdetails = await getUserDetails(paramsStudent);
                body = {
                    "firstName": studentdetails.Item.firstName.S,
                    "lastName": studentdetails.Item.lastName.S,
                    "mobileNo": studentdetails.Item.mobileNo.S,
                    "email": studentdetails.Item.id.S,
                    "courses": studentdetails.Item.courses.S,
                    "program": studentdetails.Item.program.S,
                    "university": studentdetails.Item.university.S,
                    "startyear": studentdetails.Item.startyear.S,
                    "endyear": studentdetails.Item.endyear.S,
                };
            }
        }
        body = JSON.stringify(body);
    } else if (JSON.parse(event.body).skills) {
        console.log("has skills");
        if (JSON.parse(event.body).skills === " ") {
            console.log("has skills=");
            const params = {
                TableName: "tutor-details",
            };
            body = await getTutorList(params);
            console.log("body:"+body);
        } else {
        var skillset = JSON.parse(event.body).skills.split(",");
        var tutorsSet = new Set();
        for (let i = 0; i < skillset.length; i++) {
            console.log(skillset[i]);
            var getparams = {
                TableName: 'skills',
                Key: {
                    'skill': {
                        S: skillset[i]
                    }
                }
            };

            var tutorList = await getUserDetails(getparams);
            console.log(tutorList);
            if (tutorList.Item) {
                for (let j = 0; j < tutorList.Item.tutors.SS.length; j++) {
                    console.log(tutorList.Item.tutors.SS[j]);
                    tutorsSet.add(tutorList.Item.tutors.SS[j]);
                }

            }
        }
        if (tutorsSet.size > 0) {
            console.log("here")
            //body = "{\"tutors\":"+JSON.stringify(Array.from(tutorsSet))+"}";
            var tutorDetailsArr = [];
            for (var ele of tutorsSet) {
                console.log("ele" + ele);
                var paramsTutor = {
                    TableName: 'tutor-details',
                    Key: {
                        'id': {
                            S: ele
                        }
                    }
                };
                var tutordetails = await getUserDetails(paramsTutor);
                console.log("tutor" + JSON.stringify(tutordetails));
                var tutorDetails = {
                    "firstName": tutordetails.Item.firstName.S,
                    "lastName": tutordetails.Item.lastName.S,
                    "mobileNo": tutordetails.Item.mobileNo.S,
                    "email": tutordetails.Item.id.S,
                    "expyears": tutordetails.Item.expyears.S,
                    "expdesc": tutordetails.Item.expdesc.S,
                    "skills": tutordetails.Item.skills.S
                };
                tutorDetailsArr = tutorDetailsArr + JSON.stringify(tutorDetails) + ",";
            }
            body = "{\"tutors\":[" + tutorDetailsArr + "]}";

        } else {
            body = "{\"tutors\":[]}";
        }
    }
    }

    return {
        statusCode,
        body,
        headers,
    };
};
