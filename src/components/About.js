// rfc
// import React, {useState} from 'react'

export default function About(props) {
    // const [mystyle, setMystyle] = useState({
    //     color: 'black',
    //     backgroundColor: 'white',
    //     border: '1px solid white'
    // })

    let mystyle = {
        color: '#163563',
        backgroundColor: props.mode === 'dark'?'white':'#E0E0E0',
        border: '1px solid white'
    }

    // const [context, setContext] = useState('Enable Light Mode')

    // const  toggleStyle = () => {
    //     if(mystyle.color === 'white'){
    //         setMystyle({
    //             color: 'black',
    //             backgroundColor: 'white',
    //             border: '1px solid white'
    //         })
    //         setContext('Enable Dark Mode')
    //     }
    //     else{
    //         setMystyle({
    //             color: 'white',
    //             backgroundColor: 'black',
    //             border: '1px solid white'
    //         })
    //         setContext('Enable Light Mode')
    //     }
    // }

    

  return (
    <div className='container my-3' >
        <h1 className='my-3' style={{color: props.mode === 'dark'?'#E0E0E0':'#163563',}}>About Us</h1>
        <div className="accordion" id="accordionExample" >
            <div className="accordion-item">
                <h2 className="accordion-header">
                <button className="accordion-button" style={mystyle} type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                    <strong>Analyse your Text</strong>
                </button>
                </h2>
                <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                <div className="accordion-body" style={mystyle}>
                    TextUtils is a versatile text manipulation tool designed to empower users with the ability to analyze and transform text effortlessly. Whether you need to convert text to uppercase, lowercase, or sentence case, TextUtils provides a range of functions to suit your needs. With features like word count, character count, and sentence count, users can gain valuable insights into their text composition, helping them make informed decisions in their writing and communication.
                </div>
                </div>
            </div>
            <div className="accordion-item">
                <h2 className="accordion-header">
                <button className="accordion-button collapsed" style={mystyle} type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                <strong>Free to use</strong>
                </button>
                </h2>
                <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                <div className="accordion-body" style={mystyle}>
                    TextUtils is committed to providing a seamless and accessible text manipulation experience for all users, completely free of charge. We believe that everyone should have access to powerful tools that enhance productivity and creativity without any financial barriers. Our platform is open to all, allowing users to harness the full potential of text manipulation without limitations.
                </div>
                </div>
            </div>
            <div className="accordion-item">
                <h2 className="accordion-header">
                <button className="accordion-button collapsed" style={mystyle} type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                <strong>Browser Compatible</strong>
                </button>
                </h2>
                <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                <div className="accordion-body" style={mystyle}>
                    TextUtils is built with compatibility in mind, ensuring a smooth user experience across various web browsers. Whether you prefer Chrome, Firefox, Safari, or any other modern browser, you can rely on TextUtils to perform consistently and reliably. Our responsive design adapts seamlessly to different screen sizes and devices, allowing you to access and utilize our tools from anywhere, anytime.
                </div>
                </div>
            </div>
        </div>
        {/* <div className="container my-3">
            <button className="btn btn-info" onClick={toggleStyle}>{context}</button>
        </div> */}
    </div>
  )
}
