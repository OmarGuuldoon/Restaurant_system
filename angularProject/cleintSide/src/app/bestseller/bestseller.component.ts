import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bestseller',
  standalone: true,
  imports: [],
  templateUrl: './bestseller.component.html',
  styleUrl: './bestseller.component.scss'
})
export class BestsellerComponent implements OnInit{

 ngOnInit(): void {
     console.log("bestsller is loaded");
 }
}
