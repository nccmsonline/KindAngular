import { Directive, HostListener, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appMiniSidebar]'
})
export class MiniSidebarDirective {

  private treeview;
    constructor(private eRef: ElementRef, private renderer: Renderer2) {
        this.treeview = this.eRef.nativeElement.parentElement.parentElement.parentElement.parentElement.parentElement;
    }
    @HostListener('click') toggle() {
      console.log("this.treeview", this.treeview);

        !this.treeview.classList.contains('mini-sidebar') ? this.expand() : this.shrink();
    }

    public expand() {
        this.renderer.addClass(this.treeview,'mini-sidebar');
        this.renderer.setAttribute(this.treeview, 'data-sidebartype', 'mini-sidebar');
    }
    
    public shrink() {
        this.renderer.removeClass(this.treeview,'mini-sidebar');
        this.renderer.setAttribute(this.treeview, 'data-sidebartype', 'full');
    }
}
