import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActCatComponent } from './act.cat.component';

describe('ActCatComponent', () => {
  let component: ActCatComponent;
  let fixture: ComponentFixture<ActCatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActCatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActCatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
