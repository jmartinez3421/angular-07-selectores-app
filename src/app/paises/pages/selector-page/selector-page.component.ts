import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';
import { PaisSmall } from '../../interfaces/paises.interface';
import { of, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region: ['', [Validators.required]],
    pais: ['', [Validators.required]],
    frontera: ['', [Validators.required]]
  });

  regiones: string[] = [];
  paises: PaisSmall[] = [];
  fronteras: PaisSmall[] = [];

  cargando: boolean = false;
  noFronterizos: boolean = false;

  get paisSeleccionado(){
    return this.miFormulario.get('pais')?.value;
  }

  constructor(
    private fb: FormBuilder,
    private paisesService: PaisesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;

    //Cuando cambie la region
    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap((_) => {
          this.miFormulario.get('pais')?.reset('');
          this.paises = [];
          this.cargando = true;
        }),
        switchMap(region => this.paisesService.getPaisesPorRegion(region))
      )
      .subscribe(paises => {
        this.paises = paises;
        this.cargando = false;
      });


    //Cuando cambie el país
    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap((_) => {
          this.miFormulario.get('frontera')?.reset('');
          this.fronteras = [];
          this.cargando = true;          
          this.noFronterizos = false;
        }),
        switchMap(pais => this.paisesService.getPaisPorCodigo(pais)),
        switchMap(pais => {
          if (pais[0]) {
            return this.paisesService.getPaisesFronterizos(pais[0].borders);
          }
          return of([]);
        })
      )
      .subscribe(paises => {
        if(paises.length === 0){
          this.noFronterizos = true;
        }
        this.fronteras = paises;
        this.cargando = false;
      })

  }

  guardar() {
    this.router.navigate(['./paises/verPais/',this.miFormulario.get('frontera')?.value])
  }

}
