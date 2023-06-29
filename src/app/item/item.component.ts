import { Component , OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ItemService } from '../item.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit{
  searchTerm: string = '';
  items: any[] = [];
  currentItem: any = {};
  form!: FormGroup;

  constructor(private itemService: ItemService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getItems();
    this.buildForm();
  }

  getItems(): void {
    this.itemService.getItems()
      .subscribe((items) => {
        this.items = items;
      });
  }

  buildForm(): void {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9áéíóúÁÉÍÓÚ\s ]+')]],
      description: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9áéíóúÁÉÍÓÚ\s ]+')]],
      marca: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9áéíóúÁÉÍÓÚ\s ]+')]],
      ram: ['', [Validators.required, Validators.pattern('^([0-5]?[0-9]):([0-5]?[0-9])$')]],
      date: ['', [Validators.required, Validators.min(60), Validators.max(180)]]
    });
  }

  getItemById(id: string): void {
    this.itemService.getItemById(id)
      .subscribe((item) => {
        this.currentItem = item;
      });
  }
  filterItems(): void {
    // Filtrar los elementos de la lista según el término de búsqueda
    this.items = this.items.filter((item) =>
      item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  createItem(item: any): void {
    this.itemService.createItem(item)
      .subscribe(() => {
        Swal.fire('Creado', 'creado exitosamente', 'success');
    
        this.getItems();
        this.currentItem = {};
      },
      () => {
        Swal.fire('Error', 'problema al crear', 'error');
      }

      );
  }
  updateItem(id: string, item: any): void {
    this.itemService.updateItem(id, item)
      .subscribe(() => {
        Swal.fire('Actualizado', 'El elemento ha sido actualizado exitosamente', 'success');
          
        this.getItems();
        this.currentItem = {};
      }
      ,
        () => {
          Swal.fire('Error', 'Hubo un problema al actualizar el elemento', 'error');
        });
  }

  deleteItem(id: string): void {

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.itemService.deleteItem(id)
      .subscribe(() => {
        this.getItems();
      });
      }
    });
    
  }

  editItem(id: string): void {
    this.getItemById(id);
  }
}
