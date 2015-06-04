//wait for document to be ready before executing code
$('document').ready(function() {

		function positionMole() {
			var posx = (Math.random() * ($('#mole-field').width() - 150)).toFixed();
    		var posy = (Math.random() * ($('#mole-field').height() - 150)).toFixed();
    		console.log(posx);
    		console.log(posy);
			//position each .hole div at a random location within the mole-field
			$('.hole').css({
        		'position':'relative',
        		'left':posx+'px',
        		'top':posy+'px',
    		});
    		$('.hole').removeClass('invisible');
		}

		function disappearMole() {
			//make mole disappear when clicked
			$('.hole').click(function(event) {
				event.preventDefault();
				$('.hole').addClass('invisible');
				clicked = true;
			});
			return clicked;
		}

		function renderScore(){ 
			$('#score').html('Score: ' + score);
		}

		function doGame() {
			score = 0;
			//hide start button behind countdown clock
			$('#start').css('z-index', '0');
			//COUNTDOWN CLOCK
			var timerInterval = setInterval(function() {
				clock -= 1;
				$('.timer').html(clock+' sec');
				if (clock == 0) {
					clearInterval(timerInterval);
					clearInterval(intervalMole);
					$('.hole').addClass('invisible');
					clock = 31;
					score = 0;
					ended = true;
					startGame();
				}
			}, 1000);
			//game loop:
			var intervalMole = setInterval(function() {
				positionMole();
				clicked = disappearMole();
				if(clicked == true) {
					score++;
					clicked = false;
				}
				renderScore();
			}, 899);
			return ended;
		}

		function startGame() {
			if(ended == false) 
				doGame();
			else 
				$('#start').css('z-index', '100');
            	$('#start').html('Play Again');
            	ended = false;
            	clearInterval(timerInterval);
            	clock = 31;
            	score = 0;
            	$('#start').on("click", startGame);
			
		}
		//Initialize variables, display start button.
		var score = 0;
		var clock = 31; //seconds
		var clicked = false;
		var playGame = false;
		var ended = false;

		$('#btnStart').html('<button id="start" class="btn btn-success">Start Game</button>');
		$('#start').on("click", startGame);
});
