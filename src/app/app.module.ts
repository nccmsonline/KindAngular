
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, enableProdMode } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { GrdFilterPipe } from './filter.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination'; // Pagination
import { TreeviewModule } from 'ngx-treeview'; // Treeview
import {NgxSelectModule} from '../assets/public_api';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MAT_DATE_FORMATS, NativeDateAdapter, DateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import {ChartModule} from 'primeng/chart';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';



import {PaymentConfirmationService} from './Modules/Accounts/payment-confirmation/payment-confirmation.service';
import { AppDateAdapter, APP_DATE_FORMATS} from './date.adapter';
import { SelectDropDownModule } from 'ngx-select-dropdown';//dropdown
import { LoginRoute } from './login-route';
import { SupplierMasterService } from './Modules/Master/supplier-master/supplier-master.service';
import { LoginService } from './Modules/General/login/login.service';
import { AccountGroupMasterService } from './Modules/General/account-group-master/account-group-master.service';
import { CustomerMasterService } from './Modules/General/customer-master/customer-master.service';
import { GeneralLedgerService } from './Modules/General/general-ledger/general-ledger.service';
import { GoodsReceiptNoteService } from './Modules/Material-Management/goods-receipt-note/goods-receipt-note.service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ScrollSpyDirective } from './scroll-spy.directive';
import { LoremIpsumComponent } from './lorem-ipsum.component';
import { AppComponent } from './app.component';
import { LoginComponent } from './Modules/General/login/login.component';
import { VoucherEntryComponent } from './Modules/Sale-Order/voucher-entry/voucher-entry.component';
import { SupplierMasterComponent } from './Modules/Master/supplier-master/supplier-master.component';
import { CustomerMasterComponent } from './Modules/General/customer-master/customer-master.component';
import { GeneralLedgerComponent } from './Modules/General/general-ledger/general-ledger.component';
import { StatementAccountComponent } from './Modules/Accounts/statement-account/statement-account.component';
import { AccountGroupMasterComponent } from './Modules/General/account-group-master/account-group-master.component';
import { ItemMasterComponent } from './Modules/General/item-master/item-master.component';
import { PurchaseOrderComponent } from './Modules/IndentAndPO/purchase-order/purchase-order.component';
import { IndentEntryComponent } from './Modules/IndentAndPO/indent-entry/indent-entry.component';
import { EmployeeMasterComponent } from './Modules/General/employee-master/employee-master.component';
import { AddNewGeneralLedgerComponent } from './Modules/General/general-ledger/add-new-general-ledger/add-new-general-ledger.component';
import { AddNewAccountGroupMasterComponent } from './Modules/General/account-group-master/add-new-account-group-master/add-new-account-group-master.component';
import { AddNewIndentEntryComponent } from './Modules/IndentAndPO/indent-entry/add-new-indent-entry/add-new-indent-entry.component';
import { PrintIndentComponent } from './Modules/IndentAndPO/indent-entry/add-new-indent-entry/add-new-indent-entry.component';
import { AddNewSupplierMasterComponent } from './Modules/Master/supplier-master/add-new-supplier-master/add-new-supplier-master.component';
import { AddNewItemMasterComponent } from './Modules/General/item-master/add-new-item-master/add-new-item-master.component';
import { AddNewCustomerMasterComponent } from './Modules/General/customer-master/add-new-customer-master/add-new-customer-master.component';
import { AddNewPurchaseOrderComponent, PrintPOComponent } from './Modules/IndentAndPO/purchase-order/add-new-purchase-order/add-new-purchase-order.component';
import { NewEmployeeMasterComponent } from './Modules/General/employee-master/new-employee-master/new-employee-master.component';
import { ItemEnquiryComponent } from './Modules/General/item-enquiry/item-enquiry.component';
import { AddNewItemEnquiryComponent } from './Modules/General/item-enquiry/add-new-item-enquiry/add-new-item-enquiry.component';
import { AddNewGoodsReceiptNoteComponent } from "./Modules/Material-Management/goods-receipt-note/add-new-goods-receipt-note/add-new-goods-receipt-note.component";
import { GoodsReceiptNoteComponent } from  './Modules/Material-Management/goods-receipt-note/goods-receipt-note.component';
import { ConfirmationDialogComponent } from './Dialog/confirmation-dialog/confirmation-dialog.component';
import {ConfirmationDialogService} from './Dialog/confirmation-dialog/confirmation-dialog.service';
import { AddNewLoginComponent } from './Modules/General/login/add-new-login/add-new-login.component';
import { EmptyscreenComponent } from './Modules/General/emptyscreen/emptyscreen.component';
import { SuccessDialogComponent } from './Dialog/success-dialog/success-dialog.component';


//import { multiplecheques } from './Modules/General/Accounts/payment-scheduling/payment-scheduling.component';


