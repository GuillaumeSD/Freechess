/*
 This file is part of Leela Chess Zero.
 Copyright (C) 2018 The LCZero Authors

 Leela Chess is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 Leela Chess is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with Leela Chess.  If not, see <http://www.gnu.org/licenses/>.
 */


function openTab(evt, tabname) {
  $('.tabcontent').hide();
  $('.tablinks').removeClass('active');
  $('#' + tabname).show();
  evt.currentTarget.className += ' active';
}


var Controller = function() {
  const kStateOff = 0;
  const kStateReady = 1;
  const kStateRunning = 2;
  const kStateCancelling = 3;
  const kStateReplacing = 4;

  const kModePlay = 0;
  const kModeAnalysis = 1;

  const kRegexBestMove = /^bestmove ([a-h][1-8])([a-h][1-8])([nbrq])?/;
  const kRegexResult = / ([^\r\n ]+)[\r\n ]*$/;
  const kRegexBasename = /^([^.]*)\..*$/;

  const kOutcomeWhiteWon = {loser: 'b', mnemo: '1-0', text: 'Win wins'};
  const kOutcomeBlackWon = {loser: 'w', mnemo: '0-1', text: 'Black wins'};
  const kOutcomeDraw = {mnemo: '1/2-1/2', text: 'Draw'};

  const kOutcomes = [
    kOutcomeWhiteWon,
    kOutcomeBlackWon,
    kOutcomeDraw,
  ];

  const kOutcomeForLoser = {};
  const kOutcomeForMnemo = {};

  kOutcomes.forEach(function(outcome) {
    if (outcome.loser) kOutcomeForLoser[outcome.loser] = outcome;
    kOutcomeForMnemo[outcome.mnemo] = outcome;
  });


  function Controller() {
    var cfg = {
      draggable: true,
      showNotation: true,
      position: 'start',
      onDragStart: this.onDragStart.bind(this),
      onDrop: this.onDrop.bind(this),
      onSnapEnd: this.onSnapEnd.bind(this)
    };

    $('input:radio[name="mode"]').change(this.modeChanged.bind(this));

    this.board = ChessBoard('board', cfg);
    $('#startBtn').on('click', this.startpos.bind(this));
    $('#flipBtn').on('click', this.board.flip);
    $('#goBtn').on('click', this.go.bind(this));
    $('#stopBtn').on('click', this.stop.bind(this));
    $('#error').on('click', this.hideError.bind(this));

    $('#playWhiteBtn').on('click', this.playWhite.bind(this));
    $('#playBlackBtn').on('click', this.playBlack.bind(this));
    $('#takebackBtn').on('click', this.takeback.bind(this));
    $('#resignBtn').on('click', this.resign.bind(this));

    $('#navBegBtn').on('click', this.navigateBegin.bind(this));
    $('#navBckBtn').on('click', this.navigateBack.bind(this));
    $('#navFwdBtn').on('click', this.navigateForward.bind(this));
    $('#navEndBtn').on('click', this.navigateEnd.bind(this));

    $('#loadPgnBtn').on('click', function() {
      $('#pgnToLoad').click();
    });
    $('#pgnToLoad').change(this.loadPgn.bind(this));

    $('#applyParams').on('click', this.applyParams.bind(this));
    $('#logs').change(this.displayLogChanged.bind(this));

    $('#popup').find('*').on('click', function() {
      $('#popup').removeClass('show-modal');
    });

    this.populateNetworks();
    $('#applyNetwork').on('click', this.applyNetwork.bind(this));

    this.output = document.getElementById('output');

    this.game = new Chess();
    this.moveList = [];
    this.moveIndex = 0;

    this.playGoCmd = 'go movetime 5000';

    this.createEngine();

    this.mode = kModePlay;
    this.humanSide = 'w';

    this.updateButtons();
    this.updateStatus();
  }

  Controller.prototype = {

    startpos() {
      this.game.reset();
      this.board.start(true);
      this.moveList = [];
      this.moveIndex = 0;
      this.gameResult = null;

      // reset to white
      if (this.mode == kModePlay) this.humanSide = 'w';

      this.updateButtons();
      this.updateStatus();
    },


    populateNetworks() {
      var urls = null;
      $.ajax({
        url: 'networks.txt',
        async: false,
        success: function(text) {
          urls = text.split(/\r?\n/);
        }
      });
      for (var i = 0; i < urls.length; i++) {
        var url = urls[i];
        if (!url || url.length == 0) continue;
        var match = url.match(kRegexBasename);
        var label = match ? match[1] : url;
        $('#network')
            .append($('<option></option>').attr('value', url).text(label));
        if (i == 0) this.weightsUrl = url;
      }
    },

    modeChanged() {
      var selected = $('input[type=\'radio\'][name=\'mode\']:checked');
      var newMode = selected.val() == 'play' ? kModePlay : kModeAnalysis;
      if (newMode == this.mode) return;
      this.mode = newMode;
      if (this.mode == kModePlay) {
        this.humanSide = this.game.turn();
        this.cancelSearch();
      } else {
        this.humanSide = null;
        this.cancelSearch();
      }
      this.updateButtons();
    },

    applyParams() {
      var selected = $('input[type=\'radio\'][name=\'go\']:checked');
      if (selected.val() == 'nodes') {
        var nodes = $('#gonodes').val();
        this.playGoCmd = 'go nodes ' + nodes;
      } else {
        var movetime = $('#gomovetime').val();
        this.playGoCmd = 'go movetime ' + movetime;
      }
    },

    applyNetwork() {
      this.weightsUrl = $('#network').find(':selected').val();
      this.createEngine();
    },

    displayLogChanged() {
      var choice = $('#logs').is(':checked');
      if (choice)
        $('#output').show();
      else
        $('#output').hide();
    },

    updateStatus() {

      var lastMove;
      if (this.moveIndex > 0) {
        var san = this.moveList[this.moveIndex - 1].san;
        var fullMoves = (this.moveIndex + 1) >> 1;
        var turn = this.game.turn();
        if (turn == 'w') {
          lastMove = 'After ' + fullMoves + '. ... ' + san + '.';
        } else {
          lastMove = 'After ' + fullMoves + '. ' + san + '.';
        }
      }
      else {
        lastMove = 'Starting position.';
      }
      $('#status').text(lastMove);

      var pgn = '';
      for (var i = 0; i < this.moveList.length; i++) {
        if (i % 2 == 0) {
          if (pgn.length > 0) pgn += ' ';
          pgn += (1 + (i >> 1)) + '.';
        }
        var san = this.moveList[i].san;
        pgn += ' ';
        var current = i + 1 == this.moveIndex;
        if (current) pgn += '<b>';
        pgn += san;
        if (current) pgn += '</b>';
      }
      if (this.gameResult) {
        pgn += ' ' + this.gameResult.outcome.mnemo;
      }
      $('#movelist').html(pgn);
    },


    updateButtons() {
      const canNav = this.mode == kModeAnalysis;
      const moveCount = this.moveList.length;
      const canNavBack = canNav && this.moveIndex > 0;
      const canNavForward = canNav && this.moveIndex < moveCount;

      $('#loadPgnBtn').prop('disabled', !canNav);
      $('#navBegBtn').prop('disabled', !canNavBack);
      $('#navBckBtn').prop('disabled', !canNavBack);
      $('#navFwdBtn').prop('disabled', !canNavForward);
      $('#navEndBtn').prop('disabled', !canNavForward);

      const ready = this.worker && this.state != kStateOff;
      const analysisMode = ready && this.mode == kModeAnalysis;

      $('#goBtn').prop('disabled', !analysisMode);
      $('#stopBtn').prop('disabled', !analysisMode);

      const playMode = ready && this.mode == kModePlay;
      const playBlack = playMode && 'w' == this.humanSide;
      const playWhite = playMode && 'b' == this.humanSide;
      const resign = playMode && !this.gameResult;
      const takeback = playMode && this.moveCount(this.humanSide) > 0;

      $('#playBlackBtn').prop('disabled', !playBlack);
      $('#playWhiteBtn').prop('disabled', !playWhite);
      $('#takebackBtn').prop('disabled', !takeback);
      $('#resignBtn').prop('disabled', !resign);
    },

    getCurrentSetup() {
      var setup = 'position startpos';
      var history = this.game.history({verbose: true});
      if (history.length > 0) {
        setup += ' moves';
        for (var i = 0; i < history.length; i++) {
          var move = history[i];
          var coord_move = move.from + move.to;
          if (move.promotion) coord_move += move.promotion;
          setup += ' ' + coord_move;
        }
      }
      return setup;
    },

    go() {
      this.requestSearch(
          {'setup': this.getCurrentSetup(), 'go': 'go infinite'});
      this.updateButtons();
    },

    stop() {
      this.cancelSearch();
      this.updateButtons();
    },

    createEngine() {
      if (this.worker) {
        this.worker.terminate();
        this.worker = null;
      }
      CreateLC0Worker()
          .then(this.initEngine.bind(this))
          .catch(this.showError.bind(this));

      this.updateButtons();
    },

    initEngine(worker) {
      this.worker = worker;
      this.worker.onmessage = this.receive.bind(this);
      this.worker.onerror = this.engineError.bind(this);
      this.worker.postMessage('load ' + this.weightsUrl);
      this.state = kStateOff;
      this.uciPendingSearch = null;

      this.updateButtons();
    },

    send(message) {
      this.worker.postMessage(message);
      this.output.value += 'send: ' + message + '\n';
      this.output.scrollTop = output.scrollHeight;
    },

    searchResponse(move) {
      if (this.mode != kModePlay) return;

      move = this.makeMove(move);
      if (move == null) return;
      switch (move.flag) {
        case 'n':
        case 'b':
        case 'c':
          this.board.move(move.from + '-' + move.to);
          break;

        default:
          this.board.position(this.game.fen());
          break;
      }

      if (this.gameResult) {
        this.displayGameResult();
      } else {
        this.enginePlay();
      }
    },

    requestSearch(search) {
      switch (this.state) {
        case kStateOff:
          break;

        case kStateReady: {
          this.state = kStateRunning;
          this.send(search.setup);
          this.send(search.go);
          break;
        }

        case kStateRunning: {
          this.state = kStateReplacing;
          this.uciPendingSearch = search;
          this.send('stop');
          break;
        }

        case kStateCancelling: {
          this.state = kStateReplacing;
          this.uciPendingSearch = search;
          break;
        }

        case kStateReplacing: {
          this.uciPendingSearch = search;
          break;
        }
      }
    },

    cancelSearch(search) {
      switch (this.state) {
        case kStateOff:
        case kStateReady:
        case kStateCancelling:
          break;

        case kStateRunning: {
          this.state = kStateCancelling;
          this.send('stop');
          break;
        }

        case kStateReplacing: {
          this.state = kStateCancelling;
          this.uciPendingSearch = null;
          break;
        }
      }
    },

    receive(e) {
      const message = e.data;
      if (Array.isArray(message)) {
        this.output.value += message[1] + ': ' + message[0] + '\n';
      } else {
        // engine
        this.interpret(message);
        this.output.value += message + '\n';
      }
      this.output.scrollTop = output.scrollHeight;
    },

    interpret(message) {
      const oldState = this.state;
      switch (this.state) {
        case kStateOff:
          if (message == 'uciok') {
            this.state = kStateReady;
          }
          break;

        case kStateReady:
          break;

        case kStateRunning: {
          var match = message.match(kRegexBestMove);
          if (match) {
            var move = {from: match[1], to: match[2], promotion: match[3]};
            this.state = kStateReady;
            this.searchResponse(move);
          }
          break;
        }

        case kStateCancelling: {
          var match = message.match(kRegexBestMove);
          if (match) this.state = kStateReady;
          break;
        }

        case kStateReplacing: {
          var match = message.match(kRegexBestMove);
          if (match) {
            this.send(this.uciPendingSearch.setup);
            this.send(this.uciPendingSearch.go);
            this.uciPendingSearch = null;
            this.state = kStateRunning;
          }
          break;
        }
      }
      if (this.state != oldState) this.updateButtons();
    },

    playWhite() {
      if (this.mode != kModePlay) return;
      if (this.humanSide == 'w') return;
      this.board.orientation('white');
      this.humanSide = 'w';
      this.cancelSearch();
      this.enginePlay();
    },

    playBlack() {
      if (this.mode != kModePlay) return;
      if (this.humanSide == 'b') return;
      this.board.orientation('black');
      this.humanSide = 'b';
      this.cancelSearch();
      this.enginePlay();
    },

    takeback() {
      if (this.mode != kModePlay) return;
      this.cancelSearch();
      while (this.moveIndex > 0) {
        var move = this.moveList[--this.moveIndex];
        this.game.undo();
        if (move.color == this.humanSide) break;
      }
      this.board.position(this.game.fen());
      this.updateButtons();
      this.updateStatus();
    },

    moveCount(color) {
      var count = this.moveIndex;
      if ('w' == color) count++;
      return count >> 1;
    },

    resign() {
      if (this.mode != kModePlay) return;
      if (this.gameResult) return;
      this.cancelSearch();
      this.moveList.splice(this.moveIndex);
      const outcome = kOutcomeForLoser[this.humanSide];
      const loser = this.humanSide == 'w' ? 'White' : 'Black';
      this.gameResult = {outcome: outcome, reason: loser + ' resigned'};
      this.displayGameResult();
      this.updateStatus();
      this.updateButtons();
    },


    displayGameResult() {
      if (!this.gameResult) return;
      $('#popup div h2').text(this.gameResult.reason + '!');
      $('#popup div h3').text(this.gameResult.outcome.text + '.');
      $('#popup').addClass('show-modal');
    },

    onDragStart(source, piece, position, orientation) {
      if (this.mode == kModeAnalysis) return true;
      if (this.game.turn() != this.humanSide) return false;
      return true;
    },

    onDrop(source, target) {
      if (this.mode == kModePlay && this.state != kStateReady)
        return 'snapback';

      var move = {from: source, to: target, promotion: 'q'};  // TODO
      move = this.makeMove(move);
      if (move === null) return 'snapback';

      if (this.mode == kModePlay) {
        if (this.gameResult) {
          this.displayGameResult();
        } else {
          this.enginePlay();
        }
      }
    },

    enginePlay() {
      if (this.mode != kModePlay) return;
      if (this.game.turn() == this.humanSide) return;
      if (this.gameResult) return;

      this.requestSearch(
          {'setup': this.getCurrentSetup(), 'go': this.playGoCmd});
      this.updateButtons();
    },

    makeMove(move) {
      var move = this.game.move(move);
      if (move == null) return null;
      this.moveList.splice(this.moveIndex);
      this.moveList.push(move);
      this.moveIndex++;
      this.gameResult = null;
      if (this.game.game_over()) {
        var reason = null;
        var outcome = null;
        if (this.game.in_checkmate()) {
          outcome = kOutcomeForLoser[this.game.turn()];
          reason = 'Checkmate';
        } else {
          outcome = kOutcomeDraw;
          reason = '50-move rule';
          if (this.game.in_stalemate()) {
            reason = 'Stalemate';
          }
          if (this.game.in_threefold_repetition()) {
            reason = 'Threefold repetition';
          }
          if (this.game.insufficient_material()) {
            reason = 'Insufficient material';
          }
        }
        this.gameResult = {outcome: outcome, reason: reason};
      }
      this.updateButtons();
      this.updateStatus();
      return move;
    },

    onSnapEnd() {
      this.board.position(this.game.fen());
    },

    navigateBegin() {
      if (this.moveIndex == 0) return;
      this.moveIndex = 0;
      this.game.reset();
      this.board.position(this.game.fen());
      this.updateButtons();
      this.updateStatus();
    },

    navigateEnd() {
      if (this.moveIndex == this.moveList.length) return;
      while (this.moveIndex < this.moveList.length) {
        var move = this.moveList[this.moveIndex++];
        this.game.move(move);
      }
      this.board.position(this.game.fen());
      this.updateButtons();
      this.updateStatus();
    },

    navigateBack() {
      if (this.moveIndex == 0) return;
      var move = this.moveList[--this.moveIndex];
      this.game.undo();
      this.board.position(this.game.fen());
      this.updateButtons();
      this.updateStatus();
    },

    navigateForward() {
      if (this.moveIndex == this.moveList.length) return;
      var move = this.moveList[this.moveIndex++];
      this.game.move(move);
      this.board.position(this.game.fen());
      this.updateButtons();
      this.updateStatus();
    },

    loadPgn() {
      var files = $('#pgnToLoad')[0].files;
      if (!files || files.length == 0) return;
      var pgnToLoad = files[0];
      if (!pgnToLoad) return;
      var fileReader = new FileReader();
      fileReader.onload = this.readPgn.bind(this);
      fileReader.readAsText(pgnToLoad, 'UTF-8');
    },

    readPgn(evt) {
      var pgn = evt.target.result;
      if (!pgn) return;

      var pgnGame = new Chess();
      var loaded = pgnGame.load_pgn(pgn, {sloppy: true});
      if (!loaded) return;

      this.board.start(true);
      pgnGame.header([]);

      this.game.reset();
      this.moveList = [];
      var history = pgnGame.history({verbose: true});
      for (var i = 0; i < history.length; i++) this.moveList.push(history[i]);
      this.moveIndex = 0;

      this.gameResult = null;
      var match = pgn.match(kRegexResult);
      if (match) {
        const outcome = kOutcomeForMnemo[match[1]];
        if (outcome) this.gameResult = {outcome: outcome};
      }

      this.updateButtons();
      this.updateStatus();
    },

    engineError(e) {
      this.showError('Engine error: ' + e.message + ' (line ' + e.lineno + ')');
    },

    showError(message) {
      $('#error-content').text(message);
      $('#error').show();
    },

    hideError() {
      $('#error').hide();
      $('#error-content').empty();
    }


  };

  return Controller;
}();

new Controller();

// Prevent drag/scroll on mobile.

function preventBehavior(e) {
  e.preventDefault();
}

document.addEventListener('touchmove', preventBehavior, {passive: false});
