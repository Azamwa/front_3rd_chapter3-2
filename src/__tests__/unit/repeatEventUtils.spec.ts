import { Event, RepeatEvent } from '../../types';
import { getMaxRepeatLength, getRepeatingEvent } from '../../utils/repeatEventUtils';

describe('getRepeatingEvent', () => {
  it('RepeatEvent 타입의 배열을 반환한다.', () => {
    const events: Event[] = [
      {
        id: '2b7545a6-ebee-426c-b906-2329bc8d62bd',
        title: '팀 회의',
        date: '2024-11-20',
        startTime: '10:00',
        endTime: '11:00',
        description: '주간 팀 미팅',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'daily', interval: 1, endDate: '2024-11-28' },
        notificationTime: 1,
      },
    ];
    const repeatingEvent: RepeatEvent = getRepeatingEvent(events);

    expect(repeatingEvent.event).toHaveLength(9);
    expect(repeatingEvent.eventId).toBe('2b7545a6-ebee-426c-b906-2329bc8d62bd');
    expect(repeatingEvent.type).toBe('daily');
    expect(repeatingEvent.event[8].date).toBe('2024-11-28');
  });
});

describe('getMaxRepeatLength', () => {
  it('endDate가 공백일 때(무제한) 반복일정의 최대개수는 40개이다.', () => {
    const event: Event = {
      id: '2b7545a6-ebee-426c-b906-2329bc8d62bd',
      title: '팀 회의',
      date: '2024-11-20',
      startTime: '10:00',
      endTime: '11:00',
      description: '주간 팀 미팅',
      location: '회의실 A',
      category: '업무',
      repeat: { type: 'weekly', interval: 1 },
      notificationTime: 1,
    };
    const maxLength = getMaxRepeatLength(event);

    expect(maxLength <= 40).toBe(true);
  });

  it('endDate가 공백이 아니고 반복일정이 40개를 초과할 때, 40개를 반환한다.', () => {
    const event: Event = {
      id: '2b7545a6-ebee-426c-b906-2329bc8d62bd',
      title: '팀 회의',
      date: '2024-11-20',
      startTime: '10:00',
      endTime: '11:00',
      description: '주간 팀 미팅',
      location: '회의실 A',
      category: '업무',
      repeat: { type: 'daily', interval: 1, endDate: '2025-10-10' },
      notificationTime: 1,
    };
    const maxLength = getMaxRepeatLength(event);

    expect(maxLength).toBe(40);
  });

  it('endDate가 공백이 아니고 반복일정이 40개 이하일 때, 반복일정의 개수를 반환한다.', () => {
    const event: Event = {
      id: '2b7545a6-ebee-426c-b906-2329bc8d62bd',
      title: '팀 회의',
      date: '2024-11-20',
      startTime: '10:00',
      endTime: '11:00',
      description: '주간 팀 미팅',
      location: '회의실 A',
      category: '업무',
      repeat: { type: 'daily', interval: 1, endDate: '2024-11-28' },
      notificationTime: 1,
    };
    const maxLength = getMaxRepeatLength(event);

    expect(maxLength).toBe(9);
  });
});