import { DashboardComponent } from './Modules/Accounts/dashboard/dashboard.component';
import { SaleDetailComponent } from './Modules/Accounts/dashboard/sale-detail/sale-detail.component';
import { SaleBillComponent } from './Modules/Accounts/dashboard/sale-bill/sale-bill.component';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { IntlModule } from '@progress/kendo-angular-intl';
import { TimePickerModule, DateInputsModule } from '@progress/kendo-angular-dateinputs';
import {PanelMenuModule} from 'primeng/panelmenu';
import {MenuModule} from 'primeng/menu';
import { ChangePassword } from './Modules/General/login/add-new-login/add-new-login.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { LayoutModule } from './layout/layout.module';
////Employee
import { OverTimeEntryComponent } from './Modules/HR/OT/over-time-entry/over-time-entry.component';
import { OverTimePassingComponent } from './Modules/HR/OT/over-time-passing/over-time-passing.component';
import { EmployeeProfileComponent } from './Modules/HR/employee-profile/employee-profile.component';
import { SalarySlipComponent } from './Modules/HR/salary-slip/salary-slip.component';
import { HRReportsComponent } from './Modules/HR/hrreports/hrreports.component';
import { PassedOTListComponent } from './Modules/HR/hrreports/passed-otlist/passed-otlist.component';
import { LeaveEntryComponent } from './Modules/HR/leaves/leave-entry/leave-entry.component';
import { LeaveApprovalComponent } from './Modules/HR/leaves/leave-approval/leave-approval.component';
import { OTSumaryComponent } from './Modules/HR/hrreports/ot-sumary/ot-sumary.component';
import { AdvanceRequirmentComponent } from './Modules/HR/Advance/advance-requirment/advance-requirment.component';
import { OverTimeAmendmentComponent } from './Modules/HR/OT/over-time-amendment/over-time-amendment.component';
import { OverTimeAmendmentApprovalComponent } from './Modules/HR/OT/over-time-amendment-approval/over-time-amendment-approval.component';
import { SpecialRewardsReportComponent } from './Modules/HR/hrreports/special-rewards-report/special-rewards-report.component';
import { EmployeeAbsentListComponent } from './Modules/HR/hrreports/employee-absent-list/employee-absent-list.component';
import { ChnageModeOfPaymentComponent } from './Modules/Accounts/chnage-mode-of-payment/chnage-mode-of-payment.component';
import { PackageOTListComponent } from './Modules/HR/hrreports/package-otlist/package-otlist.component';
import { TourIntimationComponent } from './Modules/HR/tour-intimation/tour-intimation.component';
import { AddNewTourIntimationComponent } from './Modules/HR/tour-intimation/add-new-tour-intimation/add-new-tour-intimation.component';
import { TourApprovalComponent } from './Modules/HR/tour-approval/tour-approval.component';
import { OverTimePassingForMoreThan2Component } from './Modules/HR/OT/over-time-passing-for-more-than2/over-time-passing-for-more-than2.component';
import { EmployeeGatePassComponent } from './Modules/HR/GatePass/employee-gate-pass/employee-gate-pass.component';
import { GatePassApprovalComponent } from './Modules/HR/GatePass/gate-pass-approval/gate-pass-approval.component';
import { AdvanceImperestApprovalComponent } from './Modules/HR/Advance/advance-imperest-approval/advance-imperest-approval.component';
import { EmployeeGatePassListReportComponent } from './Modules/HR/hrreports/employee-gate-pass-list-report/employee-gate-pass-list-report.component';
import { EmployeeLeaveListComponent } from './Modules/HR/hrreports/employee-leave-list/employee-leave-list.component';
import { PrintAdvanceSlip } from './Modules/HR/Advance/advance-imperest-approval/advance-imperest-approval.component';
import {WebcamModule} from 'ngx-webcam';
import { CameraComponent } from './camera/camera.component';
import { PrintTourForm } from './Modules/HR/Advance/advance-imperest-approval/advance-imperest-approval.component';
import { OTWithGatePassComponent } from './Modules/HR/hrreports/otwith-gate-pass/otwith-gate-pass.component';
import { AdvanceStatusComponent } from './Modules/HR/Advance/advance-status/advance-status.component';
///Inventory
import { RequirmentFolloupComponent } from './Modules/IndentAndPO/requirment-folloup/requirment-folloup.component';
import { IndentPassingComponent } from './Modules/IndentAndPO/indent-passing/indent-passing.component';
import { RateApprovalConfirmatonComponent } from './Modules/IndentAndPO/rate-approval-confirmaton/rate-approval-confirmaton.component';
import { followup } from  './Modules/IndentAndPO/requirment-folloup/requirment-folloup.component';
//Store
import { AddNewStoreRequisitionSlipComponent } from './Modules/Inventory/store-requisition-slip/add-new-store-requisition-slip/add-new-store-requisition-slip.component';
import { StoreRequisitionSlipComponent } from './Modules/Inventory/store-requisition-slip/store-requisition-slip.component';
import { AddNewIssunaceSlipComponent } from './Modules/Inventory/issuance-slip/add-new-issunace-slip/add-new-issunace-slip.component';
import { IssuanceSlipComponent } from './Modules/Inventory/issuance-slip/issuance-slip.component';
import {PrintIssuanceComponent} from './Modules/Inventory/issuance-slip/add-new-issunace-slip/add-new-issunace-slip.component';
import { StoreIndentComponent } from './Modules/Inventory/store-indent/store-indent.component';
import { StoreIndentDetailComponent } from './Modules/Inventory/store-indent/store-indent.component';
import { StoreRequisationStatusComponent } from './Modules/Inventory/store-requisition-slip/store-requisition-slip.component';

