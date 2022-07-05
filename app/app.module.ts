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
import { MatToolbarModule, MatButtonModule, MatSnackBarModule, MatTableModule, MatSortModule, MatPaginatorModule, 
  MatCheckboxModule, MatInputModule, MatAutocompleteModule, MatDatepickerModule,
  MatFormFieldModule, MatRadioModule, MatSelectModule, MatSliderModule, MatSlideToggleModule, MatMenuModule,
  MatSidenavModule, MatListModule, MatGridListModule, MatCardModule, MatStepperModule,
  MatTabsModule, MatExpansionModule, MatButtonToggleModule, MatChipsModule, MatIconModule, MatProgressSpinnerModule, 
  MatProgressBarModule, MatDialogModule, MatTooltipModule, MatTreeModule, MatNativeDateModule,
  MatDividerModule, MAT_DATE_FORMATS, NativeDateAdapter,DateAdapter
} from '@angular/material';

import {PaymentConfirmationService} from './Modules/General/Accounts/payment-confirmation/payment-confirmation.service';
import { AppDateAdapter, APP_DATE_FORMATS} from './date.adapter';
import { SelectDropDownModule } from 'ngx-select-dropdown';//dropdown
import { LoginRoute } from './login-route';
import { SupplierMasterService } from './Modules/General/supplier-master/supplier-master.service';
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
import { SupplierMasterComponent } from './Modules/General/supplier-master/supplier-master.component';
import { CustomerMasterComponent } from './Modules/General/customer-master/customer-master.component';
import { GeneralLedgerComponent } from './Modules/General/general-ledger/general-ledger.component';
import { StatementAccountComponent } from './Modules/General/Accounts/statement-account/statement-account.component';
import { AccountGroupMasterComponent } from './Modules/General/account-group-master/account-group-master.component';
import { ItemMasterComponent } from './Modules/General/item-master/item-master.component';
import { PurchaseOrderComponent } from './Modules/Inventory/purchase-order/purchase-order.component';
import { IndentEntryComponent } from './Modules/General/indent-entry/indent-entry.component';
import { EmployeeMasterComponent } from './Modules/General/employee-master/employee-master.component';
import { AddNewGeneralLedgerComponent } from './Modules/General/general-ledger/add-new-general-ledger/add-new-general-ledger.component';
import { AddNewAccountGroupMasterComponent } from './Modules/General/account-group-master/add-new-account-group-master/add-new-account-group-master.component';
import { AddNewIndentEntryComponent } from './Modules/General/indent-entry/add-new-indent-entry/add-new-indent-entry.component';
import { AddNewSupplierMasterComponent } from './Modules/General/supplier-master/add-new-supplier-master/add-new-supplier-master.component';
import { AddNewItemMasterComponent } from './Modules/General/item-master/add-new-item-master/add-new-item-master.component';
import { AddNewCustomerMasterComponent } from './Modules/General/customer-master/add-new-customer-master/add-new-customer-master.component';
import { AddNewPurchaseOrderComponent } from './Modules/Inventory/purchase-order/add-new-purchase-order/add-new-purchase-order.component';
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
import { IndentPassingComponent } from './Modules/General/indent-passing/indent-passing.component';
import { RateApprovalConfirmatonComponent } from './Modules/IndentAndPO/rate-approval-confirmaton/rate-approval-confirmaton.component';
import { PaymentConfirmationComponent } from './Modules/General/Accounts/payment-confirmation/payment-confirmation.component';
import { AccountStatementComponent } from './Modules/General/Accounts/account-statement/account-statement.component';
import { PaymentSchedulingComponent } from './Modules/General/Accounts/payment-scheduling/payment-scheduling.component';
import { multiplecheques } from './Modules/General/Accounts/payment-scheduling/payment-scheduling.component';
import { PaymentChartComponent } from './Modules/General/Accounts/payment-chart/payment-chart.component';
import { ChartDetailComponent } from './Modules/General/Accounts/payment-chart/chart-detail/chart-detail.component';
import { DashboardComponent } from './Modules/General/Accounts/dashboard/dashboard.component';
import { SaleDetailComponent } from './Modules/General/Accounts/dashboard/sale-detail/sale-detail.component';
import { SaleBillComponent } from './Modules/General/Accounts/dashboard/sale-bill/sale-bill.component';
import { OverTimeEntryComponent } from './Modules/HR/OT/over-time-entry/over-time-entry.component';
import { OverTimePassingComponent } from './Modules/HR/OT/over-time-passing/over-time-passing.component';
import { RequirmentFolloupComponent } from './Modules/General/requirment-folloup/requirment-folloup.component';
import { PaymentChart1Component } from './Modules/General/Accounts/payment-chart1/payment-chart1.component';
import { followup } from './Modules/General/requirment-folloup/requirment-folloup.component';
import { EmployeeProfileComponent } from './Modules/HR/employee-profile/employee-profile.component';
import { SalarySlipComponent } from './Modules/HR/salary-slip/salary-slip.component';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { IntlModule } from '@progress/kendo-angular-intl';
import { CustomerOrderComponent } from './Modules/Sale-Order/customer-order/customer-order.component';
import { AddNewCustomerOrderComponent } from './Modules/Sale-Order/customer-order/add-new-customer-order/add-new-customer-order.component';
import {GroupByCustomerPipe} from './Modules/Sale-Order/Sale-Order-Reports/recieve-customer-order/recieve-customer-order.component';
import {PanelMenuModule} from 'primeng/panelmenu';
import { SaleOrderReportComponent } from './Modules/Sale-Order/Sale-Order-Reports/sale-order-report/sale-order-report.component';
import { RecieveCustomerOrderComponent } from './Modules/Sale-Order/Sale-Order-Reports/recieve-customer-order/recieve-customer-order.component';
import { PendingCustomerOrdersComponent } from './Modules/Sale-Order/Sale-Order-Reports/pending-customer-orders/pending-customer-orders.component';
import { DespatchedCustomerOrdersComponent } from './Modules/Sale-Order/Sale-Order-Reports/despatched-customer-orders/despatched-customer-orders.component';
import { ChangePassword } from './Modules/General/login/add-new-login/add-new-login.component';
import { DieAndToolComponent } from './Production/DieAndTools/die-and-tool/die-and-tool.component';
import { AddNewDieComponent } from './Production/DieAndTools/die-and-tool/add-new-die/add-new-die.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { LayoutModule } from './layout/layout.module';
import { DayBookAndReportComponent } from './Modules/General/Accounts/day-book-and-report/day-book-and-report.component';
import { PostDatedChequeLedgerComponent } from './Modules/General/Accounts/day-book-and-report/post-dated-cheque-ledger/post-dated-cheque-ledger.component';
import { ChequeRecoComponent } from './Modules/General/Accounts/cheque-reco/cheque-reco.component';
import { HRReportsComponent } from './Modules/HR/hrreports/hrreports.component';
import { PassedOTListComponent } from './Modules/HR/hrreports/passed-otlist/passed-otlist.component';
import { PostDatedChequeBudgetWiseComponent } from './Modules/General/Accounts/day-book-and-report/post-dated-cheque-budget-wise/post-dated-cheque-budget-wise.component';
import { LeaveEntryComponent } from './Modules/HR/leaves/leave-entry/leave-entry.component';
import { LeaveApprovalComponent } from './Modules/HR/leaves/leave-approval/leave-approval.component';
import { OTSumaryComponent } from './Modules/HR/hrreports/ot-sumary/ot-sumary.component';
import { TechnicalAssessmentComponent } from './Production/DieAndTools/die-and-tool/technical-assessment/technical-assessment.component';
import { AdvanceRequirmentComponent } from './Modules/HR/Advance/advance-requirment/advance-requirment.component';
import { OverTimeAmendmentComponent } from './Modules/HR/OT/over-time-amendment/over-time-amendment.component';
import { OverTimeAmendmentApprovalComponent } from './Modules/HR/OT/over-time-amendment-approval/over-time-amendment-approval.component';
import { PrintChequeComponent } from './Modules/General/Accounts/print-cheque/print-cheque.component';

