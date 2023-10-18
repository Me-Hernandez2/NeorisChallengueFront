import { Component, ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';
import { GetProductsService } from "./services/get-products.service";
import { ProductsInterface } from "./models/showProductsInterface";
import { Router } from "@angular/router";
import { DeleteProductService } from "./services/delete-product.service";

@Component({
  selector: 'app-show-products',
  templateUrl: './show-products.component.html',
  styleUrls: ['./show-products.component.scss']
})
export class ShowProductsComponent implements OnInit {

  // Estado para controlar si el menú desplegable está abierto
  isDropdownOpen = false;

  // Listado de productos y copia de respaldo
  productsLS: ProductsInterface[] = [];
  backupProducts: ProductsInterface[] = [];

  // Término de búsqueda
  searchTerm: string = '';

  // Elementos por página y página actual
  itemsPerPage = 5;
  currentPage = 1;

  // Control para mostrar el diálogo de confirmación de eliminación
  showConfirmationDialog = false;

  // ID del producto a eliminar
  idDelete = '';

  constructor(private el: ElementRef,
              private getProductsService$: GetProductsService,
              private deleteProductService$: DeleteProductService,
              private router: Router) {
  }

  ngOnInit(): void {
    // Al inicializarse el componente, se obtienen todos los productos
    this.getAllProducts();
  }

  // Función para alternar la apertura y cierre del menú desplegable de un producto
  toggleDropdown(product: any) {
    product.isDropdownOpen = !product.isDropdownOpen;
  }

  // Listener para cerrar el menú desplegable al hacer clic en cualquier parte del documento
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const clickedElement = event.target as HTMLElement;
    const dropdownElement = this.el.nativeElement.querySelector('div#dropdown.custom-select');

    if (clickedElement != dropdownElement) {
      this.isDropdownOpen = false;
    }
  }

  // Obtener todos los productos desde el servicio
  getAllProducts() {
    this.getProductsService$.getProducts().subscribe(res => {
      this.productsLS = [...res];
      this.backupProducts = [...this.productsLS];
    });
  }

  // Eliminar un producto
  deleteProduct() {
    this.deleteProductService$.deleteProduct(this.idDelete).subscribe(res => {
      alert(res); // Muestra un mensaje de alerta con la respuesta del servicio
    });
  }

  // Abrir el diálogo de confirmación para eliminar un producto
  openConfirmationDialog(id: string) {
    this.idDelete = id;
    this.showConfirmationDialog = true;
  }

  // Filtrar productos según un término de búsqueda
  filterProducts() {
    if (this.searchTerm) {
      // Convertir el término de búsqueda a minúsculas para una búsqueda sin distinción entre mayúsculas y minúsculas
      const searchTermLower = this.searchTerm.toLowerCase();
      // Aplicar filtro a los datos originales
      this.productsLS = this.backupProducts.filter(product =>
        // Comprueba si alguna columna contiene el término de búsqueda
        Object.values(product).some(value => {
          if (typeof value === 'string') {
            return value.toLowerCase().includes(searchTermLower);
          }
          return false; // No se aplica la búsqueda a valores no-strings
        }));
    } else {
      // Si el término de búsqueda está vacío, restaurar los datos originales
      this.productsLS = [...this.backupProducts];
    }
  }

  // Verificar si un elemento está en la página actual según la paginación
  isItemInPage(item: ProductsInterface): boolean {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage - 1;
    const itemIndex = this.productsLS.indexOf(item);
    return itemIndex >= startIndex && itemIndex <= endIndex;
  }

  // Ir a la página anterior
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Ir a la página siguiente
  nextPage() {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
    }
  }

  // Calcular el número total de páginas según la paginación
  getTotalPages(): number {
    return Math.ceil(this.productsLS.length / this.itemsPerPage);
  }

  // Cambiar la cantidad de elementos por página
  changeItemsPerPage() {
    // Reiniciar la página actual a 1 cuando cambie la cantidad de elementos por página.
    this.currentPage = 1;
  }

  // Redirigir a la página de edición de un producto
  goToEdit(product: ProductsInterface) {
    // Almacenar el producto en el almacenamiento local para que esté disponible en la página de edición
    localStorage.setItem("Product", JSON.stringify(product));
    // Redirigir a la página de edición
    this.router.navigate(['/products/edit', product.id]);
  }
}
