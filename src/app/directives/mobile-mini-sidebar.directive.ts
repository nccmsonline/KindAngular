import { Directive, HostListener, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appMobileMiniSidebar]'
})
export class MobileMiniSidebarDirective {

  private treeview;
    constructor(private eRef: ElementRef, private renderer: Renderer2) {
        this.treeview = this.eRef.nativeElement.parentElement.parentElement.parentElement.parentElement.parentElement;
        // this.expand();
        // console.log("this.treeview", this.treeview);
    }
    @HostListener('click') toggle() {
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
