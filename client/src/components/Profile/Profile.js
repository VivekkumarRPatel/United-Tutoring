import "./Profile.css";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import CreatableSelect from 'react-select/creatable';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
//https://react-select.com/home
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails
} from "amazon-cognito-identity-js";
import pooldetails from "../usermanagement/pooldata.json";
import { ConsoleSqlOutlined } from "@ant-design/icons";



// let skillvalues = [
//   { value: 'ocean', label: 'Ocean' },
//   { value: 'english', label: 'English' },
//   { value: 'chinese', label: 'Chinese' },
//   { value: 'roman', label: 'Roman' }
// ]


let skillvalues = [];

let coursesValue = [];


const onChangeHandle = (value) => {
  console.log("new value is" + value);
};

const TutorForm = ({ values,
  errors,
  touched,
  isValid,
  dirty,
  handleChange,
  setSkills,
  skills,
  handleSubmit,
  handleBlur, }) => {

  const phandleChange = (
    newValue) => {
    console.group('Value Changed');
    console.log(newValue);
    setSkills(newValue)
  };


  return (
    <div>
      <h5>Tutor Details</h5>
      <Form>
        <div className="form-group ">
          <label>Skills</label>
          {/* <Field
        className="custom-select"
        name="skills"
        options={skillvalues}
        component={SelectCreatable}
        placeholder="Select multi skills"
      /> */}
          <CreatableSelect
            isMulti
            value={skills}
            options={skillvalues}
            onChange={phandleChange}
            name="skills"
          />
        </div>
        <div className="form-group ">
          <label>Filed experience</label>
          <input
            type="number"
            className="form-control"
            placeholder="Enter years of experience"
            name="fieldExperience"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.fieldExperience}
          />
          {errors.fieldExperience && touched.fieldExperience ? (
            <small className="error">{errors.fieldExperience}</small>
          ) : null}
        </div>
        <div className="form-group ">
          <label>Experience Description</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Description"
            name="desc"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.desc}
          />
          {errors.desc && touched.desc ? (
            <small className="error">{errors.desc}</small>
          ) : null}
        </div>
        <center>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!(dirty && isValid)}
            onSubmit={handleSubmit}
          >
            Submit Tutor
          </button>
        </center>
      </Form>
    </div>
  );
}



const StudentForm = ({ values,
  errors,
  touched,
  isValid,
  dirty,
  setCourses,
  courses,
  handleChange,
  handleSubmit,
  handleBlur, }) => {


  const courseChange = (
    newValue) => {
    console.group('Value Changed');
    console.log(newValue);
    setCourses(newValue)
  };



  return (
    <div>
      <h5>Student Details</h5>
      <Form>
        <div className="form-group ">
          <label>Courses</label>
          <CreatableSelect
            isMulti
            value={courses}
            options={coursesValue}
            onChange={courseChange}
            name="courses"
          />
        </div>
        <div className="form-group ">
          <label>University</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter University"
            name="university"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.university}
          />
          {errors.university && touched.university ? (
            <small className="error">{errors.university}</small>
          ) : null}
        </div>
        <div className="form-group ">
          <label>Program</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Program"
            name="program"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.program}
          />
          {errors.program && touched.program ? (
            <small className="error">{errors.program}</small>
          ) : null}
        </div>

        <div className="form-group ">
          <label>Start Year</label>
          <input
            type="number"
            className="form-control"
            placeholder="Enter Start Year"
            name="startYear"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.startYear}
          />
          {errors.startYear && touched.startYear ? (
            <small className="error">{errors.startYear}</small>
          ) : null}
        </div>
        <div className="form-group ">
          <label>End Year</label>
          <input
            type="number"
            className="form-control"
            placeholder="Enter End Year"
            name="endYear"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.endYear}
          />
          {errors.endYear && touched.endYear ? (
            <small className="error">{errors.endYear}</small>
          ) : null}
        </div>

        <center>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!(dirty && isValid)}
            onSubmit={handleSubmit}
          >
            Submit Student
          </button>
        </center>
      </Form>


    </div>
  );
}

