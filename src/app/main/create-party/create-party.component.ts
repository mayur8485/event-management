import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DatastoreService } from 'src/app/services/datastore.service';

@Component({
  selector: 'app-create-party',
  templateUrl: './create-party.component.html',
  styleUrls: ['./create-party.component.css']
})
export class CreatePartyComponent implements OnInit, OnDestroy {

  partyForm: any;
  mode: string = 'create';
  routeSubs!: Subscription;

  constructor(private datastoreService: DatastoreService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.partyForm = new FormGroup({
      id: new FormControl(""),
      fullName: new FormControl("", { validators: [Validators.required] }),
      address: new FormControl("", { validators: [Validators.required] }),
      mobileNo: new FormControl("", { validators: [Validators.required, Validators.pattern(/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/) ] }),
      description : new FormControl(""),
      date: new FormControl("", { validators: [Validators.required] }),
      time: new FormControl("", { validators: [Validators.required] })
    })

    this.routeSubs = this.route.params.subscribe((params: Params) => {
      this.mode = this.checkModes(this.router.url);
      this.openFormInModes(params['id']);
    })
  }

  getTodaysDate() {
    const todayDate = new Date().toISOString().slice(0, 10);
    return todayDate;
  }

  getCurrentTime() {
    const time = new Date();
    const str = time.getHours() + ":" + time.getMinutes();
    return str
  }

  checkModes(url: string) {
    if (url.includes('edit')) return 'edit';
    else if (url.includes('delete')) return 'delete';
    return 'create';
  }

  openFormInModes(id: string) {
    const partydetails = this.datastoreService.getPartyDetailById(id);
    this.partyForm.patchValue(partydetails[0]);
  }

  getRandomNumber() {
    return Math.floor(Math.random() * 10000000000).toString();
  }

  onCreatePartyDetails() {
    if (this.partyForm.valid) {
      const partyDetail = this.partyForm.getRawValue();
      partyDetail.id = this.getRandomNumber();
      if (this.datastoreService.createPartyDetails(partyDetail)) {
        this.partyForm.reset();
        this.router.navigate(['/event']);
      }
    }
  }

  onUpdatePartyDetails() {
    // console.log('Updating the party details');
    if (this.partyForm.dirty) {
      const partyDetail = this.partyForm.getRawValue();
      this.datastoreService.updatePartyDetails(partyDetail);
      this.router.navigate(['/event']);
    }
  }

  onDeletePartyDetails() {
    // console.log('Deleting the party details');
    const partyDetail = this.partyForm.getRawValue();
    this.datastoreService.deletePartyDetails(partyDetail);
    this.router.navigate(['/event']);
  }

  onNavigate() {
    this.router.navigate(['/event']);
  }

  ngOnDestroy(): void {
    this.routeSubs.unsubscribe();
  }

}
