import React from "react";
import House from "./House";

function Main(){

    return(
        <>
        <div className="home-image">
        <House id = "1" />
        <House id = "2" />
        <House id = "3" />
        <House id = "4" />
        <House id = "5" />
        </div>  
        <img className="line" src="images/line.png"  width ="100%" alt="line" />
        </>
    );
}

export default Main;