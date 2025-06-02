type props = {
    subject:string,
    recipient_email:string | string[],
    message:string
}
export const SendMessage = ()=>{
    const sendEmail = async (body:props)=>{
        try {
            const response = await fetch('https://taycleanserver.vercel.app/send_email',{
                method:'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify(body),
            })
             if (!response.ok) {
                const errorData = await response.json();
                console.error('Error sending email:', errorData);
            } else {
                console.log('Email sent successfully');
            }
        }catch(error){
            console.error(error)
        }
    }

    //newsletter hook
    const sendNewsLetter = async (body:props)=>{
        try {
        const response = await fetch('https://taycleanserver.vercel.app/send_newsletter',{
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(body),
        })
    }catch(error){
        console.error(error)
    }
    }
    return{sendEmail, sendNewsLetter}
}