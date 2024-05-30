import { Injectable } from "@angular/core";
import { PartyDetails } from "../models/partyDetails.model";
import { Subject } from "rxjs";

import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class DatastoreService {
    partyDetailsSubject = new Subject<PartyDetails[]>();
    private partyDetails: PartyDetails[] = [];

    constructor(private http: HttpClient) { }

    storeData() {
        const data = this.partyDetails;
        this.http.put('https://event-management-81f60-default-rtdb.asia-southeast1.firebasedatabase.app/party.json',
            data).subscribe(response => {
                // console.log(response);
            });
    }

    fetchData() {
        this.http.get('https://event-management-81f60-default-rtdb.asia-southeast1.firebasedatabase.app/party.json').subscribe((response: any) => {
            if(response){
                this.partyDetails = response;
                this.partyDetailsSubject.next(this.partyDetails);
            }
        })
    }

    getPartyDetails() {
        if (this.partyDetails.length === 0) this.fetchData();
        return [...this.partyDetails];
    }

    createPartyDetails(partyDetails: PartyDetails) {
        this.partyDetails.push(partyDetails);
        this.partyDetailsSubject.next(this.partyDetails);
        this.storeData();
        return true
    }

    updatePartyDetails(partyDetail: PartyDetails) {
        this.partyDetails = this.partyDetails.filter((x: any) => x.id !== partyDetail.id);
        this.partyDetails.push(partyDetail);
        this.partyDetailsSubject.next(this.partyDetails);
        this.storeData();
    }

    deletePartyDetails(partyDetail: PartyDetails) {
        this.partyDetails = this.partyDetails.filter((x: any) => x.id !== partyDetail.id);
        this.partyDetailsSubject.next(this.partyDetails);
        this.storeData();
    }

    getPartyDetailById(id: string) {
        return this.partyDetails.filter(x => x.id === id);
    }

    search(value: string) {
        const filteredData = this.partyDetails.filter((x: any) => Object.values(x).join(";").toLocaleLowerCase().includes(value));
        this.partyDetailsSubject.next(filteredData);
    }

}