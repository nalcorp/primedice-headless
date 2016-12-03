/*
 * ----------------------------------------------------------------------------
 * "THE BEER-WARE LICENSE" (Revision 43-UnixPunk):
 * Poul-Henning Kamp <phk@FreeBSD.ORG> wrote this license.
 * UnixPunk wrote this script and tweaked the license wording.
 * As long as you retain this notice you can do whatever you want with this 
 * stuff as long as you don't sell it for profit. If we meet some day, and you 
 * think this stuff is worth it, you can buy me a beer in return or donate some 
 * bitcoin to 16EtDFbhbkV8MqHhup5REAdhs73PeDfjUW (UnixPunk) 
 * ----------------------------------------------------------------------------
 */

"use strict";

var needle = require('needle');
var prompt = require('prompt-sync')();
var crypto = require('crypto');

var options = {
  compressed: 			true, 
  follow_max: 			1,
  rejectUnauthorized: 	true, 
  timeout: 				60000, 
  user_agent: 			'ChaosBot/0.2.1',
  follow_set_cookies: 	true
};

needle.defaults(options);

var url = 'https://api.primedice.com/api';

function onErr(err) {
	console.log(err);
	return 1;
}

var profiles = [
	{
		target: 98,
		condition: '<',
		amount: 0,
		cost: 0,

		maxchance: 98,//95.89,
		minchance: 0.01,

		mywager: null,
		mybet: null,

		bankat: 0,
		stoplossenabled: false,
		maxstreakcost: 0,
		
		waitforfunds: false,
		
		rnd: false,
		mode2: true,
		mode2zig: false,
		mode3: false,
		stepped: true,
		static: false,
		
		username: 'User1', 
		password: '',
        	apikey: '',
		token: '',
		bankuser: 'UnixPunk'
	}, {
		target: 99.98,
		condition: '>',
		amount: 1,
		cost: 9000,

		maxchance: 98,
		minchance: 0.01,

		bankat: 0,
		stoplossenabled: false,
		maxstreakcost: 0,

		mywager: null,
		mybet: null,
		
		waitforfunds: true,
		
		rnd: false,
		mode2: true,
		mode2zig: false,
		mode3: false,
		stepped: true,
		static: false,
		
		username: 'User2',
		password: '',
       		apikey: '',
		token: '',
		bankuser: 'UnixPunk'
	}
];

var profile = profiles[0];

var want_high_variance_prompt = true;
var auto_switch_high_variance = false;
var ping_estimate = 50;

