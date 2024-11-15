import { http, HttpResponse } from 'msw';

import { server } from '../setupTests';
import { Event } from '../types';

// ! Hard 여기 제공 안함
export const setupMockHandlerCreation = (initEvents = [] as Event[]) => {
  let mockEvents: Event[] = [...initEvents];

  server.use(
    http.get('/api/events', () => {
      return HttpResponse.json({ events: mockEvents });
    }),

    http.post('/api/events', async ({ request }) => {
      const newEvent = (await request.json()) as Event;
      newEvent.id = String(mockEvents.length + 1); // 간단한 ID 생성
      mockEvents.push(newEvent);
      return HttpResponse.json(newEvent, { status: 201 });
    }),

    http.post('/api/events-list', async ({ request }) => {
      type RequestBody = { events: Event[] };
      const requestBody = (await request.json()) as RequestBody;
      const newEvents = requestBody.events.map((event, index) => {
        const isRepeatEvent = event.repeat.type !== 'none';
        return {
          ...event,
          id: String(index + 1),
          repeat: {
            ...event.repeat,
            id: isRepeatEvent ? String(index + 1) : undefined,
          },
        };
      });
      mockEvents = [...mockEvents, ...newEvents];
      return HttpResponse.json(newEvents, { status: 201 });
    })
  );
};

export const setupMockHandlerUpdating = (initEvents = [] as Event[]) => {
  const mockEvents: Event[] =
    initEvents.length > 0
      ? initEvents
      : [
          {
            id: '2ab06561-10f8-4e7f-8128-4b2dd343c6b9',
            title: '기존 회의',
            date: '2024-10-15',
            startTime: '09:00',
            endTime: '10:00',
            description: '기존 팀 미팅',
            location: '회의실 B',
            category: '업무',
            repeat: { type: 'none', interval: 0 },
            notificationTime: 10,
          },
          {
            id: 'd39ff583-36bf-40e8-b78f-a8760e708d3a',
            title: '기존 회의2',
            date: '2024-10-15',
            startTime: '11:00',
            endTime: '12:00',
            description: '기존 팀 미팅 2',
            location: '회의실 C',
            category: '업무 회의',
            repeat: { type: 'none', interval: 0 },
            notificationTime: 5,
          },
        ];

  server.use(
    http.get('/api/events', () => {
      return HttpResponse.json({ events: mockEvents });
    }),
    http.put('/api/events/:id', async ({ params, request }) => {
      const { id } = params;
      const updatedEvent = (await request.json()) as Event;
      const index = mockEvents.findIndex((event) => event.id === id);

      mockEvents[index] = { ...mockEvents[index], ...updatedEvent };
      return HttpResponse.json(mockEvents[index]);
    })
  );
};

export const setupMockHandlerDeletion = () => {
  const mockEvents: Event[] = [
    {
      id: '2ab06561-10f8-4e7f-8128-4b2dd343c6b9',
      title: '삭제할 이벤트',
      date: '2024-10-15',
      startTime: '09:00',
      endTime: '10:00',
      description: '삭제할 이벤트입니다',
      location: '어딘가',
      category: '기타',
      repeat: { type: 'monthly', interval: 1 },
      notificationTime: 10,
    },
  ];

  server.use(
    http.get('/api/events', () => {
      return HttpResponse.json({ events: mockEvents });
    }),
    http.delete('/api/events/:id', ({ params }) => {
      const { id } = params;
      const index = mockEvents.findIndex((event) => event.id === id);

      mockEvents.splice(index, 1);
      return new HttpResponse(null, { status: 204 });
    })
  );
};
