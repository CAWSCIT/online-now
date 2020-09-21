import React, { useState, useEffect }  from 'react';
import './App.css';
import {  Timeline, List, Select, Divider } from 'antd';
import {  ClockCircleOutlined  } from '@ant-design/icons';
import moment from 'moment-timezone'
import axios from 'axios'

const generateHours = (timezone, n) => {
  let hours = []
  for (let offset = 0; offset < n; offset++) {
    hours.push(moment().tz(timezone).add(offset, 'hours').startOf('hour'))
  }
  return hours
}

function to_timezone(timezone, meetingTimezone, meetingTime) {
  meetingTime = moment.tz(meetingTime, "HH:mm:ss", meetingTimezone)
  return meetingTime.tz(timezone)
}

function App() {

  const [meetings, setMeetings] = useState([])
  const [timezone, setTimezone] = useState(moment.tz.guess())
  const [hours, setHours] = useState(generateHours(timezone, 4))
  useEffect(() => {
    console.log("Timezone changed to", timezone)
    //TODO Check correctness of query
    axios.get(`https://meetings.ca.org/api/v1/meetings?virtual=true&order=day&current_day=${moment().tz(timezone).day() - 1}`).then(res => {

      setMeetings(res.data.map(meeting => {
        meeting.time = to_timezone(timezone, meeting.timezone, meeting.time)
        return meeting
      }))
    })

    setHours(generateHours(timezone, 4))
    // empty dependency array means this effect will only run once (like componentDidMount in classes)
  }, [timezone]);


  return (
    <div style={{padding: "24px"}}>
      <Divider>
      <Select showSearch defaultValue={timezone} style={{ width: 240 }} onChange={setTimezone}>
        {moment.tz.names().map(name => <Select.Option value={name}>{name}</Select.Option>)}
      </Select>
      </Divider>
      <Timeline mode="left">
        {hours.map(hour => {
          return (
            <Timeline.Item dot={<ClockCircleOutlined style={{ fontSize: '16px' }} />}>
            <p>{hour.format("H") + ":00"}</p>
            <List
            size="small"
            itemLayout="horizontal"
            dataSource={meetings.filter(meeting => {
              let meeting_hour = meeting.time.clone().startOf('hour')
              return meeting_hour.isSame(hour) && meeting.day === hour.format("dddd")
            })}
            renderItem={meeting => (
              <List.Item>
                <List.Item.Meta
                  title={<>{meeting.name} <span style={{color:"grey"}}>{meeting.time.format("H:mm:ss")} {meeting.day}</span></>}
                  description={
                    <p>{meeting.group.location.instructions} - ({meeting.group.location.virtual_location})</p>
                  }
                />
              </List.Item>
            )}
            />
          </Timeline.Item>
        )
        })}
      </Timeline>
    </div>
  );
}

export default App;
