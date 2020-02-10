var iFileName = "Matt Mercer's Blood Hunter 2020.js";
RequiredSheetVersion(12.999);

var FightingStyles = {
	archery : {
		name : "Archery Fighting Style",
		description : "\n   " + "+2 bonus to attack rolls I make with ranged weapons",
		calcChanges : {
			atkCalc : ["if (isRangedWeapon) {output.extraHit += 2; }; ", "My ranged weapons get a +2 bonus on the To Hit."]
		}
	},
	defense : {
		name : "Defense Fighting Style",
		description : "\n   " + "+1 bonus to AC when I'm wearing armor",
		eval : "AddACMisc(1, 'Defense Fighting Style', 'When wearing armor, the class feature Defense Fighting Style gives a +1 bonus to AC', 'CurrentArmour.known && !ArmourList[CurrentArmour.known].type')",
		removeeval : "AddACMisc(0, 'Defense Fighting Style', 'When wearing armor, the class feature Defense Fighting Style gives a +1 bonus to AC')"
	},
	dueling : {
		name : "Dueling Fighting Style",
		description : "\n   " + "+2 to damage rolls when wielding a melee weapon in one hand and no other weapons",
		calcChanges : {
			atkCalc : ["var areOffHands = function(n){for(var i=1;i<=n;i++){if ((/off.hand.attack/i).test(What('Bonus Action ' + i))) {return true; }; }; }(FieldNumbers.actions); if (!areOffHands && isMeleeWeapon && !isNaturalWeapon && !(/\\b(2|two).?hand(ed)?s?\\b/i).test(theWea.description)) {output.extraDmg += 2; }; ", "When I'm wielding a melee weapon in one hand and no weapon in my other hand, I do +2 damage with that melee weapon. This condition will always be false if the bonus action 'Off-hand Attack' exists."]
		}
	},
	great_weapon : {
		name : "Great Weapon Fighting Style",
		description : "\n   " + "Reroll 1 or 2 on damage if wielding two-handed/versatile melee weapon in both hands",
		calcChanges : {
			atkAdd : ["if (isMeleeWeapon && (/\\b(versatile|(2|two).?hand(ed)?s?)\\b/i).test(theWea.description)) {fields.Description += (fields.Description ? '; ' : '') + 'Re-roll 1 or 2 on damage die' + ((/versatile/i).test(fields.Description) ? ' when two-handed' : ''); }; ", "While wielding a two-handed or versatile melee weapon in two hands, I can re-roll a 1 or 2 on any damage die once."]
		}
	},
	protection : {
		name : "Protection Fighting Style",
		description : "\n   " + "As a reaction, I can give disadv. on an attack made vs. someone within 5 ft of me" + "\n   " + "I need to be wielding a shield and be able to see the attacker to do this",
		action : ["reaction", ""]
	},
	two_weapon : {
		name : "Two-Weapon Fighting Style",
		description : "\n   " + "I can add my ability modifier to the damage of my off-hand attacks",
		calcChanges : {
			atkCalc : ["if (isOffHand) {output.modToDmg = true; }; ", "When engaging in two-weapon fighting, I can add my ability modifier to the damage of my off-hand attacks."]
		}
	}
};


SourceList["MM:BH"] = {
	name : "Matthew Mercer: Blood Hunter Class 2020",
	abbreviation : "MM:BH",
	group : "Dungeon Masters Guild",
	url : "https://www.dmsguild.com/product/170777/",
	date : "2018/06/07"
};
SourceList["MM:OotL"] = {
	name : "Matthew Mercer: Order of the Lycan for Blood Hunters v1.5",
	abbreviation : "MM:OotL",
	group : "Dungeon Masters Guild",
	url : "https://www.dmsguild.com/product/175606/",
	date : "2017/12/27"
};

