import { Typography } from 'antd';

export const Advertisement = ()=>{
    const {Title} = Typography
    return(
        <section id="advertisement">
            <div className="container-fluid">
                <div>
                    <Title style={{color:"#2ac1aa",fontFamily:'podkova'}} level={1}>Enjoy 15% off  All Recurring Bookings, Including Bi-Monthly Cleaning!</Title>
                </div>
            </div>
        </section>
    )
}