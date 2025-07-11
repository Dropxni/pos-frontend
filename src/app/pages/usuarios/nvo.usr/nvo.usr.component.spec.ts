import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NvoUsrComponent } from './nvo.usr.component';

describe('NvoUsrComponent', () => {
  let component: NvoUsrComponent;
  let fixture: ComponentFixture<NvoUsrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NvoUsrComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NvoUsrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
