import React from 'react'

const City = (props) => {
    return (
        <div>
            <p>
                Date : {props.date} <br />
                Weather : {props.weather} <br />
                Temperature : {props.temp.toPrecision(2)} Celcius
            </p>

        </div>
    )
}

export default City