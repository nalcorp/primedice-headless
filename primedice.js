"use strict";

var needle = require('needle');
var prompt = require('sync-prompt').prompt;

var options = {
  compressed: 			true, 
  follow_max: 			5,
  rejectUnauthorized: 	true, 
  timeout: 				20000, 
  user_agent: 			'ChaosBot/0.2.1',
  follow_set_cookies: 	true
}

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

		maxchance: 98,
		minchance: 0.01,

		bankat: 0,
		stoplossenabled: false,
		maxstreakcost: 0,
		
		rnd: false,
		mode2: true,
		mode2zig: false,
		stepped: false,
		static: false,

		username: 'user1', 
		password: 'pass1',
		token: '',
		bankuser: 'bank'
	}, {
		target: 99.93,
		condition: '>',
		amount: 1,
		cost: 966666,

		maxchance: 98,
		minchance: 0.06,

		bankat: 0,
		stoplossenabled: false,
		maxstreakcost: 0,
		
		rnd: false,
		mode2: true,
		mode2zig: false,
		stepped: true,
		static: false,
		
		username: 'user2',
		password: 'pass2',
		token: '',
		bankuser: 'bank'
	}
];

// FIXME add proper support for profiles

// Must edit the index each launch 0 based(first profile index is 0)

var profile = profiles[2];

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
	{ chance: 0.15, nonce: -1, score: 0 },
	{ chance: 0.2, nonce: -1, score: 0 },
	{ chance: 0.25, nonce: -1, score: 0 },
	{ chance: 0.3, nonce: -1, score: 0 },
	{ chance: 0.4, nonce: -1, score: 0 },
	{ chance: 0.5, nonce: -1, score: 0 },
	{ chance: 0.75, nonce: -1, score: 0 },
	{ chance: 1.0, nonce: -1, score: 0 },
	{ chance: 1.5, nonce: -1, score: 0 },
	{ chance: 2.0, nonce: -1, score: 0 },
	{ chance: 5.0, nonce: -1, score: 0 },
	{ chance: 10.0, nonce: -1, score: 0 },
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
	{ chance: 0.15, nonce: -1, score: 0 },
	{ chance: 0.2, nonce: -1, score: 0 },
	{ chance: 0.25, nonce: -1, score: 0 },
	{ chance: 0.3, nonce: -1, score: 0 },
	{ chance: 0.4, nonce: -1, score: 0 },
	{ chance: 0.5, nonce: -1, score: 0 },
	{ chance: 0.75, nonce: -1, score: 0 },
	{ chance: 1.0, nonce: -1, score: 0 },
	{ chance: 1.5, nonce: -1, score: 0 },
	{ chance: 2.0, nonce: -1, score: 0 },
	{ chance: 5.0, nonce: -1, score: 0 },
	{ chance: 10.0, nonce: -1, score: 0 },
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

var condition = profile.condition;

var ownuserinfo;
var betres;

var waittimemin = 300;
var waittimemax = 350;

var bankamountmin = 50001;
var bankat = 150000000;
var bankuser = profile.bankuser;

var balance = 0;
var startbalance = 0;

var winstreak = 0;
var losestreak = 0;

var losestreakcost = profile.cost;

var amount = getwagerforprofit(getchance(profile.target), profile.cost, profile.amount, profile.stepped);

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

function login() {
	var chunk;
	while (chunk = this.read()) {
		token = chunk.access_token;
	}
}

function loginend() {
	needle.get(url + '/users/1?access_token=' + token).on('readable', getownuserinfo).on('end', getownuserinfoend);

	var interval = setInterval(
		function() {
			if(gotownuserinfo) {
				balance = ownuserinfo.balance;
				startbalance = balance;
				clearInterval(interval);

				if(balance < 1) {
					console.log("Balance is less than 1 satoshi, waiting for funds... ");

					amount = 0;
					needle.get(url + '/users/1?access_token=' + token).on('readable', getownuserinfo).on('end', getownuserinfoend);
					setTimeout(betend, 20000);
					return;
				}

				rebet()
			}
		}
	, 300);
}

function bank() {
	var res;
	var chunk;
	while (chunk = this.read())
		res = chunk;

	maxbalance = balance = res.balance;
	console.log(res);
}

function bankend() {
}

