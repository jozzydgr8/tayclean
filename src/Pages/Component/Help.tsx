import helpImage from '../../assets/housebackground.jpg'
import { FlatButton } from '../../Shared/FlatButton'
export const Help = ()=>{
    return(
        <section style={{background:'#a3d65e', textAlign:"center", color:"white"}} className='background'>
            <div className="container-fluid">
                <h1>Need Some Help?</h1>
                <FlatButton title='Contact Us' onClick={()=>{}} className='nocolorbutton'/>
            </div>
        </section>
    )
}