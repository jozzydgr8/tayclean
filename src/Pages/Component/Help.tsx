import helpImage from '../../assets/housebackground.jpg'
export const Help = ()=>{
    return(
        <section style={{background:`url(${helpImage})`, textAlign:"center"}} className='background'>
            <div className="container-fluid">
                <h2>Need Some Help?</h2>
                <p>Contact us now</p>
            </div>
        </section>
    )
}