const express = require('express');
const router = express.Router();
var Datastore = require('nedb'), db = new Datastore();



let playerCount = 0;



router.get('/getId', (req, res) => {
    playerCount++;
    var doc = { maxPlayer: playerCount };
    db.insert(doc, function(err, newDoc){});
  res.send(''+playerCount);
});
/*
router.post('/move',(req, res) =>{
    Board[req.body.x][req.body.y].value = req.body.value;
});

router.get('/getBoard', (req, res) => {
    
  res.send(Board);
});

function createBoard(){
    for(let i = 0; i < 10; i++){
      Board[i] = new Array(10);
      for(let j = 0; j < 10; j++){
        Board[i][j] = 0;
      }
    }
    
}
*/
module.exports = router;