var lowgaps = [
	{ chance: 0.01, nonce: -1, score: 0 },
	{ chance: 0.02, nonce: -1, score: 0 },
	{ chance: 0.03, nonce: -1, score: 0 },
	{ chance: 0.04, nonce: -1, score: 0 },
	{ chance: 0.05, nonce: -1, score: 0 },
	{ chance: 0.06, nonce: -1, score: 0 },
	{ chance: 0.07, nonce: -1, score: 0 },
	{ chance: 0.08, nonce: -1, score: 0 },
	{ chance: 0.09, nonce: -1, score: 0 },
	{ chance: 0.1, nonce: -1, score: 0 },
	{ chance: 0.11, nonce: -1, score: 0 },
 	{ chance: 0.12, nonce: -1, score: 0 },
 	{ chance: 0.13, nonce: -1, score: 0 },
	{ chance: 0.14, nonce: -1, score: 0 },
	{ chance: 0.15, nonce: -1, score: 0 },
	{ chance: 0.16, nonce: -1, score: 0 },
	{ chance: 0.17, nonce: -1, score: 0 },
	{ chance: 0.18, nonce: -1, score: 0 },
	{ chance: 0.19, nonce: -1, score: 0 },
	{ chance: 0.2, nonce: -1, score: 0 },
	{ chance: 0.22, nonce: -1, score: 0 },
	{ chance: 0.24, nonce: -1, score: 0 },
	{ chance: 0.26, nonce: -1, score: 0 },
	{ chance: 0.28, nonce: -1, score: 0 },
	{ chance: 0.3, nonce: -1, score: 0 },
	{ chance: 0.32, nonce: -1, score: 0 },
	{ chance: 0.34, nonce: -1, score: 0 },
	{ chance: 0.36, nonce: -1, score: 0 },
	{ chance: 0.38, nonce: -1, score: 0 },
	{ chance: 0.4, nonce: -1, score: 0 },
	{ chance: 0.42, nonce: -1, score: 0 },
	{ chance: 0.44, nonce: -1, score: 0 },
	{ chance: 0.46, nonce: -1, score: 0 },
	{ chance: 0.48, nonce: -1, score: 0 },
	{ chance: 0.5, nonce: -1, score: 0 },
	{ chance: 0.55, nonce: -1, score: 0 },
	{ chance: 0.6, nonce: -1, score: 0 },
	{ chance: 0.65, nonce: -1, score: 0 },
	{ chance: 0.7, nonce: -1, score: 0 },
	{ chance: 0.75, nonce: -1, score: 0 },
	{ chance: 0.8, nonce: -1, score: 0 },
	{ chance: 0.85, nonce: -1, score: 0 },
	{ chance: 0.9, nonce: -1, score: 0 },
	{ chance: 0.95, nonce: -1, score: 0 },
	{ chance: 1.0, nonce: -1, score: 0 },
	{ chance: 1.1, nonce: -1, score: 0 },
	{ chance: 1.2, nonce: -1, score: 0 },
	{ chance: 1.3, nonce: -1, score: 0 },
	{ chance: 1.4, nonce: -1, score: 0 },
	{ chance: 1.5, nonce: -1, score: 0 },
	{ chance: 1.6, nonce: -1, score: 0 },
	{ chance: 1.7, nonce: -1, score: 0 },
	{ chance: 1.8, nonce: -1, score: 0 },
	{ chance: 1.9, nonce: -1, score: 0 },
	{ chance: 2.0, nonce: -1, score: 0 },
	{ chance: 2.2, nonce: -1, score: 0 },
	{ chance: 2.4, nonce: -1, score: 0 },
	{ chance: 2.6, nonce: -1, score: 0 },
	{ chance: 2.8, nonce: -1, score: 0 },
	{ chance: 3.0, nonce: -1, score: 0 },
	{ chance: 3.5, nonce: -1, score: 0 },
	{ chance: 4.0, nonce: -1, score: 0 },
	{ chance: 4.5, nonce: -1, score: 0 },
	{ chance: 5.0, nonce: -1, score: 0 },
	{ chance: 6.0, nonce: -1, score: 0 },
	{ chance: 7.0, nonce: -1, score: 0 },
	{ chance: 8.0, nonce: -1, score: 0 },
	{ chance: 9.0, nonce: -1, score: 0 },
	{ chance: 10.0, nonce: -1, score: 0 },
	{ chance: 12.0, nonce: -1, score: 0 },
	{ chance: 14.0, nonce: -1, score: 0 },
	{ chance: 16.0, nonce: -1, score: 0 },
	{ chance: 18.0, nonce: -1, score: 0 },
	{ chance: 20.0, nonce: -1, score: 0 },
	{ chance: 30.0, nonce: -1, score: 0 },
	{ chance: 40.0, nonce: -1, score: 0 },
	{ chance: 49.0, nonce: -1, score: 0 },
	{ chance: 60.0, nonce: -1, score: 0 },
	{ chance: 70.0, nonce: -1, score: 0 },
	{ chance: 80.0, nonce: -1, score: 0 },
	{ chance: 90.0, nonce: -1, score: 0 },
	{ chance: 95.0, nonce: -1, score: 0 }
];

