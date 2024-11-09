addLayer("oleg", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "<p style ='transform: translate(0px,-3px);'>💠", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        dotState: false,
        extraBuyables: [new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)],
        diamonds: new Decimal(0),
        dots: new Decimal(0)
    }},
    update(diff){
        if(player.oleg.dotState){
            player.oleg.extraBuyables[0] = player.oleg.extraBuyables[0].add(tmp.oleg.buyables["down"].effect.mul(diff))
            player.oleg.extraBuyables[1] = player.oleg.extraBuyables[1].add(tmp.oleg.buyables["left"].effect.mul(diff))
            player.oleg.extraBuyables[2] = player.oleg.extraBuyables[2].add(tmp.oleg.buyables["up"].effect.mul(diff))
        }
        else {
            player.oleg.diamonds = player.oleg.diamonds.add(tmp.oleg.buyables["right"].effect.mul(diff))
            player.oleg.dots = player.oleg.dots.add(tmp.oleg.buyables["down"].effect.mul(diff))
            player.oleg.points = player.oleg.points.add(tmp.oleg.buyables["left"].effect.mul(diff))
        }
    },
    tabFormat: ["main-display", "prestige-button", "resource-display", ["display-text", function(){return `You also have the following:<br>${format(player.oleg.diamonds)} ${player.oleg.buyables["right"].gt(0) && !player.oleg.dotState ? `(+${format(tmp.oleg.buyables["right"].effect)})` : ``} diamonds, boosting your point gain by x${format(tmp.oleg.diamondEffect)}<br>${format(player.oleg.dots)} ${player.oleg.buyables["down"].gt(0) && !player.oleg.dotState ? `(+${format(tmp.oleg.buyables["down"].effect)})` : ``} dots, boosting your 💠 gain by x${format(tmp.oleg.dotEffect)}`}], ["blank", "32px", "32px"], ["buyable", "up"], ["blank", "32px", "32px"], ["row", [["buyable", "left"], ["buyable", "dot"], ["buyable", "right"]]], ["blank", "32px", "32px"], ["buyable", "down"]],
    diamondEffect(){return player.oleg.diamonds.add(1).log(4).add(1)},
    dotEffect(){return player.oleg.dots.add(1).log(4).add(1)},
    color(){return player.oleg.dotState ? "#FCE100" : "#00BCF2"},
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "💠", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        mult = mult.mul(tmp.oleg.dotEffect)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "💠", description: "💠: Reset for 💠", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    branches: ["yuki", ";vivid"],
    layerShown(){return true},
    buyables: {
        up: {
            title: `<p style='transform: rotate(-45deg) translate(-28px, -24px);'>Wardite`,
            display(){return `<p style='transform: rotate(-45deg) translate(12px, -12px)'>Generates<br>${player.oleg.dotState?`0.01 Amethyst/sec`:`1 ???/sec`}<br><br>Amount: ${format(player.oleg.buyables["right"])} ${player.oleg.extraBuyables[3].gt(0)?` (+ ${format(player.oleg.extraBuyables[3])})`:``}<br>Effect: ${format(this.effect())}/sec<br>Cost: ${format(this.cost())} 💠`},
            effect(){return new Decimal(player.oleg.dotState?0.01:1).mul(player.oleg.buyables[this.id].add(player.oleg.extraBuyables[3]))},
            cost(){return new Decimal(4).add(Decimal.pow(4, 1/9*12)).pow(player.oleg.buyables[this.id]).mul(1000000)},
            canAfford(){return player.oleg.points.gte(this.cost())},
            buy(){
                player.oleg.points = player.oleg.points.sub(this.cost())
                player.oleg.buyables[this.id] = player.oleg.buyables[this.id].add(1)
            },
        },
        left: {
            title: `<p style='transform: rotate(-45deg) translate(-28px, -24px);'>Amethyst`, 
            display(){return `<p style='transform: rotate(-45deg) translate(12px, -12px)'>Generates<br>${player.oleg.dotState?`0.01 Sapphire/sec`:`1 💠/sec`}<br><br>Amount: ${format(player.oleg.buyables["right"])} ${player.oleg.extraBuyables[2].gt(0)?` (+ ${format(player.oleg.extraBuyables[2])})`:``}<br>Effect: ${format(this.effect())}/sec<br>Cost: ${format(this.cost())} dot`},
            effect(){return new Decimal(player.oleg.dotState?0.01:1).mul(player.oleg.buyables[this.id].add(player.oleg.extraBuyables[2]))},
            cost(){return new Decimal(4).add(Decimal.pow(4, 1/9*8)).pow(player.oleg.buyables[this.id]).mul(10000)},
            canAfford(){return player.oleg.dots.gte(this.cost())},
            buy(){
                player.oleg.dots = player.oleg.dots.sub(this.cost())
                player.oleg.buyables[this.id] = player.oleg.buyables[this.id].add(1)
            },
            style(){return {
                "transform": "rotate(22.5deg) translate(-22px, 22px)"
            }}
        },
        dot: {
            title(){return `<p style='color: black; transform: translate(0px, 1px);'>Emerald<Br>Of<br>[${player.oleg.dotState?`ORDER`:`CHAOS`}]`},
            display(){return `<p style='color: black; transform: translate(0px, -8px);'>Reversing it will ${player.oleg.dotState?`halt the cycle, but restore your resource production`:`halt resource production, but will activate the cycle`}`},
            canAfford(){return true},
            buy(){
                player.oleg.dotState = !player.oleg.dotState
            },
            style(){return {
                "transform": "rotate(-22.5deg)",
                "border-radius": "100%",
                "color": player.oleg.dotState ? "#FCE100" : "#00BCF2"
            }},
        },
        right: {
            title: `<p style='transform: rotate(-45deg) translate(-30px, -24px);'>Diamond`, 
            display(){return `<p style='transform: rotate(-45deg) translate(10px, -12px)'>${player.oleg.dotState?`Does absolutely nothing`:`Generates<br>1 diamond/sec`}<br><br>Amount: ${format(player.oleg.buyables[this.id])} ${player.oleg.extraBuyables[0].gt(0)?` (+ ${format(player.oleg.extraBuyables[0])})`:``}<br>Effect: ${format(this.effect())}/sec<br>Cost: ${format(this.cost())} 💠`},
            effect(){return new Decimal(player.oleg.dotState?0:1).mul(player.oleg.buyables[this.id].add(player.oleg.extraBuyables[0]))},
            cost(){return new Decimal(4).pow(player.oleg.buyables[this.id])},
            canAfford(){return player.oleg.points.gte(this.cost())},
            buy(){
                player.oleg.points = player.oleg.points.sub(this.cost())
                player.oleg.buyables[this.id] = player.oleg.buyables[this.id].add(1)
            },
            style(){return {
                "transform": "rotate(22.5deg) translate(22px, -22px)"
            }}
        },
        down: {
            title: `<p style='transform: rotate(-45deg) translate(-28px, -24px);'>Sapphire`,
            display(){return `<p style='transform: rotate(-45deg) translate(12px, -12px)'>Generates<br>${player.oleg.dotState?`0.01 Diamond/sec`:`1 dot/sec`}<br><br>Amount: ${format(player.oleg.buyables[this.id])} ${player.oleg.extraBuyables[1].gt(0)?` (+ ${format(player.oleg.extraBuyables[1])})`:``}<br>Effect: ${format(this.effect())}/sec<br>Cost: ${format(this.cost())} diamonds`},
            effect(){return new Decimal(player.oleg.dotState?0.01:1).mul(player.oleg.buyables[this.id].add(player.oleg.extraBuyables[1]))},
            cost(){return new Decimal(4).add(Decimal.pow(4, 1/9*4)).pow(player.oleg.buyables[this.id]).mul(100)},
            canAfford(){return player.oleg.diamonds.gte(this.cost())},
            buy(){
                player.oleg.diamonds = player.oleg.diamonds.sub(this.cost())
                player.oleg.buyables[this.id] = player.oleg.buyables[this.id].add(1)
            },
        },
    },
    nodeStyle(){return {
        "border": "4px solid rgba(0,0,0,0.875)",
        "background-image": (player.oleg.dotState ? "radial-gradient(#00BCF2 10%, #FCE100 10%, #FCE100 80%, #000000 80%)" : "radial-gradient(#FCE100 10%, #00BCF2 10%, #00BCF2 80%, #000000 80%)")
    }},
    componentStyles: {
        "buyable"(){return {
            "height": "128px",
            "width": "128px",
            "left-margin": "50px",
            "transform": "rotate(22.5deg)",
            "class": "upgrades",
        }},
    }
})

//#00BCF2 - square
//#FCE100 - dot
//#000000 - border
