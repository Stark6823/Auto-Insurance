import { Component } from '@angular/core';

@Component({
  selector: 'app-front-page',
  imports: [],
  templateUrl: './front-page.component.html',
  styleUrl: './front-page.component.css'
})
export class FrontPageComponent {
getQuote() {
  console.log('Get Quote clicked');
}

}
