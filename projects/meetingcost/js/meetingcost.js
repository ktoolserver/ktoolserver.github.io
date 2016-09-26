// JS for the Meeting Cost Calculator

var app = app || {};

// Placeholder for actual rates of pay data
app.rates = [
	{
		'label': 'EC-01',
		'description': 'Economics and Social Science',
		'min': '44350',
		'max': '56214',
		'median': '50282',
	},
	{
		'label': 'EC-02',
		'description': 'Economics and Social Science',
		'min': '50122',
		'max': '62026',
		'median': '56074',
	},
];

$(function() {

	app.meetingCost = {};
	app.meetingCost.participants = [];
	app.meetingCost.timeElapsedSeconds = 0;
	app.meetingCost.timeElapsedMoment;

	app.meetingCost.initialize = function() {

		console.log('Meeting cost calculator initialized.');

		$('.js-add-user').on('click', function(e) {
			app.meetingCost.addUser(e);
		});

		$('.js-add-time').on('click', function(e) {
			var elem = $(e.currentTarget);
			var amount = $(elem).data('amount');
			var dateType = $(elem).data('date-type');
			
			app.meetingCost.addTime(amount, dateType);
		});

		$('.js-remove-time').on('click', function(e) {
			var elem = $(e.currentTarget);
			var amount = $(elem).data('amount');
			var dateType = $(elem).data('date-type');
			
			app.meetingCost.subtractTime(amount, dateType);
		});

		app.meetingCost.timeElapsedMoment = moment.duration(0);

	}

	app.meetingCost.addUser = function() {

		var userType = $('.js-user-type-select').val();
		var rateData = _.find(app.rates, {label: userType});
		
		console.log('Adding user.');
		console.log(userType);
		console.log(rateData);

		app.meetingCost.participants.push(rateData);

		app.meetingCost.recalculateCost();


	}

	app.meetingCost.addTime = function(amount, dateType) {

		app.meetingCost.timeElapsedMoment.add(_.parseInt(amount), dateType);

		app.meetingCost.updateTimeClock();


	}
	app.meetingCost.subtractTime = function(amount, dateType) {

		app.meetingCost.timeElapsedMoment.subtract(_.parseInt(amount), dateType);

		app.meetingCost.updateTimeClock();


	}

	app.meetingCost.updateTimeClock = function() {

		// var timeClockString = app.meetingCost.timeElapsedMoment.hours() + ':' + app.meetingCost.timeElapsedMoment.minutes() + ':' + app.meetingCost.timeElapsedMoment.seconds();
		var timeClockString = app.meetingCost.timeElapsedMoment.format('h:mm:ss');

		$('.js-time-elapsed-input').val(timeClockString);

		
		app.meetingCost.recalculateCost();

		return timeClockString;


		

	}

	app.meetingCost.recalculateCost = function() {

		var annualValue = 0;
		var perSecondValue = 0;
		var newCost = 0;
		var newCostRounded = 0;

		_.each(app.meetingCost.participants, function(value, index) {

			annualValue += _.parseInt(value.median);

		});

		// Convert from annual salary to per-hour cost, by dividing by 1950 (37.5  * 52)
		// Convert from per-hour to per-second cost, by dividing by 3600 (60 s * 60 min)


		newCost = annualValue / 1950 / 3600 * app.meetingCost.timeElapsedMoment.format('s');

		newCostRounded = _.parseInt(newCost * 100) / 100;

		$('.js-cost-display').text(newCostRounded);

		return newCost;

	}

});
