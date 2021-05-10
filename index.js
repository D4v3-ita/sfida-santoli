function davideJS(){
    // inizializzazione variabili che contengono id di elementi html e contatori
    var davideContenitore = document.getElementById('davideContenitore');
    var davideFooter = document.getElementById('footer');
    var davideRegole = document.getElementById('davideRegole');
    var davideGioca = document.getElementById('davideGioca');
    var davideSxGiocando = document.getElementById('davideSxGiocando');
    var davideDxGiocando = document.getElementById('davideDxGiocando');
    var davideBersaglio = document.getElementById('davideBersaglio');
    var davideContieneCaricamento = document.getElementById('davideContieneCaricamento');
    var davideContienePerso = document.getElementById('davideContienePerso');
    var davideContieneVinto = document.getElementById('davideContieneVinto');
    var davideRiprovaP = document.getElementById('davideRiprovaP');
    var davideRiprovaV = document.getElementById('davideRiprovaV');

    var davideClickPunti = 0;
    var davideClickSbagliati = 0;
    var davideClickPercentuale = 0;

    // scriviamo un numero basso in modo che il bersaglio non si velocizzi subito
    var davideBersVelocita = 0.12;
    var davTempoIniz, davTempoTrascorso;
    // posizione di partenza del bersaglio
    var davCoordX = 0;
    var davCoordY = 0;
    var davBersPasso = 1;

    // si muoverà ogni volta di 1
    var dx = davBersPasso;
    var dy = davBersPasso;
    // altezza e larghezza del contenitore
    var cH = davideSxGiocando.offsetHeight;
    var cW = davideSxGiocando.offsetWidth;

    // otteniamo così la dimensione del div che si rimpicciolerà
    var davideBersWidth = $(".davideBersaglio").width();
    var davideBersHeight = $(".davideBersaglio").height();

    // impostiamo il timer per farlo partire e per resettarlo
    var davFifteenSeconds = 10, davTimerDisplay = document.querySelector('#time');
    var davResetTimer;

    // nasconde le schermate seguenti per mostrare la pagina iniziale
    davideContenitore.style.display = '';
    davideFooter.style.display = '';
    davideGioca.style.display = 'none';
    davideBersaglio.style.display = 'none';
    davideSxGiocando.style.display = 'none';
    davideDxGiocando.style.display = 'none';
    davideContieneCaricamento.style.display = 'none';
    davideContienePerso.style.display = 'none';
    davideContieneVinto.style.display = 'none';
    davideRiprovaP.style.display = 'none';
    davideRiprovaV.style.display = 'none';
    document.getElementById('davidePunteggioPercentuale').style.display = 'none';
    document.getElementById('davideSiMaContieniti').style.display = 'none'


    // quando il bottone viene premuto passa alle regole del gioco, nasconde il pulsante cliccato e mostra il successivo
    davideRegole.addEventListener('click', function(){
        davideRegole.style.display = 'none';
        davideGioca.style.display = '';
    });

    // quando il bottone viene premuto mostra il caricamento
    davideGioca.addEventListener('click', function(){
        davideGioca.style.display = 'none';
        // compare la pagina di caricamento e quando avrà finito di caricare comparirà la schermata seguente 
        davideContieneCaricamento.style.display = '';
        davideFunctionCaricamento();
        setTimeout(function(){ 
            davideFinestraDiGioco(davideBersaglio);
        }, 9000);

    });


    // progress bar per il caricamento
    function davideFunctionCaricamento(){
        var davideContatoreCaricam = 7;
        var davideCaricamento = setInterval(function(){
        if(davideContatoreCaricam <= 0){
            clearInterval(davideCaricamento);
        }
        document.getElementById("davProgressBar").value = 7 - davideContatoreCaricam;
        davideContatoreCaricam -= 1;
        }, 1000);

        // generiamo le freddure che compariranno, secondo estrazione casuale, durante il caricamento
        davideGeneratFreddure('davideFreddure');
    }


    // generiamo le freddure che compariranno, secondo estrazione casuale, durante il caricamento
    function davideGeneratFreddure(){
        let davfreddura1 = 'Due casseforti si incontrano per strada. Che combinazione!';
        let davfreddura2 = 'I videogames mi hanno rovinato la vita. Per fortuna ne ho altre due!';
        let davfreddura3 = 'Ogni mattina mi alzo e dico 20 volte ciao. Dicono che è salutare';
        let davfreddura4 = 'Ragazza stufa scappa di casa. Genitori morti dal freddo';

        let davEstratto = Math.round(Math.random()*3);
        switch (davEstratto) {
            case 0:
                document.getElementById('davideFreddure').innerHTML = davfreddura1;
                break;
            case 1:
                document.getElementById('davideFreddure').innerHTML = davfreddura2;
                break;
            case 2:
                document.getElementById('davideFreddure').innerHTML = davfreddura3;
                break;
            case 3:
                document.getElementById('davideFreddure').innerHTML = davfreddura4;
                break;
        }
    }



    // calcola quante volte hai cliccato sul bersaglio, quante volte clicchi fuori e la percentuale
    $(document).ready(function() {
        
        $('#davideBersaglio').on('click', function() {

            movement();

            davideClickPunti++;
            // questo serve perchè i div sono annidati, quindi aumenterebbero entrambi ...
            // ... invece così i click sbagliati rimangono invariati
            davideClickSbagliati--;
            document.getElementById('davidePunteggioRealizzato').innerHTML = davideClickPunti;
            document.getElementById('davidePunteggioPercentuale').style.display = '';

            // ad ogni click si resetta il timer
            clearInterval(davResetTimer);
            startDavideTimer(davFifteenSeconds, davTimerDisplay);

            if(davideClickPunti==16){
                davideHaiVinto();
            }

        });

        // ogni volta che si clicca il bersaglio, diminuisce da ambo i lati
        $(".davideBersaglio").click(function(){
            $(".davideBersaglio").width(davideBersWidth-=4);
            $(".davideBersaglio").height(davideBersHeight-=4);
        });


    
        $('#davideSxGiocando').on('click', function() {
            davideClickSbagliati++;
            document.getElementById('davidePunteggioSbagliato').innerHTML = davideClickSbagliati;
            document.getElementById('davidePunteggioPercentuale').style.display = '';
        });


        // calcola la percentuale e aggiorna il tutto ogni mezzo secondo
        setInterval(function(){
            davideClickPercentuale = (100/(davideClickSbagliati+davideClickPunti))*davideClickPunti;
            document.getElementById('davidePunteggioPercentuale').innerHTML = Math.round(davideClickPercentuale);
        }, 500)

    })
    
    // gestiamo il movimento del div nell'area di gioco
    function movement() {
        /* sto dicendo al browser che ci sarà un'animazione, 
            data dalla funzione muoviDavideBersaglio */
        requestAnimationFrame(muoviDavideBersaglio);
    
        davideBersVelocita = Math.round((davideBersVelocita+0.03) * 100) / 100;
    
        /* controlliamo la posizione del bersaglio, quindi controlla 
           anche se è fuori dal div che lo contiene */
        function davideBersaglioFuori() {
          if (davCoordX + davideBersWidth >= cW) dx = -davBersPasso;
          if (davCoordX <= 0) dx = davBersPasso;
          if (davCoordY + davideBersHeight >= cH) dy = -davBersPasso;
          if (davCoordY <= 0) dy = davBersPasso;
        }
        
        // muove la palla con le coordinate
        function muoviDavideBersaglio(timestamp) {
          
          // misuriamo il tempo
          if (!davTempoIniz) {davTempoIniz = timestamp;}
          davTempoTrascorso = timestamp - davTempoIniz;
          davTempoIniz = timestamp;
    
          // permettiamo alla palla di muoversi secondo i tempi da noi dati
          davCoordX += dx * davTempoTrascorso * davideBersVelocita;
          davCoordY += dy * davTempoTrascorso * davideBersVelocita;
        
          
          davideBersaglio.style.transform = "translate(" + davCoordX + "px, " + davCoordY + "px)";
    
          davideBersaglioFuori();
    
          requestAnimationFrame(muoviDavideBersaglio);
        }
      }


    // appare la schermata di gioco dove si muoverà il div
    // viene mostrato il bersaglio, che viene passato come parametro nella funzione per usarlo
    function davideFinestraDiGioco(davideBersaglio) {
        davideContieneCaricamento.style.display = 'none';
        davideContenitore.style.display = 'none';

        davideSxGiocando.style.display = '';
        davideDxGiocando.style.display = '';
        davideBersaglio.style.display = '';

        
        // facciamo partire il timer
        startDavideTimer(davFifteenSeconds, davTimerDisplay);
    }


    // timer per conto alla rovescia 
    function startDavideTimer(duration, davTimerDisplay) {
        var davTimer = duration, davSeconds;
        davResetTimer = setInterval(function () {
            davSeconds = parseInt(davTimer, 10);

            davSeconds = davSeconds < 2 ? davSeconds : davSeconds;

            davTimerDisplay.textContent = davSeconds;

            if (--davTimer < 0) {
                davTimer = duration;
                // quando il timer arriva a 0 compare la schermata di Game Over
                davideHaiPerso(davideClickPunti);
            }
        }, 1000);
    }


    // mostro la schermata di Game Over
    function davideHaiPerso(davideClickPunti){
        davideContenitore.style.display = 'none';
        davideFooter.style.display = 'none';
        davideContienePerso.style.display = '';
        davideRiprovaP.style.display = '';
        document.getElementById('davidePunteggioRealizzatoFine').innerHTML = davideClickPunti;
    }


    function davideHaiVinto(){
        davideContenitore.style.display = 'none';
        davideFooter.style.display = 'none';
        davideContieneVinto.style.display = '';
        davideRiprovaV.style.display = '';
    }


    // e dai sto cinque al gioco
    $(".davideDammiIl5").click(function(){
        document.getElementById('davideSiMaContieniti').style.display = '';
    });



    // per ricominciare ricaricherà la pagina iniziale
    davideRiprovaP.addEventListener('click', function(){
        window.location.reload();
    });
    davideRiprovaV.addEventListener('click', function(){
        window.location.reload();
    });

}

// eseguiamo la funzione soprastante
davideJS();