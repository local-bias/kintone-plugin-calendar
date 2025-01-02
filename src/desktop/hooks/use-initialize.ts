import { useEffect } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { getCalendarEventFromKintoneRecord } from '../actions';
import { calendarEventsState } from '../states/calendar';
import { appPropertiesState, loadingState, pluginConditionState } from '../states/kintone';
import { getAllRecordsWithId, getAppId, getQueryCondition } from '@konomi-app/kintone-utilities';
import { GUEST_SPACE_ID } from '@/lib/global';

export const useInitialize = () => {
  const condition = useRecoilValue(pluginConditionState);

  const initialize = useRecoilCallback(
    ({ set, snapshot }) =>
      async (condition: Plugin.Condition) => {
        try {
          set(loadingState, true);
          const app = getAppId()!;
          const query = getQueryCondition() || '';
          const fields = [
            '$id',
            condition.calendarEvent.titleField,
            condition.calendarEvent.startField,
            condition.calendarEvent.allDayField,
            condition.calendarEvent.noteField,
            condition.calendarEvent.endField,
          ].filter((field) => field);

          if (condition.calendarEvent.categoryField) {
            fields.push(condition.calendarEvent.categoryField);
          }

          const properties = await snapshot.getPromise(appPropertiesState);

          const onStep: Parameters<typeof getAllRecordsWithId>[0]['onStep'] = ({ records }) => {
            const calendarEvents = records.map((record) =>
              getCalendarEventFromKintoneRecord({ condition, properties, record })
            );
            set(calendarEventsState, calendarEvents);
          };

          await getAllRecordsWithId({
            app,
            condition: query,
            fields,
            onStep,
            guestSpaceId: GUEST_SPACE_ID,
            debug: process.env.NODE_ENV === 'development',
          });
        } catch (error) {
          console.error('レコードの取得に失敗しました', error);
        } finally {
          set(loadingState, false);
        }
      },
    []
  );

  useEffect(() => {
    if (condition) {
      initialize(condition);
    }
  }, [condition]);

  return null;
};
