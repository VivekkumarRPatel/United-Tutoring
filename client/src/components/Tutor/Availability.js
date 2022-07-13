import axios from 'axios';

import { useEffect, useState } from 'react';
import { Typography, Spin, List } from 'antd'

import { GET_AVAILABILITY } from '../../apis/Availability';
import { useLocation } from 'react-router-dom';

const { Title } = Typography;
export default function Availability(params) {
    const [getProcess, setGetProcess] = useState(true)
    const [availability, setAvailability] = useState({});

    useEffect(() => {
        getAvailability()
    },[])

    const location = useLocation();

    const userId = location.state || localStorage.getItem('username')
    console.log(userId)

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
                setAvailability(response.data)
            })
            .catch(function (error) {
                console.log(error);
            }).finally(()=>{
                setGetProcess(false)
            });
    }

    return (<section>
        <Title level={2}> Availability </Title>
        {getProcess 
            ? <Spin size='large' /> 
            : <List
                header= {
                    <List.Item>
                        <Title level={5}>Date</Title>
                        <Title level={5}>Start Time</Title>
                        <Title level={5}>End Time</Title>
                        <Title level={5}>Status</Title>
                    </List.Item>
                }
                itemLayout="horizontal"
                dataSource={availability}
                renderItem={item => (
                    <List.Item>
                        <Title level={5}>{item.date.S}</Title>
                        <Title level={5}>{item.startTime.S}</Title>
                        <Title level={5}>{item.endTime.S}</Title>
                        <Title level={5}>{item.status.S}</Title>
                    </List.Item>
                )}
        />}
    </section>)
}