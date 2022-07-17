import "./tutor.css";
import 'antd/dist/antd.min.css'

import * as Yup from "yup";
import moment from 'moment'
import axios from "axios";


import { Formik, Form, Field } from "formik";
import { TimePicker,DatePicker, Space } from 'antd';
import { Typography, Button } from 'antd';
import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";

import { SAVE_AVAILABILITY } from '../../apis/Availability';

const { Title } = Typography;

const Tutor=( props )=>{
  const requestData =  {id:'',date:'',startTime:'',endTime:''}

  const [requestError,setRequestError] = React.useState(false);
  const [submitProcess,setSubmitProcess] = React.useState(false);

  const {auth, setAuth} = props;

  useEffect(() => {
    setAuth({
      ...auth,profileType:'tutor'
    })
  },[])

  const navigate = useNavigate();

  const onChangeDate = (date, dateString) => {
    requestData.date = dateString;
  };

  const onChangeTime = (time, timeString) => {
    requestData.startTime = timeString[0]
    requestData.endTime = timeString[1]
  };

  const onSubmitHandle = () => {
    requestData.id = localStorage.getItem('username');
    if(requestData.date && requestData.id && requestData.startTime && requestData.endTime){

      var data = JSON.stringify(requestData);
      
      var config = {
        method: 'post',
        url: SAVE_AVAILABILITY,
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      };

      axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
          navigate('availability')
        })
        .catch(function (error) {
          console.log(error);
        }).finally(function () {
          setSubmitProcess(false);
        })

      setSubmitProcess(true)
      setRequestError(false)
    }else{
      setRequestError(true)
    }
  }

    return (
      <>
        <section style={{ textAlign: 'center' }}>
          <Title level={2}>Enter your availability</Title>
          <section>
            <Space direction="vertical" size={12}>
              <DatePicker disabledDate={(current) => {
                return moment().add(-1, 'days') >= current ||
                  moment().add(1, 'month') <= current;
              }} format={'DD-MM-YYYY'} onChange={onChangeDate} />
            </Space>
            <TimePicker.RangePicker format={'HH:mm'} onChange={onChangeTime} />
          </section>
          <section style={{ marginTop: '2.5%' }}>
            <Button type='primary' onClick={onSubmitHandle} loading={submitProcess}> Submit </Button>
            <Button style={{marginLeft:'2.5%'}} type='primary' onClick={()=>navigate('availability')}> See All Availabilities </Button>
          </section>
        </section>
      </>
      );
    
}

export default Tutor;