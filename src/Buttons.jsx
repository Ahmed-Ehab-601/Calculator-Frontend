function Buttons(props) {

  const buttonValues =['%','CE','C','DEL','1/x',
    'x\u00B2','\u221Ax',"\u00F7",'7','8',
    '9','\u00D7','4','5','6','-','1','2','3','+',
    '+/-','0','.','='];

  const buttonDiv = buttonValues.map((value)=>{

    const buttonClass = ["%", "CE", "C", "DEL", "1/x", "x\u00B2", "\u221Ax", "\u00F7", 
      "\u00D7", "-", "+","="].includes(value)? "operator-button" : "number-button";

    return (<button className={buttonClass} key={value} onClick={()=>props.fn(value)}>{value}</button>);
});


  return (
    <div className="buttons">

      {buttonDiv}
      
    </div>
  );
}

export default Buttons;