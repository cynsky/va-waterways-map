
require(["lib/suncalc/suncalc.js"], function(SunCalc) {

window.getSunTimes = function(lat, lon) {
	return SunCalc.getTimes(new Date(), lat, lon);
}

window.getMoonPhase = function() {
	var phase = SunCalc.getMoonIllumination(new Date()).phase;
	if (phase == 0) {
		return 'New Moon';
	}
	else if (phase > 0 && phase < .25) {
		return 'Waxing Crescent';
	}
	else if (phase = .25) {
		return 'First Quarter';
	}
	else if (phase > .25 && phase < .5) {
		return 'Waxing Gibbous';
	}
	else if (phase = .5) {
		return 'Full Moon';
	}
	else if (phase > .5 && phase < .75) {
		return 'Waning Gibbous';
	}
	else if (phase = 0.75) {
		return 'Last Quarter';
	}
	else {
		return 'Waning Crescent';
	};
}

});