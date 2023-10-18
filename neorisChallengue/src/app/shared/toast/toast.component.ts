import {Component, Input, OnInit} from '@angular/core';
import {ToastService} from "./services/toast.service";

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {
  message: string | null = null;
  constructor(private toastService: ToastService) { }

  ngOnInit(): void {
    this.toastService.toast$.subscribe( res => {
        this.message = res
        setTimeout(() => {
          this.toastService.hideToast()
        }, 5000)
    })
  }

}
