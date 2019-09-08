import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'buffToHex'
})
export class BuffToHexPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(value == null) return '';
    
    //return Buffer.from(value).toString("hex").match(/.{1,2}/g).join(' ');
    return this.hexdump(Buffer.from(value));
  }

  hexdump(buffer) {
    const blockSize = 8;
    const nbBlocksPerline = 2;
    let hex = buffer.toString("hex").match(/.{1,2}/g);
    let lines = [];
    let currentBlock = 0;
    let currentLine = "";
    for(let i = 0; i < hex.length; i++){
      
      if(i % (blockSize*nbBlocksPerline) == 0 && i > 0){
        lines.push(currentLine);
        currentLine = '';
      }
  
      if(i % blockSize == 0){
        currentBlock++;
        if(currentBlock % nbBlocksPerline == 0)
          currentLine += ' ';
      }
      currentLine += hex[i] + ' ';
    }
  
  
  
    let formated = '';
    for(let i = 0; i < lines.length; i++){
      let buffer = Buffer.from(lines[i].replace(/\s/g,''), 'hex');
  
      
      let index = (i*blockSize*nbBlocksPerline).toString(16);
      let hex = lines[i];
      let text = buffer.toString('ascii').replace(/\s/g,'');
  
  
      formated += ("000000".substr(0, 6 - index.length) + index) + ':  ' + hex + '  ' + text;
      if(i < lines.length-1) formated+= '\n';
  
    }
  
    return formated;
  }
  
}
