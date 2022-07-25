import { kintoneClient } from '@common/kintone-api';
import { getAppId } from '@lb-ribbit/kintone-xapp';
import { FC, useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { convertRecordIntoEvent } from '../../actions';
import { calendarEventsState } from '../../states/calendar';
import { loadingState, pluginConditionState } from '../../states/kintone';

const Component: FC = () => {
  const condition = useRecoilValue(pluginConditionState);
  const setEvents = useSetRecoilState(calendarEventsState);
  const setLoading = useSetRecoilState(loadingState);

  useEffect(() => {
    (async () => {
      if (!condition) {
        return;
      }
      setLoading(true);
      try {
        const app = getAppId()!;
        const query = `${condition.calendarEvent.endField} >= FROM_TODAY(-${60}, DAYS)`;
        const fields = [
          '$id',
          condition.calendarEvent.titleField,
          condition.calendarEvent.startField,
          condition.calendarEvent.endField,
        ];

        const records = await kintoneClient.record.getAllRecordsWithCursor({ app, query, fields });
        console.log('🐁 初期レコード', { fields, records });
        const events = records.map((record) => convertRecordIntoEvent(condition, record));
        setEvents(events);
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
