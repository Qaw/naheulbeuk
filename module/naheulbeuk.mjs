// Import document classes.
import { NaheulbeukActor } from "./documents/actor.mjs";
import { NaheulbeukItem } from "./documents/item.mjs";
// Import sheet classes.
import { NaheulbeukActorSheet } from "./sheets/actor-sheet.mjs";
import { NaheulbeukItemSheet } from "./sheets/item-sheet.mjs";
// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from "./helpers/templates.mjs";
import { NAHEULBEUK } from "./helpers/config.mjs";

//PCH
import { Macros } from "./documents/macro.mjs";


/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */


Hooks.once('init', async function() {

  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.

  game.naheulbeuk = {
    NaheulbeukActor,
    NaheulbeukItem,
    rollItemMacro,
    macros : Macros
  };

  // Add custom constants for configuration.
  CONFIG.NAHEULBEUK = NAHEULBEUK;

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "@abilities.cou.value + @abilities.cou.bonus",
    decimals: 2
  };

  // Define custom Document classes
  CONFIG.Actor.documentClass = NaheulbeukActor;
  CONFIG.Item.documentClass = NaheulbeukItem;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("naheulbeuk", NaheulbeukActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("naheulbeuk", NaheulbeukItemSheet, { makeDefault: true });

  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();
});

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

// If you need to add Handlebars helpers, here are a few useful examples:
Handlebars.registerHelper('concat', function() {
  var outStr = '';
  for (var arg in arguments) {
    if (typeof arguments[arg] != 'object') {
      outStr += arguments[arg];
    }
  }
  return outStr;
});

Handlebars.registerHelper('toLowerCase', function(str) {
  return str.toLowerCase();
});

//PCH - opération mathématique
Handlebars.registerHelper("math", function(lvalue, operator, rvalue, options) {
  lvalue = parseFloat(lvalue);
  rvalue = parseFloat(rvalue);
  return {
      "+": lvalue + rvalue,
      "-": lvalue - rvalue,
      "*": (lvalue*100) * (rvalue*100) / 10000,
      "/": Math.ceil(lvalue / rvalue),
      ":": lvalue / rvalue,
      "%": lvalue % rvalue
  }[operator];
});
//PCH - opération mathématique arrondi
Handlebars.registerHelper("arrondi", function(lvalue) {
  lvalue = parseFloat(lvalue);
  var value = Math.ceil(lvalue *100)/100
  return value
});

//PCH - égalité
Handlebars.registerHelper('equals', function (val1, val2) {
  var val1 = val1;
  var val2 = val2;
  if(val1 == "false"){val1=false};
  if(val1 == "true"){val1=true};
  if(val2 == "false"){val2=false};
  if(val2 == "true"){val2=true};
  return val1 == val2;
});

//PCH - premier character
Handlebars.registerHelper('first', function (val1) {
  var val1 = val1;
  return val1.slice(0,1);
});

//PCH - sans premier character
Handlebars.registerHelper('first2', function (val1) {
  var val1 = val1;
  return val1.slice(1,val1.length);
});

//PCH - pas égalité
Handlebars.registerHelper('equalsnot', function (val1, val2) {
  var val1 = val1;
  var val2 = val2;
  if(val1 == "false"){val1=false};
  if(val1 == "true"){val1=true};
  if(val2 == "false"){val2=false};
  if(val2 == "true"){val2=true};
  return val1 != val2;
});

//PCH - égalité avec OU
Handlebars.registerHelper('equalsor', function (val1, val2, val3, val4) {
  var val1 = val1;
  var val2 = val2;
  var val3 = val3;
  var val4 = val4;
  var result = false;
  if(val1 == "false"){val1=false};
  if(val1 == "true"){val1=true};
  if(val2 == "false"){val2=false};
  if(val2 == "true"){val2=true};
  if(val3 == "false"){val3=false};
  if(val3 == "true"){val3=true};
  if(val4 == "false"){val4=false};
  if(val4 == "true"){val4=true};
  if (val1==val2 || val3==val4) {result=true}
  return result;
});

//PCH - égalité avec ET
Handlebars.registerHelper('equalsand', function (val1, val2, val3, val4) {
  var val1 = val1;
  var val2 = val2;
  var val3 = val3;
  var val4 = val4;
  var result = false;
  if(val1 == "false"){val1=false};
  if(val1 == "true"){val1=true};
  if(val2 == "false"){val2=false};
  if(val2 == "true"){val2=true};
  if(val3 == "false"){val3=false};
  if(val3 == "true"){val3=true};
  if(val4 == "false"){val4=false};
  if(val4 == "true"){val4=true};
  if (val1==val2 && val3==val4) {result=true}
  return result;
});

