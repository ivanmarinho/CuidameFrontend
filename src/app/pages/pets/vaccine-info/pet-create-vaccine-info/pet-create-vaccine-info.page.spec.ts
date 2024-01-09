import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PetCreateVaccineInfoPage } from './pet-create-vaccine-info.page';

describe('PetCreateVaccineInfoPage', () => {
  let component: PetCreateVaccineInfoPage;
  let fixture: ComponentFixture<PetCreateVaccineInfoPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PetCreateVaccineInfoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PetCreateVaccineInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
