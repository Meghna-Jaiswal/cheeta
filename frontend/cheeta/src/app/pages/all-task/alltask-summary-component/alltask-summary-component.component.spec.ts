import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlltaskSummaryComponentComponent } from './alltask-summary-component.component';

describe('AlltaskSummaryComponentComponent', () => {
  let component: AlltaskSummaryComponentComponent;
  let fixture: ComponentFixture<AlltaskSummaryComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlltaskSummaryComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlltaskSummaryComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