//PCH - a un bonus (item)
Handlebars.registerHelper('bonus', function (val1, val2, val3, val4, val5, val6, val7, val8, val9, val10, val11, val12) {
  if ((val1==0) && (val2==0) && (val3==0) && (val4==0) && (val5==0) && (val6==0) && (val7==0) && (val8==0) && (val9==0) && (val9==0) && (val10==0) && (val11==0) && (val12=="")) {
    return true
  } else {
    return false
  }
});

//PCH - déplacement
Handlebars.registerHelper('deplacement', function (val1, val2, val3) {
  var calc=val1+val2;
  var calc1=0;
  var calc2=0;
  if(calc <= 1){
    calc1=8;
    calc2=12;
  }else if(calc == 2){
    calc1=6;
    calc2=10;
  }else if(calc <= 4){
    calc1=4;
    calc2=8;
  }else if(calc == 5){
    calc1=4;
    calc2=6;
  }else if(calc == 6){
    calc1=3;
    calc2=4;
  }else if(calc == 7){
    calc1=2;
    calc2=3;
  }else if(calc > 7){
    calc1=1;
    calc2=2;
  }
  calc1=Math.max(0,Math.ceil(calc1+(calc1*val3/100)))
  calc2=Math.max(0,Math.ceil(calc2+(calc2*val3/100)))
  calc="(" + calc1 + "m/" + calc2 + "m)"
  return calc;
});
//PCH - opération mathématique
Handlebars.registerHelper("log", function(value) {
  console.log(value)
});