var beterr = false;

function bet() {
	betres = null;

	var res;
	var chunk;
	while (chunk = this.read())
		res = chunk;

	if(typeof(res.user) != 'undefined') {
		betres = res.bet;
		balance = res.user.balance;
			
		beterr = false;
	} else {
		console.log('error, retrying bet');
		beterr = true;
	}
	
	if(betres == null)
		beterr = true;
	if(beterr)
		betres = null;
		
	if(betres != null)
		lastbetid = betres.id;
	else
		lastbetid = 0;

	if(beterr)
		console.log(res.toString())
}

var green = [ "\x1b[1;32m", "\x1b[0m" ];
var red = [ "\x1b[1;31m", "\x1b[0m" ];

var lastbetid = 0;

var waittime = 350;

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
	if(betres != null && betres.id == lastbetid) {
		if(betres.win) {
			if(losestreak > 0) {
				losestreak = 0;
				winstreak = 1;
			} else {
				winstreak++;
			}
			wins++;
		} else {
			if(winstreak > 0) {
				winstreak = 0;
				losestreak = 1;
			} else {
				losestreak++;
			}
			losses++;
		}
		
		var seqs = [ green, red ];
		var use = 0;
		if(betres.win)
			use = 0;
		else
			use = 1;

		var profit = (balance + banked - startbalance).toFixed(0);
		console.log(profile.username + ' ' + Math.floor(Date.now() / 1000) + 
			' ' + betres.id + ' ' + betres.nonce + ' ' + Math.floor(balance).toFixed(0) + 
			'(' + seqs[use][0] + betres.profit.toFixed(0) + seqs[use][1] + ') ' + 
			betres.condition + betres.target + ' ' + betres.roll + 
			' bet ' + totalbet.toFixed(0) + 
			' (' + green[0] + 'W' + winstreak + green[1] + ':' + red[0] + 'L' + losestreak + red[1] + ') cost(' + losestreakcost.toFixed(0) + ')');

		if(profile.bankat > 0 && balance >= profile.bankat) {
			var bankamount = Math.floor(balance*0.15);
			if(bankamount < 50001)
				bankamount = 50001;

			banked += bankamount;
			balance -= bankamount;
			startbalance = balance;
			needle.post(url + '/tip?access_token=' + token, {username: bankuser, amount: bankamount}).on('readable', bank).on('end', bankend);
			//bankat += 200000;
		}
		lastbetid = 0;
		if (first) {
			first = false;

			for(var i = 0; i < lowgaps.length; ++i) {
				lowgaps[i].nonce = betres.nonce;
			}

			for(var i = 0; i < highgaps.length; ++i) {
				highgaps[i].nonce = betres.nonce;
			}
		}
	}

	setTimeout(rebet, waittime);
}

var balancehit = false;

var waiting = true;

var amountsave = 0;

var broke = false;
var raised = false;

var betlog;

var fs = require('fs');
readbetlog();

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

function getwagerforprofit(chance, streakCost, minprofit, stepped) {
	if(streakCost < 0.)
		streakCost = 0.;

	if(minprofit < 0.0001)
		minprofit = 0.0001;

	var payout = getpayout(chance);
	var wager = 1.;

	while(wager * payout-wager < streakCost + minprofit) {
		wager = Math.round(wager*2);
	}

	if(!stepped) {
		while(wager > 0 && ((wager-1) * payout)-(wager-1) >= streakCost + minprofit) {
			wager -= 1;
		}
	}

	if(wager < 1)
		wager = 1;

	return wager;
}

function settarget(chance, conditionhigh) {
	if (conditionhigh) {
		target = 99.99-chance;
		condition = '>';
	} else {
		target = chance;
		condition = '<';
	}
}

function gettarget(chance, conditionhigh) {
	if (conditionhigh) {
		
	} else {
	}
}

