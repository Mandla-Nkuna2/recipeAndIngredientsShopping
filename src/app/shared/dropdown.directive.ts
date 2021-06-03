import { Directive, HostBinding, HostListener } from "@angular/core";

@Directive({
    selector: '[appDropdown]'
})

export class DirectiveDropdown {
    @HostBinding('class.open') isOpen = false;
    
    @HostListener('click') toggleClassOpen() {
        this.isOpen = !this.isOpen; 
    }
}