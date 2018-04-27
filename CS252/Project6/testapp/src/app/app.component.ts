import { Component, OnInit } from '@angular/core';

import { PlayerService } from './player.service';
import { Board } from './board'
import * as io from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  id: number = -1;
  board: Object[];
  error: string = "testing";
  message: string="Waiting for player...";
  yourTurn: boolean = false;
  socket: SocketIOClient.Socket;
  remainTurn:number = 20;
  constructor(private playerServace: PlayerService){
    this.socket=io.connect();
  }

  ngOnInit(){
    this.createBoard(10);
    
    this.playerServace.getId().subscribe(data => {
      this.id = +JSON.stringify(data);
    });
    this.socket.on('start', () => {
      if( this.id == 1){
        this.message = "Your Trun";
        this.yourTurn = true;
      }else{
        this.message = "Waiting for opponent...";
      }
      
    });
    this.socket.on('end', () => {
      this.message = "Finished"
      this.yourTurn = false;
      
    });
    this.socket.on('next', (mover: number, x:number, y:number) => {
      if(mover != this.id){
        this.board[x][y].value = mover;
        this.board[x][y].inUse = true;
        this.yourTurn = true;
        this.message = "Your Turn.";
        this.checkElim(mover, x, y);
      }
    });
  }
  /*
  getBoard(){
    this.playerServace.getBoard().subscribe(data => {
      this.board = JSON.stringify(data);
    });
    this.error = this.board;
  }
  */
  placeAt(i, j) : AppComponent{
    if(!this.yourTurn){
      return;
    }
    
    let c = this.board[i][j];
    if(c.inUse){
      this.message = "This position is unavailiable."
      return;
    }
    this.remainTurn--;
    this.socket.emit('move', this.id, i, j);


    this.yourTurn = false;
    c.value = this.id;
    c.inUse = true;
    this.checkElim(this.id, i, j);
    this.message = "Waiting for opponent...";
    return;
  }
  createBoard(size:number = 10) : AppComponent{
    let blocks = [];
    for(let i = 0; i < size; i++){
      blocks[i] = [];
      for(let j = 0; j < size; j++){
        blocks[i][j] = { inUse: false, value: 0};
      }
    }
    this.board = blocks;
    return this;
  }

  checkElim(mover, x, y) : AppComponent{
    this.error = x;
    let f = false;
    for(let i = 0; i < y; i++){
      let c = this.board[x][i];
      if(c.value == mover){
        f = true;
      }
      if(c.inUse && c.value != mover && f){
        c.value = 0;
        c.inUse = false;
      }
    }
    f = false;
    for(let i = 9; i > y; i--){
      let c = this.board[x][i];
      if(c.value == mover){
        f = true;
      }
      if(c.inUse && c.value != mover && f){
        c.value = 0;
        c.inUse = false;
      }
    }
    f = false;
    for(let i = 0; i < x; i++){
      let c = this.board[i][y];
      if(c.value == mover){
        f = true;
      }
      if(c.inUse && c.value != mover && f){
        c.value = 0;
        c.inUse = false;
      }
    }
    f = false;
    for(let i = 9; i > x; i--){
      let c = this.board[i][y];
      if(c.value == mover){
        f = true;
      }
      if(c.inUse && c.value != mover && f){
        c.value = 0;
        c.inUse = false;
      }
    }
    return;
  }
}
