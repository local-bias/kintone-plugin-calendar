import { getAppId, getQuery } from '@lb-ribbit/kintone-xapp';
import { FC, useEffect } from 'react';
import { useRecoilCallback, useRecoilValue, useSetRecoilState } from 'recoil';
import { getCalendarEventFromKintoneRecord } from '../../actions';
import { calendarEventsState } from '../../states/calendar';
import { appPropertiesState, loadingState, pluginConditionState } from '../../states/kintone';
import { getAllRecords } from '@konomi-app/kintone-utilities';
import { GUEST_SPACE_ID } from '@/lib/global';

export const useObserver = () => {
  const condition = useRecoilValue(pluginConditionState);

  const observe = useRecoilCallback(
    ({ set, snapshot }) =>
      async (condition: Plugin.Condition) => {
        set(loadingState, true);
        try {
          const app = getAppId()!;
          const query = (getQuery() || '')
            .replace(/limit [0-9]+/g, '')
            .replace(/offset [0-9]+/g, '');
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

          await getAllRecords({
            app,
            query,
            fields,
            onStep: ({ records }) => {
              const calendarEvents = records.map((record) =>
                getCalendarEventFromKintoneRecord({
                  condition,
                  properties,
                  record,
                })
              );
              set(calendarEventsState, calendarEvents);
            },
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
    (async () => {
      if (!condition) {
        return;
      }
      await observe(condition);
    })();
  }, [condition]);

  return null;
};
