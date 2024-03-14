import './createEventStyle.css'


export default function createEvent(){


return(
<div className='weddingDetails-page'>

<div className='topyoke'>
<h3 className='home-tab-top-thingy'>Home / </h3> <h3 className='other-tab-at-top'>My Events</h3>
</div>

<div className='wedding-details-header'>
   <h1>Wedding Details</h1>
</div>

{/* HOST DETAILS */}

<div className='event-col1'>

<div className='event-details-container'>

<form className='host-form'>

<div className='bride-group'>

<label htmlFor="username">Nearly-wed</label>
<div className='details-group'>
<input type="text" name="bride-firstName" id="bride-firstName" placeholder=" First Name" />
</div>
<div className='details-group'>
<input type="text" name="bride-lastName" id="bride-lastName" placeholder=" Last Name" />
</div>
<div className='details-group'>
<input type="text" name="bride-lastName" id="bride-password" placeholder=" Email" />
</div>
<div className='details-group'>
<input type="password" name="bride-lastName" id="bride-password" placeholder=" Password" />
</div>
</div>

<div className='groom-group'>
<label htmlFor="username">Nearly-wed</label>
<div className='details-group'>
<input type="text" name="groom-firstName" id="groom-firstName" placeholder=" First Name" />
</div>

<div className='details-group'>
<input type="text" name="groom-lastName" id="groom-lastName" placeholder=" Last Name" />
</div>
<div className='details-group'>
<input type="text" name="bride-lastName" id="groom-email" placeholder=" Email" />
</div>
<div className='details-group'>
<input type="password" name="bride-lastName" id="groom-password" placeholder=" Password" />
</div>




</div>

</form>
</div>

{/* VENUE DETAILS */}

<div className='event-details-container'>
<form className='venue-form'>

<label htmlFor="venue-details">Venue details</label>

<div className='details-group'>
<input type="text" name="country-id" id="country-id" placeholder=" Country" />
</div>

<div className='details-group'>
<input type="text" name="venue-id" id="venue-id" placeholder=" Venue" />
</div>

<div className='details-group'>
<input type="text" name="address1-id" id="address1-id" placeholder=" Address line 1" />
</div>
<div className='details-group'>
<input type="text" name="address2-id" id="address2-id" placeholder=" Address line 2" />
</div>
<div className='details-group'>
<input type="text" name="address3-id" id="address3-id" placeholder=" Address line 3" />
</div>

<div className='details-group'>
<input type="text" name="zip-id" id="Zip-id" placeholder=" Zip code" />
</div>

</form>
</div>


<div className='event-details-buttoncontainer'>
<button className='createEvent-button'>Create event </button>
   </div>

   </div>

</div>







)




}



