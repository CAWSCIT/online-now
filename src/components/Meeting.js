
import React, { useState } from 'react';

function Meetings(props) {

    const [foucsed, setFocused] = useState(null);

    return (
    <>
    <Row className="primary-row">
        <Col span={4}>AA Fyris Gruppen</Col>
        <Col span={4}></Col>
        <Col span={4}>CA Risne</Col>
        <Col span={4}>CA Solna</Col>
        <Col span={4}></Col>
        <Col span={4}>CA Super-sober</Col>
    </Row>
    <Meeting/>
    </>
    )
}

function Meeting(props) {
    return (
    <Row>
        <Col style={{background: "lightblue"}} span={6}>AA Fyris Gruppen</Col>
        <Col span={18}></Col>
    </Row>
    )
}