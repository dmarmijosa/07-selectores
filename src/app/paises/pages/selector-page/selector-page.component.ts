import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';
import { PaisSmall } from '../../interfaces/paises.interface';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html'
})
export class SelectorPageComponent implements OnInit {
  regiones  :string[]=[];
  paises    :PaisSmall[]=[];
  fronteras :PaisSmall[]=[];

  cargando:boolean=false;


  miFormulario:FormGroup=this.fb.group({
    region:['',Validators.required],
    paises:['',Validators.required],
    frontera:['',Validators.required]
  })
  constructor(private fb:FormBuilder, private paiesService:PaisesService) { }

  ngOnInit(): void {
    this.regiones=this.paiesService.regiones;
    this.miFormulario.get('region')?.valueChanges
        .pipe(
          tap( (_)=>{
            this.miFormulario.get('paises')?.reset('');
            this.cargando=true;
            //this.miFormulario.get('frontera')?.disable();
            
          }),
          switchMap((region)=>this.paiesService.getCoutryByRegion(region))
        ).subscribe((paises)=>{
          this.cargando=false;
          this.paises=paises;
        });

    this.miFormulario.get('paises')?.valueChanges
        .pipe(
          tap(()=>{
            this.miFormulario.get('frontera')?.reset('');
            this.cargando=true;
            //this.miFormulario.get('frontera')?.enable();
          }),
          switchMap(codigo=>this.paiesService.getCountryForCode(codigo)),
          switchMap(pais=>this.paiesService.getCountryforCodesBorder(pais?.borders!))
        )
        .subscribe((paises)=>{

          this.cargando=false;
          this.fronteras=paises;
          //this.fronteras=pais?.borders || [];
        })
 


  }
  guardar(){
    console.log(this.miFormulario.value);

  }

}
