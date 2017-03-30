import { Component, OnInit } from '@angular/core';
import {PicasoDataService} from "../service/picaso-data.service";
import {PatientClinician} from "../model/patient-clinician";

@Component({
    selector: 'patient-clinicians-history',
    templateUrl: './patient-clinicians-history.component.html',
    styleUrls: ['./patient-clinicians-history.component.css'],
    providers: [PicasoDataService]

})

export class PatientCliniciansComponent implements OnInit {
    errorMessage: string;
    clinicians: PatientClinician[];

    constructor(private picasoDataService: PicasoDataService) {
    };

    ngOnInit(): void {
        this.getClinicians();
    }

    getClinicians(): void {
        this.picasoDataService.getClinicians().
        subscribe(clinicians => this.clinicians = clinicians,
            error => this.errorMessage = <any>error);


    }

}