ClassList["blood hunter"] = {
	regExpSearch : /^(?=.*blood)(?=.*hunter).*$/i,
	name : "Blood Hunter",
	source : ["MM:BH", 0],
	primaryAbility : "\n \u2022 Blood Hunter: Strength or Dexterity, and Intelligence;",
	prereqs : "\n \u2022 Blood Hunter: Strength 13 or Dexterity 13, and Intelligence 13;",
	die : 10,
	improvements : [0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5],
	saves : ["Dex", "Int"],
	skills : ["\n\n" + toUni("Blood Hunter") + ": Choose three from Acrobatics, Arcana, Athletics, Insight, Investigation, Religion, and Survival."],
	toolProfs : {
		primary : ["Alchemist's supplies"],
		secondary : ["Alchemist's supplies"]
	},
	armor : [
		[true, true, false, true],
		[true, true, false, true]
	],
	weapons : [
		[true, true],
		[true, true]
	],
	equipment : "Blood Hunter starting equipment:\n \u2022 Scale mail -or- studded leather armor;\n \u2022 A martial weapon -or- two simple weapons;\n \u2022 A light crossbow and 20 bolts -or- a hand crossbow and 20 bolts;\n \u2022 An explorer's pack.\n\nAlternatively, choose 4d4 \xD7 10 gp worth of starting equipment instead of both the class' and the background's starting equipment.",
	subclasses : ["Blood Hunter Orders", ["blood hunter-order of the ghostslayer", "blood hunter-order of the lycan", "blood hunter-order of the mutant", "blood hunter-order of the profane soul"]],
	attacks : [1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  abilitySave : 4,
	features : {
		"hunter's bane" : {
			name : "Hunter's Bane",
			source : ["MM:BH", 3],
			minlevel : 1,
			description : desc([
				"When tracking a Fey, Fiends, or Undead, I can't be surprised by a creature of that type",
				"I have adv. on Wis (Survival) checks to track and Int checks to recall info about them",
			])
		},
    "blood maledict" : {
			name : "Blood Maledict",
			source : ["MM:BH", 3],
			minlevel : 1,
			description : desc([
				"I can use a Blood Curse on targets with blood; Use the \"Choose Features\" button above",
				"I can amplify its effect by taking damage equal to my Hemocraft damage die",
				"Whenever I learn a new Blood Curse, I can replace one I know with a new one as well"
			]),
			additional : levels.map(function (n) { return (n < 5 ? 1 : n < 9 ? 2 : n < 13 ? 3 : n < 17 ? 4 : n < 20 ? 5 : 6) + " curse" + (n < 5 ? "" : "s"); }),
			usages : levels.map(function (n) { return n < 6 ? 1 : n < 12 ? 2 : n < 16 ? 3 : 4; }),
			recovery : "short rest",
			extraname : "Blood Curse",
			extrachoices : ["Blood Curse of the Anxious", "Blood Curse of Binding", "Blood Curse of Bloated Agony", "Blood Curse of the Eyeless", "Blood Curse of the Fallen Puppet",  "Blood Curse of the Marked", "Blood Curse of the Muddled Mind"],
      "blood curse of the anxious":{
        name : "Blood Curse of the Anxious",
        source: ["MM:BH", 3],
        description: desc([
          "As a bonus action I can magnify the adrenaline of a creature within 20 ft of me",
          "All creatures have advantage on Cha (Intimidation) checks against the creature.",
          "\u2022 Amplify: The next Wis saving throw the target has to make before the curse ends has disadvantage"
        ]),
        action : ["bonus action", ""]
      },
			"blood curse of binding" : {
				name : "Blood Curse of Binding",
				source : ["MM:BH", 3],
				description : desc([
					"As a bonus action, I can bind a creature within 30 ft that is up to one size larger than me",
					"It makes a Str save or has speed 0 and can't use reactions until the start of my next turn",
					"\u2022 Amplify: I can affect any size of creature and the curse lasts for 1 minute",
					"  At the end of each of the target's turns, it can make another Str save to stop the curse"
				]),
				action : ["bonus action", ""]
			},
      "blood curse of bloated agony" : {
        name : "Blood Curse of Bloated Agony",
        source : ["MM:BH", 3],
        description : desc([
          "As a bonus action, I can curse a creature that I can see within 30 feet of me to swell until the end of my next turn",
          "The creature has disadvantage on Str and Dex ability checks and suffers 1d8 necrotic damage if it makes more than one attack during it's turn",
          "\u2022 Amplify: The curse lasts for 1 minute",
          " At the end of each of the target's turns, it can make another Con save to stop the curse"
        ]),
        action : ["bonus action", ""]
      },
      
			"blood curse of the eyeless" : {
				name : "Blood Curse of the Eyeless",
				source : ["MM:BH", 4],
				description : desc([
					"As a reaction when a creature within 30 ft of me makes an attack roll",
          "I can use my reaction to roll one hemocraft die, and I subtract the number rolled from the creature's attack roll.",
					"This doesn't work if the creature is immune to blindness",
					"\u2022 Amplify: I can apply this to all of the creatures attack rolls until the end of the turn. I roll a new hemocraft die for each affected attack."
				]),
				action : ["reaction", ""]
			},
			"blood curse of the fallen puppet" : {
				name : "Blood Curse of the Fallen Puppet",
				source : ["MM:BH", 4],
				description : desc([
					"As a reaction when a creature drops to 0 hp in 30 ft of me, I can make it attack",
					"The creature makes one weapon attack against a target of my choice within its attack range",
					"\u2022 Amplify: I can first move the creature up to half their speed and the attack roll gains a bonus equal to my Int modifier (min 1)"
				]),
				action : ["reaction", ""]
			},
      
			"blood curse of the marked" : {
				name : "Blood Curse of the Marked",
				source : ["MM:BH", 4],
				description : desc([
					"As a bonus action, I can mark an enemy within 30 ft of me until the end of my turn",
					"While marked, I roll an additional hemocraft die whenever you deal rite damage to the target",
					"\u2022 Amplify: The next attack roll I make against the target before the end of my turn has advantage"
				]),
				action : ["bonus action", ""]
			},
			"blood curse of the muddled mind" : {
				name : "Blood Curse of The Muddled Mind",
				source : ["MM:BH", 4],
				description : desc([
					"As a bonus action, I curse a creature that I can see within 30 ft of me that is concentrating on a spell",
					"The creature has disadvantage on the next Con saving throw it must make to maintain concentration before the end of my next turn",
					"\u2022 Amplify: the creature has disadvantage on all Con saving throws to maintain concentration of spells until the end of my next turn"
				]),
				action : ["bonus action", ""]
			},
			
     },
		
		"fighting style" : {
			name : "Fighting Style",
			source : ["MM:BH", 3],
			minlevel : 2,
			description : "\n   " + "Choose a Fighting Style using the \"Choose Feature\" button above",
			choices : ["Archery", "Dueling", "Great Weapon Fighting", "Two-Weapon Fighting"],
			"archery" : FightingStyles.archery,
			"dueling" : FightingStyles.dueling,
			"great weapon fighting" : FightingStyles.great_weapon,
			"two-weapon fighting" : FightingStyles.two_weapon
		},
    "crimson rite" : {
			name : "Crimson Rite",
			source : ["MM:BH", 3],
			minlevel : 2,
			description : desc([
				"I can imbue my weapons with Crimson Rites; Use the \"Choose Features\" button above",
				"As a bonus action, I imbue a weapon, which then deals additional damage equal to my hemocraft die to its damage",
				"It can hold only one rite, lasting until my next short/long rest or it leaves my hand",
				"When activated, I lose hp equal to one roll of my hemocraft die."
			]),
			additional : levels.map(function (n) {
				var die = "1d" + (n < 4 ? 4 : n < 10 ? 6 : n < 16 ? 8 : 10);
				var rite = (n < 6 ? 1 : 2) + " primal rite" + (n < 6 ? "" : "s") + (n < 13 ? "" : " \u0026 1 esoteric rite") + " known";
				return die + "; " + rite;
			}),
			action : ["bonus action", ""],
			extraname : "Crimson Rite",
			extrachoices : ["Flame (Primal Rite)", "Frozen (Primal Rite)", "Storm (Primal Rite)", "Roar (Esoteric Rite)", "Oracle (Esoteric Rite)", "Dead (Esoteric Rite)"],
			"flame (primal rite)" : {
				source : ["MM:BH", 3],
				name : "Rite of the Flame",
				description : "\n   " + "I can select fire as the damage type for my crimson rite damage die"
			},
			"frozen (primal rite)" : {
				source : ["MM:BH", 3],
				name : "Rite of the Frozen",
				description : "\n   " + "I can select cold as the damage type for my crimson rite damage die"
			},
			"storm (primal rite)" : {
				source : ["MM:BH", 3],
				name : "Rite of the Storm",
				description : "\n   " + "I can select lightning as the damage type for my crimson rite damage die"
			},
			"roar (esoteric rite)" : {
				source : ["MM:BH", 3],
				name : "Rite of the Roar",
				description : "\n   " + "I can select thunder as the damage type for my crimson rite damage die",
				prereqeval : "classes.known['blood hunter'].level >= 14"
			},
			"oracle (esoteric rite)" : {
				source : ["MM:BH", 3],
				name : "Rite of the Oracle",
				description : "\n   " + "I can select psychic as the damage type for my crimson rite damage die",
				prereqeval : "classes.known['blood hunter'].level >= 14"
			},
			"dead (esoteric rite)" : {
				source : ["MM:BH", 3],
				name : "Rite of the Dead",
				description : "\n   " + "I can select necrotic as the damage type for my crimson rite damage die",
				prereqeval : "classes.known['blood hunter'].level >= 14"
			},
			calcChanges : {
				atkAdd : ["if (classes.known['blood hunter'] && !isSpell && (/\\brite\\b/i).test(inputText)) {fields.Description += (fields.Description ? '; ' : '') + '+1d' + (classes.known['blood hunter'].level < 4 ? 4 : classes.known['blood hunter'].level < 10 ? 6 : classes.known['blood hunter'].level < 16 ? 8 : 10) + ' rite damage'; }; ", "If I include the word 'Rite' in a weapon's name, it gets my crimson rite damage die added in its description."]
			}
		},
		"subclassfeature3" : {
			name : "Blood Hunter Order",
			source : ["MM:BH", 5],
			minlevel : 3,
			description : desc([
				"Choose a Blood Hunter Order you commit to and put it in the \"Class\" field",
				"Choose either the Order of the Ghostslayer, Lycan, Mutant, or Profane Soul"
			])
		},
    "brand of castigation" : {
      name : "Brand of Castigation",
      source : ["MM:BH", 4],
      minlevel : 6,
      description : desc([
        "Whenever I damage a creature with my Crimson Rite feature, I can brand a creature",
        "I always know the direction to the branded creature, and each time the the creature deals damage to me or a creature I can see within 5 ft of me the creature suffers psychic damage equal to my Int modifier",
        "My brand lasts until I dismsiss it or apply it to another creature. It counts as a spell for the purposes of <i> dispel magic </i>, and the spell level is equal to half of my blood hunter level (max 9th level)"
      ]),
      usages : 1,
      recovery : "short rest",
    },
		"grim psychometry" : {
			name : "Grim Psychometry",
			source : ["MM:BH", 4],
			minlevel : 9,
			description : desc([
				"When making an Int (History) check to recall information about a darker past surrounding an object I am touching or a location I am present in, I have advantage on the roll"
			])
		},
		"dark augmentation" : {
			name : "Dark Augmentation",
			source : ["MM:BH", 4],
			minlevel : 10,
			description : desc([
				"My speed increases by 5 ft and whenever I make a Str, Dex or Cos save I can add my Int modifier to the total"
			]),
			speed : "+5",
      addMod : [{type : "save", field : "Con", mod: "Int"}, {type : "save", field : "Dex", mod: "Int"}, {type : "save", field : "Str", mod: "Int"}]
		},
    "brand of tethering" : {
      name : "Brand of Tethering",
      source : ["MM:BH", 4],
      minlevel : 13,
      description : desc([
        "the psychic damage from Brand of Castignation increases to twice my Int modifier (min 2)",
        "Additionally, a branded creature can't take the Dash action",
        "If a creature branded by me attempts to teleport or leave their current plane via ability, spell or portal, they take 4d6 psychic damage and must make a Wis save or the teleport/plane shift fails"
      ]),
    },
		"hardened soul" : {
			name : "Hardened Soul",
			source : ["MM:BH", 4],
			minlevel : 14,
			description : " [adv. vs. charm, frightened]",
			savetxt : {
				adv_vs : ["charmed", "frightened"]
			}
		},
		"sanguine mastery" : {
			name : "Sanguine Mastery",
			source : ["MM:BH", 4],
			minlevel : 20,
			description : desc([
				"Once per turn, whenever I roll a hemocraft die, I can choose to reroll the die and choose which result to use",
				"When I score a critical hit with a rite-imbued weapon, I regain one use of Blood Maledict"
			])
		}
	}
};

ClassSubList["blood hunter-order of the ghostslayer"] = {
	regExpSearch : /^(?=.*ghost)(?=.*slayer).*$/i,
	subname : "Order of the Ghostslayer",
	source : ["MM:BH", 5],
	fullname : "Ghostslayer",
	features : {
		"subclassfeature3" : {
			name : "Rite of the Dawn",
			source : ["MM:BH", 5],
			minlevel : 3,
			description : "\n   " + "I know the Rite of the Dawn",
			extraname : "Crimson Rite",
			extrachoices : ["dawn"],
			choicesNotInMenu : true,
			"dawn" : {
				source : ["MM:BH", 5],
				name : "Rite of the Dawn",
				description : desc([
					"I can select radiant as the damage type for my crimson rite damage die",
					"My weapon sheds bright light out to a radius of 20 ft",
          "I have resistance to necrotic damage",
          "My weapon deals one additional hemocraft die when I hit an undead"
				]),
			eval : "ClassFeatureOptions(['blood hunter', 'subclassfeature3', 'dawn', 'extra']);",
			removeeval : "ClassFeatureOptions(['blood hunter', 'subclassfeature3', 'dawn', 'extra'], 'remove');"
		}
    },
		"subclassfeature3.1" : {
			name : "Curse Specialist",
			source : ["MM:BH", 5],
			minlevel : 3,
			description : desc([
				"My blood curses can now affect any creature, regardless of lack of blood",
				"I gain an additional use of my Blood Maledict feature"
			])
      // Somehow add additional use of Blood Maledict...
		},
		"subclassfeature7" : {
			name : "Ethereal Step",
			source : ["MM:BH", 5],
			minlevel : 7,
			description : desc([
				"At the start of my turn, if I am not incapacitated, I can choose to magically step into the veil between the planes",
				"While in this state, I can move through objects and creatures as if they were difficult terrain as well as see and affect creatures and objects on the Etherial Plane",
				"If I end my turn inside an object, I take 1d10 force damage.",
        "If I am inside an object when this feature ends, I am shunted to the nearest unoccupied space I can occupy, and take force damage equal to twice the number of feet I was moved",
        "This feature lasts for a number of rounds equal to my Int mod (min of 1 round)"
			]),
			usages : [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2],
			recovery : "short rest",
		},
		"subclassfeature11" : {
			name : "Brand of Sundering",
			source : ["MM:BH", 5],
			minlevel : 11,
			description : desc([
        "Whenever I damage a creature branded by my Brand of Castigation with my Crimson Rite, I roll an additional hemocraft die",
        "Additionally, the branded creature can't move through creatures or objects."
      ]),
		},
    "subclassfeature15" : {
      name : "Blood Curse of the Exorcist",
      source : ["MM:BH", 5],
      minlevel : 15,
      description : "\n   " + "I know the Blood Curse of the Exorcist, which doesn't count against the number I know",
			extraname : "Blood Curse",
			"blood curse of the exorcist" : {
				name : "Blood Curse of the Exorcist",
				source : ["MM:OotL", 3],
				description : desc([
					"As a bonus action, I can choose a creature that I can see within 30 ft that is charmed, frightened, or possessed",
          "The target is no longer charmed, frightened, or possessed",
          "\u2022 Amplify: the creature that charmed, frightened, or possessed the target suffers 3d6 psychic damage and must make a Wis save or be stunned until the end of my next turn"
        ]),
				action : ["bonus action", ""]
			}, 
      eval : "ClassFeatureOptions(['blood hunter', 'subclassfeature15', 'blood curse of the exorcist', 'extra']);",
			removeeval : "ClassFeatureOptions(['blood hunter', 'subclassfeature15', 'blood curse of the exorcist', 'extra'], 'remove');"
    },
		"subclassfeature18" : {
			name : "Rite Revival",
			source : ["MM:BH", 5],
			minlevel : 18,
			description : desc([
				"When I am reduced to 0 HP while I have an active Crimson Rite, but don't die outright, the rite ends and I drop to 1 HP instead",
        "If I have more than one rite active, I choose which one ends"
			])
		}
	}
};

ClassSubList["blood hunter-order of the profane soul"] = {
	regExpSearch : /^(?=.*profane)(?=.*soul).*$/i,
	subname : "Order of the Profane Soul",
	source : ["MM:BH", 6],
	abilitySave : 4,
	spellcastingFactor : "warlock3",
	spellcastingTable : [
		[0, 0, 0, 0, 0, 0, 0, 0, 0], //lvl 0
		[0, 0, 0, 0, 0, 0, 0, 0, 0], //lvl 1
		[0, 0, 0, 0, 0, 0, 0, 0, 0], //lvl 2
		[1, 0, 0, 0, 0, 0, 0, 0, 0], //lvl 3
		[1, 0, 0, 0, 0, 0, 0, 0, 0], //lvl 4
		[2, 0, 0, 0, 0, 0, 0, 0, 0], //lvl 5
		[2, 0, 0, 0, 0, 0, 0, 0, 0], //lvl 6
		[0, 2, 0, 0, 0, 0, 0, 0, 0], //lvl 7
		[0, 2, 0, 0, 0, 0, 0, 0, 0], //lvl 8
		[0, 2, 0, 0, 0, 0, 0, 0, 0], //lvl 9
		[0, 2, 0, 0, 0, 0, 0, 0, 0], //lvl10
		[0, 2, 0, 0, 0, 0, 0, 0, 0], //lvl11
		[0, 2, 0, 0, 0, 0, 0, 0, 0], //lvl12
		[0, 0, 2, 0, 0, 0, 0, 0, 0], //lvl13
		[0, 0, 2, 0, 0, 0, 0, 0, 0], //lvl14
		[0, 0, 2, 0, 0, 0, 0, 0, 0], //lvl15
		[0, 0, 2, 0, 0, 0, 0, 0, 0], //lvl16
		[0, 0, 2, 0, 0, 0, 0, 0, 0], //lvl17
		[0, 0, 2, 0, 0, 0, 0, 0, 0], //lvl18
		[0, 0, 0, 2, 0, 0, 0, 0, 0], //lvl19
		[0, 0, 0, 2, 0, 0, 0, 0, 0] //lvl20
	],
	spellcastingKnown : {
		cantrips : [0, 0, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
		spells : [0, 0, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 11]
	},
	spellcastingList : {
		class : "warlock",
		level : [0, 4]
	},
	features : {
		"subclassfeature3" : {
			name : "Otherwordly Patron",
			source : ["MM:BH", 6],
			minlevel : 3,
			description : "\n   " + "Choose an Otherwordly Patron using the \"Choose Feature\" button above",
			choices : ["the Archfey", "the Fiend", "the Great Old One", "the Undying", "the Celestial", "the Hexblade"],
			"the archfey" : {
				name : "Otherwordly Patron: the Archfey",
				description : "\n   " + "When I do rite damage, the target loses invisibility, 1/2 \u0026 3/4 cover until my next turn",
				eval : "var ToAdd = ['blood hunter', 'subclassfeature7.1', 'the archfey']; if (classes.known['blood hunter'].level >= 7 && this.getField('Class Features Remember').value.indexOf(ToAdd.toString()) === -1) {ClassFeatureOptions(ToAdd)} ToAdd[1] = 'subclassfeature15'; ToAdd[2] += 2; if (classes.known['blood hunter'].level >= 15 && this.getField('Class Features Remember').value.indexOf(ToAdd.toString()) === -1) {ClassFeatureOptions(ToAdd)};"
			},
			"the fiend" : {
				name : "Otherwordly Patron: the Fiend",
				description : "\n   " + "When using the Rite of the Flame I may reroll a 1 on the rite damage die, once",
				eval : "var ToAdd = ['blood hunter', 'subclassfeature7.1', 'the fiend']; if (classes.known['blood hunter'].level >= 7 && this.getField('Class Features Remember').value.indexOf(ToAdd.toString()) === -1) {ClassFeatureOptions(ToAdd)} ToAdd[1] = 'subclassfeature15'; ToAdd[2] += 2; if (classes.known['blood hunter'].level >= 15 && this.getField('Class Features Remember').value.indexOf(ToAdd.toString()) === -1) {ClassFeatureOptions(ToAdd)};"
			},
			"the great old one" : {
				name : "Otherwordly Patron: the Great Old One",
				description : "\n   " + "When I do a critical hit, the target Wis save or frightened of me until my next turn end",
				eval : "var ToAdd = ['blood hunter', 'subclassfeature7.1', 'the great old one']; if (classes.known['blood hunter'].level >= 7 && this.getField('Class Features Remember').value.indexOf(ToAdd.toString()) === -1) {ClassFeatureOptions(ToAdd)} ToAdd[1] = 'subclassfeature15'; ToAdd[2] += 2; if (classes.known['blood hunter'].level >= 15 && this.getField('Class Features Remember').value.indexOf(ToAdd.toString()) === -1) {ClassFeatureOptions(ToAdd)};"
			},
			"the undying" : {
				name : "Otherwordly Patron: the Undying",
				description : "\n   " + "When I kill a hostile with a weapon attack, I regain HP equal to my rite damage die",
				eval : "var ToAdd = ['blood hunter', 'subclassfeature7.1', 'the undying']; if (classes.known['blood hunter'].level >= 7 && this.getField('Class Features Remember').value.indexOf(ToAdd.toString()) === -1) {ClassFeatureOptions(ToAdd)} ToAdd[1] = 'subclassfeature15'; ToAdd[2] += 2; if (classes.known['blood hunter'].level >= 15 && this.getField('Class Features Remember').value.indexOf(ToAdd.toString()) === -1) {ClassFeatureOptions(ToAdd)};"
			},
			"the celestial" : {
				name : "Otherwordly Patron: the Celestial",
				description : "\n   " + "As a bonus action, I can expend a Blood Maledict use to heal a creature within 60 ft",
				additional : levels.map(function (n) {
					var die = "2d" + (n < 6 ? 4 : n < 11 ? 6 : n < 16 ? 8 : 10);
					return n < 3 ? "" : "heal " + die + " + Wisdom modifier";
				}),
				action : ["bonus action", ""],
				eval : "var ToAdd = ['blood hunter', 'subclassfeature7.1', 'the celestial']; if (classes.known['blood hunter'].level >= 7 && this.getField('Class Features Remember').value.indexOf(ToAdd.toString()) === -1) {ClassFeatureOptions(ToAdd)} ToAdd[1] = 'subclassfeature15'; ToAdd[2] += 2; if (classes.known['blood hunter'].level >= 15 && this.getField('Class Features Remember').value.indexOf(ToAdd.toString()) === -1) {ClassFeatureOptions(ToAdd)};"
			},
			"the hexblade" : {
				name : "Otherwordly Patron: the Hexblade",
				description : "\n   " + "My next attack vs. a creature I target with a blood curse, is a critical hit on a 19 or 20",
				eval : "var ToAdd = ['blood hunter', 'subclassfeature7.1', 'the hexblade']; if (classes.known['blood hunter'].level >= 7 && this.getField('Class Features Remember').value.indexOf(ToAdd.toString()) === -1) {ClassFeatureOptions(ToAdd)} ToAdd[1] = 'subclassfeature15'; ToAdd[2] += 2; if (classes.known['blood hunter'].level >= 15 && this.getField('Class Features Remember').value.indexOf(ToAdd.toString()) === -1) {ClassFeatureOptions(ToAdd)};"
			}
		},
		"subclassfeature3.1" : {
			name : "Pact Magic",
			source : ["MM:BH", 5],
			minlevel : 3,
			description : desc([
				"I can cast warlock cantrips/spells that I know, using Wisdom as my spellcasting ability",
				"I can use a rite-imbued weapon as a spellcasting focus; I regain spell slots in a short rest"
			]),
			additional : ["", "", "2 cantrips \u0026 2 spells known", "2 cantrips \u0026 2 spells known", "2 cantrips \u0026 3 spells known", "2 cantrips \u0026 3 spells known", "2 cantrips \u0026 4 spells known", "2 cantrips \u0026 4 spells known", "2 cantrips \u0026 5 spells known", "3 cantrips \u0026 5 spells known", "3 cantrips \u0026 6 spells known", "3 cantrips \u0026 6 spells known", "3 cantrips \u0026 7 spells known", "3 cantrips \u0026 7 spells known", "3 cantrips \u0026 8 spells known", "3 cantrips \u0026 8 spells known", "3 cantrips \u0026 9 spells known", "3 cantrips \u0026 9 spells known", "3 cantrips \u0026 10 spells known", "3 cantrips \u0026 11 spells known"]
		},
		"subclassfeature7" : {
			name : "Mystic Frenzy",
			source : ["MM:BH", 6],
			minlevel : 7,
			description : "\n   " + "When I cast a cantrip as an action, I can make one weapon attack as a bonus action",
			action : ["bonus action", " (with cantrip)"]
		},
		"subclassfeature7.1" : {
			name : "Revealed Arcana",
			source : ["MM:BH", 6],
			minlevel : 7,
			description : "\n   " + "Choose an Otherwordly Patron using the \"Choose Feature\" button above ",
			usages : 1,
			recovery : "long rest",
			choices : ["the Archfey", "the Fiend", "the Great Old One", "the Undying", "the Celestial", "the Hexblade"],
			choicesNotInMenu : true,
			"the archfey" : {
				name : "Revealed Arcana",
				description : "\n   " + "Once per long rest, I can cast Blur using a profane soul spell slot",
				spellcastingBonus : {
					name : "Revealed Arcana",
					spells : ["blur"],
					selection : ["blur"],
					oncelr : true
				}
			},
			"the fiend" : {
				name : "Revealed Arcana",
				description : "\n   " + "Once per long rest, I can cast Scorching Ray using a profane soul spell slot",
				spellcastingBonus : {
					name : "Revealed Arcana",
					spells : ["scorching ray"],
					selection : ["scorching ray"],
					oncelr : true
				}
			},
			"the great old one" : {
				name : "Revealed Arcana",
				description : "\n   " + "Once per long rest, I can cast Detect Thoughts using a profane soul spell slot",
				spellcastingBonus : {
					name : "Revealed Arcana",
					spells : ["detect thoughts"],
					selection : ["detect thoughts"],
					oncelr : true
				}
			},
			"the undying" : {
				name : "Revealed Arcana",
				description : "\n   " + "Once per long rest, I can cast Blindness/Deafness using a profane soul spell slot",
				spellcastingBonus : {
					name : "Revealed Arcana",
					spells : ["blindness/deafness"],
					selection : ["blindness/deafness"],
					oncelr : true
				}
			},
			"the celestial" : {
				name : "Revealed Arcana",
				description : "\n   " + "Once per long rest, I can cast Lesser Restoration using a profane soul spell slot",
				spellcastingBonus : {
					name : "Revealed Arcana",
					spells : ["lesser restoration"],
					selection : ["lesser restoration"],
					oncelr : true
				}
			},
			"the hexblade" : {
				name : "Revealed Arcana",
				description : "\n   " + "Once per long rest, I can cast Branding Smite using a profane soul spell slot",
				spellcastingBonus : {
					name : "Revealed Arcana",
					spells : ["branding smite"],
					selection : ["branding smite"],
					oncelr : true
				}
			},
			eval : "if (FeaChoice === '') {var CFrem = What('Class Features Remember'); var tReg = /.*?blood hunter,subclassfeature3,(the (archfey|fiend|great old one|undying|celestial|hexblade)).*/i; if ((tReg).test(CFrem)) {FeaChoice = CFrem.replace(tReg, '$1'); AddString('Class Features Remember', 'blood hunter,subclassfeature7.1,' + FeaChoice, false);};};"
		},
		"subclassfeature11" : {
			name : "Diabolic Channel",
			source : ["MM:BH", 6],
			minlevel : 11,
			description : desc([
				"As an action, I infuse a warlock spell into a rite-imbued weapon and attack with it",
				"It must have a 1 action casting time or be a conc. spell that activates with 1 action",
				"If the attack hits, it does weapon damage as well as casts the spell on the target",
				"If the spell requires any attack rolls, those all succeed against the target",
				"If the spell requires a save and the attack had adv., the target has disadv. on the save"
			]),
			action : ["action", ""]
		},
		"subclassfeature15" : {
			name : "Unsealed Arcana",
			source : ["MM:BH", 7],
			minlevel : 15,
			description : "\n   " + "Choose an Otherwordly Patron using the \"Choose Feature\" button above  ",
			usages : 1,
			recovery : "long rest",
			choices : ["the Archfey2", "the Fiend2", "the Great Old One2", "the Undying2", "the Celestial2", "the Hexblade2"],
			choicesNotInMenu : true,
			"the archfey2" : {
				name : "Unsealed Arcana",
				description : "\n   " + "Once per long rest, I can cast Slow without using a profane soul spell slot",
				spellcastingBonus : {
					name : "Unsealed Arcana",
					spells : ["slow"],
					selection : ["slow"],
					oncelr : true
				}
			},
			"the fiend2" : {
				name : "Unsealed Arcana",
				description : "\n   " + "Once per long rest, I can cast Fireball without using a profane soul spell slot",
				spellcastingBonus : {
					name : "Unsealed Arcana",
					spells : ["fireball"],
					selection : ["fireball"],
					oncelr : true
				}
			},
			"the great old one2" : {
				name : "Unsealed Arcana",
				description : "\n   " + "Once per long rest, I can cast Haste without using a profane soul spell slot",
				spellcastingBonus : {
					name : "Unsealed Arcana",
					spells : ["haste"],
					selection : ["haste"],
					oncelr : true
				}
			},
			"the undying2" : {
				name : "Unsealed Arcana",
				description : "\n   " + "Once per long rest, I can cast Bestow Curse without using a profane soul spell slot",
				spellcastingBonus : {
					name : "Unsealed Arcana",
					spells : ["bestow curse"],
					selection : ["bestow curse"],
					oncelr : true
				}
			},
			"the celestial2" : {
				name : "Unsealed Arcana",
				description : "\n   " + "Once per long rest, I can cast Revivify without using a profane soul spell slot",
				spellcastingBonus : {
					name : "Unsealed Arcana",
					spells : ["revivify"],
					selection : ["revivify"],
					oncelr : true
				}
			},
			"the hexblade2" : {
				name : "Unsealed Arcana",
				description : "\n   " + "Once per long rest, I can cast Blink without using a profane soul spell slot",
				spellcastingBonus : {
					name : "Unsealed Arcana",
					spells : ["blink"],
					selection : ["blink"],
					oncelr : true
				}
			},
			eval : "if (FeaChoice === '') {var CFrem = What('Class Features Remember'); var tReg = /.*?blood hunter,subclassfeature3,(the (archfey|fiend|great old one|undying|celestial|hexblade)).*/i; if ((tReg).test(CFrem)) {FeaChoice = CFrem.replace(tReg, '$1') + 2; AddString('Class Features Remember', 'blood hunter,subclassfeature15,' + FeaChoice, false);};};"
		},
		"subclassfeature18" : {
			name : "Soul Syphon",
			source : ["MM:BH", 7],
			minlevel : 18,
			description : "\n   " + "When I kill a creature of CR15+ with an attack, I recover an expended spell slot"
		}
	}
};

ClassSubList["blood hunter-order of the mutant"] = {
	regExpSearch : /mutant/i,
	subname : "Order of the Mutant",
	source : ["MM:BH", 7],
	features : {
		"subclassfeature3" : {
			name : "Formulas",
			source : ["MM:BH", 7],
			minlevel : 3,
			description : desc([
				"Use the \"Choose Features\" button above to add Mutagen Formulae to the third page",
				"When I gain a new mutagen formula I can also replace one I know with another"
			]),
			additional : levels.map(function (n) { return n < 3 ? "" : (n < 7 ? 3 : n < 11 ? 4 : n < 15 ? 5 : n < 18 ? 6 : 7) + " mutagen formulae"; }),
			extraname : "Mutagen Formula",
			extrachoices : ["Aether (prereq: level 11 blood hunter)", "Celerity", "Conversant", "Cruelty (prereq: level 11 blood hunter)", "Impermeable", "Mobility", "Nighteye", "Potency", "Precision (prereq: level 11 blood hunter)", "Rapidity", "Reconstruction (prereq: level 7 blood hunter)", "Sagacity", "Shielded", "Unbreakable", "Wariness"],
			"aether (prereq: level 11 blood hunter)" : {
				name : "Aether",
				source : ["MM:BH", 7],
				description : desc([
					"I gain 20 ft flying speed",
					"\u2022 Side effect: I have disadvantage on Strength and Dexterity ability checks"
				])
			},
			"celerity" : {
				name : "Celerity",
				source : ["MM:BH", 7],
				description : desc([
					"My Dexterity score increases by an amount equal to my mutation score",
					"\u2022 Side effect: My Wisdom score decreases by an amount equal to my mutation score"
				])
			},
			"conversant" : {
				name : "Conversant",
				source : ["MM:BH", 7],
				description : desc([
					"I gain advantage on Intelligence ability checks",
					"\u2022 Side effect: I have disadvantage on Charisma ability checks"
				])
			},
			"cruelty (prereq: level 11 blood hunter)" : {
				name : "Cruelty",
				source : ["MM:BH", 7],
				description : desc([
					"I can make a single weapon attack as a bonus action",
					"\u2022 Side effect: I have disadvantage on Intelligence, Wisdom, and Charisma saving throws"
				])
			},
			"impermeable" : {
				name : "Impermeable",
				source : ["MM:BH", 8],
				description : desc([
					"I gain resistance to piercing damage",
					"\u2022 Side effect: I gain vulnerability to slashing damage"
				])
			},
			"mobility" : {
				name : "Mobility",
				source : ["MM:BH", 8],
				description : desc([
					"I gain immunity to the grappled and restrained conditions; At 11th level also paralyzed",
					"\u2022 Side effect: I gain a penalty to initiative rolls equal to 2 times my mutation score"
				])
			},
			"nighteye" : {
				name : "Nighteye",
				source : ["MM:BH", 8],
				description : desc([
					"I gain darkvision up to 60 ft, or add an extra 60 ft to it if I already have darkvision",
					"\u2022 Side effect: I gain sunlight sensitivity"
				])
			},
			"potency" : {
				name : "Potency",
				source : ["MM:BH", 8],
				description : desc([
					"My Strength score increases by an amount equal to my mutation score",
					"\u2022 Side effect: I have disadvantage on Dexterity saving throws"
				])
			},
			"precision (prereq: level 11 blood hunter)" : {
				name : "Precision",
				source : ["MM:BH", 8],
				description : desc([
					"My weapon attacks score critical hits on attack rolls of 19 and 20",
					"\u2022 Side effect: All healing that I recieve is halved"
				])
			},
			"rapidity" : {
				name : "Rapidity",
				source : ["MM:BH", 8],
				description : desc([
					"My speed increases with 15 ft (20 ft at 15th level)",
					"\u2022 Side effect: I have disadvantage on Dexterity ability checks"
				])
			},
			"reconstruction (prereq: level 7 blood hunter)" : {
				name : "Reconstruction",
				source : ["MM:BH", 8],
				description : desc([
					"At the start of my turn in combat when I'm conscious and above 0 HP, I regenerate HP",
					"The amount of HP I regenerate is equal to 2 times my mutagen score",
					"\u2022 Side effect: My speed decreases by 10 ft"
				])
			},
			"sagacity" : {
				name : "Sagacity",
				source : ["MM:BH", 8],
				description : desc([
					"My Wisdom score increases by an amount equal to my mutation score",
					"\u2022 Side effect: My armor class is reduced by my mutation score"
				])
			},
			"shielded" : {
				name : "Shielded",
				source : ["MM:BH", 8],
				description : desc([
					"I gain resistance to slashing damage",
					"\u2022 Side effect: I gain vulnerability to bludgeoning damage"
				])
			},
			"unbreakable" : {
				name : "Unbreakable",
				source : ["MM:BH", 8],
				description : desc([
					"I gain resistance to bludgeoning damage",
					"\u2022 Side effect: I gain vulnerability to piercing damage"
				])
			},
			"wariness" : {
				name : "Wariness",
				source : ["MM:BH", 8],
				description : desc([
					"I gain a bonus to my initiative rolls equal to 2 times my mutation score",
					"\u2022 Side effect: I gain disadvantage on Wisdom (Perception) checks"
				])
			}
		},
		"subclassfeature3.1" : {
			name : "Mutagen Craft",
			source : ["MM:BH", 7],
			minlevel : 3,
			description : desc([
				"I can craft mutagen during a short rest, which remain usable until my next long rest",
				"I can craft as many mutagen each short rest as listed above, but only one of each",
				"Taking a mutagen is a bonus action; Mutagens only affect Medium or smaller creatures",
				"The effects of a mutagen overlap and last until taking a short rest to willingly stop it",
				"Only I can gain the mutagen's full effect, other only get the side effect",
				"As an action, I can end all effects of a single mutagen that is in my system"
			]),
			usages : [0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3],
			recovery : "short rest",
			additional : levels.map(function (n) { return n < 3 ? "" : "Mutation Score: " + Math.ceil(n/4); }),
			action : ["bonus action", " (Consume Mutagen)"],
			eval : "AddAction('action', 'Mutagen Craft (End Mutagen)', 'Blood Hunter (Order of the Mutant)');",
			removeeval : "RemoveAction('action', 'Mutagen Craft (End Mutagen)', 'Blood Hunter (Order of the Mutant)');"
		},
		"subclassfeature11" : {
			name : "Strange Metabolism",
			source : ["MM:BH", 7],
			minlevel : 11,
			description : "\n   " + "As a bonus action, I can ignore the side effects of a single mutagen for 1 minute",
			usages : 1,
			recovery : "short rest",
			action : ["bonus action", ""]
		},
		"subclassfeature15" : {
			name : "Robust Physiology",
			source : ["MM:BH", 7],
			minlevel : 15,
			description : "\n   " + "I gain immunity to poison damage and the poison condition",
			savetxt : { immune : ["poison"] }
		},
		"subclassfeature18" : {
			name : "Exalted Mutation",
			source : ["MM:BH", 7],
			minlevel : 18,
			description : "\n   " + "I permanently gain all (side) effects of one mutagen, chosen from the formulae I know"
		}
	}
};

ClassSubList["blood hunter-order of the lycan"] = {
	regExpSearch : /^(?=.*lycan)(?=.*blood)(?=.*hunter).*$/i,
	subname : "Order of the Lycan",
	source : ["MM:OotL", 2],
	features : {
		"subclassfeature3" : {
			name : "Heightened Senses",
			source : ["MM:OotL", 2],
			minlevel : 3,
			description : "\n   " + "I gain advantage on Wisdom (Perception) checks that rely on hearing or smell",
			vision : [["Adv. on Perception relying on hearing or smell", 0]]
		},
		"subclassfeature3.1" : {
			name : "Hybrid Transformation",
			source : ["MM:OotL", 2],
			minlevel : 3,
			description : desc([
				"As an action, I can transform into a Hybrid lycanthropy form",
				"See the \"Notes\" page for the full rules of this Hybrid form at my current level"
			]),
			usages : ["", "", 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, "unlimited per", "unlimited per", "unlimited per"],
			recovery : "short rest",
			action : ["bonus action", " (start/end)"],
			savetxt : { text : ["Adv. on Str saves in Hybrid form"] },
			dmgres : [["Bludgeoning", "Bludg. (in hybrid)"], ["Piercing", "Pierc. (in hybrid)"], ["Slashing", "Slash. (in hybrid)"], ["Silver vuln.", "Silver vuln. (in hybrid)"]],
			eval : "AddWeapon('Predatory Strikes'); AddAction('bonus action', 'Predatory Strike (with Attack action)', 'Order of the Lycan (Hybrid Transformation)');",
			removeeval : "RemoveWeapon('Predatory Strike'); RemoveAction('bonus action', 'Predatory Strike (with Attack action)');",
			changeeval : "UpdateHybridForm();",
			calcChanges : {
				atkAdd : [
					"var hybridDie = function(n) {return n < 3 ? 1 : n < 11 ? 6 : 8;}; if (classes.known['blood hunter'] && classes.known['blood hunter'].level && ((/predatory strike/i).test(WeaponName) || ((/unarmed strike/i).test(WeaponName) && (/\\bhybrid\\b/i).test(inputText)))) { var aHybridDie = hybridDie(classes.known['blood hunter'].level); try {var curDie = eval(fields.Damage_Die.replace('d', '*'));} catch (e) {var curDie = 'x';}; if (isNaN(curDie) || curDie < aHybridDie) {fields.Damage_Die = '1d' + aHybridDie;}; fields.Mod = StrDex; if ((/unarmed strike/i).test(WeaponName)) { fields.Damage_Type = 'slashing'; }; }; ",
					"In hybrid form, my unarmed strikes (predatory strikes) do slashing damage, have an increaded damage die based on my Blood Hunter level, and can use Dexterity instead of Strength.\n - If I include the word 'Hybrid' in a melee weapon's name or description, or if it is 'preditory strikes', it gets treated as an attack while in Hybrid form. Thus, adding half my proficiency bonus (rounded down) to the attack's damage."
				],
				atkCalc : ["if ((/predatory strike/i).test(WeaponName) || (isMeleeWeapon && (/\\bhybrid\\b/i).test(WeaponText))) { output.bDmg += function(n) {return n < 3 ? 0 : n < 10 ? 1 : n < 17 ? 2 : 3;};", ""]
			}
		},
		"subclassfeature7" : {
			name : "Stalker's Prowess",
			source : ["MM:OotL", 2],
			minlevel : 7,
			description : desc([
				"My speed increases with 10 ft",
				"I also add 10 ft to my long jump distance and 3 ft to my high jump distance",
				"In my Hybrid form, I gain the Improved Predatory Strikes feature"
			]),
			speed : { allModes : "+10" }
		},
		"subclassfeature11" : {
			name : "Advanced Transformation",
			source : ["MM:OotL", 2],
			minlevel : 11,
			description : desc([
				"I can now use my Hybrid Transformation feature twice, regaining all expended uses when I finish a short or long rest",
				"In my Hybrid form, I gain the Lycan Regeneration feature"
			]),
			calcChanges : {
				atkCalc : [
					"if ((/predatory strike/i).test(WeaponName) || (isMeleeWeapon && (/\\bhybrid\\b/i).test(WeaponText))) { output.bHit += function(n) {return n < 3 ? 0 : n < 11 ? 1 : n < 18 ? 2 : 3;}; ",
				]
			}
		},
		"subclassfeature15" : {
			name : "Brand of the Voracious",
			source : ["MM:OotL", 3],
			minlevel : 15,
			description : desc([
				"I now have advantage on the Wisdom saves to maintain control of my Hybrid form",
				"In my Hybrid form, my attacks have advantage against creatures branded by me"
			])
		},
		"subclassfeature18" : {
			name : "Hybrid Transformation Mastery",
			source : ["MM:OotL", 3],
			minlevel : 18,
			description : "\n   " + "I know the Blood Curse of the Howl, which doesn't count against the number I know",
			extraname : "Blood Curse",
			"blood curse of the howl" : {
				name : "Blood Curse of the Howl",
				source : ["MM:OotL", 3],
				description : desc([
					"As an action I can unleash a blood-curdling howl. Each creature within 30 ft of me that can hear me must make a Wis save",
          "On a failed save they are frightened of me until the end of my next turn. If they fail by 5 or more, they are stunned while frightened in this way",
          "A creature that succeeds on this saving throw is immune to this curse for the next 24 hours",
          "I can choose any number of creatures I can see to be unaffected by this howl",
          "\u2022 Amplify: The range of this curse increases to 60 ft"
        ]),
				action : ["action", ""]
			},
			eval : "ClassFeatureOptions(['blood hunter', 'subclassfeature18', 'blood curse of the howl', 'extra']);",
			removeeval : "ClassFeatureOptions(['blood hunter', 'subclassfeature18', 'blood curse of the howl', 'extra'], 'remove');"
		}
	}
};

//weapon entry for the predatory strikes
WeaponsList["predatory strike"] = {
	regExpSearch : /^(?=.*predatory)(?=.*strike).*$/i,
	name : "Predatory Strikes",
	source : ["MM:OotL", 3],
	ability : 1,
	type : "Natural",
	damage : [1, "", "slashing"],
	range : "Melee",
	description : "In hybrid form; One attack as bonus action with Attack action",
	monkweapon : true,
	abilitytodamage : true
};

//a function to update the notes page with the Hybrid form
UpdateHybridForm = function() {
	var NotesPrefix = isTemplVis("ASnotes", true);
	if (!NotesPrefix) {
		NotesPrefix = DoTemplate("ASnotes", "Add");
	} else {
		NotesPrefix = NotesPrefix[1];
	};

	var BHlevelOld = classes.old["blood hunter"] ? classes.old["blood hunter"].classlevel : 0;
	var BHlevelNew = classes.known["blood hunter"] ? classes.known["blood hunter"].level : 0;
	if (BHlevelOld <= 2 && BHlevelNew <= 2) return;

	//a funtion to create the full text for the hybrid feature
	var makeHybridText = function(lvl) {
		if (lvl < 3) return "";
		var PSdie = lvl >= 11 ? "d8" : "d6";
		var theText = "Blood Hunter (Order of the Lycan) Hybrid form, at level " + lvl + ":\n   " + "As a bonus action, I can transform into a Hybrid lycanthropy form" + "\n   " + "This form lasts for " + (lvl < 18 ? "1 hour" : "indefinitely") + " or until I transform back as a bonus action" + "\n   " + "I can speak, use equipment, and wear armor in this form" + "\n   " + "I revert back to my normal form if I fall unconscious, drop to 0 HP, or die" + "\n   " + "While I am in this Hybrid form, I gain the following features:";
		theText += "\n\u25C6 " + "Bloodlust (Order of the Lycan 3, MM:OotL 2)" + "\n   " + "I must save to keep control if I begin my turn with no more than half of my maximum HP" + "\n   " + "This save happens at the start of each of my turns" + (lvl < 15 ? ", if I have less than half of my max HP" : " and I have adv. on it") + "\n   " + "It is a Wisdom save DC (8 + 1/3 of my Blood Hunter level)" + "\n   " + "I automatically fail if I am under an effect that prevents concentrating (like Rage)" + "\n   " + "If failed, I must move to the nearest creature and take the Attack action on it" + "\n   " + "I can choose whether or not I use my Extra attack feature for this attack."+ "\n   " + "After this Attack action, I regain control and can continue my turn";
		theText += "\n\u25C6 " + "Cursed Weakness (Order of the Lycan 3, MM:OotL 2)" + "\n   " + "I have vulnerability to damage from silvered weapons";
		theText += "\n\u25C6 " + "Feral Might (Order of the Lycan 3, MM:OotL 2)" + "\n   " + "I gain" + (lvl < 11 ? "+1" : lvl < 18 ? "+2" : "+3") + "bonus melee damage " + "\n   " + "I have advantage on Strength checks and saving throws";
		theText += "\n\u25C6 " + "Predatory Strikes (Order of the Lycan 3, MM:OotL 2)" + "\n   " + "My unarmed strikes are more powerful and can be imbued with a Crimson Rite" + "\n   " + "These predatory strikes do " + PSdie + " damage and I can use Dex or Str with them" + "\n   " + "When I use them during an Attack action, I can make another as a bonus action";
		theText += "\n\u25C6 " + "Resilient Hide (Order of the Lycan 3, MM:OotL 2)" + "\n   " + "I have resistance to bludgeoning, piercing, and slashing damage" + "\n   " + "Attacks that are magical or from silvered weapons bypass this resistance" + "\n   " + "I gain +1 bonus to AC while I am not wearing heavy armor";
		if (lvl >= 7) theText += "\n\u25C6 " + "Improved Predatory Strikes (Order of the Lycan 7, MM:OotL 2)" + "\n   " + "I gain a" + (lvl < 11 ? "+1" : lvl < 18 ? "+2" : "+3") + "bonus to my attack rolls made with my unarmed strikes" + "\n   " + "If I have an active Crimson Rite, my predatory strikes are considered magical";
		if (lvl >= 11) {
			theText += "\n\u25C6 " + "Lycan Regeneration (Order of the Lycan 11, MM:OotL 2)" + "\n   " + "If I have less than half my max HP at the start of my turn, I heal myself" + "\n   " + "I regain 1 + Constitution modifier (min 1) HP; This works as long as I have at least 1 HP and no more than half my max HP left";
		return theText;
    }
	};

	//update the hybrid feature on the notes page
	var BHstringOld = makeHybridText(BHlevelOld);
	var BHstringNew = makeHybridText(BHlevelNew);
	ReplaceString(NotesPrefix + "Notes.Left", BHstringNew, false, BHstringOld);

	//give an alert about what is going on
	if (BHlevelOld <= 2 && BHlevelNew > 2) {
		app.alert({
			cTitle : "Order of thy Lycan's Hybrid Form is on the Notes page",
			cMsg : "You can find the rules for the Hybrid Form on the first \"Notes\" page, (page no. " + (tDoc.getField(NotesPrefix + "Notes.Left").page + 1) + ").\n\nThe Hybrid Form you gain with the Hybrid Transformation class feature from Blood Hunter (Order of thy Lycan) has a lot of rules attached to it. Because of this, it is not possible to put them in the \"Class Features\". Additionally, all the Blood Curses and Crimson Rites take up all the space of the third page's Notes section. Thus, the rules for this Hybrid Form will be put on the first \"Notes\" page and will be updated there.",
			nIcon : 3
		});
	};
};
