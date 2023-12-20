import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarLogoutComponent } from './avatar-logout.component';

describe('AvatarLogoutComponent', () => {
  let component: AvatarLogoutComponent;
  let fixture: ComponentFixture<AvatarLogoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvatarLogoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvatarLogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
