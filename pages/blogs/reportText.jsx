import React, { useEffect } from "react";
const reportText = () =>{
    const removeOffensiveWords = () =>{
        const Filter = require("bad-words");
        const filter = new Filter();
        let textTobeReported = "Don't be idiot";
        let reportedText = filter.clean(textTobeReported);

        if (textTobeReported === reportedText) {
            console.log(0);    
        }
        else{
            console.log(1)
        }
            }
    return(
        <button onClick = {removeOffensiveWords}> hi</button>

    );
};
export default reportText;