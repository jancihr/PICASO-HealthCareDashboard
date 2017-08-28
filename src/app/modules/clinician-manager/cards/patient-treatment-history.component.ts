import {Component, OnInit, OnDestroy, ViewChild, Input} from '@angular/core';

import {VisTimelineService, VisTimelineItems, VisTimelineOptions} from 'ng2-vis/ng2-vis';
import {PicasoDataService} from "../service/picaso-data.service";
import {PatientTreatment} from "../model/patient-treatment";
import {PatientLoadProgress} from "../model/patient-loadprogress";
import {MyDateRange} from "./patient-range-picker.component";
import {CareProfessionalVisit} from "../model/generated-interfaces";


@Component({
  selector: 'patient-treatments',
  template: require('./patient-treatment-history.component.html'),
  styles: [
    require('./patient-treatment-history.component.css')
  ],
  providers: [PicasoDataService, VisTimelineService]
})

export class PatientTreatmentHistoryComponent implements OnInit, OnDestroy {


  @Input() dateRange: MyDateRange;

  animateToggle = true;
  isColourful = false;

  progress: PatientLoadProgress = {
    percentage: 0,
    loaded: 0,
    total: 0
  };

  selectedId: string;
  selectedTreatment: PatientTreatment;
  checks: PatientTreatment[];
  listOfItems: string[];

  itemCounter: number;

  errorMessage: string;

  public visTimelineTreatments: string = 'visTimelineGraph';
  public visTimelineItemsTreatments: VisTimelineItems;
  public visTimelineTreatmentsOptions: VisTimelineOptions;

  public constructor(private visTimelineService: VisTimelineService,
                     private picasoDataService: PicasoDataService) {
  }

  public ngOnInit(): void {
    this.visTimelineTreatmentsOptions = {
      selectable: true,
      autoResize: true,
      showCurrentTime: true,
      //zoomMax: 61556926000, //year
      zoomMin: 86400000, //day
      clickToUse: false,
      rollingMode: null,//{follow:false, offset:0},
      start: this.dateRange.startDate,
      end: this.dateRange.endDate,
      minHeight: 270,
      margin: {
        axis: 10,
        item: 10
      },
      showMajorLabels: true,
      showMinorLabels: true,
      zoomable: false,
      zoomKey: 'altKey',

      format: {
        minorLabels: {
          millisecond: 'SSS',
          second: 's',
          minute: 'HH:mm',
          hour: 'HH:mm',
          weekday: 'ddd D.M.',
          day: 'D.',
          month: 'MMM',
          year: 'YYYY'
        },
        majorLabels: {
          millisecond: 'HH:mm:ss',
          second: 'D.M. HH:mm',
          minute: 'ddd D.M.',
          hour: 'ddd D.M.',
          weekday: 'MMMM YYYY',
          day: 'MMMM YYYY',
          month: 'YYYY',
          year: ''
        }
      }
    };
    this.getChecks();
  }

  getChecks() {

    this.checks = [];
    this.itemCounter = 0;

    this.getVisits();
    this.getImaging();
    this.getLabTests();

    this.getPsychTests();
    this.getfunctionalDiag();
    this.getPatientReport();
    this.getQuestionFill();

  }

  close() {
    this.selectedTreatment = null;
  }

  openDetail() {
    if (!(this.selectedTreatment !== null && this.selectedTreatment.id === this.selectedId)) {

      for (let treatment of this.checks) {
        if (treatment.id === this.selectedId) {

          this.animateToggle = !this.animateToggle;
          this.selectedTreatment = treatment;
          break
        }

      }
    }
  }

  public timelineInitialized(): void {
    // console.log('timeline initialized');

    // now we can use the service to register on events
    this.visTimelineService.on(this.visTimelineTreatments, 'click');


    this.visTimelineService.click
      .subscribe((eventData: any[]) => {
        if (eventData[0] === this.visTimelineTreatments) {
          //console.log(itemId);
          //console.log(this.selectedItem);
          this.selectedId = eventData[1].item;
          //console.log("itemid: ", eventData[1].item);
          if (eventData[1].item !== null) this.openDetail();
        }
      });

  }

  public refreshRange(start: Date, end: Date): void {
    this.close();
    this.visTimelineService.setWindow('visTimelineGraph', start, end);
  }


