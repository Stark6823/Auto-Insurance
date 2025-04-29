import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentDashBoardComponent } from './agent-dash-board.component';

describe('AgentDashBoardComponent', () => {
  let component: AgentDashBoardComponent;
  let fixture: ComponentFixture<AgentDashBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentDashBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentDashBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
