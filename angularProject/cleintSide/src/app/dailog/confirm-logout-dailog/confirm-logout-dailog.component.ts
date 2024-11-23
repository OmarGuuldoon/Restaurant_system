import { Component ,EventEmitter,OnInit} from '@angular/core';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from '../../shared/material.module';

@Component({
  selector: 'app-confirm-logout-dailog',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './confirm-logout-dailog.component.html',
  styleUrl: './confirm-logout-dailog.component.scss'
})
export class ConfirmLogoutDailogComponent implements OnInit {

  onEmitStatusChange = new EventEmitter();
  details : any = {};
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData : any) {

  }

  ngOnInit(): void {
    if(this.dialogData){
      this.details = this.dialogData;
    }
  }

  handleChangeAction (){
    this.onEmitStatusChange.emit();
  }
}
