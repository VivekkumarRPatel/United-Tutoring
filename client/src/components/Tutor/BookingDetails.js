import { Table, Space, Button, Typography, Spin, Tag, Tooltip, message, List } from "antd";
import {CheckCircleTwoTone, CloseCircleTwoTone} from '@ant-design/icons'
import axios from "axios";

import { useEffect, useState } from "react"
import { GET_TUTOR_BOOKINGS, UPDATE_BOOKING } from "../../apis/Tutor";

const { Column, ColumnGroup } = Table;
const { Title } = Typography

export default function BookingDetails(params) {
    const [rejectedBookings, setRejectedBookings] = useState([]);
    const [pendingBookings, setPendingBookings] = useState([]);
    const [confirmBookings, setConfirmBookings] = useState([]);

    const [getProcess, setGetProcess] = useState(true);

    useEffect(() => {
        loadBookings();
    }, [])

    function loadBookings() {
        var config = {
            method: 'get',
            // url: GET_TUTOR_BOOKINGS + '?id=' + localStorage.getItem('username'),
            url: 'https://8z9upjgji0.execute-api.us-east-1.amazonaws.com/dev/get-tutor-bookings?id=' + localStorage.getItem('username'),
            headers: {}
        };

        axios(config)
            .then(async function (response) {

                var rejecteds = [];
                var confirms = [];
                var pendings = [];
                await response.data?.Bookings.map((booking) => {
                    if (booking.bookingStatus === 'REJECT') {
                        rejecteds = [...rejecteds,booking];
                        // setRejectedBookings([...rejectedBookings, booking])
                    } else if (booking.bookingStatus === 'CONFIRM') {
                        confirms = [...confirms,booking]
                        // console.log(booking,'confirm');
                        // setConfirmBookings([...confirmBookings, booking])
                    } else if (booking.bookingStatus === 'PENDING') {
                        pendings = [...pendings,booking]
                        // console.log(pendingBookings);
                        // setPendingBookings([...pendingBookings, booking])
                    }
                })
                // setTempData(response.data.Bookings)
                setConfirmBookings(confirms);
                setPendingBookings(pendings);
                setRejectedBookings(rejecteds);
                setGetProcess(false)
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function confirmBooking(record) {
        setGetProcess(true);

        var data = JSON.stringify({
            "bookingId": record.bookingId,
            "tutorId": localStorage.getItem('username'),
            "studentId": record.studentId,
            "slotId": record.slotId,
            "action": "CONFIRM"
          });

          var config = {
            method: 'post',
            url: UPDATE_BOOKING,
            headers: { 
              'Content-Type': 'application/json'
            },
            data : data
          };

        axios(config)
            .then(function (response) {
                message.success('Booking Confirmed');
                console.log(JSON.stringify(response.data));
                loadBookings();
            })
            .catch(function (error) {
                loadBookings();
                console.log(error);
            }).finally(()=>{
                setGetProcess(false);
            });
    }
    
    function rejectBooking(record) {
        setGetProcess(true);

        var data = JSON.stringify({
            "bookingId": record.bookingId,
            "tutorId": localStorage.getItem('username'),
            "studentId": record.studentId,
            "slotId": record.slotId,
            "action": "REJECT"
          });

          var config = {
            method: 'post',
            url: UPDATE_BOOKING,
            headers: { 
              'Content-Type': 'application/json'
            },
            data : data
          };

        axios(config)
            .then(function (response) {
                message.success('Booking REJECTED');
                console.log(JSON.stringify(response.data));
                loadBookings();
            })
            .catch(function (error) {
                loadBookings();
                console.log(error);
            }).finally(()=>{
                setGetProcess(false);
            });
    }

    return (
        <section>
            {
                getProcess
                    ? <Spin size='large' />
                    :
                    <div>
                        <Title level={3}> Pending Bookings </Title>
                        <Table dataSource={pendingBookings} key='pendingtable'>
                            <Column title="Studnet Name" dataIndex="studentId" key="studentId" />
                            <Column
                                title="Booking Status"
                                dataIndex="bookingStatus"
                                key="bookingStatus"
                                render={(bookingStatus) => {
                                    return (
                                        <Tag color="yellow">
                                            {bookingStatus}
                                        </Tag>
                                    )
                                }}
                            />
                            <Column title="Date" dataIndex="date" key="date" />
                            <Column title="Date" dataIndex="startTime" key="startTime" />
                            <Column title="Date" dataIndex="endTime" key="endTime" />
                            <Column
                                key="action"
                                render={(_, record) => {
                                    return (
                                        <>
                                        <Tooltip title="confirm">
                                           <CheckCircleTwoTone onClick={() => confirmBooking(record)} style={{ fontSize: '150%'}} twoToneColor="#52c41a" />
                                        </Tooltip>
                                        <Tooltip title="reject">
                                        <CloseCircleTwoTone onClick={ () => rejectBooking(record)} style={{ fontSize: '150%', marginLeft:'15%'}} twoToneColor="#d90909" />
                                     </Tooltip>
                                     </>
                                    )
                                }}
                            />
                        </Table>

                        <Title level={3}> Rejected Bookings </Title>
                        <Table dataSource={rejectedBookings} key='rejecttable' >
                            <Column title="Studnet Name" dataIndex="studentId" key="studentId" />
                            <Column
                                title="Booking Status"
                                dataIndex="bookingStatus"
                                key="bookingStatus"
                                render={(bookingStatus) => {
                                    return (
                                        <Tag color="red">
                                            {bookingStatus}
                                        </Tag>
                                    )
                                }}
                            />
                            <Column title="Date" dataIndex="date" key="date" />
                            <Column title="Date" dataIndex="startTime" key="startTime" />
                            <Column title="Date" dataIndex="endTime" key="endTime" />
                        </Table>

                        <Title level={3}> Confirm Bookings </Title>
                        <Table dataSource={confirmBookings} key='confirmTable' >
                            <Column title="Studnet Name" dataIndex="studentId" key="studentId" />
                            <Column
                                title="Booking Status"
                                dataIndex="bookingStatus"
                                key="bookingStatus"
                                render={(bookingStatus) => {
                                    return (
                                        <Tag color="green">
                                            {bookingStatus}
                                        </Tag>
                                    )
                                }}
                            />
                            <Column title="Date" dataIndex="date" key="date" />
                            <Column title="Date" dataIndex="startTime" key="startTime" />
                            <Column title="Date" dataIndex="endTime" key="endTime" />
                        </Table>
                    </div>
            }
        </section>
    )
}