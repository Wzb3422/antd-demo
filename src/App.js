import React, { useState, useEffect } from 'react';
import { Card, Typography, Col, Row, Statistic, Table, Badge, Divider, Switch } from 'antd';
import {
  CalendarOutlined
} from '@ant-design/icons';
import axios from 'axios'
import dayjs from 'dayjs'
import 'antd/dist/antd.dark.css'

const columns = [
  {
    title: '姓名',
    dataIndex: 'sname',
    key: 'sname',
    width: '10%',
    fixed: 'left'
  },
  {
    title: '身份证号',
    dataIndex: 'sfcard',
    key: 'sfcard',
    width: '14%'
  },
  {
    title: '体温',
    dataIndex: 'tempNumber',
    key: 'tempNumber',
    width: '8%'
  },
  {
    title: '体温状态',
    dataIndex: 'tempNumber',
    key: 'tempNumber',
    render: (tmp) => {
      let num = Number(tmp)
      if (num < 37.2) {
        return (
          <Badge status="success" text='正常'/>
        )
      } else {
        return (
          <Badge status="error" text='异常'/>
        )
      }
    },
    width: '10%',
    fixed: 'right'
  },
  {
    title: '检测时间',
    dataIndex: 'tempTime',
    key: 'tempTime',
  },
  {
    title: '上报地点',
    dataIndex: 'monitorName',
    key: 'monitorName',
  }

];

const App = () => {
  const [counts, setCounts] = useState({total: 9, high: 0, normal: 9})
  const [time, setTime] = useState('')
  const [dataArr, setDataArray] = useState([])
  const [isUpdating, setIsUpdating] = useState(false)
  useEffect(() => {
    (async () => {
      await updateData()
    })()
  }, [])

  useEffect(() => {
    const dateTimer = window.setInterval(() => {
      upDateTime()
    }, 1000)
    const dataTimer= window.setInterval(() => {
      updateData()
    }, 30000)
    return () => {
      window.clearInterval(dataTimer)
      window.clearInterval(dateTimer)
    }
  }, [])

  const updateData = async () => {
    if (isUpdating) {
      return
    }
    setIsUpdating(true)
    const ret = await axios.get('http://demo.wzbspace.top/tpEratureData/index/ph/data/daTperatureInfo/countToday')
      const {total, high, normal} = ret.data.result[0]
      setCounts({total, high, normal})
    const response = await axios.post('http://demo.wzbspace.top/tpEratureData/index/ph/data/daTperatureInfo/tperData', {
      beginReportTime: dayjs().format('YYYY-MM-DD 00:00:00'),
      endReportTime: dayjs().format('YYYY-MM-DD 23:59:59')
    })
    const arr = response.data.result
    if (arr.length > 0) {
      setDataArray(arr)
    }
    setIsUpdating(false)
  }

  const upDateTime = () => {
    console.log('update');
    setTime(dayjs().format('YYYY年MM月DD日 HH:mm:ss'))
  }

  return (
    <>
      <div style={{margin: '14px'}}>
        <Card style={{marginTop: 12}}>
          <div style={{textAlign: 'center'}}>
            <CalendarOutlined />
            <Typography.Text>&nbsp;{time}</Typography.Text>
          </div>
          <Divider/>
          <Row>
            <Col lg={8} md={24} xs={24}>
              <Statistic title="今日检测人数" value={counts.total} />
            </Col>
            <Col lg={8} md={24} xs={24}>
              <Statistic title="体温正常" value={counts.normal} valueStyle={{ color: '#3f8600' }}/>
            </Col>
            <Col lg={8} md={24} xs={24}>
              <Statistic title="体温异常" value={counts.high} valueStyle={{ color: '#cf1322'}}/>
            </Col>
          </Row>
        </Card>
        <Card style={{marginTop: 12}}>
          <Table pagination={{defaultPageSize: 8}} loading={dataArr.length === 0} columns={columns} dataSource={dataArr} key='id'/>
        </Card>
        <div style={{textAlign: 'center', margin: '28px 0px'}}>
          <Typography.Text>Copyright @ 2020 南昌大学人工智能工业研究院 ┆ iData</Typography.Text>
        </div>
      </div>
    </>
  )
};


export default App
