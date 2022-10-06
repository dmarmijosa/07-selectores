
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { PaisSmall } from '../interfaces/paises.interface';
import { combineLatest, Observable, of } from 'rxjs';
import { Pais } from '../interfaces/pais.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {
  api_URL:string =environment.url_Api;
  api_URL2:string =environment.url_Api2;

  private _regiones=['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regiones():string[]{
    return [...this._regiones]
  }
  
  constructor(private http:HttpClient) { }
  
  getCoutryByRegion(region:string):Observable<PaisSmall[]>{
    return this.http.get<PaisSmall[]>(`${this.api_URL2}/region/${region}?fields=alpha3Code,name`)
  }
  getCountryForCode(code:string):Observable<Pais | null>{
    if(!code){
      return of(null)
    }
    return this.http.get<Pais>(`${this.api_URL2}/alpha/${code}`);
  }

  getCountryForCodeSmall(code:string):Observable<PaisSmall>{
    return this.http.get<Pais>(`${this.api_URL2}/alpha/${code}?fields=name,alpha3Code`);
  }
  getCountryforCodesBorder(borders:string[]):Observable<PaisSmall[]>{
    if(!borders){
      return of([])
    }
    const peticiones:Observable<PaisSmall>[]=[];
    borders.forEach(codigo=>{
      const peticion = this.getCountryForCodeSmall(codigo);
      peticiones.push(peticion);
    })

    return combineLatest(peticiones);
  }


}