var highgaps = [
	{ chance: 0.01, nonce: -1, score: 0 },
	{ chance: 0.02, nonce: -1, score: 0 },
	{ chance: 0.03, nonce: -1, score: 0 },
	{ chance: 0.04, nonce: -1, score: 0 },
	{ chance: 0.05, nonce: -1, score: 0 },
	{ chance: 0.06, nonce: -1, score: 0 },
	{ chance: 0.07, nonce: -1, score: 0 },
	{ chance: 0.08, nonce: -1, score: 0 },
	{ chance: 0.09, nonce: -1, score: 0 },
	{ chance: 0.1, nonce: -1, score: 0 },
	{ chance: 0.11, nonce: -1, score: 0 },
 	{ chance: 0.12, nonce: -1, score: 0 },
 	{ chance: 0.13, nonce: -1, score: 0 },
	{ chance: 0.14, nonce: -1, score: 0 },
	{ chance: 0.15, nonce: -1, score: 0 },
	{ chance: 0.16, nonce: -1, score: 0 },
	{ chance: 0.17, nonce: -1, score: 0 },
	{ chance: 0.18, nonce: -1, score: 0 },
	{ chance: 0.19, nonce: -1, score: 0 },
	{ chance: 0.2, nonce: -1, score: 0 },
	{ chance: 0.22, nonce: -1, score: 0 },
	{ chance: 0.24, nonce: -1, score: 0 },
	{ chance: 0.26, nonce: -1, score: 0 },
	{ chance: 0.28, nonce: -1, score: 0 },
	{ chance: 0.3, nonce: -1, score: 0 },
	{ chance: 0.32, nonce: -1, score: 0 },
	{ chance: 0.34, nonce: -1, score: 0 },
	{ chance: 0.36, nonce: -1, score: 0 },
	{ chance: 0.38, nonce: -1, score: 0 },
	{ chance: 0.4, nonce: -1, score: 0 },
	{ chance: 0.42, nonce: -1, score: 0 },
	{ chance: 0.44, nonce: -1, score: 0 },
	{ chance: 0.46, nonce: -1, score: 0 },
	{ chance: 0.48, nonce: -1, score: 0 },
	{ chance: 0.5, nonce: -1, score: 0 },
	{ chance: 0.55, nonce: -1, score: 0 },
	{ chance: 0.6, nonce: -1, score: 0 },
	{ chance: 0.65, nonce: -1, score: 0 },
	{ chance: 0.7, nonce: -1, score: 0 },
	{ chance: 0.75, nonce: -1, score: 0 },
	{ chance: 0.8, nonce: -1, score: 0 },
	{ chance: 0.85, nonce: -1, score: 0 },
	{ chance: 0.9, nonce: -1, score: 0 },
	{ chance: 0.95, nonce: -1, score: 0 },
	{ chance: 1.0, nonce: -1, score: 0 },
	{ chance: 1.1, nonce: -1, score: 0 },
	{ chance: 1.2, nonce: -1, score: 0 },
	{ chance: 1.3, nonce: -1, score: 0 },
	{ chance: 1.4, nonce: -1, score: 0 },
	{ chance: 1.5, nonce: -1, score: 0 },
	{ chance: 1.6, nonce: -1, score: 0 },
	{ chance: 1.7, nonce: -1, score: 0 },
	{ chance: 1.8, nonce: -1, score: 0 },
	{ chance: 1.9, nonce: -1, score: 0 },
	{ chance: 2.0, nonce: -1, score: 0 },
	{ chance: 2.2, nonce: -1, score: 0 },
	{ chance: 2.4, nonce: -1, score: 0 },
	{ chance: 2.6, nonce: -1, score: 0 },
	{ chance: 2.8, nonce: -1, score: 0 },
	{ chance: 3.0, nonce: -1, score: 0 },
	{ chance: 3.5, nonce: -1, score: 0 },
	{ chance: 4.0, nonce: -1, score: 0 },
	{ chance: 4.5, nonce: -1, score: 0 },
	{ chance: 5.0, nonce: -1, score: 0 },
	{ chance: 6.0, nonce: -1, score: 0 },
	{ chance: 7.0, nonce: -1, score: 0 },
	{ chance: 8.0, nonce: -1, score: 0 },
	{ chance: 9.0, nonce: -1, score: 0 },
	{ chance: 10.0, nonce: -1, score: 0 },
	{ chance: 12.0, nonce: -1, score: 0 },
	{ chance: 14.0, nonce: -1, score: 0 },
	{ chance: 16.0, nonce: -1, score: 0 },
	{ chance: 18.0, nonce: -1, score: 0 },
	{ chance: 20.0, nonce: -1, score: 0 },
	{ chance: 30.0, nonce: -1, score: 0 },
	{ chance: 40.0, nonce: -1, score: 0 },
	{ chance: 49.0, nonce: -1, score: 0 },
	{ chance: 60.0, nonce: -1, score: 0 },
	{ chance: 70.0, nonce: -1, score: 0 },
	{ chance: 80.0, nonce: -1, score: 0 },
	{ chance: 90.0, nonce: -1, score: 0 },
	{ chance: 95.0, nonce: -1, score: 0 }
];

var username = profile.username; 
var password = profile.password; 
var token = profile.token;
var orig_profile_chance = profile.minchance;
var condition = profile.condition;

var auth_str = profile.apikey != '' ? 'api_key=' + profile.apikey : 'access_token=' + profile.token;
var ownuserinfo;
var betres;

var bankamountmin = 50001;
var bankat = 150000000;
var bankuser = profile.bankuser;

var balance = 0;
var startbalance = 0;

var winstreak = 0;
var losestreak = 0;

var losestreakcost = profile.cost;
var amount = profile.amount;
if(amount > 0 || profile.cost > 0)
    amount = getwagerforprofit(getchance(profile.target), profile.cost, profile.amount, profile.stepped);
losestreakcost += amount;

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

function random(howMany, chars) {
    chars = chars 
		|| "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
    var rnd = crypto.randomBytes(howMany), 
		value = new Array(howMany), 
		len = chars.length;

    for (var i = 0; i < howMany; i++)
        value[i] = chars[rnd[i] % len]

    return value.join('');
}

function loginend() {
	needle.get(url + '/users/1?' + auth_str).on('readable', getownuserinfo).on('end', getownuserinfoend);

	var interval = setInterval(
		function() {
			if(gotownuserinfo) {
				console.log('auth success');
				balance = ownuserinfo.balance;
				startbalance = balance;
				clearInterval(interval);

				if(balance < 1) {
					console.log("Balance is less than 1 satoshi, waiting for funds... ");

					//amount = 0;
					needle.get(url + '/users/1?' + auth_str).on('readable', getownuserinfo).on('end', getownuserinfoend);
					setTimeout(loginend, 20000);
					return;
				}

				rebet()
			}
		}
	, 1000);
}

function bank() {
	var chunk;
	while (chunk = this.read())
		balance = chunk.user.balance;

	console.log(JSON.stringify(chunk));
	maxbalance = balance = res.user.balance;
}

function bankend() {
}

var beterr = false;

