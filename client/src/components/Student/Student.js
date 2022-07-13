import { Spin, Table, Typography, Tag, Space, Button } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const {Title} = Typography;
const { Column, ColumnGroup } = Table;

export default function Student(){
const [getProcess,setGetProcess] = useState(false);

const navigate = useNavigate();

const fakeData = [
    {
        id:'anc@gmail.com',
        firstName: 'abc',
        lastName: 'def',
        expyears: 10,
        skills : ['abc','abc','abc'],
        expdesc: 'abcd is dfa'
    }
]

return (
    <section>
        {getProcess 
            ? <Spin key='spin' size='large' /> 
            : <Table dataSource={fakeData} key='table' rowKey='table'> 
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
                    render={(skills) => (
                        <>
                          {skills.map((skill,key) => (
                            <Tag color="blue" key={key}>
                              {skill}
                            </Tag>
                          ))}
                        </>
                      )}
                />
                <Column
                    key="action"
                    render={(_, record) => {
                        return(
                        <Space size="middle">
                            <Button onClick={()=>{navigate('../tutor/availability',{state:record.id})} } type='primary'>Book Session</Button>
                        </Space>
                    )}}
                />
            </Table>}
    </section>
);
}