//Production
import { FinshingBOMComponent } from './Modules/Production/Finishing/finshing-bom/finshing-bom.component';
import { AddNewFnishingBOMComponent } from './Modules/Production/Finishing/finshing-bom/add-new-fnishing-bom/add-new-fnishing-bom.component';
import { TechnicalAssessmentComponent } from './Modules/Production/DieAndTools/die-and-tool/technical-assessment/technical-assessment.component';
import { DieAndToolComponent } from './Modules/Production/DieAndTools/die-and-tool/die-and-tool.component';
import { AddNewDieComponent } from './Modules/Production/DieAndTools/die-and-tool/add-new-die/add-new-die.component';

//Sop
import { SaleOrderFollowUpComponent } from './Modules/Sale-Order/sale-order-follow-up/sale-order-follow-up.component';
import { OrderConfirmationComponent } from './Modules/Sale-Order/order-confirmation/order-confirmation.component';
import { ProformaListComponent , ExportInvoiceShippingDetailComponent} from './Modules/Sale-Order/proforma-list/proforma-list.component';
import { PeningOrderReportABCCatComponent } from './Modules/Sale-Order/Sale-Order-Reports/pening-order-report-abccat/pening-order-report-abccat.component';
import { GSTR2AComponent } from './Modules/Sale-Order/GST-Return/gstr2-a/gstr2-a.component';
import { gst2ABillDetailComponent } from './Modules/Sale-Order/GST-Return/gstr2-a/gstr2-a.component';
import { gst2AVoucherDetailComponent } from './Modules/Sale-Order/GST-Return/gstr2-a/gstr2-a.component';
import { DespatchFollowUp } from './Modules/Sale-Order/sale-order-follow-up/sale-order-follow-up.component';
import { SaleOrderReportComponent } from './Modules/Sale-Order/Sale-Order-Reports/sale-order-report/sale-order-report.component';
import { RecieveCustomerOrderComponent } from './Modules/Sale-Order/Sale-Order-Reports/recieve-customer-order/recieve-customer-order.component';
import { PendingCustomerOrdersComponent } from './Modules/Sale-Order/Sale-Order-Reports/pending-customer-orders/pending-customer-orders.component';
import { DespatchedCustomerOrdersComponent } from './Modules/Sale-Order/Sale-Order-Reports/despatched-customer-orders/despatched-customer-orders.component';
import { CustomerOrderComponent } from './Modules/Sale-Order/customer-order/customer-order.component';
import { AddNewCustomerOrderComponent, PrintSaleOrderComponent } from './Modules/Sale-Order/customer-order/add-new-customer-order/add-new-customer-order.component';
import {GroupByCustomerPipe} from './Modules/Sale-Order/Sale-Order-Reports/recieve-customer-order/recieve-customer-order.component';
import { PaymentChartComponent } from './Modules/Accounts/payment-chart/payment-chart.component';


//Masters
import { ValidationComponent } from '././validation/validation.component';
import { ConfirmAlertComponent } from './confirm-alert/confirm-alert.component';
import { AllSupplierMasterComponent } from './Modules/Master/all-supplier-master/all-supplier-master.component';
import { SupplierFirstScreenComponent } from './Dialog/supplier-first-screen/supplier-first-screen.component';
import { ItemsBelongsToComponent } from './Modules/Master/items-belongs-to/items-belongs-to.component';
import { AddNewItemBelongsToComponent } from './Modules/Master/items-belongs-to/add-new-item-belongs-to/add-new-item-belongs-to.component';
import { ItemSubCategoryComponent } from './Modules/Master/item-sub-category/item-sub-category.component';
import { AddNewItemSubCategoryComponent } from './Modules/Master/item-sub-category/add-new-item-sub-category/add-new-item-sub-category.component';
import { ItemMaterialComponent } from './Modules/Master/item-material/item-material.component';
import { AddNewItemMaterialComponent } from './Modules/Master/item-material/add-new-item-material/add-new-item-material.component';
import { ItemTypeComponent } from './Modules/Master/item-type/item-type.component';
import { AddNewItemTypeComponent } from './Modules/Master/item-type/add-new-item-type/add-new-item-type.component';
import { ItemsMasterComponent } from './Modules/Master/items-master/items-master.component';
import { AddNewItemComponent } from './Modules/Master/items-master/add-new-item/add-new-item.component';

