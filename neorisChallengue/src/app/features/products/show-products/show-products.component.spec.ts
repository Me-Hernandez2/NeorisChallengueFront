import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowProductsComponent } from './show-products.component';
import { GetProductsService } from './services/get-products.service';
import { DeleteProductService } from './services/delete-product.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';

describe('ShowProductsComponent', () => {
  let component: ShowProductsComponent;
  let fixture: ComponentFixture<ShowProductsComponent>;
  let getProductsService: jasmine.SpyObj<GetProductsService>;
  let deleteProductService: jasmine.SpyObj<DeleteProductService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const getProductsServiceSpy = jasmine.createSpyObj('GetProductsService', ['getProducts']);
    const deleteProductServiceSpy = jasmine.createSpyObj('DeleteProductService', ['deleteProduct']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [ShowProductsComponent],
      providers: [
        { provide: GetProductsService, useValue: getProductsServiceSpy },
        { provide: DeleteProductService, useValue: deleteProductServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    fixture = TestBed.createComponent(ShowProductsComponent);
    component = fixture.componentInstance;
    getProductsService = TestBed.inject(GetProductsService) as jasmine.SpyObj<GetProductsService>;
    deleteProductService = TestBed.inject(DeleteProductService) as jasmine.SpyObj<DeleteProductService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('debería crear', () => {
    expect(component).toBeTruthy();
  });

  it('debería obtener productos al inicializar', () => {
    const productos = [
      {
        id: '1',
        name: 'Producto 1',
        description: 'Descripción 1',
        logo: 'Logo 1',
        date_release: new Date(),
        date_revision: new Date(),
      },
      {
        id: '2',
        name: 'Producto 2',
        description: 'Descripción 2',
        logo: 'Logo 2',
        date_release: new Date(),
        date_revision: new Date(),
      },
    ];
    getProductsService.getProducts.and.returnValue(of(productos));

    component.ngOnInit();

    expect(component.productsLS).toEqual(productos);
  });

  it('debería abrir el diálogo de confirmación', () => {
    const productId = '123';
    component.openConfirmationDialog(productId);

    expect(component.showConfirmationDialog).toBe(true);
    expect(component.idDelete).toBe(productId);
  });

  it('debería eliminar el producto', () => {
    const productId = '456';
    //deleteProductService.deleteProduct.and.returnValue(of(''));

    component.idDelete = productId;
    component.deleteProduct();

    expect(deleteProductService.deleteProduct).toHaveBeenCalledWith(productId);
    expect(component.showConfirmationDialog).toBe(false);
  });

  it('debería filtrar productos', () => {
    const productos = [
      {
        id: '1',
        name: 'Producto 1',
        description: 'Descripción 1',
        logo: 'Logo 1',
        date_release: new Date(),
        date_revision: new Date(),
      },
      {
        id: '2',
        name: 'Producto 2',
        description: 'Descripción 2',
        logo: 'Logo 2',
        date_release: new Date(),
        date_revision: new Date(),
      },
    ];

    component.backupProducts = [...productos];
    component.searchTerm = '1';

    component.filterProducts();

    expect(component.productsLS).toEqual([productos[0]]);
  });

});
