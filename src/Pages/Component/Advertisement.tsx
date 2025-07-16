import { FlatButton } from '../../Shared/FlatButton';
import {DownOutlined} from '@ant-design/icons'
export const Advertisement = ()=>{
    return(
        <section id="advertisement">
            <div className="container-fluid">
                <div>
                    <h2>Enjoy 15% off  All Recurring Bookings, Including Bi-Monthly Cleaning!</h2>
                    <div className='animate-up'><a href='/#service'><FlatButton title='Learn More About Our Services ' icon={<DownOutlined/>} className='successbutton btn-lg'/></a></div>
                </div>
            </div>
        </section>
    )
}