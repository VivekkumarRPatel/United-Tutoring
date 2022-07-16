import "./Profile.css";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import CreatableSelect from 'react-select/creatable';
import React, { useState } from 'react';

//https://react-select.com/home

let skillvalues = [
  { value: 'ocean', label: 'Ocean' },
  { value: 'english', label: 'English' },
  { value: 'chinese', label: 'Chinese' },
  { value: 'roman', label: 'Roman' }
]

let coursesValue = [
  { value: 'cs', label: 'CS' },
  { value: 'mechanical', label: 'ELE' },
  { value: 'electrical', label: 'ME' },
  { value: 'ASDC', label: 'MACS' }
]


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
        <div class="form-group ">
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
        <div class="form-group ">
          <label>Filed experience</label>
          <input
            type="number"
            class="form-control"
            placeholder="Enter years of experience"
            name="fieldExperience"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.fieldExperience}
          />
          {errors.fieldExperience && touched.fieldExperience ? (
            <small class="error">{errors.fieldExperience}</small>
          ) : null}
        </div>
        <div class="form-group ">
          <label>Experience Description</label>
          <input
            type="text"
            class="form-control"
            placeholder="Enter Description"
            name="desc"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.desc}
          />
          {errors.desc && touched.desc ? (
            <small class="error">{errors.desc}</small>
          ) : null}
        </div>
        <center>
          <button
            type="submit"
            class="btn btn-primary"
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
        <div class="form-group ">
          <label>Courses</label>
          <CreatableSelect
            isMulti
            value={courses}
            options={coursesValue}
            onChange={courseChange}
            name="courses"
          />
        </div>
        <div class="form-group ">
          <label>University</label>
          <input
            type="text"
            class="form-control"
            placeholder="Enter University"
            name="university"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.university}
          />
          {errors.university && touched.university ? (
            <small class="error">{errors.university}</small>
          ) : null}
        </div>
        <div class="form-group ">
          <label>Program</label>
          <input
            type="text"
            class="form-control"
            placeholder="Enter Program"
            name="program"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.program}
          />
          {errors.program && touched.program ? (
            <small class="error">{errors.program}</small>
          ) : null}
        </div>

        <div class="form-group ">
          <label>Start Year</label>
          <input
            type="number"
            class="form-control"
            placeholder="Enter Start Year"
            name="startYear"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.startYear}
          />
          {errors.startYear && touched.startYear ? (
            <small class="error">{errors.startYear}</small>
          ) : null}
        </div>
        <div class="form-group ">
          <label>End Year</label>
          <input
            type="number"
            class="form-control"
            placeholder="Enter End Year"
            name="endYear"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.endYear}
          />
          {errors.endYear && touched.endYear ? (
            <small class="error">{errors.endYear}</small>
          ) : null}
        </div>

        <center>
          <button
            type="submit"
            class="btn btn-primary"
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
        <div class="form-group ">
          <label>Firstname</label>
          <input
            type="text"
            class="form-control"
            placeholder="Enter First Name"
            name="firstName"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.firstName}
          />
          {errors.firstName && touched.firstName ? (
            <small class="error">{errors.firstName}</small>
          ) : null}
        </div>
        <div class="form-group ">
          <label>Lastname</label>
          <input
            type="text"
            class="form-control"
            placeholder="Enter Last Name"
            name="lastName"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.lastName}
          />
          {errors.lastName && touched.lastName ? (
            <small class="error">{errors.lastName}</small>
          ) : null}
        </div>
        <div class="form-group ">
          <label>Email</label>
          <input
            type="text"
            class="form-control"
            placeholder="Enter email"
            name="email"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.email}
          />
          {errors.email && touched.email ? (
            <small class="error">{errors.email}</small>
          ) : null}
        </div>
        <div class="form-group ">
          <label>Mobile No</label>
          <input
            type="text"
            class="form-control"
            placeholder="Enter Mobile No"
            name="mobileNo"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.mobileNo}
          />
          {errors.mobileNo && touched.mobileNo ? (
            <small class="error">{errors.mobileNo}</small>
          ) : null}
        </div>
        <div class="form-group">
          <img
            src={profilePic}
            alt="profile pic"
            className="rounded-circle img-fluid image-size"
          />
        </div>
        <div class="form-group">
          <label>Profile pic</label>
          <input
            type="file"
            class="form-control"
            placeholder="Upload profile picture"
            name="file"
            onChange={(event) => { fileUpload(event.currentTarget.files[0]) }}
          />
        </div>
        <center>
          <button
            type="submit"
            class="btn btn-primary"
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



const generalValues = {
  firstName: "",
  lastName: "",
  email: "",
  mobileNo: ""
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

const generalValidator = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),

  lastName: Yup.string().required("Last name is required"),

  mobileNo: Yup.string().required("Mobile no is required"),
  email: Yup.string()
    .required("Email is required")
    .email("Invalid Email Address"),
});

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

  const tutorSubmit = (values) => {
    console.log("tutor" + values.desc);
    console.log(skills)
  }

  const studentSubmit = (values) => {
    console.log("student" + values.university);
    console.log(courses);
  }

  const generalSubmit = (values) => {
    console.log("general" + values);
    console.log(profilePic)
  }

  return (
    <div class="signup-container">
      <Formik
        initialValues={generalValues}
        validationSchema={generalValidator}
        onSubmit={generalSubmit}
        // children={GeneralForm}
        component={(props) => <GeneralForm {...props} setProfilePic={setProfilePic}  profilePic={profilePic} ></GeneralForm>}


      />
      {localStorage.getItem('tutor') !== null ? 
      <Formik
        initialValues={tutorInitialValues}
        validationSchema={tutorValidator}
        onSubmit={tutorSubmit}
        component={(props) => <TutorForm {...props} setSkills={setSkills} skills={skills}></TutorForm>}
      />:null}

{localStorage.getItem('student') !== null ? 
      <Formik
        initialValues={studentInitialValues}
        validationSchema={studentValidator}
        onSubmit={studentSubmit}
        component={(props) => <StudentForm {...props} setCourses={setCourses} courses={courses}></StudentForm>}
      />:null}

    </div>
  );

}

export default Profile;