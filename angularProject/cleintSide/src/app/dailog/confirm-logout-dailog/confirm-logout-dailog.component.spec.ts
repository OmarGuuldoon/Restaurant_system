import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmLogoutDailogComponent } from './confirm-logout-dailog.component';

describe('ConfirmLogoutDailogComponent', () => {
  let component: ConfirmLogoutDailogComponent;
  let fixture: ComponentFixture<ConfirmLogoutDailogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmLogoutDailogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmLogoutDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