function bet(error, res) {
	var timeout = 250;
	if(error) {
		console.log('error, retrying bet', error);
		beterr = true;
	} else if(res.statusCode == 200 && typeof(res.body.user) != 'undefined') {
		betres = res.body.bet;
		balance = res.body.user.balance;
		beterr = false;
	} else {
		beterr = true;
		if (res.body.match(/Too many requests/) === null) {
			timeout = 10000;
		}
		console.log('err:', res.body);
	}
	
	if(beterr)
		betres = null;
		
	if(betres != null)
		lastbetid = betres.id;
	else
		lastbetid = 0;

	if (beterr) {
		setTimeout(rebet, timeout);
		return;
	}

	betend();
}

var ansi_seq_end = '\x1b[0m';
var pink = [ '\x1b[1;35m', ansi_seq_end ];
var blue = [ '\x1b[1;34m', ansi_seq_end ];
var green = [ '\x1b[1;32m', ansi_seq_end ];
var red = [ '\x1b[1;31m', ansi_seq_end ];

var lastbetid = 0;

var waittime = 0;

function updategaps(nonce, roll) {
	for(var i = 0; i < lowgaps.length; ++i) {
		if(roll < lowgaps[i].chance)
			lowgaps[i].nonce = nonce;
	}
	computegapscores(lowgaps, nonce);

	for(var i = 0; i < highgaps.length; ++i) {
		if(roll > (9999-Math.round(highgaps[i].chance*100))/100)
			highgaps[i].nonce = nonce;
	}
	computegapscores(highgaps, nonce);
}

function computegapscores(gaps, nonce) {
	var score;
	
	for(var i = 0; i < gaps.length; ++i) {
		score = 0.0;
		if(gaps[i].nonce >= 0) {
			score = (nonce-gaps[i].nonce)*gaps[i].chance/100;
			score = Math.round(score*1e5)/1e5;
			gaps[i].score = score;
		}
	}
}

function gethighgapscore(gaps, nonce, minchance, maxchance) {
	var gapidx = -1;
	var highscore = 0.0;
	var score = 0.0;
	
	minchance = minchance || 0.01;
	maxchance = maxchance || 98.0;

	minchance = Math.round(minchance*100)/100;
	maxchance = Math.round(maxchance*100)/100;

	for(var i = 0; i < gaps.length; ++i) {
		score = 0.0;
		if(gaps[i].nonce >= 0) {
			if(gaps[i].chance >= minchance && gaps[i].chance <= maxchance) {
				score = gaps[i].score;
				if(score > highscore) {
					highscore = score;
					gapidx = i;
				}
			}
		}
	}

	var gap = null;
	if(gapidx >= 0) {
		gap = gaps[gapidx];
		return { chance: gap.chance, score: highscore };
	}
	
	return { chance: 0, score: 0 };
}

function getlowestgapofscore(gaps, nonce, minchance, maxchance, minscore) {
	var gapidx = -1;
	var score = 0.0;
	var highscore = 0.0;
	
	minchance = minchance || 0.01;
	maxchance = maxchance || 98.0;

	minchance = Math.round(minchance*100)/100;
	maxchance = Math.round(maxchance*100)/100;
	
	for(var i = gaps.length-1; i > 0; --i) {
		score = 0.0;
		if(gaps[i].nonce >= 0) {
			if(gaps[i].chance >= minchance && gaps[i].chance <= maxchance) {
				score = gaps[i].score;
				if(score > minscore) {
					highscore = score;
					gapidx = i;
				}
			}
		}
	}

	var gap = null;
	if(gapidx >= 0) {
		gap = gaps[gapidx];
		//console.log(gap.chance, highscore)

		return { chance: gap.chance, score: highscore };
	}
	
	return { chance: 0, score: 0 };
}

var lasthighscore = 0, lastlowscore = 0;

