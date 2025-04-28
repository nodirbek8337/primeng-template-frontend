import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { InputComponent } from "../../../shared/components/input/input.component";
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-example-table-form',
  standalone: true,
  templateUrl: './example-table-form.component.html',
  styleUrls: ['./example-table-form.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, InputComponent, SelectModule, CalendarModule],
})
export class ExampleTableFormComponent {
  @Input() model: any = {};
  @Input() loading: boolean = false;
  onClose!: () => void;
  onSubmitted!: (success: boolean) => void;

  form: FormGroup;

  roleOptions = [
    { label: 'Admin', value: 'Admin' },
    { label: 'User', value: 'User' },
    { label: 'Guest', value: 'Guest' },
  ];

  genderOptions = [
    { label: 'Erkak', value: 'male' },
    { label: 'Ayol', value: 'female' },
  ];

  statusOptions = [
    { label: 'Faol', value: 'active' },
    { label: 'Faol emas', value: 'inActive' },
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      role: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      gender: ['', Validators.required],
      status: ['', Validators.required],
      nationality: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  ngOnInit() {
    if (this.model) {
      this.form.patchValue(this.model);
    }
  }

  submitForm() {
    if (this.form.invalid) return;

    const payload = this.form.value;
    if (this.model?.id) {
      payload.id = this.model.id; 
    }

    this.onSubmitted?.(payload); 
  }

  closeModal() {
    this.onClose?.();
  }
}
