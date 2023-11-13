import { kintoneAPI } from '@konomi-app/kintone-utilities';
import { getAppId } from '@lb-ribbit/kintone-xapp';

/** kintoneアプリに初期状態で存在するフィールドタイプ */
export const PREDEFINED_FIELDS: kintoneAPI.FieldPropertyType[] = [
  'RECORD_NUMBER',
  'UPDATED_TIME',
  'CREATOR',
  'CREATED_TIME',
  'CATEGORY',
  'MODIFIER',
  'STATUS',
];

const END_POINT = '/k/v1/records';

const LIMIT_GET = 500;

type GetProps = Readonly<
  Partial<{
    app: number;
    fields: string[];
    totalCount: boolean;
    query: string;
    onGetTotal: (total: number) => void;
    onAdvance: (thisStepData: kintoneAPI.RecordData[], loadedData: kintoneAPI.RecordData[]) => void;
  }>
>;

type GetMethod = (props?: GetProps) => Promise<kintoneAPI.RecordData[]>;

interface CursorProps {
  id: string;
  onAdvance:
    | ((thisStepData: kintoneAPI.RecordData[], loadedData: kintoneAPI.RecordData[]) => void)
    | null;
  loadedData?: kintoneAPI.RecordData[];
}

export const getAllRecords: GetMethod = async (props = {}) => {
  const { app = getAppId(), fields = [], query = '', onGetTotal = null, onAdvance = null } = props;

  const param = { app, fields, size: LIMIT_GET, query };

  const cursor = await kintone.api(kintone.api.url(`${END_POINT}/cursor`, true), 'POST', param);

  if (onGetTotal) {
    onGetTotal(cursor.totalCount);
  }

  return getRecordsByCursorId({ id: cursor.id, onAdvance });
};

const getRecordsByCursorId = async ({
  id,
  onAdvance,
  loadedData = [],
}: CursorProps): Promise<kintoneAPI.RecordData[]> => {
  const response = await kintone.api(kintone.api.url(`${END_POINT}/cursor`, true), 'GET', { id });

  const thisStepData: kintoneAPI.RecordData[] = response.records;
  const newRecords: kintoneAPI.RecordData[] = [...loadedData, ...thisStepData];

  if (onAdvance) {
    onAdvance(thisStepData, loadedData);
  }

  return response.next
    ? getRecordsByCursorId({ id, onAdvance, loadedData: newRecords })
    : newRecords;
};
