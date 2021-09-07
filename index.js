const pokeSearch = (ev) => {
    ev.preventDefault();
    const apiData = {
        nameid: document.getElementById('searchText').value
    }

    var userValue = apiData.nameid;

    console.log(userValue);
    console.log(typeof userValue);
    const userValueProper = userValue.toLowerCase();

    console.log(userValueProper);

    const url = `https://pokeapi.co/api/v2/pokemon/${userValueProper}`;
    fetch(url)
        .then(res => res.json())
        .then(pokemon => {
            pokeTemplate(pokemon);
        });

    const pokeTemplate = (res) => {
        console.log(res);
        console.log(res.name);
        var sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${res.id}.png`
        console.log(sprite);

        var height = parseFloat(res.height);
        console.log(height);

        var weight = parseFloat(res.weight);
        console.log(weight);

        const pokeMap = [];
        pokeMap.push({
            "name": res.name,
            "id": res.id,
            "height": height / 10,
            "weight": weight / 10,
            "hp": res.stats[0].base_stat,
            "atk": res.stats[1].base_stat,
            "def": res.stats[2].base_stat,
            "spatk": res.stats[3].base_stat,
            "spdef": res.stats[4].base_stat,
            "speed": res.stats[5].base_stat,
            "base_experience": res.base_experience,
            "sprite": sprite,
            "type": res.types.map(type => type.type.name).join(", "),
            "abilities": res.abilities.map(ability => ability.ability.name).join(", ")
        });

        const speciesUrl = res.species.url;
        fetch(speciesUrl)
            .then(data => data.json())
            .then(pokemonSpecies => {
                speciesTemplate(pokemonSpecies);
            });

        const speciesTemplate = (data) => {
            console.log(data);
            console.log(data.genera);
            var genera = data.genera;
            let englishGenera = [];
            for(let i = 0; i < genera.length; i++) {
                if(genera[i].language.name == 'en') {
                    englishGenera.push(genera[i].genus);
                    break;
                }
            }

            var flavor = data.flavor_text_entries;
            let englishFlavor = [];
            for(let i = 0; i < flavor.length; i++) {
                if(flavor[i].language.name == 'en') {
                    englishFlavor.push(flavor[i].flavor_text);
                    break;
                }
            }

            console.log(englishGenera);
            console.log(englishFlavor);

            var generaStr = englishGenera.toString();

            var samStr = englishFlavor.toString();
            var cleanStr = samStr.replace(/\n|\f/g, " "); //get rid of \n and \f in string
            console.log(cleanStr);

            var captureRate = data.capture_rate;
            let capRatePercent = (captureRate / 255) * 100;
            capRatePercent = capRatePercent.toFixed(1);

            pokeMap.push({
                "base_happiness": data.base_happiness,
                "capture_rate": captureRate,
                "capture_rate_percent": capRatePercent,
                "genus": generaStr,
                "growth_rate": data.growth_rate.name,
                "flavor_text": cleanStr
            });
            console.log(pokeMap[1]);
            console.log(pokeMap[1].growth_rate);

            // Bio HTML
            const bioHtml =
            `
                ${pokeMap[1].flavor_text}
            `
            const bioMarkup = document.querySelector('.minidex__bio--text');
            bioMarkup.innerHTML = bioHtml;

            const bioGenusHtml =
            `
                ${pokeMap[1].genus}
            `
            const bioGenusMarkup = document.querySelector('.minidex__bio--genus');
            bioGenusMarkup.innerHTML = bioGenusHtml;

            // Training HTML
            const trainingHappinessHtml =
            `
                ${pokeMap[1].base_happiness}
            `
            const trainingHappinessMarkup = document.querySelector('.minidex__training--happiness');
            trainingHappinessMarkup.innerHTML = trainingHappinessHtml;

            const trainingCapRateHtml =
            `
                ${pokeMap[1].capture_rate} (${pokeMap[1].capture_rate_percent}%)
            `
            const trainingCapRateMarkup = document.querySelector('.minidex__training--caprate');
            trainingCapRateMarkup.innerHTML = trainingCapRateHtml;

            const trainingGrowthHtml =
            `
                ${pokeMap[1].growth_rate}
            `
            const trainingGrowthMarkup = document.querySelector('.minidex__training--growth');
            trainingGrowthMarkup.innerHTML = trainingGrowthHtml;

            const evoUrl = data.evolution_chain.url;
            fetch(evoUrl)
                .then(evo => evo.json())
                .then(pokemonEvo => {
                    evoTemplate(pokemonEvo);
                });
            
            const evoTemplate = (evo) => {
                console.log(evo);

                let evoChain = [];
                let evoData = evo.chain;

                do {
                    let numberOfEvolutions = evoData.evolves_to.length;

                    var speciesUrl = evoData.species.url;
                    var parts = speciesUrl.split('/');
                    var lastSegment = parts.pop() || parts.pop();

                    evoChain.push({
                        "species_name": evoData.species.name,
                        "species_url": speciesUrl,
                        "species_id": lastSegment
                    });

                    if(numberOfEvolutions > 1) {
                        for(let i = 1; i < numberOfEvolutions; i++) {
                            var speciesMultiUrl = evoData.evolves_to[i].species.url;
                            var multiParts = speciesMultiUrl.split('/');
                            var multiLastSegment = multiParts.pop() || multiParts.pop();

                            evoChain.push({
                                "species_name": evoData.evolves_to[i].species.name,
                                "species_url": speciesMultiUrl,
                                "species_id": multiLastSegment
                            })
                        }
                    }

                    evoData = evoData.evolves_to[0];

                } while(evoData != undefined && evoData.hasOwnProperty('evolves_to'));

                console.log(evoChain);
                for(i = 0; i < evoChain.length; i++) {
                    console.log(evoChain[i].species_name);
                }

                let evoHtmlRefresh = // refreshes so doesn't infinitely append to evo div
                `
                `
                let evoMarkupRefresh = document.querySelector('.minidex__evo');
                evoMarkupRefresh.innerHTML = evoHtmlRefresh;

                for(i = 0; i < evoChain.length; i++) {
                    var iterator = i + 1;

                    let evoHtml =
                    `
                        <div class="col-1-of-3">
                            <p>#00${iterator}</p>
                            <div class="minidex__evo--bg">
                                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evoChain[i].species_id}.png" alt="Pokémon Evolution">
                            </div>
                            <p>${evoChain[i].species_name}</p>
                        </div>
                    `
                    let evoMarkup = document.querySelector('.minidex__evo');
                    evoMarkup.innerHTML += evoHtml;
                }
            }
        }
        
        console.log(pokeMap[0]);

        //capitalize first letter of a string
        var pokeName = pokeMap[0].name;
        var pokeNameProper = pokeName.charAt(0).toUpperCase() + pokeName.slice(1);

        //capitalize first letter of each word in a string
        var pokeTypes = pokeMap[0].type;
        var pokeTypesArr = pokeTypes.split(" ");
        for(i = 0; i < pokeTypesArr.length; i++) {
            pokeTypesArr[i] = pokeTypesArr[i].charAt(0).toUpperCase() + pokeTypesArr[i].slice(1);
        }
        var pokeTypesProper = pokeTypesArr.join(" ");

        //capitalize first letter of each word in a string
        var pokeAbilities = pokeMap[0].abilities;
        var pokeAbilitiesArr = pokeAbilities.split(" ");
        for(i = 0; i < pokeAbilitiesArr.length; i++) {
            pokeAbilitiesArr[i] = pokeAbilitiesArr[i].charAt(0).toUpperCase() + pokeAbilitiesArr[i].slice(1);
        }
        var pokeAbilitiesProper = pokeAbilitiesArr.join(" ");

        // Title HTML
        const pokeNameHtml = 
        `
        ${pokeNameProper}
        `
        const pokeNameMarkup = document.querySelector('.minidex__title--name');
        pokeNameMarkup.innerHTML = pokeNameHtml;

        const pokeIDHtml = 
        `
            #${pokeMap[0].id}
        `
        const pokeIDMarkup = document.querySelector('.minidex__title--id');
        pokeIDMarkup.innerHTML = pokeIDHtml;

        const pokeImageHtml =
        `
            <img src="${sprite}" class="minidex__title__img" alt="Pokémon">
        `
        const pokeImageMarkup = document.querySelector('.minidex__title--imgcontainer');
        pokeImageMarkup.innerHTML = pokeImageHtml;

        // Stats HTML
        const pokeStatsHPHtml =
        `
            ${pokeMap[0].hp}
        `
        const pokeStatsHPMarkup = document.querySelector('.minidex__stats__hp');
        pokeStatsHPMarkup.innerHTML = pokeStatsHPHtml;

        const pokeStatsAtkHtml =
        `
            ${pokeMap[0].atk}
        `
        const pokeStatsAtkMarkup = document.querySelector('.minidex__stats__atk');
        pokeStatsAtkMarkup.innerHTML = pokeStatsAtkHtml;

        const pokeStatsDefHtml =
        `
            ${pokeMap[0].def}
        `
        const pokeStatsDefMarkup = document.querySelector('.minidex__stats__def');
        pokeStatsDefMarkup.innerHTML = pokeStatsDefHtml;

        const pokeStatsSpAtkHtml =
        `
            ${pokeMap[0].spatk}
        `
        const pokeStatsSpAtkMarkup = document.querySelector('.minidex__stats__spatk');
        pokeStatsSpAtkMarkup.innerHTML = pokeStatsSpAtkHtml;

        const pokeStatsSpDefHtml =
        `
            ${pokeMap[0].spdef}
        `
        const pokeStatsSpDefMarkup = document.querySelector('.minidex__stats__spdef');
        pokeStatsSpDefMarkup.innerHTML = pokeStatsSpDefHtml;

        const pokeStatsSpeedHtml =
        `
            ${pokeMap[0].speed}
        `
        const pokeStatsSpeedMarkup = document.querySelector('.minidex__stats__speed');
        pokeStatsSpeedMarkup.innerHTML = pokeStatsSpeedHtml;

        // Bio HTML
        const pokeBioHeightHtml =
        `
            ${pokeMap[0].height}m
        `
        const pokeBioHeightMarkup = document.querySelector('.minidex__bio--height');
        pokeBioHeightMarkup.innerHTML = pokeBioHeightHtml;

        const pokeBioWeightHtml =
        `
            ${pokeMap[0].weight}kg
        `
        const pokeBioWeightMarkup = document.querySelector('.minidex__bio--weight');
        pokeBioWeightMarkup.innerHTML = pokeBioWeightHtml;

        const pokeBioTypeHtml =
        `
            ${pokeTypesProper}
        `
        const pokeBioTypeMarkup = document.querySelector('.minidex__bio--type');
        pokeBioTypeMarkup.innerHTML = pokeBioTypeHtml;

        const pokeBioAbilitiesHtml =
        `
            ${pokeAbilitiesProper}
        `
        const pokeBioAbilitiesMarkup = document.querySelector('.minidex__bio--ability');
        pokeBioAbilitiesMarkup.innerHTML = pokeBioAbilitiesHtml;

        // Training HTML
        const trainingExpHtml =
        `
            ${pokeMap[0].base_experience}
        `
        const trainingExpMarkup = document.querySelector('.minidex__training--exp');
        trainingExpMarkup.innerHTML = trainingExpHtml;
    }
}