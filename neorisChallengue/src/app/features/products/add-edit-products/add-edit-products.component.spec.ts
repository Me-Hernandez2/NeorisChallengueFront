import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { CreateProductInterface } from './models/createProduct.interface';
import { AddEditProductsComponent } from './add-edit-products.component';
import { CreateProductService } from './services/create-product.service';
import { EditProductService } from './services/edit-product.service';
import { ValidateIdService } from './services/validate-id.service';
import { DatePipe } from '@angular/common';

describe('AddEditProductsComponent', () => {
  let component: AddEditProductsComponent;
  let fixture: ComponentFixture<AddEditProductsComponent>;
  const createProductServiceSpy = jasmine.createSpyObj('CreateProductService', ['createProduct']);
  const editProductServiceSpy = jasmine.createSpyObj('EditProductService', ['editProduct']);
  const validateIdServiceSpy = jasmine.createSpyObj('ValidateIdService', ['validateIdProducts']);

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      declarations: [AddEditProductsComponent],
      providers: [
        DatePipe,
        {
          provide: CreateProductService,
          useValue: createProductServiceSpy,
        },
        {
          provide: EditProductService,
          useValue: editProductServiceSpy,
        },
        {
          provide: ValidateIdService,
          useValue: validateIdServiceSpy,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditProductsComponent);
    component = fixture.componentInstance;
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario para crear', () => {
    component.initForm();
    expect(component.formAddEdit).toBeTruthy();
    expect(component.formAddEdit.get('id')).toBeTruthy();
    // Agrega más expectativas para la inicialización del formulario
  });

  it('debería cargar datos para editar', () => {
    const productData: CreateProductInterface = {
      id: 'test1',
      name: 'Producto de Prueba',
      description: 'Descripción de prueba',
      logo: 'test.jpg',
      date_release: new Date('2023-10-21'),
      date_revision: new Date('2024-10-21'),
    };

    localStorage.setItem('Product', JSON.stringify(productData));
    component.idEdit = 'test1';

    component.initForm();
    component.loadData();

    expect(component.formAddEdit.get('id')!.disabled).toBe(true);
    // Agrega más expectativas para la carga de datos
  });

  it('debería validar el control', () => {
    component.initForm();

    // Simular control no válido
    component.formAddEdit.get('id')?.setErrors({required: true});

    const esInvalido = component.validateControl('id');

    expect(esInvalido).toBe(true);
  });

  it('debería generar la fecha de revisión', () => {
    const fechaLanzamiento = '2023-10-21';
    component.initForm();
    component.formAddEdit.get('date_release')?.setValue(fechaLanzamiento);

    component.generateDateRevision();

    const fechaRevision = component.formAddEdit.get('date_revision')?.value;
    expect(fechaRevision).toBeTruthy();
    // Agrega más expectativas para la generación de la fecha de revisión
  });

  it('debería enviar la información para crear', () => {
    component.initForm();
    createProductServiceSpy.createProduct.and.returnValue(of('Creado'));

    component.sendInfo();

    expect(createProductServiceSpy.createProduct).toHaveBeenCalled();
    // Agrega más expectativas para la creación
  });

  it('debería enviar la información para editar', () => {
    component.initForm();
    component.idEdit = 'test1';
    editProductServiceSpy.editProduct.and.returnValue(of('Editado'));

    component.sendInfo();

    expect(editProductServiceSpy.editProduct).toHaveBeenCalled();
    // Agrega más expectativas para la edición
  });

  it('debería restablecer el formulario para editar', () => {
    component.initForm();
    component.idEdit = 'test1';

    component.resetForm();

    expect(component.formAddEdit.get('id')?.disabled).toBe(true);
    // Agrega más expectativas para el restablecimiento del formulario en la edición
  });

  it('debería restablecer el formulario para crear', () => {
    component.initForm();
    component.idEdit = '';

    component.resetForm();

    expect(component.formAddEdit.get('id')?.disabled).toBe(false);
    // Agrega más expectativas para el restablecimiento del formulario en la creación
  });

})
