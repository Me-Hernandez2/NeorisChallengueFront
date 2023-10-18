import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {CreateProductService} from "./services/create-product.service";
import {EditProductService} from "./services/edit-product.service";
import {CreateProductInterface} from "./models/createProduct.interface";
import {DatePipe} from "@angular/common";
import {ValidateIdService} from "./services/validate-id.service";


@Component({
  selector: 'app-add-edit-products',
  templateUrl: './add-edit-products.component.html',
  styleUrls: ['./add-edit-products.component.scss'],
  providers: [DatePipe]
})
export class AddEditProductsComponent implements OnInit {
  formAddEdit!: FormGroup
  actualDate = new Date()
  idEdit: string | null = null;


  constructor(private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private createProductService$: CreateProductService,
              private editProductService$: EditProductService,
              private validateIdService$: ValidateIdService,
              private datePipe: DatePipe) {
  }

  ngOnInit(): void {
    this.idEdit = this.activatedRoute.snapshot.params.id;
    this.initForm()
  }

  initForm() {
    this.formAddEdit = this.formBuilder.group({
      id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: [this.idEdit, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', [Validators.required]],
      date_release: ['', [Validators.required]],
      date_revision: ['', []],
    })

    if (this.idEdit) {
      this.loadData()
    }

  }

  loadData() {
    this.formAddEdit.controls['id'].disable();
    let product = JSON.parse(<string>localStorage.getItem("Product"))
    product.date_release = this.datePipe.transform(product.date_release, 'yyyy-MM-dd');
    product.date_revision = this.datePipe.transform(product.date_revision, 'yyyy-MM-dd');
    debugger
    this.formAddEdit.patchValue(product)
  }

  validateControl(controlName: string) {
    return this.formAddEdit.get(controlName)?.invalid
  }

  generateDateRevision() {
    const fechaInicial = new Date(this.formAddEdit.controls['date_release'].value)
    const fechaNueva = new Date(fechaInicial);
    // Sumar un año y un día
    fechaNueva.setFullYear(fechaInicial.getFullYear() + 1);
    fechaNueva.setDate(fechaInicial.getDate() + 1);
    // Formatear la fecha en "yyyy-MM-dd"
    const nuevoAnio = fechaNueva.getFullYear();
    const nuevoMes = (fechaNueva.getMonth() + 1).toString().padStart(2, '0');
    const nuevoDia = fechaNueva.getDate().toString().padStart(2, '0');
    const fechaFormateada = `${nuevoAnio}-${nuevoMes}-${nuevoDia}`;

    this.formAddEdit.controls['date_revision'].setValue(fechaFormateada)
  }

  sendInfo() {
    const payload: CreateProductInterface = {
      id: this.formAddEdit.controls['id'].value,
      name: this.formAddEdit.controls['name'].value,
      description: this.formAddEdit.controls['description'].value,
      logo: this.formAddEdit.controls['logo'].value,
      date_release: this.formAddEdit.controls['date_release'].value,
      date_revision: this.formAddEdit.controls['date_revision'].value,
    }
    if (this.idEdit) {
      this.editProductService$.editProduct(payload).subscribe()
    } else {
      this.validateIdService$.validateIdProducts(payload.id).subscribe((res:boolean)=>{
        if(!res){
          this.createProductService$.createProduct(payload).subscribe();
        }else{
          alert('Ya existe un producto con ese Id')
        }
      })
    }
  }

  resetForm() {
    if (this.idEdit) {
      const idValue = this.formAddEdit.get('id')!.value;
      this.formAddEdit.reset();
      this.formAddEdit.get('id')!.setValue(idValue);
      this.formAddEdit.controls['id'].disable();
    } else {
      this.formAddEdit.reset();
    }
  }


}
