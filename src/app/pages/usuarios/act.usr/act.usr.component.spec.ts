import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActUsrComponent } from './act.usr.component';

describe('ActUsrComponent', () => {
  let component: ActUsrComponent;
  let fixture: ComponentFixture<ActUsrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActUsrComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActUsrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
