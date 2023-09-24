import React, { useState, useContext, useRef, useEffect } from "react";
import CircleType from "circletype";


const CircleText = () => {
    const circleInstance = useRef();

    useEffect(() => {
        let circle1
        if (circleInstance.current) {
            circle1 = new CircleType(circleInstance.current).radius(500)
        };
        return () => {
            circle1 && circle1.destroy();
        };
    }, []);

    return (
        <div className="question">
            <div className="circle-font" ref={circleInstance}>What Do You Need?</div>
        </div>
    )
}

export default CircleText