//PCH - sauvegarder l'acteur dans une variable pour être lû dans les boucles for
if (typeof actor_data != 'object'){var actor_data};
Handlebars.registerHelper("save_actor", function(actor) {
  actor_data=actor
});
//PCH - lire l'acteur dans la variable précédente
Handlebars.registerHelper("read_actor", function(value) {
  var actor_details = "actor_data.data.root.data"+value
  actor_details = eval(actor_details)
  if (actor_details.toString().substring(0, 1)!="-" && /^[0-9]/.test(actor_details)){actor_details="+"+actor_details}
  if (actor_details=="+0"){
    return
  } else {
    return actor_details
  }
});

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once("ready", async function() {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on("hotbarDrop", (bar, data, slot) => createItemMacro(data, slot));
});

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {Object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * @returns {Promise}
 */
async function createItemMacro(data, slot) {
  if (data.type !== "Item") return;
  if (!("data" in data)) return ui.notifications.warn("You can only create macro buttons for owned Items");
  const item = data.data;

  // Create the macro command
  const command = `game.naheulbeuk.rollItemMacro("${item.name}");`;
  let macro = game.macros.find(m => (m.name === item.name) && (m.command === command));
  if (!macro) {
    macro = await Macro.create({
      name: item.name,
      type: "script",
      img: item.img,
      command: command,
      flags: { "naheulbeuk.itemMacro": true }
    });
  }
  game.user.assignHotbarMacro(macro, slot);
  return false;
}

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {string} itemName
 * @return {Promise}
 */
function rollItemMacro(itemName) {
  const speaker = ChatMessage.getSpeaker();
  let actor;
  if (speaker.token) actor = game.actors.tokens[speaker.token];
  if (!actor) actor = game.actors.get(speaker.actor);
  const item = actor ? actor.items.find(i => i.name === itemName) : null;
  if (!item) return ui.notifications.warn(`Your controlled Actor does not have an item named ${itemName}`);

  if (item.type=="sort") {
    let d = new Dialog({
      title: item.name,
      content:`
      <label style="font-size: 15px;">Que souhaitez vous faire ?</label>
      <br/>
      `,
      buttons: {
        one: {
          label: "Voir l'objet",
          callback: (html) => {
              item.sheet.render(true);
            }
        },
        two: {
          label: "Utiliser l'objet",
          callback: (html) => {
            if (item.data.data.epreuvecustom==true){
              var dataset={"actor":actor,"dice1":item.data.data.jet1,"name1":item.data.data.name1,"diff1":item.data.data.epreuve1,"dice2":item.data.data.jet2,"name2":item.data.data.name2,"diff2":item.data.data.epreuve2,"dice3":item.data.data.jet3,"name3":item.data.data.name3,"diff3":item.data.data.epreuve3,"dice4":item.data.data.jet4,"name4":item.data.data.name4,"diff4":item.data.data.epreuve4,"dice5":item.data.data.jet5,"name5":item.data.data.name5,"diff5":item.data.data.epreuve5};
              var currentTarget = {"dataset":dataset};
              var event = {"currentTarget":currentTarget};
              onRollCustomSpell(event)
            } else {
              if (item.data.data.degat==""){
                var dataset= {"actor":actor,"dice1":"d20","name1":"Epreuve","diff1":item.data.data.epreuve,"dice2":"","name2":"","diff2":"","dice3":"","name3":"","diff3":"","dice4":"","name4":"","diff4":"","dice5":"","name5":"","diff5":""};
              } else {
                var dataset= {"actor":actor,"dice1":"d20","name1":"Epreuve","diff1":item.data.data.epreuve,"dice2":item.data.data.degat,"name2":"Dégâts","diff2":"","dice3":"","name3":"","diff3":"","dice4":"","name4":"","diff4":"","dice5":"","name5":"","diff5":""};
              }
              var currentTarget = {"dataset":dataset};
              var event = {"currentTarget":currentTarget};
              onRollCustomSpell(event)
            }
          }
        }
      }
    });
    d.render(true);

  } else if (item.type=="arme" && item.data.data.formula+item.data.data.prd!="-" && item.data.data.formula+item.data.data.prd!="--" && item.data.data.epreuvecustom==false) {
    let d = new Dialog({
      title: item.name,
      content:`
      <label style="font-size: 15px;">Que souhaitez vous faire ?</label>
      <br/>
      `,
      buttons: {
        one: {
          label: "Voir l'objet",
          callback: (html) => {
              item.sheet.render(true);
            }
        },
        two: {
          label: "Utiliser l'objet",
          callback: (html) => {
            if (item.data.data.equipe == false || item.data.data.enmain == false) {
              return ui.notifications.warn(`L'objet ${itemName} n'est pas équipé`);
            } else {
              if (item.data.data.prd=="-"){
                var prd = "";
                var prdname = "";
              } else {
                var prd = "@prd+"+item.data.data.prd;
                var prdname = "Parade";
              }
              if (item.data.data.formula=="-" || item.data.data.formula=="" ){
                var attaque = "";
                var attname = "";
                var degat = "";
                var degatname = "";
              } else {
                var attname = "Attaque";
                var degatname = "Dégâts";
                if (item.data.data.lancerarme!="-"){var attaque = "@att-distance"} else {var attaque="@att+"+item.data.data.att}
                var degat = item.data.data.formula;
                if ((actor.data.data.abilities.fo.value+actor.data.data.abilities.fo.bonus)>12){
                  degat=degat + "+" + Math.max(0, (actor.data.data.abilities.fo.value+actor.data.data.abilities.fo.bonus)-12)
                };
                if ((actor.data.data.abilities.fo.value+actor.data.data.abilities.fo.bonus)<9){
                  degat=degat + "-1"
                };
                if (item.data.data.lancerarme!="-" && actor.data.data.attributes.lancerarme.degat!=0){
                  degat=degat + actor.data.data.attributes.lancerarme.degat
                };
              }

              var dataset= {"actor":actor,"dice1":"d20","name1":attname,"diff1":attaque,"dice2":degat,"name2":degatname,"diff2":"","dice3":"d20","name3":prdname,"diff3":prd,"dice4":"","name4":"","diff4":"","dice5":"","name5":"","diff5":""};
              var currentTarget = {"dataset":dataset};
              var event = {"currentTarget":currentTarget};
              onRollCustomSpell(event)
            }
          }
        }
      }
    });
    d.render(true);

  } else if (item.type=="arme" && item.data.data.formula+item.data.data.prd!="-" && item.data.data.formula+item.data.data.prd!="--" && item.data.data.epreuvecustom==true) {
    let d = new Dialog({
      title: item.name,
      content:`
      <label style="font-size: 15px;">Que souhaitez vous faire ?</label>
      <br/>
      `,
      buttons: {
        one: {
          label: "Voir l'objet",
          callback: (html) => {
              item.sheet.render(true);
            }
        },
        two: {
          label: "Utiliser l'objet",
          callback: (html) => {
            if (item.data.data.equipe == false || item.data.data.enmain == false) {
              return ui.notifications.warn(`L'objet ${itemName} n'est pas équipé`);
            } else {
              if (item.data.data.prd=="-"){
                var prd = "";
                var prdname = "";
              } else {
                var prd = "@prd+"+item.data.data.prd;
                var prdname = "Parade";
              }
              if (item.data.data.formula=="-" || item.data.data.formula=="" ){
                var attaque = "";
                var attname = "";
                var degat = "";
                var degatname = "";
              } else {
                var attname = "Attaque";
                var degatname = "Dégâts";
                if (item.data.data.lancerarme!="-"){var attaque = "@att-distance"} else {var attaque="@att+"+item.data.data.att}
                var degat = item.data.data.formula;
                if ((actor.data.data.abilities.fo.value+actor.data.data.abilities.fo.bonus)>12){
                  degat=degat + "+" + Math.max(0, (actor.data.data.abilities.fo.value+actor.data.data.abilities.fo.bonus)-12)
                };
                if ((actor.data.data.abilities.fo.value+actor.data.data.abilities.fo.bonus)<9){
                  degat=degat + "-1"
                };
                if (item.data.data.lancerarme!="-" && actor.data.data.attributes.lancerarme.degat!=0){
                  degat=degat + actor.data.data.attributes.lancerarme.degat
                };
              }

              var dataset= {"actor":actor,"dice1":"d20","name1":attname,"diff1":attaque,"dice2":degat,"name2":degatname,"diff2":"","dice3":"d20","name3":prdname,"diff3":prd,"dice4":"","name4":"","diff4":"","dice5":"","name5":"","diff5":""};
              var currentTarget = {"dataset":dataset};
              var event = {"currentTarget":currentTarget};
              onRollCustomSpell(event)
            }
          }
        },
        three: {
          label: "Épreuve(s) custom",
          callback: (html) => {
            var dataset = {"actor":actor,"dice1":item.data.data.jet1,"name1":item.data.data.name1,"diff1":item.data.data.epreuve1,"dice2":item.data.data.jet2,"name2":item.data.data.name2,"diff2":item.data.data.epreuve2,"dice3":item.data.data.jet3,"name3":item.data.data.name3,"diff3":item.data.data.epreuve3,"dice4":item.data.data.jet4,"name4":item.data.data.name4,"diff4":item.data.data.epreuve4,"dice5":item.data.data.jet5,"name5":item.data.data.name5,"diff5":item.data.data.epreuve5};
            var currentTarget = {"dataset":dataset};
            var event = {"currentTarget":currentTarget};
            onRollCustomSpell(event)
          }
        },
      }
    });
    d.render(true);
  } else if (item.type=="coup" && ((item.data.data.epreuve!="" && item.data.data.bourrepif==false) || item.data.data.bourrepif==true)){
    let d = new Dialog({
      title: item.name,
      content:`
      <label style="font-size: 15px;">Que souhaitez vous faire ?</label>
      <br/>
      `,
      buttons: {
        one: {
          label: "Voir l'objet",
          callback: (html) => {
              item.sheet.render(true);
            }
        },
        two: {
          label: "Utiliser l'objet",
          callback: (html) => {
            if (item.data.data.bourrepif==false) {
              var name1="";
              var name2="";
              var diff1="";
              var dice1="";
              var dice2="";
              if (item.data.data.epreuve.substring(0,1)!="*") {
                name1="Epreuve"
                diff1=item.data.data.epreuve
                dice1="d20"
              }
              if (item.data.data.degat.substring(0,1)!="*") {
                name2="Dégâts"
                dice2=item.data.data.degat
              }
              var dataset= {"actor":actor,"dice1":dice1,"name1":name1,"diff1":diff1,"dice2":dice2,"name2":name2,"diff2":"","dice3":"","name3":"","diff3":"","dice4":"","name4":"","diff4":"","dice5":"","name5":"","diff5":""};
              var currentTarget = {"dataset":dataset};
              var event = {"currentTarget":currentTarget};
              onRollCustomSpell(event)
            } else {
              var name1="";
              var name2="";
              var name3="";
              var diff1="";
              var diff3="";
              var dice1="";
              var dice2="";
              var dice3="";
              if (item.data.data.epreuve!="" && item.data.data.epreuve!="-"){
                name1="Epreuve d'attaque";
                diff1=item.data.data.epreuve;
                dice1="d20";
              }
              if (item.data.data.degat!="" && item.data.data.degat!="-"){
                name2="Dégâts";
                dice2=item.data.data.degat;
              }
              if (item.data.data.attaque!="" && item.data.data.attaque!="-"){
                name3="Epreuve spéciale";
                diff3=item.data.data.attaque;
                dice3="d20";
              }
              var dataset= {"actor":actor,"dice1":dice1,"name1":name1,"diff1":diff1,"dice2":dice2,"name2":name2,"diff2":"","dice3":dice3,"name3":name3,"diff3":diff3,"dice4":"","name4":"","diff4":"","dice5":"","name5":"","diff5":""};
              var currentTarget = {"dataset":dataset};
              var event = {"currentTarget":currentTarget};
              onRollCustomSpell(event)
            }
          }
        }
      }
    });
    d.render(true);
  } else {
    item.sheet.render(true);
  }

}

//PCH roll custom avec formulaire pour les sorts 
async function onRollCustomSpell(event){
  const element = event.currentTarget;
  const dataset = element.dataset;
  var dice1 = dataset.dice1;
  var dice2 = dataset.dice2;
  var dice3 = dataset.dice3;
  var dice4 = dataset.dice4;
  var dice5 = dataset.dice5;
  var name1 = dataset.name1;
  var name2 = dataset.name2;
  var name3 = dataset.name3;
  var name4 = dataset.name4;
  var name5 = dataset.name5;
  var diff1 = dataset.diff1;
  var diff2 = dataset.diff2;
  var diff3 = dataset.diff3;
  var diff4 = dataset.diff4;
  var diff5 = dataset.diff5;

  const actorCible=dataset.actor

  //récupération de l'objet si besoin
  //const li = $(event.currentTarget).parents(".item");
  //const item = this.actor.items.get(li.data("itemId"));

  dice1=dice1.toString().replace(/ /g,"");
  dice2=dice2.toString().replace(/ /g,"");
  dice3=dice3.toString().replace(/ /g,"");
  dice4=dice4.toString().replace(/ /g,"");
  dice5=dice5.toString().replace(/ /g,"");
  diff1=diff1.toString().replace(/ /g,"");
  diff2=diff2.toString().replace(/ /g,"");
  diff3=diff3.toString().replace(/ /g,"");
  diff4=diff4.toString().replace(/ /g,"");
  diff5=diff5.toString().replace(/ /g,"");

  var content=`
  <em style="font-size: 15px;">Raccourcis :</em>
  <br/>
  <em style="font-size: 15px;">@cou @int @cha @ad @fo @att @prd @lvl @pr @prm @esq @rm @mphy @mpsy @att-distance @bonusint</em>
  <hr>
  `
  if (name1!=""){
    content= content + `
    <label style="font-size: 15px;"1>Formule `+name1+` :</label>
    <input style="font-size: 15px;" type="text" name="inputFormule1" value="`+dice1+`">
    <label style="font-size: 15px;"1>Difficulté `+name1+` :</label>
    <input style="font-size: 15px;" type="text" name="inputDiff1" value=`+diff1+`></li>
    <br/><br/>
    `
  }
  if (name2!=""){
    content= content + `
    <label style="font-size: 15px;"1>Formule `+name2+` :</label>
    <input style="font-size: 15px;" type="text" name="inputFormule2" value="`+dice2+`">
    <label style="font-size: 15px;"1>Difficulté `+name2+` :</label>
    <input style="font-size: 15px;" type="text" name="inputDiff2" value=`+diff2+`></li>
    <br/><br/>
    `
  }
  if (name3!=""){
    content= content + `
    <label style="font-size: 15px;"1>Formule `+name3+` :</label>
    <input style="font-size: 15px;" type="text" name="inputFormule3" value="`+dice3+`">
    <label style="font-size: 15px;"1>Difficulté `+name3+` :</label>
    <input style="font-size: 15px;" type="text" name="inputDiff3" value=`+diff3+`></li>
    <br/><br/>
    `
  }
  if (name4!=""){
    content= content + `
    <label style="font-size: 15px;"1>Formule `+name4+` :</label>
    <input style="font-size: 15px;" type="text" name="inputFormule4" value="`+dice4+`">
    <label style="font-size: 15px;"1>Difficulté `+name4+` :</label>
    <input style="font-size: 15px;" type="text" name="inputDiff4" value=`+diff4+`></li>
    <br/><br/>
    `
  }
  if (name5!=""){
    content= content + `
    <label style="font-size: 15px;"1>Formule `+name5+` :</label>
    <input style="font-size: 15px;" type="text" name="inputFormule5" value="`+dice5+`">
    <label style="font-size: 15px;"1>Difficulté `+name5+` :</label>
    <input style="font-size: 15px;" type="text" name="inputDiff5" value=`+diff5+`></li>
    <br/><br/>
    `
  }
  var buttons = []
  var one = {
      label: name1,
      callback: (html) => {
        let dice = html.find('input[name="inputFormule1"').val();
        let diff = html.find('input[name="inputDiff1"').val();
        const rollMessageTpl = 'systems/naheulbeuk/templates/chat/skill-roll.hbs';
        //dice=game.naheulbeuk.macros.replaceAttr(dice,actorCible);
        //diff=game.naheulbeuk.macros.replaceAttr(diff,actorCible);
        if (dice.substr(0, 6)=="cible:" || diff.substr(0, 6)=="cible:"){
          if (game.naheulbeuk.macros.getSpeakersTarget()==null){return}
        }
        if (dice.substr(0, 6)=="cible:"){
          dice=game.naheulbeuk.macros.replaceAttr(dice, game.naheulbeuk.macros.getSpeakersTarget());
        } else {
          dice=game.naheulbeuk.macros.replaceAttr(dice, actorCible);
        }
        if (diff.substr(0, 6)=="cible:"){
          diff=game.naheulbeuk.macros.replaceAttr(diff, game.naheulbeuk.macros.getSpeakersTarget());
        } else {
          diff=game.naheulbeuk.macros.replaceAttr(diff, actorCible);
        }
        if(dice!="") {
            let r = new Roll(dice);
            //await r.roll({"async": true});
            r.roll({"async": true}).then(r =>{
            var result = 0;
            var tplData={};
            var reussite = "Réussite !   ";
            if (diff==""){
                tplData = {
                  diff: "",
                  name : name1 
                }
                renderTemplate(rollMessageTpl, tplData).then(msgFlavor => {
                  r.toMessage({
                    user: game.user.id,
                    flavor: msgFlavor,
                    speaker: ChatMessage.getSpeaker({actor: actorCible})
                  });
              });
              } else {
                diff=new Roll(diff);
                diff.roll({"async": true}).then(diff =>{
                  result = Math.abs(diff.total-r.total);
                  if (r.total>diff.total){reussite="Echec !   "};
                  tplData = {
                    diff: reussite + " - Difficulté : " + diff.total + " - Ecart : " + result,
                    name : name1  
                  };
                  renderTemplate(rollMessageTpl, tplData).then(msgFlavor => {
                    r.toMessage({
                      user: game.user.id,
                      flavor: msgFlavor,
                      speaker: ChatMessage.getSpeaker({actor: actorCible})
                    });
                  });
                });
              };
          });
        }
        return false;
      }
  }
  var two = {
  label: name2,
  callback: (html) => {
      let dice = html.find('input[name="inputFormule2"').val();
      let diff = html.find('input[name="inputDiff2"').val();
      const rollMessageTpl = 'systems/naheulbeuk/templates/chat/skill-roll.hbs';
      //dice=game.naheulbeuk.macros.replaceAttr(dice,actorCible);
      //diff=game.naheulbeuk.macros.replaceAttr(diff,actorCible);
      if (dice.substr(0, 6)=="cible:" || diff.substr(0, 6)=="cible:"){
        if (game.naheulbeuk.macros.getSpeakersTarget()==null){return}
      }
      if (dice.substr(0, 6)=="cible:"){
        dice=game.naheulbeuk.macros.replaceAttr(dice, game.naheulbeuk.macros.getSpeakersTarget());
      } else {
        dice=game.naheulbeuk.macros.replaceAttr(dice, actorCible);
      }
      if (diff.substr(0, 6)=="cible:"){
        diff=game.naheulbeuk.macros.replaceAttr(diff, game.naheulbeuk.macros.getSpeakersTarget());
      } else {
        diff=game.naheulbeuk.macros.replaceAttr(diff, actorCible);
      }
      if(dice!="") {
        let r = new Roll(dice);
        //await r.roll({"async": true});
        r.roll({"async": true}).then(r =>{
        var result = 0;
        var tplData={};
        var reussite = "Réussite !   ";
        if (diff==""){
            tplData = {
              diff: "",
              name : name2 
            }
            renderTemplate(rollMessageTpl, tplData).then(msgFlavor => {
              r.toMessage({
                user: game.user.id,
                flavor: msgFlavor,
                speaker: ChatMessage.getSpeaker({actor: actorCible})
              });
          });
          } else {
            diff=new Roll(diff);
            diff.roll({"async": true}).then(diff =>{
              result = Math.abs(diff.total-r.total);
              if (r.total>diff.total){reussite="Echec !   "};
              tplData = {
                diff: reussite + " - Difficulté : " + diff.total + " - Ecart : " + result,
                name : name2  
              };
              renderTemplate(rollMessageTpl, tplData).then(msgFlavor => {
                r.toMessage({
                  user: game.user.id,
                  flavor: msgFlavor,
                  speaker: ChatMessage.getSpeaker({actor: actorCible})
                });
              });
            });
          };
        });
      }
      return false;
    }
  }
  var three = {
  label: name3,
  callback: (html) => {
      let dice = html.find('input[name="inputFormule3"').val();
      let diff = html.find('input[name="inputDiff3"').val();
      const rollMessageTpl = 'systems/naheulbeuk/templates/chat/skill-roll.hbs';
      //dice=game.naheulbeuk.macros.replaceAttr(dice,actorCible);
      //diff=game.naheulbeuk.macros.replaceAttr(diff,actorCible);
      if (dice.substr(0, 6)=="cible:" || diff.substr(0, 6)=="cible:"){
        if (game.naheulbeuk.macros.getSpeakersTarget()==null){return}
      }
      if (dice.substr(0, 6)=="cible:"){
        dice=game.naheulbeuk.macros.replaceAttr(dice, game.naheulbeuk.macros.getSpeakersTarget());
      } else {
        dice=game.naheulbeuk.macros.replaceAttr(dice, actorCible);
      }
      if (diff.substr(0, 6)=="cible:"){
        diff=game.naheulbeuk.macros.replaceAttr(diff, game.naheulbeuk.macros.getSpeakersTarget());
      } else {
        diff=game.naheulbeuk.macros.replaceAttr(diff, actorCible);
      }
      if(dice!="") {
          let r = new Roll(dice);
          //await r.roll({"async": true});
          r.roll({"async": true}).then(r =>{
          var result = 0;
          var tplData={};
          var reussite = "Réussite !   ";
          if (diff==""){
              tplData = {
                diff: "",
                name : name3 
              }
              renderTemplate(rollMessageTpl, tplData).then(msgFlavor => {
                r.toMessage({
                  user: game.user.id,
                  flavor: msgFlavor,
                  speaker: ChatMessage.getSpeaker({actor: actorCible})
                });
            });
            } else {
              diff=new Roll(diff);
              diff.roll({"async": true}).then(diff =>{
                result = Math.abs(diff.total-r.total);
                if (r.total>diff.total){reussite="Echec !   "};
                tplData = {
                  diff: reussite + " - Difficulté : " + diff.total + " - Ecart : " + result,
                  name : name3  
                };
                renderTemplate(rollMessageTpl, tplData).then(msgFlavor => {
                  r.toMessage({
                    user: game.user.id,
                    flavor: msgFlavor,
                    speaker: ChatMessage.getSpeaker({actor: actorCible})
                  });
                });
              });
            };
        });
      }
      return false;
    }
  }
  var four = {
  label: name4,
  callback: (html) => {
      let dice = html.find('input[name="inputFormule4"').val();
      let diff = html.find('input[name="inputDiff4"').val();
      const rollMessageTpl = 'systems/naheulbeuk/templates/chat/skill-roll.hbs';
      //dice=game.naheulbeuk.macros.replaceAttr(dice,actorCible);
      //diff=game.naheulbeuk.macros.replaceAttr(diff,actorCible);
      if (dice.substr(0, 6)=="cible:" || diff.substr(0, 6)=="cible:"){
        if (game.naheulbeuk.macros.getSpeakersTarget()==null){return}
      }
      if (dice.substr(0, 6)=="cible:"){
        dice=game.naheulbeuk.macros.replaceAttr(dice, game.naheulbeuk.macros.getSpeakersTarget());
      } else {
        dice=game.naheulbeuk.macros.replaceAttr(dice, actorCible);
      }
      if (diff.substr(0, 6)=="cible:"){
        diff=game.naheulbeuk.macros.replaceAttr(diff, game.naheulbeuk.macros.getSpeakersTarget());
      } else {
        diff=game.naheulbeuk.macros.replaceAttr(diff, actorCible);
      }
      if(dice!="") {
          let r = new Roll(dice);
          //await r.roll({"async": true});
          r.roll({"async": true}).then(r =>{
          var result = 0;
          var tplData={};
          var reussite = "Réussite !   ";
          if (diff==""){
              tplData = {
                diff: "",
                name : name4 
              }
              renderTemplate(rollMessageTpl, tplData).then(msgFlavor => {
                r.toMessage({
                  user: game.user.id,
                  flavor: msgFlavor,
                  speaker: ChatMessage.getSpeaker({actor: actorCible})
                });
            });
            } else {
              diff=new Roll(diff);
              diff.roll({"async": true}).then(diff =>{
                result = Math.abs(diff.total-r.total);
                if (r.total>diff.total){reussite="Echec !   "};
                tplData = {
                  diff: reussite + " - Difficulté : " + diff.total + " - Ecart : " + result,
                  name : name4  
                };
                renderTemplate(rollMessageTpl, tplData).then(msgFlavor => {
                  r.toMessage({
                    user: game.user.id,
                    flavor: msgFlavor,
                    speaker: ChatMessage.getSpeaker({actor: actorCible})
                  });
                });
              });
            };
        });
      }
      return false;
    }
  }
  var five = {
    label: name5,
    callback: (html) => {
      let dice = html.find('input[name="inputFormule5"').val();
      let diff = html.find('input[name="inputDiff5"').val();
      const rollMessageTpl = 'systems/naheulbeuk/templates/chat/skill-roll.hbs';
      //dice=game.naheulbeuk.macros.replaceAttr(dice,actorCible);
      //diff=game.naheulbeuk.macros.replaceAttr(diff,actorCible);
      if (dice.substr(0, 6)=="cible:" || diff.substr(0, 6)=="cible:"){
        if (game.naheulbeuk.macros.getSpeakersTarget()==null){return}
      }
      if (dice.substr(0, 6)=="cible:"){
        dice=game.naheulbeuk.macros.replaceAttr(dice, game.naheulbeuk.macros.getSpeakersTarget());
      } else {
        dice=game.naheulbeuk.macros.replaceAttr(dice, actorCible);
      }
      if (diff.substr(0, 6)=="cible:"){
        diff=game.naheulbeuk.macros.replaceAttr(diff, game.naheulbeuk.macros.getSpeakersTarget());
      } else {
        diff=game.naheulbeuk.macros.replaceAttr(diff, actorCible);
      }
      if(dice!="") {
          let r = new Roll(dice);
          //await r.roll({"async": true});
          r.roll({"async": true}).then(r =>{
          var result = 0;
          var tplData={};
          var reussite = "Réussite !   ";
          if (diff==""){
              tplData = {
                diff: "",
                name : name5 
              }
              renderTemplate(rollMessageTpl, tplData).then(msgFlavor => {
                r.toMessage({
                  user: game.user.id,
                  flavor: msgFlavor,
                  speaker: ChatMessage.getSpeaker({actor: actorCible})
                });
            });
            } else {
              diff=new Roll(diff);
              diff.roll({"async": true}).then(diff =>{
                result = Math.abs(diff.total-r.total);
                if (r.total>diff.total){reussite="Echec !   "};
                tplData = {
                  diff: reussite + " - Difficulté : " + diff.total + " - Ecart : " + result,
                  name : name4  
                };
                renderTemplate(rollMessageTpl, tplData).then(msgFlavor => {
                  r.toMessage({
                    user: game.user.id,
                    flavor: msgFlavor,
                    speaker: ChatMessage.getSpeaker({actor: actorCible})
                  });
                });
              });
            };
        });
      }
      return false;
    }
}
  if (name1!=""){buttons.push(one)}
  if (name2!=""){buttons.push(two)}
  if (name3!=""){buttons.push(three)}
  if (name4!=""){buttons.push(four)}
  if (name5!=""){buttons.push(five)}
  const myDialogOptions = {
    width: 500
  };
  let d = new CustomDialog({
      title: "Utiliser l'objet",
      content:content,
      buttons:buttons
    }, myDialogOptions);
    d.render(true);
}

export class CustomDialog extends Dialog {
  submit(button) {
      try {
        if (button.callback && button.callback(this.options.jQuery ? this.element : this.element[0]) !== false) this.close();
      } catch(err) {
        ui.notifications.error(err);
        throw new Error(err);
      }
    }
}