const GeneralForm = ({ values,
  errors,
  touched,
  isValid,
  dirty,
  handleChange,
  setProfilePic,
  profilePic,
  handleSubmit,
  handleBlur, }) => {

  const fileUpload = (
    file) => {
    console.log("uploaded file")
    console.log(file);
    let reader = new FileReader();
    reader.onloadend = () => {
      setProfilePic(reader.result);
    };
    reader.readAsDataURL(file);
  };


  return (
    <div>
      <h5>General Details</h5>
      <Form>
        <div className="form-group ">
          <label>Firstname</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter First Name"
            name="firstName"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.firstName}
            readOnly={true}
          />
        </div>
        <div className="form-group ">
          <label>Lastname</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Last Name"
            name="lastName"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.lastName}
            readOnly={true}
          />
        </div>
        <div className="form-group ">
          <label>Email</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter email"
            name="email"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.email}
            readOnly={true}
          />
        </div>
        <div className="form-group ">
          <label>Mobile No</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Mobile No"
            name="mobileNo"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.mobileNo}
            readOnly={true}
          />
        </div>
        <div className="form-group">
          <img
            src={profilePic}
            alt="profile pic"
            className="rounded-circle img-fluid image-size"
          />
        </div>
        <div className="form-group ">
          <label>Profile pic</label>
          <input
            type="file"
            className="form-control"
            placeholder="Upload profile picture"
            name="file"
            onChange={(event) => { fileUpload(event.currentTarget.files[0]) }}
          />
        </div>
        <center>
          <button
            type="submit"
            className="btn btn-primary"
            onSubmit={handleSubmit}
          >
            Upload profile picture
          </button>
        </center>
      </Form>
    </div>
  );
}


// localStorage.setItem('username', result.idToken.payload.email);
// localStorage.setItem('firstname', result.idToken.payload.given_name);
// localStorage.setItem('lastname', result.idToken.payload.family_name);
// localStorage.setItem('mobileno', result.idToken.payload.phone_number);



const generalValues = {
  firstName: localStorage.getItem('firstnameCloud'),
  lastName: localStorage.getItem('lastnameCloud'),
  email: localStorage.getItem('username'),
  mobileNo: localStorage.getItem('mobilenoCloud')
}


const studentInitialValues = {
  university: "",
  program: "",
  startYear: 0,
  endYear: 0,
  courses: []
}

const tutorInitialValues = {
  skills: [],
  desc: "",
  fieldExperience: 0
}

// const generalValidator = Yup.object().shape({
//   firstName: Yup.string().required("First name is required"),

//   lastName: Yup.string().required("Last name is required"),

//   mobileNo: Yup.string().required("Mobile no is required"),
//   email: Yup.string()
//     .required("Email is required")
//     .email("Invalid Email Address"),
// });

const studentValidator = Yup.object().shape({
  university: Yup.string().required("Univetsity name is required."),
  program: Yup.string().required("Program name is required."),
  startYear: Yup.number().required("Start year  is required."),
  endYear: Yup.number().required("End year  is required.").moreThan(Yup.ref('startYear'), "End year should be greater than start year")

});

const tutorValidator = Yup.object().shape({
  desc: Yup.string().required("Description is required.")
});


