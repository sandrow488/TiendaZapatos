import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  readonly featuredProducts = [
    { name: 'AirStride Pro', category: 'RUNNING', price: 129.99, image: 'https://via.placeholder.com/300' },
    { name: 'SpeedFlow Elite', category: 'RUNNING', price: 149.99, image: 'https://via.placeholder.com/300' },
    { name: 'CourtKing High', category: 'BASKETBALL', price: 159.99, image: 'https://via.placeholder.com/300' },
  ];

  readonly categories = ['Basketball', 'Lifestyle', 'Running', 'Training'];
}
