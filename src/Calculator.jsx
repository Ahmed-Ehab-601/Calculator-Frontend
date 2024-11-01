import Display from "./Display";
import Buttons from "./Buttons";
import { useState } from "react";
function Calculator() {
  let [input, setInput] = useState("");
  let [history, setHistory] = useState("");
  let [equalPressed, setPressed] = useState(false);

  const calculateResult = async () => {
    try {
      let x = setExpression();
      console.log(x);
      const response = await fetch(
        `http://localhost:8080/calculator/api/calculate?expression=${encodeURIComponent(
          x
        )}`
      );
      if (response.ok) {
        let data = await response.text();
        if (data == "Infinity") {
          data = "E";
        }
        setInput(data); // Display the result
      } else {
        console.error("Error calculating:", response.statusText);
      }
    } catch (error) {
      console.error("Error calculating:", error);
    }
  };

  const lastOperand = () => {
    for (let i = input.length - 1; i >= 0; i--) {
      if (isOperand(input[i])) {
        return input[i];
      }
    }
    return "";
  };

  const adddDot = () => {
    let dot = false;
    for (let j = input.length; j >= 0; j--) {
      if (input[j] == ".") {
        dot = true;
      }
      if (isOperand(input[j])) {
        return !dot;
      }
    }
    return !dot;
  };

  const isOperand = (x) => {
    return (
      x == "+" ||
      x == "-" ||
      x == "\u00D7" ||
      x == "\u00B2" ||
      x == "\u221A" ||
      x == "\u00F7" ||
      x == "/" ||
      x == ")" ||
      x == "("
    );
  };

  const getLast = () => {
    // get last number without aperands
    let i;
    for (i = input.length - 1; i >= 0; i--) {
      if (isOperand(input[i]) && input[i] != ")") {
        break;
      }
    }
    if (input[i] == "(") {
      return input.substring(i, input.length);
    }
    return input.substring(i + 1, input.length);
  };

  const pow = (i, input) => {
    // give it index of power char and string return the string needed to be putted inside
    let j;
    for (j = i - 1; j >= 0; j--) {
      if (isOperand(input[j]) && input[j] != ")" && input[j] != "-" && input[j] != '\u00B2') {
        break;
      } else if (input[j] == "-" && j > 0 && input[j - 1] == "(") {
        j--;
        break;
      }
      if(input[j] == '-'){
        break;
      }
    }
    if ((j == 0 && input[j]!= '\u221A')|| input[j] == "(") {
      // if the stop is not bad operand
      return input.substring(j, i);
    } else {
      // if we stop on operand don't take it
      return input.substring(j + 1, i);
    }
  };
  const root = (i, input) => {
    // give it index of root char and string return the string needed to be putted inside
    let j;
    for (j = i + 1; j < input.length; j++) {
      if (isOperand(input[j]) && input[j] != "(") {
        break;
      }
    }
    if (j == input.length) {
      // if the stop is not bad operand
      return input.substring(i + 1, j);
    } else if (input[j] == ")") {
      return input.substring(i + 1, j + 1);
    } else {
      // if we stop on operand don't take it
      return input.substring(i + 1, j);
    }
  };

  const setExpression = () => {
    // return the exp  which can be send to back
    let x = input;
    for (let i = 0; i < x.length; i++) {
      if (x[i] == "\u00B2") {
        let y = pow(i, x);
        let z =y;
        y = y.replaceAll('(','&');
        y = y.replaceAll(')','^');
        y = y.replace('-','#');
        x = x.replace(z + "\u00B2", `Math.pow&${y},2^`);
      }
    }
    for(let i=0;i<x.length;i++){
    if (x[i] == "\u221A") {
      //root
      let y = root(i, x);
      x = x.replace("\u221A" + y, `Math.sqrt&${y}^`);
    }
    }
    x = x.replaceAll("\u00D7", "*");
    x = x.replaceAll("\u00F7", "/");
    x = x.replaceAll('&','(');
    x = x.replaceAll('^',')');
    x = x.replaceAll('()','');
    x = x.replaceAll('#','-');
    x = x.replaceAll("%", "/100");
    return x;
  };

  const handleButtonClick = (value) => {
    if (value == "C" || value == "CE") {
      setInput("");
      setHistory("");
      setPressed(false);
    } else if (value == "DEL") {
      if (input.length == 1 || equalPressed) {
        setInput("");
        setHistory("");
        setPressed(false);
      }else if(input[input.length-1] == ')'){
        let y = pow(input.length,input);
        setInput(input.replace(y,''));

      } else {
        setInput(input.substring(0, input.length - 1));
        setPressed(false);
      }
    } else if (value == "1/x") {
      let x = lastOperand();
      if (
        input.length &&
        !isOperand(input[input.length - 1]) &&
        x != "/" &&
        x != "\u00B2" &&
        x != "\u221A"
      ) {
        setInput(() => {
          setPressed(false);
          let n = getLast().length;
          let x = input.substring(0, input.length - n);
          return x + "1/" + getLast();
        });
      }
    } else if (value == "x\u00B2") {
      let x = lastOperand();
      let y = input[input.length - 1];
      if (
        input.length &&
        (!isOperand(y) || y == ")" || y == "\u221A") &&
        x != "/" &&
        x != "\u00B2"
      ) {
        setInput(input + "\u00B2");
        setPressed(false);
      }
    } else if (value == "\u221Ax") {
      let x = lastOperand();
      let y = input[input.length - 1];
      if (
        input.length &&
        (!isOperand(y) || y == ")" || y == '\u00B2') &&
        x != "/" &&
        x != "\u221A"
      ) {
        setInput(() => {
          setPressed(false);
          let n = pow(input.length,input).length;
          let x = input.substring(0, input.length - n);
          return x + "\u221A" +pow(input.length,input);
        });
      }
    } else if (isOperand(value) && value != "-") {
      let x = input[input.length - 1];
      if(input.length==1 && input[0] == '-'){ 
        return;
      }
      if (
        isOperand(x) &&
        x != "\u00B2" &&
        x != "(" &&
        x != ")" &&
        x != "\u221A"
      ) {
        setInput(() => {
          setPressed(false);
          let x = input.substring(0, input.length - 1);
          return x + value;
        });
      } else if (input.length && x != "." && x != "\u221A") {
        setInput(input + value);
        setPressed(false);
      }
    } else if (value == "-") {
      let y = input[input.length - 1];
      if ( y == "-" || y == "." || y == "\u221A") {
        return;
      } else if (input[input.length - 1] == "+") {
        setInput(() => {
          setPressed(false);
          let x = input.substring(0, input.length - 1);
          return x + value;
        });
      } else {
        setPressed(false);
        setInput(input + value);
      }
    } else if (value == "%") {
      if (!isOperand(input[input.length - 1])) {
        setInput(input + value);
        setPressed(false);
      }
    } else if (value == "+/-") {
      if (!isOperand(input[input.length - 1]) || input[input.length-1] ==')') {
        setInput(() => {
          setPressed(false);
          if (lastOperand() != "-") {
            let y = pow(input.length,input);
            let n = y.length;
            let x = input.substring(0, input.length - n);
            if(y[0] == '(' && y[1] == '-'){
             
              return x+y.replace('-','');
            }
            else if(y[0] == '('){
             
              return x + y.replace('(','(-');
            } 
            return x + "(" + "-" + y + ")";
          } else {
            let y = pow(input.length,input);
            let n = y.length;
            let x = input.substring(0, input.length - n - 1);
            if(y[0] == '(' && y[1] == '-'){
    
              return x+y.replace('-','');
            }
            else if(y[0] == '('){
           
              return x + y.replace('(','(-');
            } 
            return x + "+" + "(" + y + ")";
          }
        });
      }
    } else if (value == ".") {
      if(equalPressed){
        setInput("");
        setHistory("");
        return;
      }
      if (!isOperand(input[input.length - 1]) && adddDot()) {
        setInput(input + value);
        setPressed(false);
      }
    } else if (value == "=") {
      if(!input.length || equalPressed){
        return;
      }
      let x = input[input.length - 1];
      if (!isOperand(x) || x == ")" || x == "\u00B2") {
        setHistory(input);
        console.log(input);
        calculateResult();
        setPressed(true);
        // fetch here
        
      }
    } else {
      let x = input[input.length - 1];
      if (
        x == "-" ||
        x == "+" ||
        x == "\u00D7" ||
        x == "\u00F7" ||
        x == "." ||
        !isOperand(x) ||
        x == "\u221A"
      ) {
        if(equalPressed){
          setInput(value);
          return;
        }
        setInput(input + value);
        setPressed(false);
      }
    }
  };

  return (
    <div className="Calculator">
      <Display input={input} history={history} />
      <Buttons fn={handleButtonClick} />
    </div>
  );
}

export default Calculator;
