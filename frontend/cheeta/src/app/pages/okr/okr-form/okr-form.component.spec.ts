import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OkrFormComponent } from './okr-form.component';

describe('OkrFormComponent', () => {
  let component: OkrFormComponent;
  let fixture: ComponentFixture<OkrFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OkrFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OkrFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
