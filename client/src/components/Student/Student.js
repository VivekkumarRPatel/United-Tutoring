import axios from "axios";

import { Spin, Table, Typography, Tag, Space, Button, Input } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GET_TUTOR_DETAILS } from '../../apis/Tutor';


const { Column, ColumnGroup } = Table;
const { Search } = Input;
const {Title} = Typography;


export default function Student(props) {
    const [getProcess, setGetProcess] = useState(true);
    const [tutorData, setTutorData] = useState([]);

    const navigate = useNavigate();
    const {auth, setAuth} = props;

    useEffect(() => {
        getTutorList();

        setAuth({
            ...auth,profileType:'student'
          })
    }, [])

    function getTutorList() {
        var data = JSON.stringify({
            "skills": " "
        });

        var config = {
            method: 'post',
            url: GET_TUTOR_DETAILS,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                console.log(response.data.tutors);

                setTutorData(response.data.tutors)
                setGetProcess(false)
            })
            .catch(function (error) {
                setGetProcess(false)
                console.log(error);
            });
    }


    function onSeach(str) {
        if (str !== '') {
            setGetProcess(true)
            var data = JSON.stringify({
                "skills": str
            });

            var config = {
                method: 'post',
                url: GET_TUTOR_DETAILS,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };

            axios(config)
                .then(function (response) {
                    setGetProcess(false)
                    setTutorData(response.data.tutors);
                })
                .catch(function (error) {
                    setGetProcess(false)
                    console.log(error);
                });
        }
    }


    return (
        <section>
            {getProcess
                ? <Spin key='spin' size='large' />
                :
                <section>
                    <Search
                        placeholder="Search Tutors by Skills"
                        allowClear
                        onSearch={onSeach}
                        style={{ width: 304 }}
                    />
                    <Table dataSource={tutorData} key='table' rowKey='table'>
                        <ColumnGroup title="Name" key='name'>
                            <Column title="First Name" dataIndex="firstName" key="firstName" />
                            <Column title="Last Name" dataIndex="lastName" key="lastName" />
                        </ColumnGroup>
                        <Column title="Experience Years" dataIndex="expyears" key="expyears" />
                        <Column title="Description" dataIndex="expdesc" key="expdesc" />
                        <Column
                            title="Skills"
                            dataIndex="skills"
                            key="skills"
                            render={(skills) => {
                                return (<>
                                    {skills.split(',').map((skill, key) => (
                                        <Tag color="blue" key={key}>
                                            {skill}
                                        </Tag>
                                    ))}
                                </>)
                            }}
                        />
                        <Column
                            key="action"
                            render={(_, record) => {
                                return (
                                    <Space size="middle">
                                        <Button onClick={() => { navigate('../tutor/availability', { state: record.email }) }} type='primary'>Book Session</Button>
                                    </Space>
                                )
                            }}
                        />
                    </Table>
                </section>
            }
        </section>
    );
}
