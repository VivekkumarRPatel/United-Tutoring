import axios from 'axios';


import { useEffect, useState } from 'react';
import { Typography, Spin, List, Button } from 'antd'


import { GET_AVAILABILITY, SAVE_AVAILABILITY } from '../../apis/Availability';
import { useLocation } from 'react-router-dom';


const { Title } = Typography;


export default function Availability(props) {
    const [getProcess, setGetProcess] = useState(true)
    const [availability, setAvailability] = useState({});
    const { auth, setAuth } = props


    useEffect(() => {
        getAvailability()
    }, [])


    const location = useLocation();


    const userId = location.state || localStorage.getItem('username')


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

        axios(config)
            .then(function (response) {
                const listedData = []
                const username = localStorage.getItem('username');

                response.data.map((d) => {
                    const date = new Date(d.date.S.split('-')[2]
                        , d.date.S.split('-')[1] - 1
                        , d.date.S.split('-')[0])
                        console.log(new Date(date.toDateString()) , new Date(new Date().toDateString()))
                    if (new Date(date.toDateString()) >= new Date(new Date().toDateString())) {

                        // if(auth.profileType == 'tutor'){
                            listedData.push(d)
                        // }
                        // else if( username !=  d.tutorID.S){
                        //     listedData.push(d)
                        // }
                    }
                })
                console.log(listedData);
                setAvailability(listedData)
            })
            .catch(function (error) {
                console.log(error);
            }).finally(() => {
                setGetProcess(false)
            });
    }

    function bookAppointment() {
        var data = JSON.stringify({
            "tutorid": "",
            "studentid": "",
            "slotid": "",
            "status": ""
        });

        var config = {
            method: 'post',
            url: SAVE_AVAILABILITY,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    function goBack() {
        window.history.back()
    }


    return (<section>
        <div style={{display:'flex'}}> 
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
                        <Title level={5}>{item.date.S}</Title>
                        <Title level={5}>{item.startTime.S}</Title>
                        <Title level={5}>{item.endTime.S}</Title>
                        <Title level={5}>{item.slotstatus.S}</Title>
                        { auth.profileType == 'student' ? <Button onClick={bookAppointment} type='primary'>Book Now</Button> : <div/>}
                    </List.Item>
                )}
            />}
    </section>)
}