function setchance(targetroll, conditionhigh) {
	var chance = 0;

	if (conditionhigh) {
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

function getchance() {
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

var resumetarget = null;

var mode2zigpaydirup = true;

var rolltarget = {
	target: 0,
	condition: '>'
};

var lowvgap = null;
var highvgap = null;
var vgap = { islow: true, vgap: lowvgap };
var currvgap = null;

var mode2first = false;

var levels = [ 0.03, 0.05, 0.1, 0.2, 0.5, 1.0 ];
var currlevel = 1;
var maxlevel = levels.length;

var lastamount = amount;

function rebet() {
	if(beterr || betres == null) {
		needle.post(url + '/bet?access_token=' + token, { 
			amount: amount, 
			target: target, 
			condition: condition 
		}).on('readable', bet).on('end', betend);
		return;
	}

	if(balance < 1) {
		if(!broke) {
			broke = true;
			amountsave = amount;
		}

		amount = 0;
		needle.get(url + '/users/1?access_token=' + token).on('readable', getownuserinfo).on('end', getownuserinfoend);
		setTimeout(betend, 15000);

		return;
	}

	if(balance > 0 && broke) {
		amount = amountsave;
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

	updategaps(betres.nonce, lastroll);
	var lowgap = gethighgapscore(lowgaps, betres.nonce);
	var highgap = gethighgapscore(highgaps, betres.nonce);

	if(lastwon) {
		if(raised) {
			amountsave = 0;
			raised = false;
		}
	}

	if(resumetarget) {
		if((resumetarget.condition == '>' && lastroll > resumetarget.target) ||
				(resumetarget.condition == '<' && lastroll < resumetarget.target)) {
			resumetarget = null;
		}
	}

	if(lastwon)
		currlevel = 0;

	lowvgap = gethighgapscore(lowgaps, betres.nonce, 0.01, levels[currlevel]);
	highvgap = gethighgapscore(highgaps, betres.nonce, 0.01, levels[currlevel]);
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
			else if(!vgap.islow && profile.confition == '<')
				vgap.islow = true;
			onswitch = true;
		}
		//console.log(lowvgap, highvgap, vgap, levels, currlevel)
	}
	
	if(lastwon) {
		losestreakcost = 0;

		currlevel++;

		if(profile.rnd) {
			if(condition == '<')
				condition = '>';
			else
				condition = '<';

			target = getRandom(profile.minchance, profile.maxchance);
			if(condition == '<')
				target = 99.99-target;
			target = Math.floor(roundtoprecision(target, 2));
		} else if(profile.mode2 || 
				((rolltarget.condition == '>' && lastroll > 99.99-profile.minchance) || 
					(condition == '<' && lastroll < profile.minchance))) {
			profile.minchance = 0.01;
			if(lowvgap.chance > 0 && highvgap.chance > 0) {
				if (ishighv) {
					vgap.islow = false;
					vgap.vgap = highvgap;
					profile.minchance = highvgap.chance;
					condition = '>';
					target = 99.99-profile.maxchance;
				} else {
					vgap.islow = true;
					vgap.vgap = lowvgap;
					profile.minchance = lowvgap.chance;
					condition = '<';
					target = profile.maxchance;
				}
				//console.log(lowvgap, highvgap, ishighv, target, condition);
			} else {
				vgap.vgap = null;
				if(condition == '<') {
					if(lastroll < profile.minchance)
						condition = '>';
				} else {
					if(lastroll > 99.99-profile.minchance)
						condition = '<';
				}

				if(condition == '>')
					target = 99.99-profile.maxchance;
				else
					target = profile.maxchance;
			}

			if(profile.mode2) {
				currpayout = getpayout(profile.maxchance);
			}
		} else {
			target = lastroll;
		}

		if(resumetarget) {
			if(!profile.mode2) {
				target = resumetarget.target;
				condition = resumetarget.condition;
			}
			losestreakcost -= resumetarget.cost;

			resumetarget = null;
		}
		mode2first = true;
		onswitch = false;
		mode2zigpaydirup = true;
	} else {
		var chance = 0;
		if(condition == '<') {
			chance = target;
		} else {
			chance = 99.99-target;
		}
		
		if(currlevel >= maxlevel)
			currlevel = maxlevel-1;

		if(!onswitch && profile.mode2) {
			if(vgap.vgap && vgap.vgap.chance > 0) {
				//console.log(1, vgap)
				if(vgap.islow) {
					vgap.vgap = gethighgapscore(lowgaps, betres.nonce, 0.01, vgap.vgap.chance);
				} else {
					vgap.vgap = gethighgapscore(highgaps, betres.nonce, 0.01, vgap.vgap.chance);
				}
				profile.minchance = vgap.vgap.chance;
			}

			var max = maxlevel-1;
			var extralevel = 0;
			if(currlevel > 1 && currlevel+1 < max) {
				extralevel = 1;
			}

			var scoreneeded = 0.0;
			if(vgap.vgap.chance < 0.05)
				scoreneeded = 1.0;
			else
				scoreneeded = 2.0;

			var switchlowvgap = getlowestgapofscore(lowgaps, betres.nonce, 0.01, levels[currlevel+extralevel], vgap.vgap.score+scoreneeded);
			var switchhighvgap = getlowestgapofscore(highgaps, betres.nonce, 0.01, levels[currlevel+extralevel], vgap.vgap.score+scoreneeded);

			if((vgap.vgap.score > 0 && switchlowvgap.chance > 0 && switchlowvgap.score > 0) ||  
					(switchhighvgap.chance > 0 && switchhighvgap.score > 0)) {
				if(switchlowvgap.score > switchhighvgap.score)
						ishighv = false;
					else
						ishighv = true;
			}
			if(chance <= 1.0 && vgap && vgap.vgap && vgap.vgap.chance > 0 && 
					(switchlowvgap.chance > 0 || switchhighvgap.chance > 0) && 
					(vgap.vgap.chance <= 0.05 && 
							(switchlowvgap.score-1 > vgap.vgap.score || 
							switchhighvgap.score-1 > vgap.vgap.score)) ||
					(vgap.vgap.chance > 0.05 && 
							(switchlowvgap.score-2 > vgap.vgap.score || 
							switchhighvgap.score-2 > vgap.vgap.score))) {
				console.log(vgap, switchlowvgap, switchhighvgap)

				if (ishighv) {
					condition = '>';
					chance = switchhighvgap.chance;
					vgap.islow = false;
					vgap.vgap = switchhighvgap;
				} else {
					condition = '<';
					chance = switchlowvgap.chance;
					vgap.islow = true;
					vgap.vgap = switchlowvgap;
				}
				currlevel += 1+extralevel;
				if(currlevel >= maxlevel)
					currlevel = maxlevel-1;

				profile.minchance = chance;
				//console.log(vgap);
			} else {
				var minchance = profile.minchance;
				var maxchance = profile.maxchance;

				if((profile.mode2zig && mode2zigpaydirup) || !profile.mode2zig) {
					if(!mode2first) {
						if(chance == 75) {
							chance = 49;
						} else {
							while(chance > minchance && getpayout(chance) <= currpayout+1) {
								chance -= 2.0;
								chance = Math.round(chance*100)/100;
							}
							
						}

						if(chance < minchance) {
							chance = minchance;
							if(profile.mode2zig)
								mode2zigpaydirup = false;
							//console.log(chance, minchance, maxchance);
						}
					}
					if(mode2first) {
						chance = 75;
						mode2first = false;
					}
				} else if(profile.mode2zig && !mode2zigpaydirup) {
					while(chance < 0.1 && getpayout(chance) > currpayout-1) {
						chance += 0.01;
					}
					if(chance >= maxchance) {
						mode2zigpaydirup = true;
					}
				}
			}

			//console.log(chance, minchance, maxchance);
			currpayout = getpayout(chance);

			if(condition == '<') {
				target = chance;
			} else {
				target = 99.99-chance;
			}
		}
	}

	if(betres.nonce % 1000 == 0)
		console.log(lowgaps, highgaps)
	if(betres.nonce % 100 == 0)
		console.log(vgap, lowvgap, highvgap)

	if(!betres.won && (profile.stoplossenabled && balance >= 50001 && losestreakcost > profile.maxstreakcost)) {
		if(!((condition == '<' && target <= 0.1) || (condition == '>' && target > 99.88))) {
			console.log('Streakcost of ' +  (losestreakcost+amount) + ' would exceed safety limit.');
			needle.post(url + '/tip?access_token=' + token, {username: bankuser, amount: balance/*Math.floor(balance-50001)*/}).on('readable', bank).on('end', bankend);
			balance = maxbalance = 0;
			setTimeout(betend, 15000);
			return;
		}
	}

	if(!onswitch && highgap && lowgap && 
			(((lasthighscore.score > 4 && lastlowscore.score > 4) && 
				(lowgap.score == 0 || highgap.score == 0)) || 
				(highgap.chance <= 2.0 && highgap.score > 8) || 
				(lowgap.chance <= 2.0 && lowgap.score > 8) || 
				highgap.score > 10 || lowgap.score > 10)) {
		var ishigh = highgap.score > lowgap.score;
		var tvar = null;
		if(ishigh) {
			tvar = '>' + (99.99-highgap.chance) + '@' + highgap.score + 'x';
		} else {
			tvar = '<' + lowgap.chance + '@' + lowgap.score + 'x';
		}
		console.log('prev_variance: >' + (99.99-lasthighscore.chance) + '@' + lasthighscore.score + 'x' +
				' <' + lastlowscore.chance + '@' + lastlowscore.score + 'x') + ' curr_variance: ' + tvar;

		var change = prompt('High variance detected, switch to ' + tvar + ' ? ');
		if(change.length > 0 && change.toLowerCase() === 'y') {
			switchscore = highgap.score > lowgap.score ? highgap : lowgap;
			switchlow = lowgap.score > highgap.score;

			var stramount = prompt('Amount: ');
			if(stramount && Number(stramount) > 0) {
				switchamount = Number(stramount);
			}

			resumetarget = { 
				target: target, condition: condition, cost: losestreakcost
			};

			onswitch = true;
			if(switchlow) {
				target = switchscore.chance;
				condition = '<';
			} else {
				target = 99.99-switchscore.chance;
				condition = '>';
			}
		}
	}

	if(!profile.static) {
		var chance = 0;
		if(condition == '<') {
			chance = target;
		} else {
			chance = 99.99-target;
		}

		if(switchamount > 0) {
			amount = getwagerforprofit(chance, losestreakcost, switchamount, profile.stepped);
			losestreakcost += switchamount;
			
			switchamount = 0;
		} else {
			if(profile.mode2 && lastwon && vgap.vgap && vgap.vgap.score > 0) {
				var scorebonus = 0;
				if(balance > 100000000) {
					scorebonus = vgap.vgap.score*2;
				} else if(balance > 25000000) {
					scorebonus = vgap.vgap.score;
				} else if(balance > 5000000) {
					scorebonus = vgap.vgap.score*0.5;
				} else {
					scorebonus = vgap.vgap.score*0.25;
				}
				amount = getwagerforprofit(chance, losestreakcost, profile.amount+scorebonus, profile.stepped)
				if(amount < 16)
					amount = 16;
			} else {
				amount = getwagerforprofit(chance, losestreakcost, profile.amount, profile.stepped);
			}
		}
		
		if(balance-amount < getwagerforprofit(chance, losestreakcost+amount, profile.amount, profile.stepped)) {
			var change = prompt('Yolo  ' + getwagerforprofit(chance, losestreakcost+amount, profile.amount, profile.stepped) + ' ? ');
			if(change.length > 0 && change.toLowerCase() === 'y') {
				amount = Math.floor(balance);
			}
		}
	} else {
		amount = profile.amount;
		if(amount*2 > balance)
			amount = Math.floor(balance);
	}

	if(amount > balance)
		amount = balance;

	losestreakcost += amount;

	if(balance < 1)
		amount = 0;

	lasthighscore = highgap;
	lastlowscore = lowgap;
	
	totalbet += amount;

	if(amount > 10000 && lastamount > 10000)
		waittime = 50;
	else if(amount < 10000 && lastamount > 10000)
		waittime = 750;
	else
		waittime = 350;

	lastamount = amount;
	
	betres = null;
	beterr = true;
	needle.post(url + '/bet?access_token=' + token, { 
		amount: amount, target: target, condition: condition 
	}).on('readable', bet).on('end', betend);
}
function getuserinfo(name) {
	//console.log(name)
	return needle.get(url + '/users/:' + name);
}

function getownuserinfo() {
	var chunk;
	while (chunk = this.read())
		ownuserinfo = chunk.user;
	console.log(chunk)
}

function getownuserinfoend() {
	if(ownuserinfo != null) {
		balance = ownuserinfo.balance;
		gotownuserinfo = true;
	}
}

if(token == '')
	needle.post(url + '/login', { username: username, password: password }).on('readable', login).on('end', loginend);
else
	loginend();
