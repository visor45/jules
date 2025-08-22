
// --- Utility functions ---
var removeFromArray = function(arr, elem) {
    var index = arr.indexOf(elem);
    if (index > -1) {
        arr.splice(index, 1);
    }
};

var cloneArray = function(arr) {
    return arr.slice(0);
};

var shuffleArray = function(arr) {
    var j, x, i;
    for (i = arr.length; i; i -= 1) {
        j = Math.floor(Math.random() * i);
        x = arr[i - 1];
        arr[i - 1] = arr[j];
        arr[j] = x;
    }
    return arr;
}

// ---- Main app class ------------
var StarWarsRebellionSolo = function(){
    
    var systems = [
        'mon_calamari', 'yavin', 'felucia', 'saleucami',
        'kessel', 'nal_hutta', 'toydaria', 'bothawui', 
        'tatooine', 'rodia', 'ryloth', 'geonosis', 
        'utapau', 'naboo', 'dagobah', 'sullust', 
        'mustafar', 'bespin', 'hoth', 'endor', 
        'dathomir', 'mandalore', 'kashyyyk', 'malastare', 
        'dantooine', 'mygeeto', 'illum', 'ord_mantell', 
        'alderaan', 'cato_nemodia', 'corellia', 'coruscant', 
    ];
    
    var imp_systems = [
        'corellia', 'mandalore', 'mygeeto', 'sullust', 
        'saleucami', 'mustafar', 'rodia'
    ];
    
    var probe_deck = [];
    var probe_hand = [];
    var initial_hand = [];
    var rebel_base = "";
    var basic_game = false;
    var log_messages_count = 0;
    
    var systems_white = [];
    var systems_green = [];
    var systems_red = [];
    
    var logMessage = function(message) {
        log_messages_count++;
        var log_html = '<div class="log-message">#' + log_messages_count + ': ' + message + '</div>';
        var log_container = document.querySelector('#log_messages');
        if (log_container) {
            log_container.insertAdjacentHTML('afterbegin', log_html);
        }
    };

    var InitCards = function(){
        probe_deck = cloneArray(systems);
        removeFromArray(probe_deck, 'coruscant');
        shuffleArray(probe_deck);
    };
    
    var InitBasic = function(){
        DrawCard('mandalore');
        DrawCard('saleucami');
        DrawCard('corellia');
        DrawCard('sullust');
        DrawCard('mustafar');
        basic_game = true;
        initial_hand = cloneArray(probe_hand);
        logMessage("Basic game started.");
    };
    
    var InitAdvanced = function(){
        
        shuffleArray(imp_systems);
        imp_systems = imp_systems.slice(0, 5);
        for(var i=0; i<imp_systems.length; i++){
            DrawCard(imp_systems[i]);
        }
        
        basic_game = false;
        initial_hand = cloneArray(probe_hand);
        logMessage("Advanced game started.");
    };
    
    var DrawCard = function(name){
        
        var text_zone = document.querySelector('#text_zone');
        if(probe_deck.length > 0){
            
            var card = "";
            if(name){
                card = name
                removeFromArray(probe_deck, card);
            }else{
                card = probe_deck.shift();
            }
            
            probe_hand.push(card);
            probe_hand.sort();
            var message = 'Imperial player drew: ' + card;
            if(text_zone) text_zone.innerHTML = message;
            logMessage(message);
        }else{
            var message = 'No card left in the deck!';
            if(text_zone) text_zone.innerHTML = message;
            logMessage(message);
        }
    };
    
    var RefreshCardList = function(){
        var html = "";
        for(var i=0; i<probe_hand.length; i++){
            html += '<div class="card-line">' + probe_hand[i] + '</div>';
        }
        var display_area = document.querySelector('#display_area');
        if(display_area) display_area.innerHTML = html;

        var hand_count = document.querySelector('#hand_count');
        if(hand_count) hand_count.innerHTML = probe_hand.length + "/" + (probe_hand.length + probe_deck.length);
    };

    var GuessBase = function(){
        var guess_select = document.querySelector('#guess_select');
        var selected = guess_select ? guess_select.value : "";
        if(guess_select) guess_select.value = "";
        
        if(selected){
            var message = "";
            if(selected == rebel_base){
                message = "Well played! " + selected + " is the rebel base! The force is strong with you.";
            }else{
                message = selected + " is not the rebel base!";
            }
            var text_zone = document.querySelector('#text_zone');
            if(text_zone) text_zone.innerHTML = message;
            logMessage("Imperial player guessed " + selected + ". Result: " + message);
        }
    };
    
    var UpdateSystemColors = function(){
        
        systems_white = [];
        systems_green = [];
        systems_red = [];
        
        var map_selectors = document.querySelectorAll('.map-selector');
        map_selectors.forEach(function(system){
            if(system.classList.contains('red')){
                systems_red.push(system.id);
            }
            if(system.classList.contains('white')){
                systems_white.push(system.id);
            }
            if(system.classList.contains('green')){
                systems_green.push(system.id);
            }
        });
    }
    
    var RelocateBase = function(nb_card){
        
        var nbCard = nb_card || 32;
        old_base = rebel_base;
        
        //Find new rebel base
        var rebel_hand = [];
        for(var i=0; i<nbCard; i++){
            if(probe_deck.length > 0){
                var card = probe_deck.shift();
                rebel_hand.push(card);
            }
        }
        
        //Check at base colors
        UpdateSystemColors();
        
        //Find best card in rebel hand
        var best_card = "";
        var isGreen = false;
        for(var i=0; i<rebel_hand.length; i++){
            var card = rebel_hand[i];
            if(systems_green.indexOf(card) >= 0){
                best_card = card;
                isGreen = true;
            }
            if(!isGreen && systems_white.indexOf(card) >= 0){
                best_card = card;
            }
        }
        
        //Set back in deck
        for(var i=0; i<rebel_hand.length; i++){
            var card = rebel_hand[i];
            if(card !== best_card){
                probe_deck.push(card);
            }
        }
        
        console.log("Cards drawn");
        console.log(rebel_hand);
        console.log("Base selected");
        console.log(best_card);
        
        //Set new rebel base
        if(best_card){
            rebel_base = best_card;
            if(old_base){
                probe_hand.push(old_base); //Push old base in probe_deck or probe_hand ???
                probe_hand.sort();
            }
        }
        
        // Text 
        var message = "";
        if(rebel_base !== old_base){
            message = "A new base has been established for the rebel player!" + ( old_base ? " Previous base: " + old_base : "");
            logMessage("Rebel player relocated the base.");
        }else{
            message = "The rebel player failed at establishing a new base.";
            logMessage(message);
        }
        var text_zone = document.querySelector('#text_zone');
        if(text_zone) text_zone.innerHTML = message;
        
        RefreshCardList();
    };

    var RefreshRelocateBase = function(){
        
        var systems_ctl = [
            {id: 'mon_calamari', top: '9%', left: '15%', size: '5%'},
            {id: 'yavin', top: '38%', left: '10%', size: '5%'},
            {id: 'felucia', top: '28%', left: '18%', size: '5%'},
            {id: 'saleucami', top: '27%', left: '27%', size: '5%'},
            
            {id: 'kessel', top: '13%', left: '32%', size: '5%'},
            {id: 'nal_hutta', top: '11%', left: '42%', size: '5%'},
            {id: 'toydaria', top: '27%', left: '38%', size: '5%'},
            {id: 'bothawui', top: '20%', left: '50%', size: '5%'},
            
            {id: 'tatooine', top: '5%', left: '66%', size: '5%'},
            {id: 'rodia', top: '24%', left: '62%', size: '5%'},
            {id: 'ryloth', top: '5%', left: '82%', size: '5%'},
            {id: 'geonosis', top: '14%', left: '75%', size: '5%'},
            
            {id: 'utapau', top: '27%', left: '88%', size: '5%'},
            {id: 'naboo', top: '39%', left: '68%', size: '5%'},
            {id: 'dagobah', top: '51%', left: '78%', size: '5%'},
            {id: 'sullust', top: '63%', left: '71%', size: '5%'},
            
            {id: 'mustafar', top: '52%', left: '89%', size: '5%'},
            {id: 'bespin', top: '72%', left: '83%', size: '5%'},
            {id: 'hoth', top: '71%', left: '93%', size: '5%'},
            {id: 'endor', top: '87%', left: '85%', size: '5%'},
            
            {id: 'dathomir', top: '56%', left: '22%', size: '5%'},
            {id: 'mandalore', top: '53%', left: '31%', size: '5%'},
            {id: 'kashyyyk', top: '50%', left: '40%', size: '5%'},
            {id: 'malastare', top: '48%', left: '55%', size: '5%'},
            
            {id: 'dantooine', top: '65%', left: '4%', size: '5%'},
            {id: 'mygeeto', top: '76%', left: '12%', size: '5%'},
            {id: 'illum', top: '88%', left: '19%', size: '5%'},
            {id: 'ord_mantell', top: '81%', left: '27%', size: '5%'},
            
            {id: 'alderaan', top: '74%', left: '38%', size: '5%'},
            {id: 'cato_nemodia', top: '66%', left: '58%', size: '5%'},
            {id: 'corellia', top: '83%', left: '65%', size: '5%'},
        ];
        
        var html = '<span id="coruscant" class="map-selector-static red" style="top:89%;left:50%;width:5%;height:5%;"></span>';
        for(var i=0; i<systems_ctl.length; i++){
            var sys = systems_ctl[i];
            html += '<span id="' + sys.id + '" class="map-selector white"'
                + ' style="top:' + sys.top + ';left:' + sys.left + ';width:' + sys.size + ';height:' + sys.size + ';"></span>';
        }
        
        var map_controls = document.querySelector('#map_controls');
        if (map_controls) map_controls.innerHTML = html;
        
        //Initial red
        for(var i=0; i<initial_hand.length; i++){
            var system_el = document.querySelector('#' + initial_hand[i]);
            if (system_el) {
                system_el.classList.remove('white');
                system_el.classList.add('red');
            }
        }
        
        var map_selectors = document.querySelectorAll('.map-selector');
        map_selectors.forEach(function(selector) {
            selector.addEventListener('click', function(event) {
                var self = event.currentTarget;
                if(self.classList.contains('white')){
                    self.classList.remove('white');
                    self.classList.add('green');
                }
                else if(self.classList.contains('green')){
                    self.classList.remove('green');
                    self.classList.add('red');
                }
                else if(self.classList.contains('red')){
                    self.classList.remove('red');
                    self.classList.add('white');
                }
            });
        });
    };
    
    var ShowCards = function(){
        var card_zone = document.querySelector('#card_zone');
        if(card_zone) card_zone.style.display = 'block';
        var map_zone = document.querySelector('#map_zone');
        if(map_zone) map_zone.style.display = 'none';
        var action_zone = document.querySelector('#action_zone');
        if(action_zone) action_zone.style.display = 'block';
        var map_buttons = document.querySelector('#map_buttons');
        if(map_buttons) map_buttons.style.display = 'none';
        var text_zone_top = document.querySelector('#text_zone_top');
        if(text_zone_top) text_zone_top.style.display = 'none';

        if(!rebel_base){
            var text_zone = document.querySelector('#text_zone');
            if(text_zone) text_zone.innerHTML = "WARNING! There is currently no rebel base. Please click on relocate base to select a new base for the rebels.";
        }
    };
    
    var ShowMap = function(){
        var card_zone = document.querySelector('#card_zone');
        if(card_zone) card_zone.style.display = 'none';
        var map_zone = document.querySelector('#map_zone');
        if(map_zone) map_zone.style.display = 'block';
    };

    var StartGame = function(){
        
        RefreshRelocateBase(true);
        RefreshCardList();
        
        var start_zone = document.querySelector('#start_zone');
        if (start_zone) start_zone.style.display = 'none';
        
        //Init guess select
        var guess_systems = cloneArray(systems);
        guess_systems.sort();
        var guess_select = document.querySelector('#guess_select');
        if (guess_select) {
            var empty_option = document.createElement('option');
            empty_option.value = '';
            empty_option.text = '';
            guess_select.appendChild(empty_option);

            guess_systems.forEach(function (system) {
                var option = document.createElement('option');
                option.value = system;
                option.text = system;
                guess_select.appendChild(option);
            });
        }
        
        //Text
        var action_zone = document.querySelector('#action_zone');
        if (action_zone) action_zone.style.display = 'none';
        var map_buttons = document.querySelector('#map_buttons');
        if (map_buttons) map_buttons.style.display = 'block';
        var text_zone_top = document.querySelector('#text_zone_top');
        if (text_zone_top) {
            text_zone_top.style.display = 'block';
            text_zone_top.innerHTML = "Waiting for rebel base selection...";
        }
        
        //Text
        var html = "<div>Imperial player starting cards: </div><ul>";
        for(var i=0; i<initial_hand.length; i++){
            html += "<li>" + initial_hand[i] + "</li>";
        }
        html += "</ul>";
        var text_zone = document.querySelector('#text_zone');
        if(text_zone) text_zone.innerHTML = html;
    };
    
    // ---- Special cards --------
    
    function InterrogationDroid(){
        
        var planets = [];
        previousPick = rebel_base;
        planets.push(rebel_base);
        
        //Check at base colors
        UpdateSystemColors();
        
        //Add 2 greens
        if(systems_green.length > 0){
            for(var i=0; i<4; i++){
                var pick = systems_green[Math.floor(Math.random()*systems_green.length)];
                if(planets.indexOf(pick) == -1){
                    planets.push(pick);
                }
            }
        }
        
        //Add 2 whites
        if(systems_white.length > 0){
            for(var i=0; i<4; i++){
                var pick = systems_white[Math.floor(Math.random()*systems_white.length)];
                if(planets.indexOf(pick) == -1){
                    planets.push(pick);
                }
            }
        }
        
        //Add 2 reds
        if(systems_red.length > 0){
            for(var i=0; i<4; i++){
                var pick = systems_red[Math.floor(Math.random()*systems_red.length)];
                if(planets.indexOf(pick) == -1){
                    planets.push(pick);
                }
            }
        }
        
        //Get 3 first and shuffle
        planets = planets.slice(0, 3);
        shuffleArray(planets);
        
        var planets_str = planets.toString().replace(/\,/g, ', ');
        var message = "Interrogation Droid: " + planets_str;
        var text_zone = document.querySelector('#text_zone');
        if(text_zone) text_zone.innerHTML = message;
        logMessage(message);
    }
    
    function InterceptTransmission(){
        var hand = [];
        var new_cards = [];
        
        UpdateSystemColors();
        
        for(var i=0; i<8; i++){
            var card = probe_deck.shift();
            if(card){
                hand.push(card);
            }
        }
        
        for(var i=0; i<hand.length; i++){
            var card = hand[i];
            
            if(systems_red.indexOf(card) >= 0){
                probe_hand.push(card);
                new_cards.push(card);
            }
            else{
                probe_deck.push(card);
            }
            
        }
        
        probe_hand.sort();
        shuffleArray(probe_deck);
        RefreshCardList();
        ShowCards();
        
        var planets_str = new_cards.toString().replace(/\,/g, ', ');
        var message = "Intercept Transmission: new cards (" + new_cards.length + "/" + hand.length +"): " + planets_str;
        if(new_cards.length == 0){
            message = "Intercept Transmission: No imperial card drawn! Sorry!";
        }
        var text_zone = document.querySelector('#text_zone');
        if(text_zone) text_zone.innerHTML = message;
        logMessage(message);
    }
    
    function HomingBeacon(){
        for(var i=0; i<systems.length; i+=4){
            var tempList = systems.slice(i, i+4);
            if(tempList.indexOf(rebel_base) >= 0){
                var planets_str = tempList.toString().replace(/\,/g, ', ');
                var message = "Homing Beacon: selected region: " + planets_str;
                var text_zone = document.querySelector('#text_zone');
                if(text_zone) text_zone.innerHTML = message;
                logMessage(message);
            }
        }
    }

    // ------ UI Event Listeners -----
    document.querySelector('#start_btn').addEventListener('click', function(){
        InitCards();
        InitBasic();
        StartGame();
        ShowMap();
    });

    document.querySelector('#start_advanced_btn').addEventListener('click', function(){
        InitCards();
        InitAdvanced();
        StartGame();
        ShowMap();
    });

    document.querySelector('#new_game').addEventListener('click', function(){
        var confirmed = confirm("Start a new game?");
        if(confirmed){
            window.location.reload();
        }
    });

    document.querySelector('#draw_btn').addEventListener('click', function(){
        DrawCard();
        RefreshCardList();
        
        var draw_btn = document.querySelector('#draw_btn');
        if(draw_btn) draw_btn.style.display = 'none';
        setTimeout(function(){
            if(draw_btn) draw_btn.style.display = 'block';
        }, 1000);
    });

    document.querySelector('#guess_btn').addEventListener('click', function(){
        GuessBase();
    });

    document.querySelector('#relocate_btn').addEventListener('click', function(){
        ShowMap();
        var action_zone = document.querySelector('#action_zone');
        if(action_zone) action_zone.style.display = 'none';
        var map_buttons = document.querySelector('#map_buttons');
        if(map_buttons) map_buttons.style.display = 'block';
        var text_zone_top = document.querySelector('#text_zone_top');
        if(text_zone_top) {
            text_zone_top.style.display = 'block';
            text_zone_top.innerHTML = "Waiting for rebel base selection...";
        }
        var text_zone = document.querySelector('#text_zone');
        if(text_zone) text_zone.innerHTML = "";
    });

    document.querySelectorAll('.tab').forEach(function(tab) {
        tab.addEventListener('click', function(event) {
            document.querySelectorAll('.action-option').forEach(function(el){ el.style.display = 'none'; });
            document.querySelectorAll('.tab').forEach(function(el){ el.classList.remove('selected'); });

            var self = event.currentTarget;
            self.classList.add('selected');
            var action_tab = document.querySelector('#action_' + self.id);
            if(action_tab) action_tab.style.display = 'block';
        });
    });

    document.querySelector('#view_cards').addEventListener('click', function(){
       ShowCards(); 
    });
    
    document.querySelector('#view_map').addEventListener('click', function(){
       ShowMap(); 
    });
    
    document.querySelector('#the_map_link').addEventListener('click', function(){
       ShowMap(); 
    });
    
    //Special cards
    document.querySelector('#interrogation_btn').addEventListener('click', function(){
        InterrogationDroid();
    });
    
    document.querySelector('#intercept_btn').addEventListener('click', function(){
        InterceptTransmission(); 
    });
    
    document.querySelector('#homing_btn').addEventListener('click', function(){
        HomingBeacon(); 
    });
    
    
    // --------- Right section UI ---------
    
    document.querySelector('#map_btn_all').addEventListener('click', function(){
        RelocateBase();
        ShowCards();
        shuffleArray(probe_deck);
    });
    
    document.querySelector('#map_btn_4').addEventListener('click', function(){
        RelocateBase(4);
        ShowCards();
    });
    
    document.querySelector('#map_btn_8').addEventListener('click', function(){
        RelocateBase(8);
        ShowCards();
    });
    
    document.querySelector('#map_btn_cancel').addEventListener('click', function(){
        ShowCards();
    });
    
};

window.addEventListener("load", function(){
   var swr = new StarWarsRebellionSolo();
});
