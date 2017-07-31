import {Component, OnInit} from '@angular/core';
import {PicasoDataService} from "../service/picaso-data.service";
import {PatientClinician} from "../model/patient-clinician";
import {PatientLoadProgress} from "../model/patient-loadprogress";

@Component({
  selector: 'patient-clinicians-history',
  templateUrl: './patient-clinicians-history.component.html',
  styleUrls: ['./patient-clinicians-history.component.css'],
  providers: [PicasoDataService]

})

export class PatientCliniciansComponent implements OnInit {
  errorMessage: string;
  clinicians: PatientClinician[];

  public filterQuery = "";
  public rowsOnPage = 5;
  public sortBy = "name";
  public sortOrder = "asc";

  settings = {
    columns: {
      startDate: {
        title: 'Start Date',
        editable: false
      },
      endDate: {
        title: 'End Date',
        editable: false
      },
      name: {
        title: 'Name',
      },
      institution: {
        title: 'Institution',
      },
      speciality: {
        title: 'Speciality',
        editable: false
      }

    },
    hideSubHeader: true,
    actions: {
      add: false,
      delete: false,
      edit: false
    },
    pager: {
      display: true,
      perPage: 5
    }
  };

  progress: PatientLoadProgress = {
    percentage: 0,
    loaded: 0,
    total: 0
  };

  constructor(private picasoDataService: PicasoDataService) {
  };

  ngOnInit(): void {
    this.getClinicians();
  }

  getClinicians(): void {
    this.picasoDataService.getClinicians(undefined, undefined, this.progress).subscribe(clinicians => this.clinicians = clinicians,
      error => this.errorMessage = <any>error);


  }

}
