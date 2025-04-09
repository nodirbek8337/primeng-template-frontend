import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-example-table-form',
  standalone: true,
  templateUrl: './example-table-form.component.html',
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule],
})
export class ExampleTableFormComponent {
  @Input() model: any = {};
  onClose!: () => void;
  onSubmitted!: (success: boolean) => void;

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      role: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      gender: ['', Validators.required],
      nationality: ['', Validators.required],
      address: ['', Validators.required],
      birth_date: ['', Validators.required],
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
