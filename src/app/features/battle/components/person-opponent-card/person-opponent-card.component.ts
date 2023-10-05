import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonDetails } from '../../models/person-details.model';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-person-opponent-card',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './person-opponent-card.component.html',
  styleUrls: ['./person-opponent-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonOpponentCardComponent {
  @Input() opponent?: PersonDetails;
  @Input() isWinner = false;
}
