import { MaterialDatepickerJson } from './../interfaces/material-datepicker.json-inteface';
import { ElementRef } from '@angular/core';
declare var M;

export interface MaterialInstanse {
  open?(): void;
  close?(): void;
  destroy?(): void;
}

export class MaterialService {
  static toast(message: string): void {
    M.toast({html: message});
  }

  static initializeFloatingButton(ref: ElementRef): void {
    M.FloatingActionButton.init(ref.nativeElement);
  }

  static updateTextInputs(): void {
    M.updateTextFields();
  }

  static initModal(ref: ElementRef): MaterialInstanse {
    return M.Modal.init(ref.nativeElement);
  }

  static initDatepicker(ref: ElementRef, onClose: () => void): MaterialDatepickerJson {
    return M.Datepicker.init(ref.nativeElement, {
      format: 'dd.mm.yyyy',
      showClearBtn: true,
      onClose
    });
  }
}