function betend() {
    if(betres == null) {
		console.log('betend null res');
        setTimeout(rebet, 1000);
        return;
	}
	
	if (betres != null) {
		if (betres.win) {
			if (losestreak > 0) {
				losestreak = 0;
				winstreak = 1;
			} else {
				winstreak++;
			}
			wins++;
		} else {
			if (winstreak > 0) {
				winstreak = 0;
				losestreak = 1;
			} else {
				losestreak++;
			}
			losses++;
		}
		
		var seqs = [ green, red ];
		var use = 0;
		if (!betres.win)
			use = 1;

		var streak_string = '(';
		if (betres.win) {
			streak_string += green[0] + 'W' + winstreak + green[1]; 
		} else {
			streak_string += red[0] + 'L' + losestreak + red[1];
		}
		streak_string += ')';

		var roll_string = '';
		if (betres.roll < 1.0 || betres.roll > 99.99-1.0) {
			roll_string = pink[0] + pad(betres.roll.toFixed(2), 5) + pink[1];
		} else {
			roll_string = pad(betres.roll.toFixed(2), 5);
		}
		
		var target_string = pad(betres.target.toFixed(2), 5);

		console.log(profile.username + ' ' + Math.floor(Date.now() / 1000) + 
			' ' + betres.id + ' ' + betres.nonce + ' ' +
			betres.condition + target_string + ' ' +
			roll_string + ' ' +
			Math.floor(balance).toFixed(0) + 
			'(' + seqs[use][0] + betres.profit.toFixed(0) + seqs[use][1] + ') ' +  
			'bet ' + totalbet.toFixed(0) +  ' ' +
			streak_string + ' cost(' +
			(betres.win ? (losestreakcost-betres.amount).toFixed(0) : losestreakcost.toFixed(0)) + ')'
		);

		if (profile.bankat > 0 && balance >= profile.bankat) {
			var bankamount = Math.floor(balance);
			if (bankamount < 50000)
				bankamount = 50000;

			banked += bankamount;
			balance -= bankamount;
			startbalance = balance;
			needle.post(url + '/tip?' + auth_str, {username: bankuser, amount: bankamount, hide: true}).on('readable', bank).on('end', bankend);
		}
		lastbetid = 0;
		
		if (first) {
			startbalance = balance;
			first = false;

			for(var i = 0; i < lowgaps.length; ++i) {
				lowgaps[i].nonce = betres.nonce;
			}

			for(var i = 0; i < highgaps.length; ++i) {
				highgaps[i].nonce = betres.nonce;
			}
		}
		updategaps(betres.nonce, betres.roll);
	}

	if (last_bet_time > 0 && betres.amount < 10000 && Date.now() < last_bet_time+500+ping_estimate) {
		waittime = last_bet_time+500+ping_estimate - Date.now();
		if (waittime < 0)
			waittime = 0;
	} else {
		waittime = 0;
	}
    setTimeout(rebet, waittime);
}

var amountsave = 0;

var broke = false;
var raised = false;

var betlog;

var fs = require('fs');
readbetlog();

var lasttarget = 0;
var lastroll = 0.0;
var lastcondition = '<';
var lastbet = amount;
var lastwon = false;

var totalbet = 0;
var banked = 0;

var target = profile.target;
var condition = profile.condition;

var gotownuserinfo = false;

var losses = 0;
var wins = 0;

var first = true;

function getwagerforprofit(chance, streakCost, minprofit, stepped) {
	streakCost = streakCost < 0 ? 0 : streakCost;
	minprofit = minprofit < 0.0001 ? 0.0001 : minprofit;

	var payout = getpayout(chance);
	var wager = 1.;

	while (wager * payout-wager < streakCost + minprofit) {
		wager = Math.round(wager*2);
	}

	if (!stepped) {
		while (wager > 0 && ((wager-1) * payout)-(wager-1) >= streakCost + minprofit) {
			wager -= 1;
		}
	}

	if(wager < 1)
		wager = 1;

	return wager;
}

function readbetlog() {
	var data = fs.readFileSync('bet_log-' + profile.username + '.txt');
	if(data == null || data == '') {
		console.log('Error reading bet log.')
	} else {
		console.log('Bet log read successfully.');
		console.log(data.toString());
		betlog = JSON.parse(data);
	}
}

function writebetlog() {
	if(!fs.writeFileSync('bet_log-' + profile.username + '.txt', JSON.stringify(betlog)))
		console.log('Bet log saved.');
	else
		console.log('Error saving bet log.');
}

function getRandom(min, max) {
	return Math.random() * (max - min) + min;
}

function roundtoprecision(value, precision) {
	var power = Math.pow(10, precision);
	return Math.floor(value * power) / power;
}

function getpayout(chance) {
	return roundtoprecision(100./chance*0.99, 5);
}

function settarget(chance, is_high) {
	if (is_high) {
		target = 99.99-chance;
		condition = '>';
	} else {
		target = chance;
		condition = '<';
	}

	return { target: target, is_high: is_high };
}

function gettarget(chance, is_high) {
	if (is_high) {
		target = 99.99-chance;
		condition = ">";
	} else {
		target = chance;
		condition = "<";
	}
	
	return { target: target, is_high: is_high };
}

function setchance(targetroll, is_high) {
	var chance = 0;

	if (is_high) {
		target = targetroll;
		chance = 99.99-target;
		condition = '>';
	} else {
		target = targetroll
		chance = target;
		condition = '<';
	}

	return chance;
}

function getchance(target) {
	if (profile.condition == '>') {
		return (9999-profile.target*100)/100;
	} else {
		return profile.target;
	}
}

var currpayout = profile.condition == '>' ? 
		getpayout(99.99-profile.target) : 
		getpayout(profile.target);

var maxbalance = 0;

var onswitch = false;
var switchscore = null;
var switchamount = 0;
var switchlow = false;

var mode2zigpaydirup = true;
var mode3amount = profile.amount;

var rolltarget = {
	target: 0,
	condition: '>'
};

var lowvgap = null;
var highvgap = null;
var vgap = { islow: true, vgap: lowvgap };
var currvgap = null;

var mode2first = false;

var lastamount = amount;
var raisemode2 = false;

var last_bet_time = 0;

