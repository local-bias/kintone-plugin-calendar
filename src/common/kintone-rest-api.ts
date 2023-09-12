import { Record } from '@kintone/rest-api-client/lib/src/client/types';
import { getAppId } from '@lb-ribbit/kintone-xapp';

const END_POINT = '/k/v1/records';

const LIMIT_GET = 500;

type GetProps = Readonly<
  Partial<{
    app: number;
    fields: string[];
    totalCount: boolean;
    query: string;
    onGetTotal: (total: number) => void;
    onAdvance: (thisStepData: Record[], loadedData: Record[]) => void;
  }>
>;

type GetMethod = (props?: GetProps) => Promise<Record[]>;

interface CursorProps {
  id: string;
  onAdvance: ((thisStepData: Record[], loadedData: Record[]) => void) | null;
  loadedData?: Record[];
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
}: CursorProps): Promise<Record[]> => {
  const response = await kintone.api(kintone.api.url(`${END_POINT}/cursor`, true), 'GET', { id });

  const thisStepData: Record[] = response.records;
  const newRecords: Record[] = [...loadedData, ...thisStepData];

  if (onAdvance) {
    onAdvance(thisStepData, loadedData);
  }

  return response.next
    ? getRecordsByCursorId({ id, onAdvance, loadedData: newRecords })
    : newRecords;
};