  setTreatmentsGraphData(closeDetail: boolean): void {

    if (closeDetail) {


      this.selectedId = null;
      this.selectedTreatment = null;
    }
    this.listOfItems = [];
    this.visTimelineItemsTreatments = new VisTimelineItems([]);

    let counter: number = 0;
    for (let item of this.checks) {
      if (item.endDate === undefined || item.endDate === null) {
        this.visTimelineItemsTreatments.add({
          id: item.id,
          style: this.isColourful ? ("background: " + item.color) : "",
          content: `<div>
                              <div class="timeline-item-header"><b>${item.category}</b></div>
                              <div class="timeline-item-content">${item.visitReason} </div>
                              </div>`,
          start: item.startDate,
          type: 'box'
        });
      }
      else {
        this.visTimelineItemsTreatments.add({
          id: item.id,
          content: `<div>
                              <div class="timeline-item-header"><b>${item.category}</b></div>
                              <div class="timeline-item-content">${item.visitReason} </div>
                              </div>`,

          start: item.startDate,
          end: item.endDate,
          style: this.isColourful ? ("background: " + item.color) : "",
        });
      }
      this.listOfItems.push(item.id);
    }
    // this.focusVisChecks();
  }


  setVisitTreatments(treatments: CareProfessionalVisit[]) {
    for (let treatment of treatments) {

      this.checks.push(
        {
          startDate: treatment.date,
          endDate: null,
          id: "treat_" + this.itemCounter++,
          category: "Care professional",
          color: treatment.color,
          visitReason: treatment.careProfessional,
          visitResults: [{type: "Care professional result", result: treatment.result}]

        }
      );

    }
    this.setTreatmentsGraphData(true);
  }

  setTreatment(treatments: any[], type: string) {
    for (let treatment of treatments) {

      let visitReason: string = "";
      for (let result of treatment.results) {
        visitReason += (visitReason === "" ? "" : ", ") + result.type;
      }
      this.checks.push(
        {
          startDate: treatment.date,
          endDate: null,
          id: "treat_" + this.itemCounter++,
          category: type,
          color: treatment.color,
          visitReason: visitReason,
          visitResults: treatment.results
        }
      );

    }
    this.setTreatmentsGraphData(true);
  }


  getVisits(): void {
    this.picasoDataService.getProfessionalVisits(
      this.dateRange.startDate,
      this.dateRange.endDate, this.progress
    ).subscribe(
      checks => this.setVisitTreatments(checks),
      error => this.errorMessage = <any>error);
  }

  getImaging(): void {
    this.picasoDataService.getImagingResults(
      this.dateRange.startDate,
      this.dateRange.endDate, this.progress
    ).subscribe(
      checks => this.setTreatment(checks, "Imaging"),
      error => this.errorMessage = <any>error);
  }

  getLabTests(): void {
    this.picasoDataService.getLabTestResults(
      this.dateRange.startDate,
      this.dateRange.endDate, this.progress
    ).subscribe(
      checks => this.setTreatment(checks, "Lab Tests"),
      error => this.errorMessage = <any>error);
  }

  getPsychTests() {
    this.picasoDataService.getPsychologicalNeurologicalTestsPerformedResults(
      this.dateRange.startDate,
      this.dateRange.endDate, this.progress
    ).subscribe(
      checks => this.setTreatment(checks, "Psych. & neurol. tests"),
      error => this.errorMessage = <any>error);
  }

  getfunctionalDiag() {
    this.picasoDataService.getFunctionalDiagnosticsResult(
      this.dateRange.startDate,
      this.dateRange.endDate, this.progress
    ).subscribe(
      checks => this.setTreatment(checks, "Functional diagnostics"),
      error => this.errorMessage = <any>error);
  }

  getPatientReport() {
    this.picasoDataService.getPatientReportedOutcomesResultResult(
      this.dateRange.startDate,
      this.dateRange.endDate, this.progress
    ).subscribe(
      checks => this.setTreatment(checks, "Patient reported outcomes"),
      error => this.errorMessage = <any>error);
  }

  getQuestionFill() {
    this.picasoDataService.getQuestionaryFilledResult(
      this.dateRange.startDate,
      this.dateRange.endDate, this.progress
    ).subscribe(
      checks => this.setTreatment(checks, "Questionnaire taken"),
      error => this.errorMessage = <any>error);
  }

  public ngOnDestroy(): void {
    this.visTimelineService.off(this.visTimelineTreatments, 'click');
  }


  public focusVisChecks(): void {
    this.visTimelineService.focusOnIds(this.visTimelineTreatments, this.listOfItems)
  }

  toggleColor(): void {
    this.isColourful = !this.isColourful;
    this.setTreatmentsGraphData(false);
  }
}
