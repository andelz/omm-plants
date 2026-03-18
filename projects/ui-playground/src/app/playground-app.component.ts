import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from '../../../../src/app/services/theme.service';

@Component({
  selector: 'app-playground-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class PlaygroundApp implements OnInit {
  private theme = inject(ThemeService);

  ngOnInit(): void {
    this.theme.init();
  }
}