function getnextmode2chance(curr) {
	if (!profile.mode2zig || (profile.mode2zig && mode2zigpaydirup)) {
		 if (curr == 98) {
			curr = 95;
		} else {
			var currpayout = getpayout(curr);
			while (curr > profile.minchance && getpayout(curr) <= currpayout+4) {
				curr -= 0.5;
				curr = Math.round(curr*100)/100;
			}
		}
	} else if (profile.mode2zig && !mode2zigpaydirup) {
		var currpayout = getpayout(curr);
		while (curr < 10 && getpayout(curr) > currpayout-1) {
			curr += 0.01;
			curr = Math.round(curr*100)/100;
		}
		if (curr >= profile.maxchance) {
			mode2zigpaydirup = true;
		}
	}

	if (curr < profile.minchance) {
		curr = profile.minchance;
				
		if (profile.mode2zig)
			mode2zigpaydirup = false;
	}

	return curr;
}

var mode2saveamount = profile.amount;

function rebet() {
	if((profile.waitforfunds && amount > 0 && amount > balance) ||
            (!profile.waitforfunds && amount > 0 && balance < 1)) {
		if(!broke) {
            console.log('waiting for sufficient funds...');
			broke = true;
			amountsave = amount;
		}

		needle.get(url + '/users/1?' + auth_str).on('readable', getownuserinfo).on('end', getownuserinfoend);
		setTimeout(rebet, 15000);
		return;
	}
    
	if(betres == null) {
		needle.post(url + '/bet?' + auth_str, { 
			amount: amount, 
			target: target, 
			condition: condition 
		}, bet);
		return;
	}

	if(balance > 0 && broke) {
		amount = amountsave;
        if(profile.mode3)
            amount = mode3amount;
		broke = false;
	}

	if(balance > maxbalance)
		maxbalance = balance;

	lastwon = betres.win;
	lastroll = betres.roll;
	lasttarget = betres.target;
	lastcondition = betres.condition;
    
	if(lastroll <= 0.1 || lastroll >= 99.89) {
		for(var i = 0; i < betlog.rolls.length; ++i) {
			if(betlog.rolls[i].roll == lastroll)
				betlog.rolls[i].nonce = betres.nonce;
			console.log(betlog.rolls[i]);
		}
		writebetlog();
	}
    
	var lowgap = gethighgapscore(lowgaps, betres.nonce);
	var highgap = gethighgapscore(highgaps, betres.nonce);

	if(lastwon) {
		if(raised) {
			amountsave = 0;
			raised = false;
		}
	}

	if (lastwon) {
		if (profile.mode2) {
			profile.minchance = orig_profile_chance;
		}
	}

    lowvgap = gethighgapscore(lowgaps, betres.nonce, 0.01, profile.minchance);
    highvgap = gethighgapscore(highgaps, betres.nonce, 0.01, profile.minchance);

	var ishighv = false;
	if(lowvgap.chance > 0 || highvgap.chance > 0) {
		if(lowvgap.score > highvgap.score)
			ishighv = false;
		else
			ishighv = true;
	}

	if(!vgap.vgap) {
		if(ishighv) {
			vgap.vgap = highvgap;
			vgap.islow = false;
		} else {
			vgap.vgap = lowvgap;
			vgap.islow = true;
		}
		if(first && vgap.vgap.chance < profile.minchance) {
			vgap.vgap.chance = profile.minchance;
			if(vgap.islow && profile.condition == '>')
				vgap.islow = false;
			else if(!vgap.islow && profile.condition == '<')
				vgap.islow = true;
			onswitch = true;
		}
		//console.log(lowvgap, highvgap, vgap, levels, currlevel)
	}
	
	if(lastwon) {
		losestreakcost = amountsave = amount = 0;

		if(profile.rnd) {
			if(condition == '<')
				condition = '>';
			else
				condition = '<';

			target = getRandom(profile.minchance, profile.maxchance);
			if(condition == '<')
				target = 99.99-target;
			target = Math.floor(roundtoprecision(target, 2));
		} else if (profile.mode3) {
			if ((condition == '>' && lastroll > 99.99-profile.minchance) || 
					(condition == '<' && lastroll < profile.minchance)) {
				if (condition == '<') {
					condition = '>';
					target = 99.99-profile.maxchance;
				} else {
					condition = '<';
					target = profile.maxchance;
				}
			} else {
				target = lastroll;
			}
		} else if (profile.mode2) {
			if (lowvgap.chance > 0 && lowvgap.score >= highvgap.score) {
				vgap.islow = true;
				vgap.vgap = lowvgap;
				profile.minchance = lowvgap.chance;
				condition = '<';
			} else if (highvgap.chance > 0 && highvgap.score > lowvgap.score) {
				vgap.islow = false;
				vgap.vgap = highvgap;
				profile.minchance = highvgap.chance;
				condition = '>';
			}

			if (condition == '>')
				target = 99.99-profile.maxchance;
			else
				target = profile.maxchance;

			//console.log(lowvgap, highvgap, ishighv, target, condition);
			currpayout = getpayout(profile.maxchance);
		} else {   
			target = lastroll;

			if(condition == '<') {
				if(lastroll < profile.minchance) {
					condition = '>';
					target = 99.99-profile.maxchance;
				}
			} else if (condition == '>') {
				if(lastroll > 99.99-profile.minchance) {
					condition = '<';
					target = profile.maxchance;
				}
			}
		}

		mode2first = true;
		raisemode2 = false;
		onswitch = false;
		mode2zigpaydirup = true;
	} else {
		var chance = 0;
		if (condition == '<') {
			chance = target;
		} else {
			chance = 99.99-target;
		}
           
		if (!onswitch && profile.mode2/* && mode2zigpaydirup*/) {
			chance = getnextmode2chance(chance);

			//console.log(chance, minchance, maxchance);
		}
		currpayout = getpayout(chance);

		if(chance > profile.maxchance)
			chance = profile.maxchance

		if (condition == '<') {
			target = chance;
		} else {
			target = 99.99-chance;
		}
        
		if (vgap.vgap && vgap.vgap.chance > 0) {
			//console.log(profile.minchance, vgap)
			if (vgap.islow) {
				vgap.vgap = gethighgapscore(lowgaps, betres.nonce, 0.01, vgap.vgap.chance);
			} else {
				vgap.vgap = gethighgapscore(highgaps, betres.nonce, 0.01, vgap.vgap.chance);
			}
        }

		var switchlowvgap;
		var switchhighvgap;

		var gaps = [
			{ chance: vgap.vgap.chance * 1.25, score: vgap.vgap.score+1.0 },
			{ chance: vgap.vgap.chance * 1.5, score: vgap.vgap.score+1.5 },
			{ chance: vgap.vgap.chance * 2.0, score: vgap.vgap.score+2.0 },
			{ chance: vgap.vgap.chance * 2.5, score: vgap.vgap.score+2.5 },
			{ chance: vgap.vgap.chance * 3, score: vgap.vgap.score+3.0 },
			{ chance: vgap.vgap.chance * 3.5, score: vgap.vgap.score+3.5 },
			{ chance: vgap.vgap.chance * 4, score: vgap.vgap.score+4.0 },
			{ chance: vgap.vgap.chance * 6, score: vgap.vgap.score+6.0 },
		];

		var lgap = { chance: 0, score: 0 };
		var hgap = { chance: 0, score: 0 };

		for (var i = 0; i < gaps.length; ++i) {
			var high_chance = gaps[i].chance;
			if (high_chance > profile.maxchance)
				high_chance = profile.maxchance;

            var clgap = getlowestgapofscore(lowgaps, betres.nonce, 0.01, high_chance, gaps[i].score);
            var chgap = getlowestgapofscore(highgaps, betres.nonce, 0.01, high_chance, gaps[i].score);
            if (clgap.score > lgap.score) {
                lgap = clgap;
                //console.log(clgap);
            }
            if(chgap.score > hgap.score) {
                hgap = chgap;
                //console.log(chgap);
            }
            if (high_chance >= profile.maxchance)
				break;
        }
        switchlowvgap = lgap;
        switchhighvgap = hgap;

		if (vgap.vgap.score > 0 && 
				(switchlowvgap.score > vgap.vgap.score ||
				switchhighvgap.score > vgap.vgap.score)) {

			console.log(vgap, switchlowvgap, switchhighvgap)

			if (switchlowvgap.score > switchhighvgap.score)
				ishighv = false;
			else
				ishighv = true;

			if (ishighv) {
				condition = '>';
				chance = switchhighvgap.chance;
				target = 99.99-chance;
				vgap.islow = false;
				vgap.vgap = switchhighvgap;
			} else {
				condition = '<';
				chance = switchlowvgap.chance;
				target = chance;
				vgap.islow = true;
				vgap.vgap = switchlowvgap;
			}
v   
			profile.minchance = chance;
			//console.log(vgap);
		} 
	}

	if (betres.nonce % 250 == 0)
		console.log(lowgaps, highgaps)
	if (betres.nonce % 50 == 0)
		console.log(vgap, lowvgap, highvgap)

	if (!betres.won && (profile.stoplossenabled && balance >= 50001 && losestreakcost > profile.maxstreakcost)) {
		if (!((condition == '<' && target <= 0.1) || (condition == '>' && target > 99.88))) {
			console.log('Streakcost of ' +  (losestreakcost+amount) + ' would exceed safety limit.');
			needle.post(url + '/tip?' + auth_str, {username: bankuser, amount: Math.floor(balance), hide: true}).on('readable', bank).on('end', bankend);
			balance = maxbalance = 0;
			setTimeout(betend, 15000);
			return;
		}
	}

	if (!onswitch && (((lasthighscore.score > 5 && lastlowscore.score > 5) && 
				(lowgap.score == 0 || highgap.score == 0)) || 
				(highgap.chance <= 2.0 && highgap.score > 10) || 
				(lowgap.chance <= 2.0 && lowgap.score > 10) || 
				highgap.score > 12.5 || lowgap.score > 12.5)) {
		var ishigh = highgap.score >= lowgap.score;
		var tvar = null;
		if (ishigh) {
			tvar = '>' + (99.99-highgap.chance) + '@' + highgap.score + 'x';
		} else {
			tvar = '<' + lowgap.chance + '@' + lowgap.score + 'x';
		}
		console.log('prev_variance: >' + (99.99-lasthighscore.chance) + '@' + lasthighscore.score + 'x' +
				' <' + lastlowscore.chance + '@' + lastlowscore.score + 'x') + ' curr_variance: ' + tvar;

		if (want_high_variance_prompt || auto_high_variance_switch) {
			switchscore = highgap.score > lowgap.score ? highgap : lowgap;
			switchlow = lowgap.score > highgap.score;
			switchamount = 0;

			if (want_high_variance_prompt) {
				var change = prompt('High variance detected, switch to ' + tvar + ' ? ');
				if (change.length > 0 && change.toLowerCase() === 'y') {
					onswitch = true;
					var stramount = prompt('Amount: ');
					if (stramount && Number(stramount) > 0) {
						switchamount = Number(stramount);
					}
				}
			}
			if (auto_switch_high_variance) {
				onswitch = true;
			}

			if (onswitch) {
				if (switchlow) {
					target = switchscore.chance;
					condition = '<';
				} else {
					target = 99.99-switchscore.chance;
					condition = '>';
				}
			}
		}
	}

	if (!profile.static) {
		var chance = 0;
		if (condition == '<') {
			chance = target;
		} else {
			chance = 99.99-target;
		}

		if (switchamount > 0) {
			amount = getwagerforprofit(chance, losestreakcost, switchamount, profile.stepped);
			losestreakcost += switchamount;
			
			switchamount = 0;
		} else {
			if (profile.mode2) {
				if (lastwon) {
					var scorebonus = 0;
					if (vgap.gap) {
						scorebonus = vgap.vgap.score*0.05;
						if (balance > 50000) {
							scorebonus = vgap.vgap.score*0.125;
						} else if (balance > 100000) {
							scorebonus = vgap.vgap.score*0.25;
						} else if (balance > 1000000) {
							scorebonus = vgap.vgap.score*0.5;
						} else if (balance > 10000000) {
							scorebonus = vgap.vgap.score*0.75;
						} else if (balance > 100000000) {
							scorebonus = vgap.vgap.score;
						}
					}

					mode2saveamount = profile.amount + scorebonus;
					amount = getwagerforprofit(chance, losestreakcost, mode2saveamount, profile.stepped)
					if (amount < 1)
						amount = 1;
				} else {
					if(chance <= 0.2 && balance > 50000 && losestreakcost < Math.ceil(getpayout(chance)/2))
						losestreakcost = Math.ceil(getpayout(chance)/2);
					if (!profile.mode2zig && chance <= profile.minchance && !raisemode2) {
						raisemode2 = true;
					}
					amount = getwagerforprofit(chance, losestreakcost, mode2saveamount, profile.stepped);
				}
			} else if (profile.mode3) {
   				if (lastwon) {
					amount = profile.amount;
                } else {
                    var tmp = amount+Math.ceil(amount/getpayout(chance)*((1.0+chance/100.)+0.5));
                    amount = tmp;
                    if(balance-amount < amount+Math.ceil(amount/getpayout(chance)*((1.0+chance/100.)+0.5))) {
                        mode3amount = amount;
                    }
                }
			}
		}
	} else {
		amount = profile.amount;
		if (amount*2 > balance)
			amount = Math.floor(balance);
	}

	var nextamount = getwagerforprofit(chance, losestreakcost+amount*2, profile.amount, profile.stepped);
	if (profile.mode2) {
		nextamount = getwagerforprofit(getnextmode2chance(chance), losestreakcost+amount, profile.amount, profile.stepped);
	}
	
	if (!profile.waitforfunds && balance-amount < nextamount) {
		if (nextamount > 5000) {
			var change = prompt('Yolo  ' + Math.floor(balance) + ' ? ');
			if (change.length > 0 && change.toLowerCase() === 'y') {
				amount = Math.floor(balance);
			}
		} else {
			amount = Math.floor(balance);
		}
	}

	if (profile.waitforfunds && amount > Math.floor(balance)) {
        setTimeout(rebet, 15000);
        return;
    }
    
	losestreakcost += amount;

	if (balance < 1)
		amount = 0;

	lasthighscore = highgap;
	lastlowscore = lowgap;
	
	totalbet += amount;

	last_bet_time = Date.now();

	lastamount = amount;
    balance -= amount;
    
	needle.post(url + '/bet?' + auth_str, { 
		amount: amount, target: target, condition: condition 
	}, bet);
}

function getuserinfo(name) {
	//console.log(name)
	return needle.get(url + '/users/:' + name);
}

function getownuserinfo() {
	var chunk;
	var res;
	while (chunk = this.read())
		ownuserinfo = chunk;
}

function getownuserinfoend() {
	if (ownuserinfo != null) {
		balance = ownuserinfo.balance;
		gotownuserinfo = true;
	}
}

loginend();
