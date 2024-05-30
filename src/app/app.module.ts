import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MainComponent } from './main/main.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CreatePartyComponent } from './main/create-party/create-party.component';
import { PartyDetailsComponent } from './main/party-details/party-details.component';
import { AppRoutingModule } from './app-routing.module';
import { HomepageComponent } from './main/homepage/homepage.component';
import { AuthComponent } from './auth/auth.component';
import { ViewCardsComponent } from './main/homepage/view-cards/view-cards.component';
import { ContactComponent } from './main/homepage/contact/contact.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainComponent,
    SidebarComponent,
    CreatePartyComponent,
    PartyDetailsComponent,
    HomepageComponent,
    AuthComponent,
    ViewCardsComponent,
    ContactComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