import { PrintChequeReportComponent } from './Modules/General/Accounts/print-cheque/print-cheque.component';
import { EditChequeComponent } from './Modules/General/Accounts/print-cheque/print-cheque.component';

enableProdMode();

const routes: Routes = [
  { path: '', component: LoginComponent, canActivate:[LoginRoute], pathMatch: 'full'},
  { path: 'login', component: LoginComponent},
  { path: 'my-calendar', component: PaymentChartComponent, canActivate:[LoginRoute]},
  { path: 'home-md', component: DashboardComponent, canActivate:[LoginRoute]},
  { path: 'indentpassing', component: IndentPassingComponent, canActivate:[LoginRoute]},
  { path: 'RateApproval', component: RateApprovalConfirmatonComponent, canActivate:[LoginRoute]},
  { path: 'PaymentConfirmation', component: PaymentConfirmationComponent, canActivate:[LoginRoute]},
  { path: 'payment-scheduling', component: PaymentSchedulingComponent, canActivate:[LoginRoute]},
  { path: 'voucher-entry', component: VoucherEntryComponent, canActivate:[LoginRoute]},
  { path: 'supplier-master', component: SupplierMasterComponent, canActivate:[LoginRoute]},
  { path: 'customer-master', component: CustomerMasterComponent, canActivate:[LoginRoute]},
  { path: 'general-ledger', component: GeneralLedgerComponent, canActivate:[LoginRoute]},
  { path: 'statement-account', component: StatementAccountComponent, canActivate:[LoginRoute]},
  { path: 'account-group', component: AccountGroupMasterComponent, canActivate:[LoginRoute]},
  { path: 'item-master', component: ItemMasterComponent, canActivate:[LoginRoute]},
  { path: 'purchase-order', component: PurchaseOrderComponent, canActivate:[LoginRoute]},
  { path: 'indent-entry', component: IndentEntryComponent, canActivate:[LoginRoute]},
  { path: 'employee-master', component: EmployeeMasterComponent, canActivate:[LoginRoute]},
  { path: 'item-enquiry', component: ItemEnquiryComponent, canActivate:[LoginRoute]},
  { path: 'good-receipt', component: GoodsReceiptNoteComponent, canActivate:[LoginRoute]},
  { path: 'addNew-purchaseOrder', component: AddNewPurchaseOrderComponent, canActivate:[LoginRoute]},
  { path: 'add-new-indent-entry', component: AddNewIndentEntryComponent, canActivate:[LoginRoute]},
  { path: 'home', component: EmptyscreenComponent, canActivate:[LoginRoute]},
  { path: 'addnew-receipt', component: AddNewGoodsReceiptNoteComponent, canActivate:[LoginRoute]},
  { path: 'OTEntry', component: OverTimeEntryComponent, canActivate:[LoginRoute]}, 
  { path: 'OTPassing', component: OverTimePassingComponent, canActivate:[LoginRoute]}, 
  { path: 'requirment-followup', component: RequirmentFolloupComponent, canActivate:[LoginRoute]}, 
  { path: 'customer-order', component: CustomerOrderComponent, canActivate:[LoginRoute]},
  { path: 'add-new-customer-order/:id/:action', component: AddNewCustomerOrderComponent, canActivate:[LoginRoute]},
  { path: 'customer-order-reports', component: SaleOrderReportComponent, canActivate:[LoginRoute]},
  { path: 'pending-customer-order-report', component: PendingCustomerOrdersComponent, canActivate:[LoginRoute]},
  { path: 'received-customer-order-report', component: RecieveCustomerOrderComponent, canActivate:[LoginRoute]},
  { path: 'despatched-customer-order-report', component: DespatchedCustomerOrdersComponent, canActivate:[LoginRoute]},
  { path: 'dies-list', component: DieAndToolComponent, canActivate:[LoginRoute]},
  { path: 'add-new-die/:id/:action', component: AddNewDieComponent, canActivate:[LoginRoute]},
  { path: 'day-books-and-report', component: DayBookAndReportComponent, canActivate:[LoginRoute]},
  { path: 'post-datedcheque-ledger-component', component: PostDatedChequeLedgerComponent, canActivate:[LoginRoute]},
  { path: 'cheque-reco', component: ChequeRecoComponent, canActivate:[LoginRoute]},
  { path: 'hr-reports', component: HRReportsComponent, canActivate:[LoginRoute]},
  { path: 'passed-ot-list-report', component: PassedOTListComponent, canActivate:[LoginRoute]},
  { path: 'passed-ot-list-summary', component: OTSumaryComponent, canActivate:[LoginRoute]},
  { path: 'post-dated-cheque-budget-wise', component: PostDatedChequeBudgetWiseComponent, canActivate:[LoginRoute]},
  { path: 'leave-entry', component: LeaveEntryComponent, canActivate:[LoginRoute]},
  { path: 'leave-approval/:flag', component: LeaveApprovalComponent, canActivate:[LoginRoute]},
  { path: 'die-technical-assessment/:dieid', component: TechnicalAssessmentComponent, canActivate:[LoginRoute]},
  { path: 'advance-imprest-req', component: AdvanceRequirmentComponent, canActivate:[LoginRoute]},
  { path: 'over-time-amendment', component: OverTimeAmendmentComponent, canActivate:[LoginRoute]},
  { path: 'over-time-amendment-approval', component: OverTimeAmendmentApprovalComponent, canActivate:[LoginRoute]},
  { path: 'print-cheque', component: PrintChequeComponent, canActivate:[LoginRoute]},
  { path: 'print-cheque-view', component: PrintChequeReportComponent, canActivate:[LoginRoute]},
  
  
];


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
    SaleOrderReportComponent,
    RecieveCustomerOrderComponent,
    GroupByCustomerPipe,
    PendingCustomerOrdersComponent,
    DespatchedCustomerOrdersComponent,
    ChangePassword,
    DieAndToolComponent,
    AddNewDieComponent,
    multiplecheques,
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
  ],
  imports: [
    BrowserModule,
    PanelMenuModule,
    RouterModule.forRoot(routes, {useHash: true}),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule.forRoot(),
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
    MatSlideToggleModule, MatMenuModule, MatSidenavModule, MatToolbarModule,
    MatGridListModule, MatCardModule, MatStepperModule, MatTabsModule, MatExpansionModule,
    MatButtonToggleModule, MatChipsModule, MatIconModule, MatProgressSpinnerModule, MatProgressBarModule,
    MatDialogModule, MatTooltipModule, MatSnackBarModule, MatSortModule, MatPaginatorModule,
    MatTableModule, MatButtonModule, MatAutocompleteModule,
    MatListModule, MatCheckboxModule, MatInputModule, MatTreeModule, MatDividerModule,
    MatNativeDateModule,NgSelectModule,
    SelectDropDownModule,PDFExportModule,IntlModule, LayoutModule,
  
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
    ConfirmationDialogComponent,
    AddNewLoginComponent,
    SuccessDialogComponent,
    AccountStatementComponent,
    ChartDetailComponent,
    SaleDetailComponent,
    SaleBillComponent,
    PaymentChart1Component,
    followup,EmployeeProfileComponent,SalarySlipComponent,RecieveCustomerOrderComponent,ChangePassword,multiplecheques,EditChequeComponent
    
  ],
  providers: [
    {provide: 'BASE_URL', useValue: 'http://112.196.6.170:8081/api'},
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