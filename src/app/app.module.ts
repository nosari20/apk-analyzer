import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgxElectronModule} from 'ngx-electron';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing/app-routing.module';

import { AppComponent } from './app.component';
import { FrameComponent } from './components/frame/frame.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { MainComponent } from './windows/main/main.component';
import { SafeUrlPipe } from './pipes/safe-url.pipe';



@NgModule({
  declarations: [
    AppComponent,
    FrameComponent,
    SafeHtmlPipe,
    MainComponent,
    SafeUrlPipe,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    NgxElectronModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
