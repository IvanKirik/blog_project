import {Component, ElementRef, TemplateRef, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  public isLightPopup: boolean = false;
  private dialogRef: MatDialogRef<any> | null = null;
  @ViewChild('popup') popup!: TemplateRef<ElementRef>;

  constructor(private dialog: MatDialog,
              private _snackBar: MatSnackBar) { }

  public createOrder(): void {
    this.isLightPopup = true;
    this.dialogRef = this.dialog.open(this.popup);
  }

  public closePopup(event: boolean): void {
    if(event) {
      this.dialogRef?.close();
    }
  }
}
