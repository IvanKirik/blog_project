import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {OrderService} from "../../services/order.service";
import {UnsubscribeService} from "../../../core/unsubscribe/unsubscribe.service";
import {ServicesCategoryType} from "../../../../types/services-category.type";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit, OnDestroy {

  public orderForm = this.fb.group({
    name: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    service: ['']
  });

  public defaultOption: string = '';
  public phoneMask = { mask: "+{375}(00)000-00-00" }
  public sending: boolean = false;
  public error: boolean = false;

  @Output() closePopup: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() servicesItems!: ServicesCategoryType[];
  @Input() isLightPopup!: boolean;

  constructor(private fb: FormBuilder,
              private orderService: OrderService,
              private unsubscribeService: UnsubscribeService) {
  }

  public ngOnInit(): void {
    this.getDefaultOption();
  }

  public ngOnDestroy(): void {
    this.unsubscribeService.getSub().forEach(s => s.unsubscribe());
  }

  public addOrder(): void {
    if (this.isLightPopup) {
      if (this.orderForm.value.name && this.orderForm.value.phone) {
        this.unsubscribeService.sub = this.orderService.addOrder(this.orderForm.value.name,
          this.orderForm.value.phone, 'consultation')
          .subscribe((data: DefaultResponseType) => {
            if(data.error) {
              this.error = true;
            }
            this.sending = true;
          })
      }
    } else {
      if (this.orderForm.value.name && this.orderForm.value.phone) {
        this.unsubscribeService.sub = this.orderService.addOrder(this.orderForm.value.name,
          this.orderForm.value.phone, 'order', this.orderForm.value.service!)
          .subscribe((data: DefaultResponseType) => {
            if(data.error) {
              this.error = true;
            }
            this.sending = true;
          })
      }
    }
  }

  private getDefaultOption(): void {
    this.servicesItems.forEach(item => {
      if (item.defaultOption) {
        this.defaultOption = item.name
      }
    })
  }

  public close(): void {
    this.closePopup.next(true);
  }
}
