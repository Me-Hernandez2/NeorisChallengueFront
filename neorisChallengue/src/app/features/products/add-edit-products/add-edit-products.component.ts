import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { CreateProductService } from "./services/create-product.service";
import { EditProductService } from "./services/edit-product.service";
import { CreateProductInterface } from "./models/createProduct.interface";
import { DatePipe } from "@angular/common";
import { ValidateIdService } from "./services/validate-id.service";

@Component({
  selector: 'app-add-edit-products',
  templateUrl: './add-edit-products.component.html',
  styleUrls: ['./add-edit-products.component.scss'],
  providers: [DatePipe]
})
export class AddEditProductsComponent implements OnInit {
  // Formulario para agregar o editar productos
  formAddEdit!: FormGroup;

  // Fecha actual
  actualDate = new Date();

  // ID del producto a editar (si es una edición)
  idEdit: string | null = null;

  constructor(private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private createProductService$: CreateProductService,
              private editProductService$: EditProductService,
              private validateIdService$: ValidateIdService,
              private datePipe: DatePipe) {
  }

  ngOnInit(): void {
    // Obtener el ID del producto desde la URL (si se está editando)
    this.idEdit = this.activatedRoute.snapshot.params.id;
    // Inicializar el formulario
    this.initForm();
  }

  // Inicializar el formulario
  initForm() {
    this.formAddEdit = this.formBuilder.group({
      id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: [this.idEdit, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', [Validators.required]],
      date_release: ['', [Validators.required]],
      date_revision: ['', []],
    });

    // Si se está editando, cargar los datos del producto
    if (this.idEdit) {
      this.loadData();
    }
  }

  // Cargar datos del producto para edición
  loadData() {
    // Deshabilitar la edición del campo 'id'
    this.formAddEdit.controls['id'].disable();
    // Obtener los datos del producto desde el almacenamiento local
    let product = JSON.parse(<string>localStorage.getItem("Product"));
    // Formatear las fechas
    product.date_release = this.datePipe.transform(product.date_release, 'yyyy-MM-dd');
    product.date_revision = this.datePipe.transform(product.date_revision, 'yyyy-MM-dd');
    // Aplicar los datos al formulario
    this.formAddEdit.patchValue(product);
  }

  // Validar si un control del formulario es inválido
  validateControl(controlName: string) {
    return this.formAddEdit.get(controlName)?.invalid;
  }

  // Generar la fecha de revisión a partir de la fecha de lanzamiento
  generateDateRevision() {
    const fechaInicial = new Date(this.formAddEdit.controls['date_release'].value);
    const fechaNueva = new Date(fechaInicial);
    // Sumar un año y un día
    fechaNueva.setFullYear(fechaInicial.getFullYear() + 1);
    fechaNueva.setDate(fechaInicial.getDate() + 1);
    // Formatear la fecha en "yyyy-MM-dd"
    const nuevoAnio = fechaNueva.getFullYear();
    const nuevoMes = (fechaNueva.getMonth() + 1).toString().padStart(2, '0');
    const nuevoDia = fechaNueva.getDate().toString().padStart(2, '0');
    const fechaFormateada = `${nuevoAnio}-${nuevoMes}-${nuevoDia}`;
    // Establecer la fecha de revisión en el formulario
    this.formAddEdit.controls['date_revision'].setValue(fechaFormateada);
  }

  // Enviar la información del producto (agregar o editar)
  sendInfo() {
    const payload: CreateProductInterface = {
      id: this.formAddEdit.controls['id'].value,
      name: this.formAddEdit.controls['name'].value,
      description: this.formAddEdit.controls['description'].value,
      logo: this.formAddEdit.controls['logo'].value,
      date_release: this.formAddEdit.controls['date_release'].value,
      date_revision: this.formAddEdit.controls['date_revision'].value,
    };
    // Si se está editando, llamar al servicio de edición
    if (this.idEdit) {
      this.editProductService$.editProduct(payload).subscribe();
    } else { // Si se está agregando un nuevo producto
      // Validar si ya existe un producto con el mismo ID
      this.validateIdService$.validateIdProducts(payload.id).subscribe((res: boolean) => {
        if (!res) { // Si no existe, agregar el producto
          this.createProductService$.createProduct(payload).subscribe();
        } else { // Si ya existe, mostrar una alerta
          alert('Ya existe un producto con ese ID');
        }
      });
    }
  }

  // Restablecer el formulario
  resetForm() {
    if (this.idEdit) { // Si se está editando, mantener el valor del campo 'id'
      const idValue = this.formAddEdit.get('id')!.value;
      this.formAddEdit.reset();
      this.formAddEdit.get('id')!.setValue(idValue);
      this.formAddEdit.controls['id'].disable();
    } else {
      // Si se está agregando un nuevo producto, se restablece por completo.
      this.formAddEdit.reset();
    }
  }
}
