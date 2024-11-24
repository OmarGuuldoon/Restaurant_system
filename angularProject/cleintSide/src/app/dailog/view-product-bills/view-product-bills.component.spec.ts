import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProductBillsComponent } from './view-product-bills.component';

describe('ViewProductBillsComponent', () => {
  let component: ViewProductBillsComponent;
  let fixture: ComponentFixture<ViewProductBillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewProductBillsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewProductBillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
