import React from 'react'

const City = (props) => {
    return (
        <div className="col-sm">
            <p>
                {props.day} <br />
                {props.weather} <br />
                {props.temp.toPrecision(3)} <span>&#176;</span>C
            </p>
            <img src={props.icon} alt="{props.weather}" />

        </div>
    )
}

export default City