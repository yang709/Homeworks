import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class PlayerService {
  constructor(private http: Http) {
  }
  getId() {
    return this.http.get('/api/getId')
      .map(res => res.json());
  }
  /*
  getBoard() {
    return this.http.get('/api/getBoard')
      .map(res => res.json());
  }
  move(v: number, xx:number, yy:number) {
    var body = {value: v, x: xx, y:yy};
    return this.http.post('/api/move',JSON.stringify(body))
      .map(res => res.json());
  }
*/
}
