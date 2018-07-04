import { Directive, TemplateRef, ViewContainerRef, Input } from '@angular/core';
import { SecurityService } from './security.service';

@Directive({
  selector: '[hasClaim]'
})
export class HasClaimDirective {

  constructor(private templateRef : TemplateRef<any>,
  private viewContainer: ViewContainerRef, 
  private securityService: SecurityService ) {
   }//Constructor ends here

   @Input() set hasClaim(claimType: any) {
    if (this.securityService.hasClaim(claimType)) {
      // Add template to DOM
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      // Remove template from DOM
      this.viewContainer.clear(); 
    }
  }
}
