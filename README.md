## United Tutoring

- [Introduction](#introduction)
- [Authors](#authors)
- [Features](#features)
- [Feedback](#feedback)
- [Contributors](#contributors)
- [Build Process](#build-process)
- [Backers](#backers-)
- [Sponsors](#sponsors-)
- [Acknowledgments](#acknowledgments)




## Introduction 

* One to One Tutor and student session management
United Tutoring is an online platform for one-to-one tutoring. This online platform caters to two
types of users: tutors who impart knowledge and students who seek knowledge. Students can use
this platform to interact with registered tutors and get all their questions answered when they are
having difficulty understanding a concept or want to learn something new. Besides improving their
overall understanding of a subject or topic, this also assists them in trying out and learning
something new. A user can be both a tutor as well as a student.

* Tutors must create an account and list their skills and experience in their expertise. Registered
students can search by skill and obtain a list of tutors who specialize in that subject. Students can
then go to each tutor's profile and arrange an appointment with whichever tutor appears to be
pertinent to their question. Moreover, tutors will be able to enter their available dates and time
range, which will subsequently be transformed into one-hour slots. A real-time schedule of tutors'
slots will be available for students, and they will be able to schedule accordingly. When a student
requests a booking, it appears on the tutor's my booking requests page. A link to a Zoom meeting
will be sent to both participants if the tutor approves the booking request. If the tutor rejects the
request, the student will receive an email notifying them of the rejection. Every hour, a Cronjob
runs to update the status of sessions that have expired. In addition, tutors can view their entered
availabilities and all requests, including accepted, rejected, and pending requests.

* *Date Created*: 01 MAY 2022
* *Last Modification Date*: 26 JULY 2022
* *Demo URL*: <https://www.youtube.com/watch?v=lJaXV4cw8fo/>
* *Git URL*: <https://git.cs.dal.ca/courses/2022-summer/csci4145-5409/group-23/-/tree/main/> 

## Authors

* [Vivekkumar Patel](vv662564@dal.ca) (B00874162) - *(Developer)*
* [Keyur Vaghani](ky360972@dal.ca) (B00901000) - *(Developer)*
* [Manali Shah](lokansh.gupta@dal.ca) (B00890746) - *(Developer)*


## Features
* User Profile Management
* Tutor's Availability Management
* Booking Sessions
* Accepting or Rejecting Requests
* Email Notification
* Real Time Status Management
* Searching based on S`kills

## Getting Started

To have a local copy of this project up and running on your local machine, refer the sections below.
### Prerequisites

First you need to install the following software / libraries / plug-ins

* Node.js
* npm

See the following section for detailed step-by-step instructions on how to install this software / libraries / plug-ins

### Installing

Installation of Node.js and npm can be found at https://nodejs.org/en/

Run the following commands to check successful installation:

* node -v
* npm -v

To run this project on local follow the below steps:

* Run 'git clone https://git.cs.dal.ca/aabhaas/group_14_backend_csci5709' for cloning files of this repository to local machine.
* Run 'npm install' for installing dependencies.
* Run 'npm run build' to build the app.
* Run the app using 'npm start'.
* Open browser and run http://localhost:8080/ to run the app in the browser.

## Deployment

This project is deployed on Heroku server. Follow below steps for deployment:

1. Go to https://www.heroku.com/ and sign in with your account.
2. Create a new app and give it a name.
3. In your terminal, run 'heroku login'.
4. After successful login, run 'heroku git:clone -a {APP_NAME}$ {APP_NAME}' where APP_NAME is the name provided in step 2.
5. Run 'git add .' to add all the files.
6. Run  'git commit -am MESSAGE' where MESSAGE is any string which can be used to identify the commit.
7. Run 'git push heroku master' to push the code.
8. Heroku will build the code after completion of push operation.
9. Click on 'Open App' from the heroku website window to view the deployed app.

## Built With

United Tutoring has been build with following technology stack.

* [![React][React.js]][React-url]
* [![Bootstrap][Bootstrap.com]][Bootstrap-url]



## Acknowledgments

* Nodejs Documentation - [node.js](https://nodejs.org/en/docs/)


<!-- LINKS & IMAGES -->
[React-url]: https://reactjs.org/
[Bootstrap-url]: https://getbootstrap.com