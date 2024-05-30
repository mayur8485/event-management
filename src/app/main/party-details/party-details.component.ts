import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatastoreService } from 'src/app/services/datastore.service';
import { PartyDetails } from '../../models/partyDetails.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-party-details',
  templateUrl: './party-details.component.html',
  styleUrls: ['./party-details.component.css'],
})
export class PartyDetailsComponent implements OnInit, OnDestroy {
  dataSubscription!: Subscription;
  parties: any = [];
  partiesPagination: any = [];

  page: number = 0;
  noOfPages: any = [];
  recordsPerPage: number = 5;
  startIndex: number = 0;

  constructor(private dataStoreService: DatastoreService) { };

  ngOnInit(): void {
    this.dataSubscription = this.dataStoreService.partyDetailsSubject.subscribe((partydetails: PartyDetails[]) => {
      this.parties = partydetails;
      this.addPagination(1);
    })
    this.parties = this.dataStoreService.getPartyDetails();
    this.addPagination(1);
  }

  addPagination(page: number) {
    this.noOfPages = Array.from({ length: Math.ceil(this.parties.length / this.recordsPerPage) }, (_, index) => index + 1);
    let startIndex = ((page - 1) * this.recordsPerPage);
    let endIndex = startIndex + this.recordsPerPage;
    this.startIndex = startIndex;
    this.partiesPagination = this.parties.slice(startIndex, endIndex)
  }

  onSearch(event: any) {
    this.dataStoreService.search(event.target.value);
  }

  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
  }

}
