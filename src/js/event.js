$(document).ready(function() {

  var game;
  var frame;

  function Roll(ballNumber, pinsLeft){
    frame.updateResult(frame._roll(pinsLeft));
    $("#ball"+ballNumber+"-Frame"+game._frameNumber).html(frame._results[ballNumber-1]);
  }

  function additionalRoll(ballNumber, pinsLeft){
    frame.updateResult(frame._roll(pinsLeft));
    $("#add"+ballNumber+"-lastframe").html(frame._results[frame._results.length-1]);
  }

  function printResults(){
    if (game._frameNumber>1 && game._frameNumber<10){
      $("#result-frame-" + (game._frameNumber-1)).html(game._frameScore[game._frameNumber-2]);
      $("#total").html(game._finalScore(game._frameScore));
    } else if (game._frameNumber===10) {
      $("#result-frame-" + (game._frameNumber-1)).html(game._frameScore[game._frameNumber-2]);
      $("#result-frame-" + (game._frameNumber)).html(game._frameScore[game._frameNumber-1]);
      $("#total").html(game._finalScore(game._frameScore));
    }
  }

  function printResultsBeforeLastGame(){
    $("#result-frame-" + (game._frameNumber-1)).html(game._frameScore[game._frameNumber-2]);
    $("#total").html(game._finalScore(game._frameScore));
  }

  function printResultsLastGame(){
    $("#result-frame-" + (game._frameNumber)).html(game._frameScore[game._frameScore.length-1]);
    $("#total").html(game._finalScore(game._frameScore));
  }

  function calculateResult(){
    game.getFrameRegularResult(frame);
    game.getFrameBonusResult(frame);
    game.saveLastGameStrikeSpareStatus(frame);
  }

  function gameType(){
    if (game._finalScore(game._frameScore)===210){
      $("#game-type").html("Perfect Game")
      $("#total").html(300)
    } else if (game._finalScore(game._frameScore)===0){
      $("#game-type").html("Gutter Game")
    }
  }

  $("#ball-1").hide();
  $("#ball-2").hide();
  $("#ball-add1").hide();
  $("#ball-add2").hide();
  $("#10frame_add1").hide();
  $("#10frame_add2").hide();
  $("#game-over").hide();

  $("#play-new-game").click(function(){
    game = new Game()
    $(this).hide();
    frame = game.createNewFrame();
    $("#ball-1").show();
  });

  $("#ball-1").click(function(){
    $(this).hide();
    Roll(1, frame.INITIALSTANDINGPINS)
    frame.checkStrike();
    if (game._frameNumber<10){
      if (frame.getStrikeStatus()==="yes"){
        calculateResult();
        printResults();
        frame = game.createNewFrame();
        $("#ball-1").show();
      } else {
        $("#ball-2").show();
      }
    } else if(game._frameNumber===10){
      if(frame.getStrikeStatus()==="yes"){
        $("#ball-add1").show()
        $("#10frame_add1").show();
        calculateResult();
        printResults();
      } else {
        $("#ball-2").show();
      }
    } else {
      $("#play-new-game").show();
    }
  });

  $("#ball-2").click(function(){
    $(this).hide();
    Roll(2, frame.INITIALSTANDINGPINS-frame._results[0]);
    frame.checkSpare();
    if (game._frameNumber<10){
      calculateResult();
      printResults();
      frame = game.createNewFrame();
      $("#ball-1").show();
    } else if (game._frameNumber===10 && frame.getSpareStatus()==="yes") {
      $("#10frame_add1").show();
      $("#ball-add1").show();
      calculateResult();
      printResultsBeforeLastGame();
    } else {
      calculateResult();
      printResults();
      gameType();
      $("#game-over").show();
    }
  });

  $("#ball-add1").click(function(){
    additionalRoll(1, frame.INITIALSTANDINGPINS);
    $(this).hide();
    if (frame.getStrikeStatus() === 'yes'){
      game.updateLastGameResults(frame);
      $("#ball-add2").show();
      $("#10frame_add2").show();
    } else {
      game.updateLastGameResults(frame);
      printResultsLastGame();
      $("#game-over").show();
    }
  });

  $("#ball-add2").click(function(){
    $(this).hide();
    if (frame._results[frame._results.length-1]===10){
      leftPins = frame.INITIALSTANDINGPINS
    } else {
      leftPins = frame.INITIALSTANDINGPINS - frame._results[frame._results.length-1]
    }
    additionalRoll(2, leftPins);
    game.updateLastGameResults(frame);
    printResultsLastGame();
    gameType();
    $("#game-over").show();
  });
});
