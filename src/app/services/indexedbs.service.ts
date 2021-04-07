import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IndexdbService {
  constructor(private indexdb: NgxIndexedDBService) {}

  public create(payload: any): Observable<any> {
    return from(this.indexdb.add('organizese', payload));
  }

  public update(payload: any): Observable<any> {
    return from(this.indexdb.update('organizese', payload));
  }

  public delete(id: string): Observable<any> {
    return from(this.indexdb.delete('organizese', id));
  }

  public clearStore(): Observable<any> {
    return from(this.indexdb.clear('organizese'));
  }

  public getById(id: string): Observable<any> {
    return from(this.indexdb.getByID('organizese', id));
  }

  public getAll(): Observable<any> {
    return from(this.indexdb.getAll('organizese'));
  }

  public getByIndex(index: number): Observable<any> {
    return from(this.indexdb.getByIndex('organizese', 'issue', index));
  }

  public count(): Observable<any> {
    return from(this.indexdb.count('organizese'));
  }
}
