import React from 'react'

export default function 
() {

    let [nameOnCard, setNameOnCard] = useState("");
    let [cardNumber, setCardNumber] = useState("");
    let [cvvNumber, setCvvNumber] = useState("");
    let [expMMCard, setExpMMCard] = useState("");
    let [expYYYYCard, setExpYYYYCard] = useState("");
    
  return (
    <div>
        <form role="form" action="" method="post" className="require-validation" id="payment-form">

                    
            <div className='form-group'>
                <label className='control-label'>Name on Card</label> <input
                    name='name_on_card'
                    onChange={(e) => setNameOnCard(e.target.value)}
                    size='4' type='text'/>
            </div>


            <div className='form-group'>
                <label className='control-label'>Card Number</label> <input
                    name='card_number'
                    onChange={(e) => setCardNumber(e.target.value)}
                    autoComplete='off'   size='20'
                    type='text'/>
            </div>


            <div className='form-row row'>
            <div className='col-xs-12 col-md-4 form-group cvc required'>
                <label className='control-label'>CVC</label> <input autoComplete='off'
                    name='cvc'
                    onChange={(e) => setCvvNumber(e.target.value)}
                    placeholder='ex. 311' size='4'
                    type='text' />
            </div>
            <div className='col-xs-12 col-md-4 form-group expiration required'>
                <label className='control-label'>Exp Month</label> <input
                name='exp_mm'
                onChange={(e) => setExpMMCard(e.target.value)}
                placeholder='MM' size='2'
                    type='text' />
            </div>
            <div className='col-xs-12 col-md-4 form-group expiration required'>
                <label className='control-label'>Exp Year</label> <input
                    name='exp_yr'
                    onChange={(e) => setExpYYYYCard(e.target.value)}
                    placeholder='YYYY' size='4'
                    type='text' />
            </div>
            </div>


            <div className="row">
            <div className="col-xs-12">
                <button type="submit" onClick={postData}>Pay ({checkoutItems.price.toFixed(2)})</button>
            </div>
            </div>

        </form>
    </div>
  )
}
