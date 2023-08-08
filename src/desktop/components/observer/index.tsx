import { getAllRecords } from '@/common/kintone-rest-api';
import { getAppId, getQuery } from '@lb-ribbit/kintone-xapp';
import { FC, useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { convertRecordIntoEvent } from '../../actions';
import { calendarEventsState } from '../../states/calendar';
import { appPropertiesState, loadingState, pluginConditionState } from '../../states/kintone';

const Component: FC = () => {
  const condition = useRecoilValue(pluginConditionState);
  const setEvents = useSetRecoilState(calendarEventsState);
  const properties = useRecoilValue(appPropertiesState);
  const setLoading = useSetRecoilState(loadingState);

  useEffect(() => {
    (async () => {
      if (!condition) {
        return;
      }
      setLoading(true);
      try {
        const app = getAppId()!;
        const query = (getQuery() || '').replace(/limit [0-9]+/g, '').replace(/offset [0-9]+/g, '');
        const fields = [
          '$id',
          condition.calendarEvent.titleField,
          condition.calendarEvent.startField,
          condition.calendarEvent.allDayField,
          condition.calendarEvent.noteField,
          condition.calendarEvent.endField,
        ];

        if (condition.calendarEvent.categoryField) {
          fields.push(condition.calendarEvent.categoryField);
        }

        await getAllRecords({
          app,
          query,
          fields,
          onAdvance: (thisStepData) => {
            const thisStepEvents = thisStepData.map((record) =>
              convertRecordIntoEvent(condition, properties, record)
            );
            setEvents((current) => [...current, ...thisStepEvents]);
          },
        });
      } catch (error) {
        console.error('レコードの取得に失敗しました', error);
      } finally {
        setLoading(false);
      }
    })();
  }, [condition]);

  return null;
};

export default Component;
