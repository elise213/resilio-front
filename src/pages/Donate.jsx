import React from 'react'
import { Link } from "react-router-dom";

const Donate = () => {
    return (
        <div className='donate-page'>
            <div className='donate-text'>
                <p className='tell-us'>We would greatly appreciate donations to help us get this website up and running. Please contact us <Link to="/contact">here </Link> and we will send you information on how you can support the project. Thank you so much.</p>
            </div>
        </div>
    )
}

export default Donate
