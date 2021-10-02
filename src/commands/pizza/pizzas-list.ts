interface Pizza{
    name: String,
    prix_26: number,
    prix_33: number,
    ingredients: Array<String>
}

const pizzasList:  Record<string, Pizza> = {
    "marguarita": {name: "Marguarita", prix_26:  6.5, prix_33: 8.5, ingredients: ["mozzarella", "origan", "olives"]},
    "tartiflette": {name: "Tartiflette", prix_26: 8.5, prix_33: 11.5, ingredients: ["mozzarella","oignons","jambon sec", "lardons", "pommes de terre", "roblochon"]},
    "biquette": {name:"Biquette", prix_26: 8, prix_33: 10, ingredients: ["mozzarella", "lardons", "oignons", "chèvre", "origan", "miel"]},
    "reine": {name: "Reine", prix_26: 7.5, prix_33: 9.5, ingredients: ["mozzarella","jambon","champignons","olives","origan"]},
    "napolitaine":{ingredients : ["mozzarella","anchois","câpres","olives","origan"],name : "Napolitaine",prix_26 : 7.5,prix_33 : 9.5},
    "L'orientale":{ingredients:["mozzarella","oignons","poivrons","merguez","chorizo","piment","origan"],name:"L'Orientale",prix_26:8.5,prix_33:11.0},
    "l'indienne":{ingredients:["mozzarella","émincé de dinde","ananas","crème","origan"],name:"L'Indienne",prix_26:8.5,prix_33:11.0},
    "kebab":{ingredients:["mozzarella","oignons","poivrons","tomates","viande kebab","crème","origan"],name:"Kebab",prix_26:8.5,prix_33:11.5},
    "burger":{ingredients:["mozzarella","viande hachée","oignons","tomates","origan"],name:"Burger",prix_26:8.5,prix_33:11.5},
    "guemele":{ingredients:["mozzarella","oignons","pommesdeterre","andouille de guémené","origan"],name:"Guémené",prix_26:8.5,prix_33:11.5},
    "mexicaine":{ingredients:["mozzarella","oignons","poivrons","viande hachée","chorizo","piment","origan"],name:"Mexicaine",prix_26:8.5,prix_33:11.5},
    "calzone":{ingredients:["mozzarella","jambon","champignons","olives","origan(20min.decuissonminimum)"],name:"Calzone",prix_26:0,prix_33:12.5},
    "nordique":{ingredients:["mozzarella","échalotes","saumon fumé","crème","citron","persil","origan"],name:"Nordique",prix_26:9.5,prix_33:13.0},
    "royale":{ingredients:["mozzarella","jambon","champignons","oeuf","crème","origan"],name:"Royale",prix_26:8.0,prix_33:10.0},
    "vegetarienne":{ingredients:["mozzarella","champignons","poivrons","artichauts","asperges","origan"],name:"Végétarienne",prix_26:8.0,prix_33:10.0},
    "normande":{ingredients:["mozzarella","pommes","camembert","origan"],name:"Normande",prix_26:8.0,prix_33:10.5},
    "4 fromages":{ingredients:["mozzarella","roquefort","chèvre","camembert","origan(reblochon+0,50 euros)"],name:"4 Fromages",prix_26:8.0,prix_33:10.5},
    "pecheur":{ingredients:["mozzarella","champignons","thon","ciboulette","crème"],name:"Pêcheur",prix_26:8.5,prix_33:11.0},
    "4 saisons":{ingredients:["mozzarella","jambon","champignons","oignons","poivrons","tomates","artichauts","origan"],name:"4 Saisons",prix_26:8.5,prix_33:11}
};

export {pizzasList};