import { useState } from 'react';

import { Event, RepeatEvent } from '../types';
import { getRepeatingEvent } from '../utils/repeatEventUtils';

export const useRepeatEvent = () => {
  const [repeatEvent, setRepeatEvent] = useState<RepeatEvent[]>([]);

  // 반복일정을 전체 변경
  const changeRepeatEvent = (events: Event[]) => {
    const eventWithRepeat = events.filter((event) => event.repeat.type !== 'none');
    setRepeatEvent(getRepeatingEvent(eventWithRepeat));
  };

  // 일정의 반복일정 전체를 삭제
  const deleteRepeatEvent = () => {};

  //일정의 반복일정 개별삭제
  const deleteRepeatEventInstance = () => {};

  return { repeatEvent, changeRepeatEvent, deleteRepeatEvent, deleteRepeatEventInstance };
};
