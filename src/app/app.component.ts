import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  processos$: Observable<any[]>;
  displayedColumns: string[] = ['numero', 'titulo'];

  private processosCollection: AngularFirestoreCollection;

  constructor(private afs: AngularFirestore, public dialog: MatDialog) {
    this.processosCollection = afs.collection('processos');
    this.processos$ = this.processosCollection.valueChanges({ idField: 'id' });
  }

  openDialog(data?: any): void {
    const dialogRef = this.dialog.open(FormComponent, {
      width: '250px',
      data: data ? { ...data } : null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      if (!result.id) {
        this.processosCollection.add(result);
      } else {
        this.processosCollection.doc(result.id).set(result);
      }
    });
  }
}

@Component({
  selector: 'form-component',
  templateUrl: 'form.component.html',
})
export class FormComponent {
  constructor(
    public dialogRef: MatDialogRef<FormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (!data) {
      this.data = {
        numero: '',
        titulo: '',
        descricao: '',
        reu: {
          nome: '',
          cpf: '',
        },
      };
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
