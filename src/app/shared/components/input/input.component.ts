import { Component, forwardRef, inject, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ControlContainer } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-input',
    standalone: true,
    imports: [NgIf, NgClass, InputTextModule, FormsModule],
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputComponent),
            multi: true
        }
    ]
})
export class InputComponent implements ControlValueAccessor, OnInit {
    private controlContainer = inject(ControlContainer);

    @Input() type: string = 'text';
    @Input() placeholder: string = '';
    @Input() formControlName!: string;
    @Input() required: boolean = false;

    value: any = '';
    isDisabled: boolean = false;
    showPassword = false;

    onChange = (_: any) => {};
    onTouched = () => {};

    ngOnInit(): void {
        const validator = this.control?.validator?.({} as any);
        this.required ||= !!validator?.['required'];
    }

    writeValue(val: any): void {
        this.value = val;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
    }

    get control() {
        return this.controlContainer?.control?.get(this.formControlName);
    }

    get actualType(): string {
        if (this.type !== 'password') return this.type;
        return this.showPassword ? 'text' : 'password';
    }

    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }

    shouldShowErrors(): boolean {
        const control = this.control;
        return !!control && this.required && control.invalid && (control.dirty || control.touched);
    }
}
