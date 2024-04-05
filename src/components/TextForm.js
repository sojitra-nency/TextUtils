// rfc
import React, {useState} from 'react'

export default function TextForm(props) {
    const handleUpClick = () => {
        // console.log("Uppercase was clicked" + text);
        let newText = text.toUpperCase();
        setText(newText)
    }

    const handleLoClick = () => {
        // console.log("Lowercase was clicked" + text);
        let newText = text.toLowerCase();
        setText(newText)
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
    }

    const handleCtClick = () => {
        // console.log("ClearText was clicked" + text);
        let newText = ''
        setText(newText)
    }   

    const handleCoClick = () => {
        // console.log("Copy was clicked" + text);
        navigator.clipboard.writeText(text)
    }

    const handlePaClick = () => {
        // console.log("Paste was clicked" + text);
        navigator.clipboard.readText()
        .then(text => {
            setText(text)
        })
    }

    const handleTtsClick = () => {
        // console.log("Text-to-Speech was clicked" + text);
        let msg = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(msg);
    }

    const handleOnClick = (event) => {
        // console.log("On Change was clicked");
        let newText = event.target.value;
        setText(newText)
    }

    const [text, setText] = useState('Enter text here');
    
    return (
        <>
            <div className='container'> 
                <h1>{props.heading}</h1>
                <div className="mb-3">
                    <label htmlFor="text" className="form-label">Enter something into the box....</label>
                    <textarea className="form-control" id="text" rows="10" value={text} onChange={handleOnClick}></textarea>
                </div>
                <button className="btn btn-primary m-1" onClick={handleUpClick}>UpperCase</button>
                <button className="btn btn-primary m-1" onClick={handleLoClick}>LowerCase</button>
                <button className="btn btn-primary m-1" onClick={handleInClick}>InverseCase</button>
                <button className="btn btn-primary m-1" onClick={handleUcaClick}>UpperCamelCase</button>
                <button className="btn btn-primary m-1" onClick={handleLcaClick}>LowerCamelCase</button>
                <button className="btn btn-primary m-1" onClick={handleCoClick}>Copy</button>
                <button className="btn btn-primary m-1" onClick={handlePaClick}>Paste</button>
                <button className="btn btn-primary m-1" onClick={handleTtsClick}>Text-to-Speech</button>
                <button className="btn btn-primary m-1" onClick={handleCtClick}>ClearText</button>
                
            </div>
            <div className='container my-3'>    
                <h2>Your Text Summary</h2>
                <p>{text.split(".").length} sentences, {text.split(" ").length} words and {text.length} characters</p>
                <p>{0.008 * text.split(" ").length} minutes read.</p>
                <h2>Preview</h2>
                <p>{text}</p>
            </div>
        </>
    )
}
