document.addEventListener('DOMContentLoaded', () => {
	
    $('#myPassword').strength({
                strengthClass: 'strength',
                strengthMeterClass: 'strength_meter',
                strengthButtonClass: 'button_strength',
                strengthButtonText: 'Show Password',
                strengthButtonTextToggle: 'Hide Password'
            });
            console.log('IronGenerator JS imported successfully!');


}, false);


