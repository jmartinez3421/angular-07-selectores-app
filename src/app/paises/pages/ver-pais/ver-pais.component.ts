import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common'
import { switchMap } from 'rxjs';

import { PaisesService } from '../../services/paises.service';
import { Pais, Translation } from '../../interfaces/paises.interface';

@Component({
  selector: 'app-ver-pais',
  templateUrl: './ver-pais.component.html',
  styles: [
  ]
})
export class VerPaisComponent implements OnInit {

  pais!: Pais;
  traducciones!: { [key: string]: Translation };

  constructor(
    private activatedRoute: ActivatedRoute,
    private paisesService: PaisesService,
    private location: Location
  ) { }

  ngOnInit(): void {

    this.activatedRoute.params
        .pipe( 
          switchMap( ({id}) => {
            return this.paisesService.getPaisPorCodigo( id )
          } )       
        )
        .subscribe(pais => {
          this.pais = pais[0];
        });

        // tap( resp => console.log(resp) ) Sirve para ejecutar el console log con la respuesta del switchMap

    // this.activatedRoute.params
    //   .subscribe(({ idPais }) => {

    //     this.paisService.getPaisPorCodigo(idPais)
    //       .subscribe(pais => {
    //         console.log(pais[0]);
    //       })

    //   })
  }

  volver(){
    this.location.back();
  }

}
