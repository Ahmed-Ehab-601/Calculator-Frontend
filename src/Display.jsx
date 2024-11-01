
function Display(props){

    return(
    
        <div className="display">
            <div className="history">
                <p className="prev">{props.history}</p>
            </div>
            <div className="input">
                <p className="now">{props.input}</p>
            </div>
        </div>
    );
}

export default Display;