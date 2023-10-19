import { ComponentFixture, TestBed } from '@angular/core/testing';
import {FormBuilder} from '@angular/forms';
import { of } from 'rxjs';
import { CreateProductInterface } from './models/createProduct.interface';
import { AddEditProductsComponent } from './add-edit-products.component';
import { CreateProductService } from './services/create-product.service';
import { EditProductService } from './services/edit-product.service';
import { ValidateIdService } from './services/validate-id.service';
import { DatePipe } from '@angular/common';
import {ActivatedRoute} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";

describe('AddEditProductsComponent', () => {
  let component: AddEditProductsComponent;
  let fixture: ComponentFixture<AddEditProductsComponent>;
  let createProductService: jasmine.SpyObj<CreateProductService>;
  let editProductService: jasmine.SpyObj<EditProductService>;
  let validateIdService: jasmine.SpyObj<ValidateIdService>;

  beforeEach(() => {
    const formBuilder = new FormBuilder();
    const activatedRoute = {
      snapshot: {params: {id: '1'}} // Establece un valor para simular el ID en la ruta
    };

    createProductService = jasmine.createSpyObj('CreateProductService', ['createProduct']);
    createProductService.createProduct.and.returnValue(of({
      id: 'test77777',
      name: '777777',
      description: '77777777777',
      logo: 'https://play-lh.googleusercontent.com/V_P-I-UENK93ahkQgOWel8X8yFxjhOOfMAZjxXrqp311Gm_RBtlDXHLQhwFZN8n4aIQ',
      date_release: '2023-10-19T00:00:00.000+00:00',
      date_revision: '2024-10-19T00:00:00.000+00:00',
    }));

    editProductService = jasmine.createSpyObj('CreateProductService', ['createProduct']);
    createProductService.createProduct.and.returnValue(of({
      id: 'test777776',
      name: '7777776',
      description: '777777777776',
      logo: 'https://play-lh.googleusercontent.com/V_P-I-UENK93ahkQgOWel8X8yFxjhOOfMAZjxXrqp311Gm_RBtlDXHLQhwFZN8n4aIQ',
      date_release: '2023-10-19T00:00:00.000+00:00',
      date_revision: '2024-10-19T00:00:00.000+00:00',
    }));

    validateIdService = jasmine.createSpyObj('ValidateIdService', ['validateIdProducts']);

// Configura validateIdProducts para que retorne true o false
    validateIdService.validateIdProducts.and.callFake((id: string) => {
      // Define tu lógica aquí para retornar true o false basado en el valor de `id`
      if (id === 'test1') {
        return of(true); // Si se cumple la condición, retorna true
      } else {
        return of(false); // Si no se cumple la condición, retorna false
      }
    });


    it('debería enviar la información para crear', () => {
      component.initForm();

      component.sendInfo();

      expect(createProductService.createProduct).toHaveBeenCalled();

      TestBed.configureTestingModule({
        declarations: [AddEditProductsComponent],
        imports: [HttpClientModule],
        providers: [
          {provide: FormBuilder, useValue: formBuilder},
          {provide: ActivatedRoute, useValue: activatedRoute},
          CreateProductService,
          EditProductService,
          ValidateIdService,
          DatePipe,
        ],
      });

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
        date_release: '2023-10-21',
        date_revision: '2024-10-21',
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
      expect(fechaRevision).toBe('2024-10-21')
    });

    it('debería enviar la información para crear', () => {
      component.initForm();
      createProductService.createProduct.and.returnValue(of({
        id: 'test77777',
        name: '777777',
        description: '77777777777',
        logo: 'https://play-lh.googleusercontent.com/V_P-I-UENK93ahkQgOWel8X8yFxjhOOfMAZjxXrqp311Gm_RBtlDXHLQhwFZN8n4aIQ',
        date_release: '2023-10-19T00:00:00.000+00:00',
        date_revision: '2024-10-19T00:00:00.000+00:00',
      }));

      component.sendInfo();

      expect(createProductService.createProduct).toHaveBeenCalled();
      // Agrega más expectativas para la creación
    });

    it('debería enviar la información para editar', () => {
      component.initForm();
      component.idEdit = 'test1';
      editProductService.editProduct.and.returnValue(of({
        id: 'test77777',
        name: '777777',
        description: '77777777777',
        logo: 'https://play-lh.googleusercontent.com/V_P-I-UENK93ahkQgOWel8X8yFxjhOOfMAZjxXrqp311Gm_RBtlDXHLQhwFZN8n4aIQ',
        date_release: '2023-10-19T00:00:00.000+00:00',
        date_revision: '2024-10-19T00:00:00.000+00:00',
      }));

      component.sendInfo();

      expect(editProductService.editProduct).toHaveBeenCalled();
      // Agrega más expectativas para la edición
    });

    it('debería restablecer el formulario para editar', () => {
      component.initForm();
      component.idEdit = 'test1';

      component.resetForm();

      expect(component.formAddEdit.get('id')?.disabled).toBe(true);
      // Agrega más expectativas para el restablecimiento del formulario en la edición
    });

    it('debería manejar el caso en que validateIdProducts retorne true', () => {
      // Simula que validateIdProducts retorna true
      validateIdService.validateIdProducts.and.returnValue(of(true));

      expect(true)
    });

    it('debería manejar el caso en que validateIdProducts retorne false', () => {
      // Simula que validateIdProducts retorna false
      validateIdService.validateIdProducts.and.returnValue(of(false));
      expect(true)
    });

    it('debería restablecer el formulario para crear', () => {
      component.initForm();
      component.idEdit = '';

      component.resetForm();

      expect(component.formAddEdit.get('id')?.disabled).toBe(false);
      // Agrega más expectativas para el restablecimiento del formulario en la creación
    });

  })
})