//Accounts
import { GSTVoucherComponent } from './Modules/Accounts/gstvoucher/gstvoucher.component';
import { PrintVoucherComponent } from './Modules/Accounts/print-voucher/print-voucher.component';
import { AddNewGSTVoucherComponent } from './Modules/Accounts/gstvoucher/add-new-gstvoucher/add-new-gstvoucher.component';
import { PaymentDetailComponent } from './Modules/Accounts/payment-confirmation/payment-detail/payment-detail.component';
import { RTGSClearanceComponent } from './Modules/Accounts/rtgs-clearance/rtgs-clearance.component';
import { NeftFormatMasterComponent } from './Modules/Master/neft-format-master/neft-format-master.component';
import { NeftFormatComponent } from './Modules/Accounts/neft-format/neft-format.component';
import { AddNewFormatComponent } from './Modules/Accounts/neft-format/add-new-format/add-new-format.component';
import { PrintNeftFormatComponent } from './Modules/Accounts/rtgs-clearance/print-neft-format/print-neft-format.component';
import { PrintChequeComponent } from './Modules/Accounts/print-cheque/print-cheque.component';
import { PrintChequeReportComponent } from './Modules/Accounts/print-cheque/print-cheque.component';
import { PrintSinghNeftComponent } from './Modules/Accounts/print-cheque/print-cheque.component';
import { EditChequeComponent } from './Modules/Accounts/print-cheque/print-cheque.component';
import { PostDatedChequeBudgetWiseComponent } from './Modules/Accounts/day-book-and-report/post-dated-cheque-budget-wise/post-dated-cheque-budget-wise.component';
import { DayBookAndReportComponent } from './Modules/Accounts/day-book-and-report/day-book-and-report.component';
import { PostDatedChequeLedgerComponent } from './Modules/Accounts/day-book-and-report/post-dated-cheque-ledger/post-dated-cheque-ledger.component';
import { ChequeRecoComponent } from './Modules/Accounts/cheque-reco/cheque-reco.component';
import { AccountStatementComponent } from './Modules/Accounts/statement-account/account-statement/account-statement.component';
import { PaymentSchedulingComponent } from './Modules/Accounts/payment-scheduling/payment-scheduling.component';
import { PaymentConfirmationComponent } from './Modules/Accounts/payment-confirmation/payment-confirmation.component';
import { ChartDetailComponent } from './Modules/Accounts/payment-chart/chart-detail/chart-detail.component';
import { PaymentChart1Component } from './Modules/Accounts/payment-chart1/payment-chart1.component';
import { PaymentRequirementComponent } from './Modules/Accounts/payment-requirement/payment-requirement.component';
import { AddNewPaymentRequirmentComponent } from './Modules/Accounts/payment-requirement/add-new-payment-requirment/add-new-payment-requirment.component';
import { PaymentPaasingAnSchedulingComponent } from './Modules/Accounts/payment-paasing-an-scheduling/payment-paasing-an-scheduling.component';
import { MRIREntryComponent } from './Modules/Inventory/mrirentry/mrirentry.component';
import { AddNewMRIRComponent,PrintMRIRComponent } from './Modules/Inventory/mrirentry/add-new-mrir/add-new-mrir.component';
import { DrCrNoteViewComponent, DrcrNotePrintComponent } from './Modules/Inventory/dr-cr-note-view/dr-cr-note-view.component';
import { PurchaseOrderFastTrackComponent, poAdditionalInfo } from './Modules/IndentAndPO/purchase-order-fast-track/purchase-order-fast-track.component';
import { OrderStatusReportComponent } from './Modules/Sale-Order/order-status-report/order-status-report.component';
import { UpdateCriticalItemsComponent } from './Modules/Inventory/update-critical-items/update-critical-items.component';
import { GateEntryListComponent } from './Modules/Inventory/gate-entry-list/gate-entry-list.component';
import { AddNewGateEntryComponent,gateEntryPrintComponent } from './Modules/Inventory/gate-entry-list/add-new-gate-entry/add-new-gate-entry.component';
import { DiePlanningComponent, DiePlanningPrintComponent, HourlyMachineComponent } from './Modules/Production/die-planning/die-planning.component';
import { GSTInvoiceComponent } from './Modules/Sale-Order/proforma-list/gstinvoice/gstinvoice.component';
import { MapPartyProductFromAnotherPartyComponent } from './Modules/Sale-Order/map-party-product-from-another-party/map-party-product-from-another-party.component';
import { OrderKnockedOffComponent } from './Modules/Sale-Order/order-knocked-off/order-knocked-off.component';
import { VehicleGatePassComponent } from './Modules/Sale-Order/vehicle-gate-pass/vehicle-gate-pass.component';
import { NewVehicleGatePassComponent } from './Modules/Sale-Order/vehicle-gate-pass/new-vehicle-gate-pass/new-vehicle-gate-pass.component';
import { GSTSummaryComponent } from './Modules/Sale-Order/gstsummary/gstsummary.component';
import { PrintSaleReturnNoteComponent } from './Modules/Sale-Order/print-sale-return-note/print-sale-return-note.component';
import { GSTR2BComponent } from './Modules/Sale-Order/gstr2-b/gstr2-b.component';




enableProdMode();

