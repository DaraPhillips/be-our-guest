import './rsvpPageStyleSheet.css'

export default function rsvpPage() {

    return (
        <div className='rsvpPage-Main'>
            <div className='topyoke'>
                <h3 className='home-tab-top-thingy'>Dashboard / </h3>
                <h3 className='home-tab-top-thingy'>My Invitations / </h3>
                <h3 className='home-tab-top-thingy'>Page 1 / </h3>
                <h3 className='other-tab-at-top'>Name and Name </h3>
            </div>

            <div className='rsvp-rsvpTitle'>
                <h1>RSVP</h1>
            </div>

            {/* EVENT DETAILS BOX */}

            <div className='rsvp-boxesWrap'>
                <div className='rsvp-eventDetailsBox'>
                    <div className='rsvp-eventDetailsList'>

                        <div className='rsvp-hostNames'>
                            <h2>Name and Name,</h2>
                        </div>
                        <h3>Counrey Location</h3>
                        <h3>@Wherever</h3>
                        <h3>Date</h3>

                    </div>

                    <div className='rsvp-eventDetailsButtonCon'>
                        <button className='rsvp-Button' id='rsvp-acceptInvitation'><img src='/src/images/acceptButtonIMG.png' /> Accept </button>
                        <button className='rsvp-Button' id='rsvp-declineInvitation'><img src='/src/images/declineButtonIMG.png' /> Decline </button>
                    </div>
                </div>

                {/* INPUT BOX */}
                <div className='rsvp-rightBoxes'>
                    <div className='rsvp-inputboxMain'>
                        <div className='rsvpnamesInput'>
                            <h2>Dear Name and Name,</h2>
                        </div>
                        <div className='rsvpInput'>
                            <input className='rsvp-brideGroomInput' placeholder='Message for the Bride & Groom' id='rsvp-messageHost'></input>
                        </div>
                        <div className='rsvp-CancelSendButtons'>
                            <button className='rsvpInputCancel'> Cancel </button>
                            <button className='rsvpInputSend' id='rsvp-sendMessage'> Send </button>
                        </div>
                    </div>

                    {/* SEND GIFT BOX */}

                    <div className='rsvp-giftBox'>
                        <div className='rsvp-sendGiftText'>
                            <h2>Send a gift </h2><img className='rsvpGiftImg' src='/src/images/rsvpGiftIMG.png' />
                        </div>
                        <div className='rsvpInput'>
                            <input className='rsvp-giftAmountInput' placeholder='Enter Amount' id='rsvp-giftAmount'></input>
                        </div>
                        <div className='rsvp-CancelSendButtons'>
                            <button className='rsvpInputCancel'> Cancel </button>
                            <button className='rsvpInputSend' id='rsvp-sendGift'> Send </button>
                        </div>
                    </div>

                </div>
            </div>







        </div>
    )
}