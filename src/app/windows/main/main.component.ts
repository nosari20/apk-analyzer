import { Component, OnInit, HostListener, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { WindowManagerService } from '../../services/window-manager.service'
import {ElectronService} from 'ngx-electron';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  title = 'APK Analyzer';

 


  constructor(private _electronService: ElectronService, private _windowManager: WindowManagerService) {}

  ngOnInit() {
   
  }

  


  openDevTool() : void {
    let win : any = this._electronService.remote;
    win.getCurrentWindow().openDevTools();
  }

  
}
