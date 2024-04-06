// rfc
import React, {useState} from 'react'

export default function TextForm(props) {
    const handleUpClick = () => {
        // console.log("Uppercase was clicked" + text);
        let newText = text.toUpperCase();
        setText(newText)
        props.showAlert("Converted to Uppercase", "success")
    }

    const handleLoClick = () => {
        // console.log("Lowercase was clicked" + text);
        let newText = text.toLowerCase();
        setText(newText)
        props.showAlert("Converted to Lowercase", "success")
    }

    const handleInClick = () => {
        // console.log("Inversecase was clicked" + text);
        let newText = ''
        for(let i=0; i<text.length; i++){
            let char = text[i]
            if(char === char.toUpperCase()){
                newText += char.toLowerCase()
            }else{
                newText += char.toUpperCase()
            }
        }
        setText(newText)
        props.showAlert("Converted to Inversecase", "success")
    }

    const handleUcaClick = () => {
        // console.log("UpperCamelcase was clicked" + text);
        let newText = ''
        let Words = text.split(" ")
        for(let i = 0; i < Words.length; i++){
            let word = Words[i]
            newText += word[0].toUpperCase() + word.slice(1).toLowerCase()
        }
        setText(newText)
        props.showAlert("Converted to Upper Camelcase", "success")
    }

    const handleLcaClick = () => {
        // console.log("LowerCamelcase was clicked" + text);
        
        let newText = ''
        let Words = text.split(" ")
        for(let i = 0; i < Words.length; i++){
            let word = Words[i]
            newText += word[0].toUpperCase() + word.slice(1).toLowerCase()
        }
        newText = newText[0].toLowerCase() + newText.slice(1)
        setText(newText)
        props.showAlert("Converted to Lower Camelcase", "success")
    }

    const handleCtClick = () => {
        // console.log("ClearText was clicked" + text);
        let newText = ''
        setText(newText)
        props.showAlert("Text Cleared", "success")
    }   

    const handleCoClick = () => {
        // console.log("Copy was clicked" + text);
        navigator.clipboard.writeText(text)
        props.showAlert("Text Copied", "success")
    }

    const handlePaClick = () => {
        // console.log("Paste was clicked" + text);
        navigator.clipboard.readText()
        .then(text => {
            setText(text)
        })
        props.showAlert("Text Pasted", "success")
    }

    const handleTtsClick = () => {
        // console.log("Text-to-Speech was clicked" + text);
        let msg = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(msg);
        props.showAlert("Text-to-Speech", "success")
    }

    const handleRasClick = () => {
        // console.log("RemoveAllSpaces was clicked" + text);
        let newText = text.replace(/\s+/g, '')
        setText(newText)
        props.showAlert("Removed All Spaces", "success")
    }

    const handleResClick = () => {
        // console.log("RemoveExtraSpaces was clicked" + text);
        let newText = text.split(/[ ]+/)
        setText(newText.join(" "))
        props.showAlert("Removed Extra Spaces", "success")
    }

    const handleOnClick = (event) => {
        // console.log("On Change was clicked");
        let newText = event.target.value;
        setText(newText)
        props.showAlert("Text Changed", "success")
    }

    const [text, setText] = useState('Enter text here');
    
    return (
        <>
            <div className='container'> 
                <h1>{props.heading}</h1>
                <div className="mb-3">
                    <label htmlFor="text" className="form-label">Enter something into the box....</label>
                    <textarea className="form-control" id="text" rows="10" value={text} onChange={handleOnClick} ></textarea>
                </div>
                <button className="btn btn-primary mx-3 my-3" onClick={handleUpClick}>Upper Case</button>
                <button className="btn btn-primary mx-3 my-3" onClick={handleLoClick}>Lower Case</button>
                <button className="btn btn-primary mx-3 my-3" onClick={handleInClick}>Inverse Case</button>
                <button className="btn btn-primary mx-3 my-3" onClick={handleUcaClick}>Upper Camel Case</button>
                <button className="btn btn-primary mx-3 my-3" onClick={handleLcaClick}>Lower Camel Case</button>
                <button className="btn btn-primary mx-3 my-3" onClick={handleRasClick}>Remove All Spaces</button>
                <button className="btn btn-primary mx-3 my-3" onClick={handleResClick}>Remove Extra Spaces</button>
                <button className="btn btn-primary mx-3 my-3" onClick={handleTtsClick}>Text to Speech</button>
                <button className="btn btn-primary mx-3 my-3" onClick={handleCoClick}>Copy</button>
                <button className="btn btn-primary mx-3 my-3" onClick={handlePaClick}>Paste</button>
                <button className="btn btn-primary mx-3 my-3" onClick={handleCtClick}>Clear Text</button>
                
            </div>
            <div className='container my-3'>    
                <h2>Your Text Summary</h2>
                <p>{text.split(".").length} sentences, {text.split(" ").length} words and {text.length} characters</p>
                <p>{0.008 * text.split(" ").length} minutes read.</p>
                <h2>Preview</h2>
                <p>{text.length>0 ? text : "Enter something into textbox to preview it here..."}</p>
            </div>
        </>
    )
}