const routes: Routes = [
  { path: '', component: LoginComponent, canActivate:[LoginRoute], pathMatch: 'full'},
 
  { path: 'supplier-master', component: SupplierMasterComponent, canActivate:[LoginRoute]},
  { path: 'customer-master', component: CustomerMasterComponent, canActivate:[LoginRoute]},
  { path: 'general-ledger', component: GeneralLedgerComponent, canActivate:[LoginRoute]},
  { path: 'statement-account/:flag', component: StatementAccountComponent, canActivate:[LoginRoute]},
  { path: 'account-group', component: AccountGroupMasterComponent, canActivate:[LoginRoute]},
  // { path: 'item-master', component: ItemMasterComponent, canActivate:[LoginRoute]},
  
  { path: 'employee-master', component: EmployeeMasterComponent, canActivate:[LoginRoute]},
  { path: 'item-enquiry', component: ItemEnquiryComponent, canActivate:[LoginRoute]},
  { path: 'good-receipt', component: GoodsReceiptNoteComponent, canActivate:[LoginRoute]},

  
  { path: 'addnew-receipt', component: AddNewGoodsReceiptNoteComponent, canActivate:[LoginRoute]},
/// Masters
  { path: 'all-supplier-master', component: AllSupplierMasterComponent},
  { path: 'item-belongs-to', component: ItemsBelongsToComponent},
  { path: 'item-sub-category', component: ItemSubCategoryComponent},
  { path: 'item-material', component: ItemMaterialComponent},
  { path: 'item-type', component: ItemTypeComponent},
  { path: 'item-master', component: ItemsMasterComponent},
  { path: 'updatecritical-items', component: UpdateCriticalItemsComponent},
  
 //Main Forms
  { path: 'login', component: LoginComponent},
  { path: 'home-md', component: DashboardComponent, canActivate:[LoginRoute]},
  { path: 'home', component: EmptyscreenComponent, canActivate:[LoginRoute]},
  //Indent And PO
  { path: 'indentpassing', component: IndentPassingComponent, canActivate:[LoginRoute]},
  { path: 'RateApproval', component: RateApprovalConfirmatonComponent, canActivate:[LoginRoute]},
  { path: 'indent-entry', component: IndentEntryComponent, canActivate:[LoginRoute]},
  { path: 'add-new-indent-entry/:id/:action', component: AddNewIndentEntryComponent, canActivate:[LoginRoute]},
  { path: 'requirment-followup', component: RequirmentFolloupComponent, canActivate:[LoginRoute]}, 
  { path: 'print-indent', component: PrintIndentComponent, canActivate:[LoginRoute]},
  { path: 'purchase-order/:flag', component: PurchaseOrderComponent, canActivate:[LoginRoute]},
  { path: 'addNew-purchaseOrder/:id/:action/:flag', component: AddNewPurchaseOrderComponent, canActivate:[LoginRoute]},
  { path: 'purchase-print', component: PrintPOComponent, canActivate:[LoginRoute]},
  { path: 'purchase-order-fasttrack/:flag', component: PurchaseOrderFastTrackComponent, canActivate:[LoginRoute]},
  
  /////accounts
  { path: 'gst-voucher', component: GSTVoucherComponent, canActivate:[LoginRoute]},
  { path: 'add-gst-voucher/:id/:action', component: AddNewGSTVoucherComponent, canActivate:[LoginRoute]},
  { path: 'PaymentConfirmation', component: PaymentConfirmationComponent, canActivate:[LoginRoute]},
  { path: 'payment-scheduling-old', component: PaymentSchedulingComponent, canActivate:[LoginRoute]},
  { path: 'voucher-entry', component: VoucherEntryComponent, canActivate:[LoginRoute]},
  { path: 'my-calendar', component: PaymentChartComponent, canActivate:[LoginRoute]},
  { path: 'day-books-and-report', component: DayBookAndReportComponent, canActivate:[LoginRoute]},
  { path: 'post-datedcheque-ledger-component', component: PostDatedChequeLedgerComponent, canActivate:[LoginRoute]},
  { path: 'cheque-reco', component: ChequeRecoComponent, canActivate:[LoginRoute]},
  { path: 'post-dated-cheque-budget-wise', component: PostDatedChequeBudgetWiseComponent, canActivate:[LoginRoute]},
  { path: 'print-cheque', component: PrintChequeComponent, canActivate:[LoginRoute]},
  { path: 'print-cheque-view', component: PrintChequeReportComponent, canActivate:[LoginRoute]},
  { path: 'rtgs-clearing', component: RTGSClearanceComponent, canActivate:[LoginRoute]},
  { path: 'neft-format-master', component: NeftFormatMasterComponent, canActivate:[LoginRoute]},
  { path: 'print-neft-format/:backto', component: PrintNeftFormatComponent, canActivate:[LoginRoute]},
  { path: 'change-mode-of-paymnet', component: ChnageModeOfPaymentComponent, canActivate:[LoginRoute]},
  { path: 'salary-neft-format', component: NeftFormatComponent, canActivate:[LoginRoute]},
  { path: 'new-salary-neft-format/:id/:action/:fromamt/:uptoamt/:percentage', component: AddNewFormatComponent, canActivate:[LoginRoute]},
  { path: 'print-single-neft', component: PrintSinghNeftComponent, canActivate:[LoginRoute]},
  { path: 'print-voucher/:id/:type', component: PrintVoucherComponent, canActivate:[LoginRoute]},
  { path: 'payment-requirment', component: PaymentRequirementComponent, canActivate:[LoginRoute]},
  { path: 'add-payment-requirment/:id/:action/:acid', component: AddNewPaymentRequirmentComponent, canActivate:[LoginRoute]},
  { path: 'payment-scheduling', component: PaymentPaasingAnSchedulingComponent, canActivate:[LoginRoute]},
  { path: 'accountstatement-print', component: AccountStatementComponent, canActivate:[LoginRoute]},
  
  //HR
  { path: 'OTEntry', component: OverTimeEntryComponent, canActivate:[LoginRoute]}, 
  { path: 'OTPassing', component: OverTimePassingComponent, canActivate:[LoginRoute]}, 
  { path: 'hr-reports', component: HRReportsComponent, canActivate:[LoginRoute]},
  { path: 'passed-ot-list-report', component: PassedOTListComponent, canActivate:[LoginRoute]},
  { path: 'passed-ot-list-summary', component: OTSumaryComponent, canActivate:[LoginRoute]},
  { path: 'leave-entry', component: LeaveEntryComponent, canActivate:[LoginRoute]},
  { path: 'leave-approval/:flag', component: LeaveApprovalComponent, canActivate:[LoginRoute]},
  { path: 'advance-imprest-req', component: AdvanceRequirmentComponent, canActivate:[LoginRoute]},
  { path: 'over-time-amendment', component: OverTimeAmendmentComponent, canActivate:[LoginRoute]},
  { path: 'over-time-amendment-approval', component: OverTimeAmendmentApprovalComponent, canActivate:[LoginRoute]},
  { path: 'special-ot-rewards', component: SpecialRewardsReportComponent, canActivate:[LoginRoute]},
  { path: 'employee-absent-list', component: EmployeeAbsentListComponent, canActivate:[LoginRoute]},
  { path: 'package-employee-ot-list', component: PackageOTListComponent, canActivate:[LoginRoute]},
  { path: 'tour-intimation-form', component: TourIntimationComponent, canActivate:[LoginRoute]},
  { path: 'add-tour-intimation/:id/:action/:backto', component: AddNewTourIntimationComponent, canActivate:[LoginRoute]},
  { path: 'tour-form-approval', component: TourApprovalComponent, canActivate:[LoginRoute]},
  { path: 'OTPassingMoreThan2', component: OverTimePassingForMoreThan2Component, canActivate:[LoginRoute]}, 
  { path: 'employee-gate-pass', component: EmployeeGatePassComponent, canActivate:[LoginRoute]}, 
  { path: 'Gate-pass-approval/:flag', component: GatePassApprovalComponent, canActivate:[LoginRoute]}, 
  { path: 'advance-imperest-approval/:flag', component: AdvanceImperestApprovalComponent, canActivate:[LoginRoute]}, 
  { path: 'employee-gatepass-list', component: EmployeeGatePassListReportComponent, canActivate:[LoginRoute]}, 
  { path: 'employee-leave-report', component: EmployeeLeaveListComponent, canActivate:[LoginRoute]},
  { path: 'print-advance-slip', component: PrintAdvanceSlip, canActivate:[LoginRoute]},
  { path: 'print-tour-form', component: PrintTourForm, canActivate:[LoginRoute]},
  { path: 'ot-with-gatepass', component: OTWithGatePassComponent, canActivate:[LoginRoute]},
  { path: 'advance-status', component: AdvanceStatusComponent, canActivate:[LoginRoute]},
  //SOP
  { path: 'customer-order', component: CustomerOrderComponent, canActivate:[LoginRoute]},
  { path: 'add-new-customer-order/:id/:action', component: AddNewCustomerOrderComponent, canActivate:[LoginRoute]},
  { path: 'print-customer-order', component: PrintSaleOrderComponent, canActivate:[LoginRoute]},
  { path: 'customer-order-reports', component: SaleOrderReportComponent, canActivate:[LoginRoute]},
  { path: 'pending-customer-order-report', component: PendingCustomerOrdersComponent, canActivate:[LoginRoute]},
  { path: 'received-customer-order-report', component: RecieveCustomerOrderComponent, canActivate:[LoginRoute]},
  { path: 'despatched-customer-order-report', component: DespatchedCustomerOrdersComponent, canActivate:[LoginRoute]},
  { path: 'sale-order-follow-up', component: SaleOrderFollowUpComponent, canActivate:[LoginRoute]},
  { path: 'order-confirmation/:flag', component: OrderConfirmationComponent, canActivate:[LoginRoute]},
  { path: 'pending-order-report-ABC-classwise', component: PeningOrderReportABCCatComponent, canActivate:[LoginRoute]},
  { path: 'customer-order-file', component: OrderStatusReportComponent, canActivate:[LoginRoute]},
  { path: 'map-existing-party-product', component: MapPartyProductFromAnotherPartyComponent, canActivate:[LoginRoute]},
  { path: 'proforma-list/:flag', component: ProformaListComponent, canActivate:[LoginRoute]},
  { path: 'gstbill-print/:id/:copy', component: GSTInvoiceComponent, canActivate:[LoginRoute]},
  { path: 'GSTR-2A', component: GSTR2AComponent, canActivate:[LoginRoute]},
  { path: 'Order-Knocked-Off', component: OrderKnockedOffComponent, canActivate:[LoginRoute]},
  { path: 'Vehicle-GP', component: VehicleGatePassComponent, canActivate:[LoginRoute]},
  { path: 'add-Vehicle-GP/:id/:action', component: NewVehicleGatePassComponent, canActivate:[LoginRoute]},
  { path: 'GST-Summary', component: GSTSummaryComponent, canActivate:[LoginRoute]},
  ///Production
  { path: 'dies-list', component: DieAndToolComponent, canActivate:[LoginRoute]},
  { path: 'add-new-die/:id/:action', component: AddNewDieComponent, canActivate:[LoginRoute]},
  { path: 'die-technical-assessment/:dieid', component: TechnicalAssessmentComponent, canActivate:[LoginRoute]},
  { path: 'finishing-bom', component: FinshingBOMComponent, canActivate:[LoginRoute]},
  { path: 'add-finishing-bom/:id/:action', component: AddNewFnishingBOMComponent, canActivate:[LoginRoute]},
  { path: 'die-planning', component: DiePlanningComponent, canActivate:[LoginRoute]},
  
  ///Inventroy and store
  { path: 'store-requisition', component: StoreRequisitionSlipComponent, canActivate:[LoginRoute]},
  { path: 'add-requisition/:id/:action', component: AddNewStoreRequisitionSlipComponent, canActivate:[LoginRoute]},
  { path: 'issuance-slip', component: IssuanceSlipComponent, canActivate:[LoginRoute]},
  { path: 'add-issuance-slip/:id/:action', component: AddNewIssunaceSlipComponent, canActivate:[LoginRoute]},
  { path: 'print-issuance', component: PrintIssuanceComponent, canActivate:[LoginRoute]},
  { path: 'store-indent', component: StoreIndentComponent, canActivate:[LoginRoute]},
  { path: 'mrir-entery-list', component: MRIREntryComponent, canActivate:[LoginRoute]},
  { path: 'add-mrir/:id/:action', component: AddNewMRIRComponent, canActivate:[LoginRoute]},
  { path: 'print-mrir', component: PrintMRIRComponent, canActivate:[LoginRoute]},
  { path: 'drcr-note-list', component: DrCrNoteViewComponent, canActivate:[LoginRoute]},
  { path: 'drcr-note-print', component: DrcrNotePrintComponent, canActivate:[LoginRoute]},
  { path: 'gate-entry', component: GateEntryListComponent, canActivate:[LoginRoute]},
  { path: 'add-gate-entry/:id/:action', component: AddNewGateEntryComponent, canActivate:[LoginRoute]},
  { path: 'sale-return-note', component: PrintSaleReturnNoteComponent, canActivate:[LoginRoute]},
  { path: 'GSTR2B', component: GSTR2BComponent, canActivate:[LoginRoute]},
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    VoucherEntryComponent,
    GrdFilterPipe,
    SupplierMasterComponent,
    CustomerMasterComponent,
    GeneralLedgerComponent,
    StatementAccountComponent,
    AccountGroupMasterComponent,
    ItemMasterComponent,
    PurchaseOrderComponent,
    IndentEntryComponent,
    EmployeeMasterComponent,
    AddNewGeneralLedgerComponent,
    AddNewAccountGroupMasterComponent,
    AddNewIndentEntryComponent,
    AddNewSupplierMasterComponent,
    AddNewItemMasterComponent,
    AddNewCustomerMasterComponent,
    AddNewPurchaseOrderComponent,
    PrintPOComponent,
    NewEmployeeMasterComponent,
    ScrollSpyDirective,
    LoremIpsumComponent,
    ItemEnquiryComponent,
    AddNewItemEnquiryComponent,
    AddNewGoodsReceiptNoteComponent,
    GoodsReceiptNoteComponent,
    ConfirmationDialogComponent,
    AddNewLoginComponent,
    EmptyscreenComponent,
    SuccessDialogComponent,
    IndentPassingComponent,
    RateApprovalConfirmatonComponent,
    PaymentConfirmationComponent,
    AccountStatementComponent,
    PaymentSchedulingComponent,
    PaymentChartComponent,
    ChartDetailComponent,
    DashboardComponent,
    SaleDetailComponent,
    SaleBillComponent,
    OverTimeEntryComponent,
    OverTimePassingComponent,
    RequirmentFolloupComponent,
    PaymentChart1Component,
    followup,
    EmployeeProfileComponent,
    SalarySlipComponent,
    CustomerOrderComponent,
    AddNewCustomerOrderComponent,
    PrintSaleOrderComponent,
    SaleOrderReportComponent,
    RecieveCustomerOrderComponent,
    GroupByCustomerPipe,
    PendingCustomerOrdersComponent,
    DespatchedCustomerOrdersComponent,
    ChangePassword,
    DieAndToolComponent,
    AddNewDieComponent,
  // multiplecheques,
    DayBookAndReportComponent,
    PostDatedChequeLedgerComponent,
    ChequeRecoComponent,
    HRReportsComponent,
    PassedOTListComponent,
    PostDatedChequeBudgetWiseComponent,
    LeaveEntryComponent,
    LeaveApprovalComponent,
    OTSumaryComponent,
    TechnicalAssessmentComponent,
    AdvanceRequirmentComponent,
    OverTimeAmendmentComponent,
    OverTimeAmendmentApprovalComponent,
    PrintChequeComponent,
    PrintChequeReportComponent,
    EditChequeComponent,
    SpecialRewardsReportComponent,
    RTGSClearanceComponent,
    NeftFormatMasterComponent,
    NeftFormatComponent,
    AddNewFormatComponent,
    PrintNeftFormatComponent,
    EmployeeAbsentListComponent,
    ChnageModeOfPaymentComponent,
    PaymentDetailComponent,
    PackageOTListComponent,
    TourIntimationComponent,
    AddNewTourIntimationComponent,
    TourApprovalComponent,
    OverTimePassingForMoreThan2Component,
    EmployeeGatePassComponent,
    GatePassApprovalComponent,
    AdvanceImperestApprovalComponent,
    EmployeeGatePassListReportComponent,
    EmployeeLeaveListComponent,
    SaleOrderFollowUpComponent,
    DespatchFollowUp,
    PrintAdvanceSlip,
    OrderConfirmationComponent,
    ProformaListComponent,
    ExportInvoiceShippingDetailComponent,
    PeningOrderReportABCCatComponent,
    FinshingBOMComponent,
    AddNewFnishingBOMComponent,
    PrintSinghNeftComponent,
    AddNewStoreRequisitionSlipComponent,
    StoreRequisitionSlipComponent,
    AddNewIssunaceSlipComponent,
    IssuanceSlipComponent,
    ValidationComponent,
    ConfirmAlertComponent,
    CameraComponent,
    PrintIndentComponent,
    PrintIssuanceComponent,
    PrintTourForm,
    GSTR2AComponent,
    gst2ABillDetailComponent,
    gst2AVoucherDetailComponent,
    OTWithGatePassComponent,
    AllSupplierMasterComponent,
    SupplierFirstScreenComponent,
    GSTVoucherComponent,
    AddNewGSTVoucherComponent,
    PrintVoucherComponent,
    PaymentRequirementComponent,
    AddNewPaymentRequirmentComponent,
    ItemsBelongsToComponent,
    AddNewItemBelongsToComponent,
    ItemSubCategoryComponent,
    AddNewItemSubCategoryComponent,
    ItemMaterialComponent,
    AddNewItemMaterialComponent,
    ItemTypeComponent,
    AddNewItemTypeComponent,
    PaymentPaasingAnSchedulingComponent,
    ItemsMasterComponent,
    AddNewItemComponent,
    StoreIndentComponent,
    StoreIndentDetailComponent,
    StoreRequisationStatusComponent,
    MRIREntryComponent,
    AddNewMRIRComponent,
    AdvanceStatusComponent,
    PrintMRIRComponent,
    DrCrNoteViewComponent,
    DrcrNotePrintComponent,
    PurchaseOrderFastTrackComponent,
    poAdditionalInfo,
    OrderStatusReportComponent,
    UpdateCriticalItemsComponent,
    GateEntryListComponent,
    AddNewGateEntryComponent,
    DiePlanningComponent,
    DiePlanningPrintComponent,
    gateEntryPrintComponent,
    HourlyMachineComponent,
    GSTInvoiceComponent,
    MapPartyProductFromAnotherPartyComponent,
    OrderKnockedOffComponent,
    VehicleGatePassComponent,
    NewVehicleGatePassComponent,
    GSTSummaryComponent,
    PrintSaleReturnNoteComponent,
    GSTR2BComponent
  ],
  imports: [
    BrowserModule,
    PanelMenuModule,
    MenuModule,
    RouterModule.forRoot(routes, {useHash: true }),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    NgxPaginationModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
        }),
    TreeviewModule.forRoot(),
    NgxSelectModule,
    BrowserAnimationsModule,
    NgMultiSelectDropDownModule.forRoot(), 
    MatDatepickerModule, MatFormFieldModule, MatRadioModule, MatSelectModule, MatSliderModule,
    MatSlideToggleModule, MatMenuModule, MatSidenavModule, MatToolbarModule,ChartModule,
    MatGridListModule, MatCardModule, MatStepperModule, MatTabsModule, MatExpansionModule,
    MatButtonToggleModule, MatChipsModule, MatIconModule, MatProgressSpinnerModule, MatProgressBarModule,
    MatDialogModule, MatTooltipModule, MatSnackBarModule, MatSortModule, MatPaginatorModule,
    MatTableModule, MatButtonModule, MatAutocompleteModule,
    MatListModule, MatCheckboxModule, MatInputModule, MatTreeModule, MatDividerModule,
    MatNativeDateModule,NgSelectModule,WebcamModule,
    SelectDropDownModule,PDFExportModule,IntlModule, LayoutModule,TimePickerModule, DateInputsModule, NgxMaterialTimepickerModule
  
  ],
  entryComponents: [
    SupplierMasterComponent,
    AddNewGeneralLedgerComponent,
    AddNewAccountGroupMasterComponent,
    AddNewSupplierMasterComponent,
    AddNewItemMasterComponent,
    AddNewCustomerMasterComponent,
    NewEmployeeMasterComponent,
    AddNewItemEnquiryComponent,
    ConfirmationDialogComponent,ExportInvoiceShippingDetailComponent,
    AddNewLoginComponent,
    SuccessDialogComponent,
    AccountStatementComponent,
    ChartDetailComponent,PrintPOComponent,DiePlanningPrintComponent,HourlyMachineComponent,gateEntryPrintComponent,
    SaleDetailComponent,poAdditionalInfo,
    SaleBillComponent,ValidationComponent,StoreIndentDetailComponent,StoreRequisationStatusComponent,
    PaymentChart1Component,DespatchFollowUp,ConfirmAlertComponent,   gst2ABillDetailComponent,AddNewItemTypeComponent,AddNewItemComponent,
    gst2AVoucherDetailComponent,AddNewItemBelongsToComponent,AddNewItemSubCategoryComponent,AddNewItemMaterialComponent,
    followup,EmployeeProfileComponent,SalarySlipComponent,RecieveCustomerOrderComponent,ChangePassword,EditChequeComponent, PaymentDetailComponent, SupplierFirstScreenComponent
    
  ],
  providers: [
    {provide: 'BASE_URL', useValue: 'http://112.196.6.172:8083/api'},
     {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
        provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    },
    LoginRoute,
    SupplierMasterService,
    LoginService,
    AccountGroupMasterService,
    CustomerMasterService,
    GeneralLedgerService,
    MatDatepickerModule,
    GoodsReceiptNoteService,
    ConfirmationDialogService,
    PaymentConfirmationService
 ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  public CompanyName:string;
  public Address1:string;
  public Address2:string;
  public  WorkingDate:string;
  constructor()
  {}
}
export class menuMaster
{
  menu:number;
  mainMenuName:string;
  subMenuName:string;
  routerName:string;
}

export function HttpLoaderFactory(http: HttpClient) {
  // return new TranslateHttpLoader(http);
  return new TranslateHttpLoader(http, "assets/i18n/", ".json");
}