import { Component, OnInit, HostListener, ElementRef, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { WindowManagerService } from '../../services/window-manager.service'
import {ElectronService} from 'ngx-electron';
import { analyzeFile } from '@angular/compiler';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  title = 'APK Analyzer';
  activeTab: number = 0;
  info: any = {};
  load: boolean = false;

 


  constructor(private _electronService: ElectronService, private _windowManager: WindowManagerService, private changeDetector: ChangeDetectorRef,) {}

  ngOnInit() {
   
  }


  openFileDialog(): void {
    const remote =this. _electronService.remote;

    remote.dialog.showOpenDialog(
      {
        filters: [
          { name: 'APK', extensions: ['apk']},
        ]
      },
      function(fileNames) {
        if (fileNames === undefined) return;
        let fileName = fileNames[0];

        this.loadAPK(fileName);

      
      
      }.bind(this)
    );
  }

  loadAPK(fileName: string): void {
    this.load = true;
    this.changeDetector.detectChanges();
    const ipc = this._electronService.ipcRenderer;
    ipc.send(`load-apk`, JSON.stringify({
      fileName: fileName,
    }));

    const onRespReceive = function (event, resJSON) {
      ipc.removeListener(`load-apk`,onRespReceive);
      let res = JSON.parse(resJSON);
      this.analyzeFile(res);

    }.bind(this);
    ipc.on(`load-apk`, onRespReceive);
  }

  analyzeFile(info): void {
    console.log(info);
    this.info = info;
    this.load = false;
    this.changeDetector.detectChanges();
  }

  

  changeTab(event, tab: number): void {
    event.stopPropagation();
    this.activeTab = tab;
  }


  openDevTool() : void {
    let win : any = this._electronService.remote;
    win.getCurrentWindow().openDevTools();
  }

  
}
