import {
  Form,
  Input,
  DatePicker,
  message,
  Row,
  Col,
  Card,
  Divider,
  Button,
  TimePicker,
  Radio,
  Select,
} from 'antd';
import { BookingFormValues } from '../../Shared/Types';
import { Dayjs } from 'dayjs';
import { PaystackButton } from 'react-paystack';
type prop ={
    proceedPayment:boolean,
    data: {
    id: string;
    title: string;
    description: string;
    image: string;
    cost: number;
    recurringCost: number;
    service: string;
} | undefined,
onFinish:((values: BookingFormValues) => void) | undefined,
setIsRecurring:React.Dispatch<React.SetStateAction<boolean>>,
isRecurring:Boolean,
setSelectedDays:React.Dispatch<React.SetStateAction<number[]>>,
selectedDays:number[],
disabledDate: (current: Dayjs) => boolean,
loading:boolean,
 weekdays: {
    label: string;
    value: number;
}[],
componentProp: {
    email: string;
    amount: number;
    metaData: {
        name: string;
        phone: string;
    };
    publicKey: string;
    text: string;
    onSuccess: () => void;
    onClose: () => void;
}

}
const styles={
    logo:{
            width: '55px',
            height: '50px',
        },
}
export const BookingForm = ({componentProp,proceedPayment,weekdays,data, onFinish, setIsRecurring, isRecurring, setSelectedDays, selectedDays, disabledDate, loading}:prop)=>{
    return(
        <section style={{ padding: '40px 20px', backgroundColor: '#f7f7f7', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: 900, margin: '0 auto' }}>
        <Card
          title={`Book Service: ${data?.title}`}
          bordered={false}
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
        >
          <Form layout="vertical" onFinish={onFinish}>
            <Divider orientation="left">Booking Type</Divider>

            <Form.Item label="Booking Type" name="bookingType" initialValue="recurring">
              <Radio.Group onChange={(e) => setIsRecurring(e.target.value === 'recurring')}>
                <Radio value="recurring">Recurring (2x / month)</Radio>
                <Radio value="one-time">One-Time</Radio>
              </Radio.Group>
            </Form.Item>

            {isRecurring && (
              <>
                <Form.Item
                  name="months"
                  label="For how many months?"
                  rules={[{ required: true, message: 'Please select duration in months' }]}
                >
                  <Select placeholder="Select number of months" style={{ width: '100%' }}>
                    {Array.from({ length: 12 }, (_, i) => (
                      <Select.Option key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? 'month' : 'months'}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Pick up to 2 days per week"
                  required
                  validateStatus={selectedDays.length === 0 ? 'error' : ''}
                  help={
                    selectedDays.length === 0
                      ? 'Select at least one day'
                      : selectedDays.length > 2
                      ? 'Only 2 days are allowed'
                      : ''
                  }
                >
                  <Select
                    mode="multiple"
                    placeholder="Select days"
                    value={selectedDays}
                    onChange={(val) =>
                      val.length <= 2
                        ? setSelectedDays(val)
                        : message.error('Max 2 days allowed')
                    }
                    style={{ width: '100%' }}
                    options={weekdays}
                  />
                </Form.Item>
              </>
            )}

            <Form.Item shouldUpdate>
              {({ getFieldValue }) => {
                const months = getFieldValue('months');
                const bookingType = getFieldValue('bookingType');
                const oneTimeCost = data?.cost || 0;
                const recurringCost = data?.recurringCost || 0;
                const totalRecurring =
                  months && bookingType === 'recurring'
                    ? months * 2 * recurringCost
                    : 0;

                return (
                  <div style={{ marginBottom: '20px', fontWeight: 'bold', color: '#444' }}>
                    {bookingType === 'recurring' && months && (
                      <div>Total Recurring Cost: ₦{totalRecurring.toLocaleString()}</div>
                    )}
                    {bookingType === 'one-time' && (
                      <div>Total One-Time Cost: ₦{oneTimeCost.toLocaleString()}</div>
                    )}
                  </div>
                );
              }}
            </Form.Item>

            <Divider orientation="left">Contact Information</Divider>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="name"
                  label="Full Name"
                  rules={[{ required: true, message: 'Please enter your name' }]}
                >
                  <Input placeholder="Your Name" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="email"
                  label="Email Address"
                  rules={[
                    { required: true, message: 'Please enter your email' },
                    { type: 'email', message: 'Please enter a valid email address' },
                  ]}
                >
                  <Input placeholder="you@example.com" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="phone"
                  label="Phone Number"
                  rules={[{ required: true, message: 'Please enter your phone number' }]}
                >
                  <Input type="tel" placeholder="+234 800 000 0000" />
                </Form.Item>
              </Col>
              <Col xs={24} md={6}>
                <Form.Item label="State">
                  <Input value="Lagos" disabled />
                </Form.Item>
              </Col>
              <Col xs={24} md={6}>
                <Form.Item label="Country">
                  <Input value="Nigeria" disabled />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">Location & Date</Divider>

            <Form.Item
              name="address"
              label="Home Address"
              rules={[{ required: true, message: 'Please enter your home address' }]}
            >
              <Input.TextArea placeholder="123 Example Street, Ikeja" rows={3} />
            </Form.Item>

            <Form.Item
              name="date"
              label="Preferred Start Date"
              rules={[{ required: true, message: 'Please select a date' }]}
            >
              <DatePicker style={{ width: '100%' }} disabledDate={disabledDate} />
            </Form.Item>

            <Form.Item
              name="time"
              label="Preferred Time"
              rules={[{ required: true, message: 'Please select a time' }]}
            >
              <TimePicker use12Hours format="h:mm A" style={{ width: '100%' }} />
            </Form.Item>

            {
                !proceedPayment ?
                <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block style={{background:'#2ac1aa'}}>
                    {isRecurring ? 'Recurring Booking' : 'One-Time Booking'}
                </Button>
                </Form.Item>:
             <>
                    <small>You will be redirected to PayStack to make payments securely**</small>
                    <PaystackButton className="btn btn-block w-100 btn-primary " {...componentProp} />
                    <div>
                        <img style={styles.logo} src="data:image/jpeg;base64,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" alt='visa'/>
                        <img style={styles.logo} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAYFBMVEX///8Lo9v29vYAnNkAoNoAntnm8/pKsuDY7PeMyuq93vJiuuQGo9vc7fgAm9iFx+nw8PD0+v3K5vWWzuuo1u7u9/xWtuLh8fksqt16w+eu2O8+rt/I5fQbp9xtvuVTteJu0xDnAAACzUlEQVR4nO3d7W7iMBBG4Zg4UBLqEj5aoC17/3e5VKv+XDb1xGO97DlXkEdEVTyO02a7eOy2zaJ57BYI5UOoH0L9EOqHUD+E+iHUD6F+CPVDqB9C/RDqh1A/hPoh1A+hfgj1Q6gfQv0Q6odQP4T6IdQPoX4I9UOoH0L9EE5o1xdtV1u470rX7qsKh24TStcNFYWHrrjvVtvXE5b/Ab+K79WEy9ZFGLpqwmeXmxQhQoQIESJEiBChTfjm9Fwaqgkbh9XhrWhZIBqFa5fbNFkmGdY1/imWB3ZnyxWa5zRD6mLRulR3TnP7a3NYF+0y2q6Peal+CPVDqN8MwnHpUEXh7j21DqUhF2kV7pPPYD/E3IdTo/Aj+fi+avMebozCkx8wdC8VhEfHnzCEzwpCrynGnxJChAgRIkSIECHCrN5chXk7UMa1heeTd1zVEF4dti2+6y41hKPfbZr7+p51irHcFN6Y+a7Nu0fnmLVdhpVD54/c62Neqh9C/RDqN4Nw+VQ0w6bMPML+M5U9MpOC5bSFXfji8Oyd1hWFvcviouY7UZ8ewBB/VRM67cxseL8UIUKECBEiRIgQ4b2cdmY2sZqw8TkVVHFt0ZxddmZqflNhjA7E+Gq5ROsU43gqvjOTrqYrtM/a+vNQtPWT7fqYl+qHUD+E+iH8Z8trzDsFs7JtuEzOKuxTzDw0E1vTR8omZxQ+W8b6mUdEfphRuDI9eKfjXIw72YSjbWcmHmZz/L2qU4zocZsivB9ChAjnCOH9ECJEOEd1haYX1iZW9ck784zIzzKunl5tqyfjJ6AmZRQuLT+i8WPrE7NOMXZtFzY5hZhMn2GbnHkSNa5PWTtK4Wr9lwATY5qoH0L9EOqHUD+E+iHUD6F+CPVDqB9C/RDqh1A/hPoh1A+hfgj1Q6gfQv0Q6odQP4T6IdQPoX4I9UOoH0L9EOqHUL//QbhdPHbb31z+UaDpp89iAAAAAElFTkSuQmCC" alt="paystack" />
                        <img style={styles.logo} src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAADACAMAAAB/Pny7AAABj1BMVEX////psEDMITHjmT3JAC/qtEDHAADhkTzsvELrt0HprzzOMjPSTzTLFzHprjnLGyzloT7ztzzVHyvQQjPorDL03N3OOEH99+8AAFrqs0n02rLnqB39+fmLK1L4583z9ffnrK/78eLz1qj67e7txcXU1+AAMHHYZzfIABHy1NbruFr35OXJABnbHibx0JnsvGbwyoztwHHmpAD8vTjo6e6egFnZPC3imJvvxX7RRE/24cDrubzYcHTgjpO/w9HTTlfVW2PZcjmiqr0AEmIAAFCqh1QAIGbOn0nAIziFj6rdgocAN3NhWWHgOyfcfz6yQVfJbnrGo26mI0RZY4teAEXZwqKvhklpfJ5KK2WHP2C6sayLb1aRGEQvT4Lhjl6LjZpRHVl6bodiWXgwPWk2N20cK30AAGjcuYbZsG1IADtsMF5/YkFIT3J4Z1nFkZxEQFtdRnKxHzx6WHskFVN4AEZ0Hk5kADGocoRbNGU9BlNkSVORh4fEtMBSMUZ2Wlh6RGaTAB+ei3icRGCZd5CdXHUrL90nAAAP00lEQVR4nO1c+3/aRrYHNSapHKQgi7fAgGQFMC/HuDxtY4gBQzZp7bamN3Db1CS9deOm3hvfOGluunfv/uE7M0fi4dhGwCSb7UffH0AajUbznTlzzpnR0VgsJkyYMGHChAkTJkyYMGHChAkTJkyYMGHChAkTJkyYMGHChAkTJj51SAj/6jrMDUl2xmJKqRTCKCmxmFOegZTbHQ4Hg8WiD6EYDAbDYffHbhrJqZRy5W1XwjZAlKmUN0NKTDZeijtcLKbyaa9/BN50PlIMht0fru7jkJRQq8JEowmBZ0bAC4mojd9uhRRDfNzBSCbN+UWRY60jYDnR77euZSLBj8EnlisXEtFxHiMQEolCORebVEowlY9f5DHGSIznU+EPTEVpbfOJq4joXZTgC+XQdaX48nFO5C4nogPzyQQ/IJVSxTWJic6HqYSuGMiSL+2dxETn400XPxAVZZvnDVEhdHi+ULqslGKcM8REkzcu/iF6R67YDDPR+Ni2nRdLCcf9V4yTK7vHv0ZbFUg5mzAdFQzBtjmm2dype+J0VAideymapkdyumzTU8GwMbFBRaSw1T89FQx/PEyNjhxKJGbjgmUtpHWOO3JvSgkb6RwxQknWVlvGVNhVnVMmViecn7FbCFgxT8XqxCpzcWGYREFBVjI9w2gZhZimoNaU7ZlFTIfgChXjc3JBbOJz25ySa24ujJ3f8Rq3LVez8frm5LI4g0Z+j8wOO/PQHwXHzdU3SnS+4UJw4+4CDSoIrH8ONrEZrcsY7HdvUeKCcG9mLbBKhcvtWwsaaLDxz6ihZRcFGWPsn93UcYcCHdY7k/WUKhTGPsKNARatFNiIs/id0qZxf98g7Lfn54J02gxup0JFyC5g53MKZLxTq7TVyvzG8j3YF29SYCOmp1QC0iYNLvaLuHH7zvxkrGJqumETozFg7HfvvAcKXNBkeqqukWkImX3ps4WLoMEFdU1+mq5RqJhLGsP9ckzjCMgMDSFbomEkLwc3heks0egY5uGt96SMnldjWD1LVy6+TgGkhj+7HDTIsFajlpNOx4z4MePYodE3hrvmQ9j+UdBw0VivMS5UZjHX4MZNKl1jzNaU6XjLV8K+RENli3kjXKRFKtOYq0YMBpWJjdWIdi5R4XL35jWgY4CMqIAKDTKo8a8DDS7cmgEp2wYyvI5LzgyQMbiIwXIshzDdUhSLYeXik+VMm5TxLh382JkxLvbbhsY4x3nja5lMPu31XvV68xJ4CVjWO9lB2wQuQm7VSRCKorOoU0Nsog3iExg3P79WzIicsWI8o+lXdzDjNciG9frCCEHRyqYmkikT59/+SH9hjBxovvmlftU50QUtlDGucmVGXBrOmhk1FSmji9FfkbsQmcnKWYY1mf2DlSEZ4est/XJpUr8wIUmWJefS4vW4s8A1vhlzr9LGVqPZbw+WNe7cxHWaWIE0feAwOyDDNzvL+mUihEiSojimYchBwAk4yoH/jrzGRBNVmCfzJKd2Yid6BKcKNx2N/1geezB+18mJoh+HOegVh5FuhTe6rIivLDw+INnzHNIAk5yAEgyKr/f0BMUmdPcGzy3zvC26Xd7M5XKtbf01Z9RWaaGEzVbFxfRII+RAU/A2VysUyrVc+rtd0CE2pvKfje/HuVjucX4cyBCJpDJpPxE5jgx0q+hPo5qzfm8+k4n7uQeHJHscJU1cpsmRCjZ/GCUzlDLLdqKgOFdlHMkkr8YqNlLjTT1FbjV7JJvsXEXimmBCTpnkDDF4JAqbqwibtpxz9cmPuhhXDw8Pq1lL+F68GA673ZLkdoeDaT/uDzLQ0/GgO+jnxAi6iK74j6rkNqwv2MgEMmRVhm/2q0MyzXP8YNKQ8rYtN5J5tYW0Q2L4CtZS6R7ohy4+sT2MOlFcAiM0FXxYDkmWrEdrrJWnT2vPaurTnzL3RnWTOy9avf+Fj4L49V9eHCxhuHukZcO468RJ6kwjA7dkCRkiZVkiPjHXzyujuZ0F3jYaJ5M4HvSoLTEWBYDEN6mSMkqyxbLXhyG58ssdh8O7+/yZd/1kayS3JZxePyFFBZExcYv+4VBfJncGkW9mFTPXc5FbiRFlViVkXm5phxZLiLmfHcsfsv06Kvu2jl4lyeZSxnKWE02VXMA/NRB8C+vALexYb1jXn421kiW1/mLALuIfI0qSSM9krp9uysTM8IFDUkX8SKX5G34MiM/mqQc1DQFwKHXhOSRRjtlUqJKEJkWbcGGlCvRLzH5Pf0r2Ptw1sC0cu/Bseaxg30JnwC6tUbcsDxoujxXcpBWnVZjMHMPtmIGyj6VsBRLK3d7WYduDAeo+9lfyyOVq3eOpBVy8SlJXqlvlU8Ih+9xTq5Gay4tnep2kag0Ixge2hWvUtg6OarjgHimi2PhvvebuF5A7Wz3c0wkSqySuXa+bV8Fmdoi8rhAyL7GEHRIxkyqBztdngUC3e9bxkCpugTxm/ydwdnx+Kpy2SSl7ta7tCbnhVTdwrkKvLr7WlMpWtdcnB8WhC+PYOHpzsrG7u/v4hYdkK351tKxTgEbI/v7mRa0Gie74FGTaVagpZkSkrL4CV0/3kVVxVcrlVwdApkcuyC3BlkT6SlNmr7rNU3JZWbRFEzXoxCUPNOtWv1aHbJGhYV9oNNj19YX0Wv4naJ7iBty1vOeBZrN8c4dtPACmljAhwxkioymzPSzkW3j4KPfJVaUgCLZySHHKsgyyvQUsLXKpxQtM8gyUWTmRfE0OnDgc9S1UxuWBR/za3VchW2bEg1lwiHkfDjd1Z8mojpzskf+Vk5OjLNRftDoaNbgT+tQQGX4f7PgTLDRbuC2+hIqEXAlGWR3N//a+bpDkUkFIwvBAhfDqxZLlApThrCSFOlQpP+JbcmxxbDSn3kDB34gboIyCOFplXQWRi2DNPFnMsAIQAiAGv2HRzqL6yX8HRZSLMuPRl9Kvr3sDXb1aSHrICerA0wPLBcQeQRnI4DTr1Ytk2IuLLan/JV3uzvjfgTPlI2SeAxno00lkiGoWjklVVn8jwxn1dkhTRC2bciF760ztDfRlSZOkEBo8h5YLKGll5BL8qU5mKGYXV8LdGSATjluhi6QIIXM02gyTVLOEjabQJ2Kg/KHLSgUUkVx+BYOy2qvDSEQaoa/WBybtUQ3qKwgvoebLA1haUAZ6gHCqjZnUQJmt/w7Zq/06ODrhr0AfB/2NF+Q+N7FJ6/As95ohMhZCBpRZ6BjqZnG67pNmiv0BevjA0+mDiom5ks1O29PW6Hx/oJWR/IGQWT6479HwN5tHU4gC09SUdVBXzY4TreDai+dQcHAD5iBFf6NPEqBnHND1oMwmujPYN+NdbVJ260wjE2qCE6NZyJgtmdyvw+iIMnwy0G97oCOqpFWRqCaPNR39MqChqTlCZL7UBjujDxqx0dFqvr7egGHne0xGCqKg9Qy6iE2rdgytMNHRRFMAYb9NpKl8pinT8imwektMDl5XF17CqCzZBIFP8md1UAN7YOvL0ehxndxRYqJJjKjg0soooclost0GreFeIzMu71fPgYHf6vgFJDDySxU/AHnPjRfwqPAayvl/UCEfUWaTpwBI2QgBonekikYmVtBsYRWe6VxM8K/IkZQrtCoFF8P/AVU40NywcvkfmsMSKm+7XIVKORf6O5SB10eS521doUfy+XwqqN0Y9IoLv4M6ibyDwZEWG2/AelrCmbxeefDpJk/OkBgkz0GZbQeATC75ktRV+h7cSEnJaXGXcjlnWVWQYdScfa3BLZK0qVk3ixwrKYpTQsoMEpB2R12v9sac7yycSsGID4a0+6c3oMxE1vrOM+5Po3wZEU2wrZNDnlcraN5BnhtzARm5ZfsBVNf/ey644tm/vh09XakNHruttsfnCptfg0IkUwy+3d4bu7F/oeDwTw+ADBK8x7U9y4Wref9aPiVOXtBArogA+i/EABnFlXxNEpz/qA0XA4g3kz0YrYT8ZW0wP10MqIdjbFo/684Bnj931fbonVvtoY0Fgdt9oqkEK/ft0VD3w9Vw2poJpvIG3gNsCk2Q91wSyIRszdegiB51VL22K6SqKwcjEpD9stlXNbLyIt9RD0fFo/V6qMwY++0TT786nNV9czRohuxzQmYDmg3rY8dJvT9YMAC97fVmimuRicoMO7rd+gpCrJzoetD/20piv7+FU3KJM1Xdw3XKVn87wklv21VtLpXd2vuOT3ZUYCfneB4x6+nTD2ll81GHlBEii4g3HnpPPOqBTiecfqdCR65Un9RQruXI40OcO4iNI+s9qvVJSVu/16soNZvixIzPZySGRnYdt1VV7ZzyQhcddHj4V9WAwPPH+KCt9vdJnkBXVSEBocszQhMd9Xu99j72VhnI3Ov1VPW8CWWcQazEDeuCdaNeq9fbB4cHT39scOwDdKLWn6mNd7Varb7LnTxD/zX4boDzPn9Wr9efPnvX6OOrGyJxTI0snFsqXWzk9lF1TvG/AP/I7PFYD3XaneMun9wnKfbu2Xmn3e53jk8FMhaa5+22eh6wk2Uygeked9R65/xs3y6QGwKn5IKduYWkx7r74AjRefC4gaq83vixffRgl13f3UBoWL/FfxsO3dtpnDxA+RwNnLir+Q1GXmlYSgIBVjqj/7DgJ2ATKGhJqNPIOUrRlgP5pHadWVxC+OKLv2B88QU+xFgiWHy4AOsYBI7hiYO1OjBYK0f+hxMEB7moXwUYedlE5TWgfenWNaATuWEoSIPKC1oq7y2vA2foBe0nGAB8GfwGY4HoBDXQCF24GkaDGiiFm+zc+vxyUCFjONyESiAQs3j7CtCIBmQ5wyG0ISpd816EphamSYGL1W/8gw0qwXNXUfyMRngGO0VcI5WwxktxY2d+KtPEzlkoBZwyl0naEo2OEdNTxQJTCQVmmKX38JCGkHFB9zQf2VMJ0kbd8H5sw/xccJB2MeWbIraZSvi8/faHsJw4fD6YCk8zbKh82GDfoc+FTMqCRd80w4bSJydUQhjHyZBPTqbcmILKx0D2RevQ86fCZaaPgSh9pmVfuquDiumf8TMti8VJ1av5qEGzl4BmUPCNhzTc5dk/bSQhTZS42GnEmc/10Snyn2l8DoxDPHcomMs5Pwem86E2w7t2uPm5zP2hNn7b+uf5hJ5sbjAfl09oc4M/17YTZEOQmdUAb8t9UhuC4K1aCn+arVoss26iw9tan94mOhizbG9UoLK90cSI31kw5cZTguvT3XgKY5otwbZzV8mGL/4JbAmGIJXKRjdru07MP4nN2jAmb6PnKueUSaUY2kbvQ1PBoLjBofWyDQ7Fj7fBIcFVW0+Wptx6Moi3nrSO7DyJRkk+5fuIW09qIJuCxpSSvifov+2moGP4E+zWasKECRMmTJgwYcKECRMmTJgwYcKECRMmTJgwYcKECRMmTJgwYcIg/glxuL6W4IrjPQAAAABJRU5ErkJggg=='alt="master card"/>
                    </div>

                </>
            }
           
          </Form>
        </Card>
      </div>
    </section>
    )
}