document.addEventListener('DOMContentLoaded', () => {

	console.log('IronGenerator JS imported successfully!');

}, false);



$(document).ready(function () {

	$('#userPassword').pwstrength({
		ui: {
			showVerdictsInsideProgressBar: true
		}
	});

	$('#signup-form').validate({
		rules: {
			name: {
				minlength: 3,
				required: true
			},
			email: {
				required: true,
				email: true
			},
			password: {
				minlength: 6,
				required: true
			}
		},
		highlight: function (element) {
			$(element).closest('.form-control').removeClass('is-valid').addClass('is-invalid');
		},
		success: function (element) {
			element.text('OK!').addClass('valid')
				.closest('.form-control').removeClass('is-invalid').addClass('is-valid');
		}
	});
});