const Profile = () => {

  const [skills, setSkills] = useState([]);

  const [courses, setCourses] = useState([]);

  const [profilePic, setProfilePic] = useState([]);


  useEffect(() => {

    //This API is being called to retrieve profile image on page load.  
    const api = 'https://u9u2p08ohd.execute-api.us-east-1.amazonaws.com/dev/get-profile-img?id=' + localStorage.getItem('username');
    axios
      .get(api, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        crossDomain: true
      })
      .then((response) => {
        console.log("res:" + response.data);
        setProfilePic(response.data);
        //localStorage.setItem('profile-img',response.data);

      })
      .catch((error) => {
        console.error(error);
      });



    //This API is being called to retrieve tutor details on update tutor details submit event
    var data = JSON.stringify({
      "id": localStorage.getItem('username'),
      "userType": localStorage.getItem('userType')
    });
    
    var config = {
      method: 'post',
      url: 'https://8z9upjgji0.execute-api.us-east-1.amazonaws.com/dev/get-user-details',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
    
    axios(config)
    .then(function (response) {
      console.log(response.data);
      console.log(JSON.stringify(response.data));
      
      if(localStorage.getItem("tutor")){

      tutorInitialValues.desc = response.data.expdesc;
      tutorInitialValues.fieldExperience = response.data.expyears;
      let skillsString = response.data.skills;
      if (skillsString) {
        skillvalues=[];


        let skiilArray = skillsString.split(",");

        for (let index = 0; index < skiilArray.length; index++) {

          let skillStringJson = { value: skiilArray[index], label: skiilArray[index].toString().toUpperCase() };
    
          skillvalues.push(skillStringJson);
        }
        console.log("Skills are");
        console.log(skillvalues);
        setSkills(skillvalues);
      }
      
      console.log("After retrieving user skills ");
      console.log(skillvalues);
    }

    if(localStorage.getItem("student")){
      coursesValue=[];  
      studentInitialValues.university=response.data.university;
      studentInitialValues.program=response.data.program;
      studentInitialValues.startYear=response.data.startyear;
      studentInitialValues.endYear=response.data.endyear;

      let courseString = response.data.courses;
      let courseArray = courseString.split(",");

      for (let index = 0; index < courseArray.length; index++) {

        let courseStringJson = { value: courseArray[index], label: courseArray[index].toString().toUpperCase() };
       
        coursesValue.push(courseStringJson);
      }
      setCourses(coursesValue);
      
    }





    })
    .catch(function (error) {
      console.log(error);
    });
    


  }, [])



  const tutorSubmit = (values) => {
    let skillStr = "";
    console.log("tutor" + values.desc);
    skills.forEach(skill => {
      skillStr = skillStr + skill.value + ",";
    });
    skillStr = skillStr.slice(0, -1);
    //console.log(skills[0].value)
    console.log(values.fieldExperience)
    console.log("Skill string is");
    console.log(skillStr);
    const api = 'https://8z9upjgji0.execute-api.us-east-1.amazonaws.com/dev/save-user-details';
    const data = {
      "userType": localStorage.getItem('userType'),
      "email": localStorage.getItem('username'),
      "skills": skillStr,
      "expyears": values.fieldExperience,
      "expdesc": values.desc
    };
    axios
      .post(api, data, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((response) => {
        console.log("res:" + response);
        window.location.reload();

      })
      .catch((error) => {
        console.log(error);
      });
  }

  const studentSubmit = (values) => {
    console.log("student" + values.university);
    console.log(courses);
    let courseStr = "";
    courses.forEach(course => {
      courseStr = courseStr + course.value + ",";
    });
    courseStr = courseStr.slice(0, -1);
    const api = 'https://8z9upjgji0.execute-api.us-east-1.amazonaws.com/dev/save-user-details';
    const data = {
      "userType": localStorage.getItem('userType'),
      "email": localStorage.getItem('username'),
      "university": values.university,
      "program": values.program,
      "courses": courseStr,
      "startyear": values.startYear,
      "endyear": values.endYear
    };
    axios
      .post(api, data, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        crossDomain: true
      })
      .then((response) => {
        console.log("res:" + response);
        window.location.reload();

      })
      .catch((error) => {
        console.log(error);
      });
  }

  const generalSubmit = (values) => {
    console.log(profilePic)
    const api = 'https://u9u2p08ohd.execute-api.us-east-1.amazonaws.com/dev/save-profile-img';
    const data = {
      "file": profilePic,
      "email": localStorage.getItem('username')
    };
    axios
      .put(api, data, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      })
      .then((response) => {
        console.log("res:\n" + response.data.file);
        //localStorage.setItem('img',response.data.file);
        setProfilePic(response.data.file);
        window.location.reload();
        //window.location.href = '/profile';
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className="signup-container">
      <Formik
        initialValues={generalValues}
        // validationSchema={generalValidator}
        onSubmit={generalSubmit}
        // children={GeneralForm}
        component={(props) => <GeneralForm {...props} setProfilePic={setProfilePic} profilePic={profilePic} ></GeneralForm>}


      />
      {localStorage.getItem('tutor') !== null ?
        <Formik
          initialValues={tutorInitialValues}
          validationSchema={tutorValidator}
          onSubmit={tutorSubmit}
          component={(props) => <TutorForm {...props} setSkills={setSkills} skills={skills}></TutorForm>}
        /> : null}

      {localStorage.getItem('student') !== null ?
        <Formik
          initialValues={studentInitialValues}
          validationSchema={studentValidator}
          onSubmit={studentSubmit}
          component={(props) => <StudentForm {...props} setCourses={setCourses} courses={courses}></StudentForm>}
        /> : null}

    </div>
  );

}

export default Profile;