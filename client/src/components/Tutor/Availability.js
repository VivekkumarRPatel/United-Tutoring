import axios from 'axios';


import { useEffect, useState } from 'react';
import { Typography, Spin, List, Button } from 'antd'


import { GET_AVAILABILITY, SAVE_AVAILABILITY, SAVE_SLOT_BOOKING, GET_BOOKING_SLOT_PENDING_STATUS } from '../../apis/Availability';
import { useLocation } from 'react-router-dom';


const { Title } = Typography;


export default function Availability(props) {
    const [getProcess, setGetProcess] = useState(true)
    const [availability, setAvailability] = useState([]);
    // const [slotIdList, setSlotIdList] = useState([]);
    const { auth, setAuth } = props

    //loginUser is a student who is booking the session.
    const loginUser = localStorage.getItem('username');

    useEffect(() => {
        getAvailability()
    }, [])


    const location = useLocation();


    const userId = location.state || localStorage.getItem('username');




    function getAvailability() {
        var data = JSON.stringify({
            'userid': userId
        });
        var config = {
            method: 'post',
            url: GET_AVAILABILITY,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        
        setGetProcess(true);

        axios(config)
            .then(function (response) {
                const listedData = []
                const username = localStorage.getItem('username');

                
                response.data.map((d) => {
                    const date = new Date(d.date.S.split('-')[2]
                        , d.date.S.split('-')[1] - 1
                        , d.date.S.split('-')[0])
                    console.log(new Date(date.toDateString()), new Date(new Date().toDateString()))
                    if (new Date(date.toDateString()) >= new Date(new Date().toDateString())) {

                        // if(auth.profileType == 'tutor'){
                        listedData.push(d)
                        // }
                        // else if( username !=  d.tutorID.S){
                        //     listedData.push(d)
                        // }
                    }
                })


                //Get all slot id whose booking request is in pending status
                var searchParam = JSON.stringify({
                    'tutorid': userId,
                    'studentid': loginUser,
                });


                var requestConfig = {
                    method: 'post',
                    url: GET_BOOKING_SLOT_PENDING_STATUS,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: searchParam
                };

                console.log("requestConfig");
                console.log(requestConfig);



                axios(requestConfig)
                    .then(function (response) {

                        console.log("response.data of having booking in pening status");
                        console.log(response.data);
                        // setSlotIdList(response.data);
                        let slotIdList=response.data;


                        let finalListedData = [];
                        console.log("Before filterring all slots");
                        console.log(listedData);
                        console.log("List slot id having booking in pening status");
                        console.log(slotIdList);
        
                        listedData.forEach(slot => {
                            let slotID = slot.id.S;
                            let isRecordExist = false;
                            console.log("Outer loop");

                            slotIdList.forEach(slotId => {
                                console.log("Inner loop");    

                                if (slotId === slotID) {
                                    console.log("Inside if");
                                    isRecordExist = true;
                                }
                            })
        
                            if (!isRecordExist) {
                                finalListedData.push(slot);
                            }
                        })
        
                        
                        console.log("After filterring all slots");
                        console.log(finalListedData);
                        setAvailability(finalListedData);    
                        setGetProcess(false);

                    })
                    .catch(function (error) {
                        console.log(error);
                    })
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    function bookAppointment(slotid, slotDate) {
        var data = JSON.stringify({
            "tutorid": userId,
            "studentid": loginUser,
            "slotid": slotid.S,
            "slotDate": slotDate
        });

        var config = {
            method: 'post',
            url: SAVE_SLOT_BOOKING,
            data: data,
        };

        axios(config)
            .then(function (response) {

                if (response.data.slotBooked) {
                    console.log("slot has been booked");
                } else {
                    console.log("slot has not been booked");
                }

            })
            .catch(function (error) {
                console.log(error);
            }).finally(() => {
                setGetProcess(false)
            });
    }


    function goBack() {
        window.history.back()
    }


    return (<section>
        <div style={{ display: 'flex' }}>
            <Button onClick={goBack} >Back</Button>
            <Title level={2}> Availability </Title>
        </div>
        {getProcess
            ? <Spin size='large' />
            : <List
                header={
                    <List.Item>
                        <Title level={5}>Date</Title>
                        <Title level={5}>Start Time</Title>
                        <Title level={5}>End Time</Title>
                        <Title level={5}>Status</Title>
                        <Title level={5} />
                    </List.Item>
                }
                itemLayout="horizontal"
                dataSource={availability}
                renderItem={item => (
                    <List.Item>
                        <Title level={5}>{item?.date.S}</Title>
                        <Title level={5}>{item?.startTime.S}</Title>
                        <Title level={5}>{item?.endTime.S}</Title>
                        <Title level={5}>{item?.slotstatus.S}</Title>
                        {auth.profileType == 'student' ? <Button onClick={() => bookAppointment(item?.id, item?.date.S)} type='primary'>Book Now</Button> : <div />}
                    </List.Item>
                )}
            />}
    </section>)
}