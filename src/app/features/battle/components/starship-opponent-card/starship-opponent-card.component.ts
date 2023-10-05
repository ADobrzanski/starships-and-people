import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarshipDetails } from '../../models/starship-details.model';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-starship-opponent-card',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './starship-opponent-card.component.html',
  styleUrls: ['./starship-opponent-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarshipOpponentCardComponent {
  @Input() opponent?: StarshipDetails;
  @Input() isWinner = false;
}
