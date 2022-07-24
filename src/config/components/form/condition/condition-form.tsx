import React, { FCX, Suspense } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import styled from '@emotion/styled';
import { Autocomplete, TextField } from '@mui/material';
import produce from 'immer';

import { kx } from '@type/kintone.api';
import { appFieldsState } from '../../../states/kintone';
import { storageState } from '../../../states/plugin';
import ViewIdForm from './view-id';

type ContainerProps = { condition: kintone.plugin.Condition; index: number };

const Component: FCX<ContainerProps> = ({ className, condition, index }) => {
  const appFields = useRecoilValue(appFieldsState);

  const onTitleFieldChange = useRecoilCallback(
    ({ set }) =>
      (field: kx.FieldProperty | null) => {
        if (!field) {
          return;
        }
        set(storageState, (_, _storage = _!) =>
          produce(_storage, (draft) => {
            draft.conditions[index].calendarEvent.titleField = field.code;
          })
        );
      },
    []
  );

  const onStartFieldChange = useRecoilCallback(
    ({ set }) =>
      (field: kx.FieldProperty | null) => {
        if (!field) {
          return;
        }
        set(storageState, (_, _storage = _!) =>
          produce(_storage, (draft) => {
            draft.conditions[index].calendarEvent.startField = field.code;
          })
        );
      },
    []
  );

  const onEndFieldChange = useRecoilCallback(
    ({ set }) =>
      (field: kx.FieldProperty | null) => {
        if (!field) {
          return;
        }
        set(storageState, (_, _storage = _!) =>
          produce(_storage, (draft) => {
            draft.conditions[index].calendarEvent.endField = field.code;
          })
        );
      },
    []
  );

  return (
    <div {...{ className }}>
      <Suspense fallback={<div>一覧情報を取得しています...</div>}>
        <div>
          <h3>テーブルを表示する一覧の設定</h3>
          <ViewIdForm conditionIndex={index} />
          <small>
            選択する一覧は必ず表示形式を「カスタマイズ」に設定し、「ページネーションを表示する」のチェックを外してください。
          </small>
          <small>対象の一覧が選択肢に存在しない場合は、一度アプリを更新してください。</small>
        </div>
      </Suspense>
      <div>
        <h3>スケジュールのタイトル</h3>
        <Autocomplete
          value={appFields.find((field) => field.code === condition.calendarEvent.titleField)}
          sx={{ width: '350px' }}
          options={appFields}
          onChange={(_, option) => onTitleFieldChange(option)}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField {...params} label='対象フィールド' variant='outlined' color='primary' />
          )}
        />
      </div>
      <div>
        <h3>スケジュールの開始日時</h3>
        <Autocomplete
          value={appFields.find((field) => field.code === condition.calendarEvent.startField)}
          sx={{ width: '350px' }}
          options={appFields}
          onChange={(_, option) => onStartFieldChange(option)}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField {...params} label='対象フィールド' variant='outlined' color='primary' />
          )}
        />
      </div>
      <div>
        <h3>スケジュールの終了日時</h3>
        <Autocomplete
          value={appFields.find((field) => field.code === condition.calendarEvent.endField)}
          sx={{ width: '350px' }}
          options={appFields}
          onChange={(_, option) => onEndFieldChange(option)}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField {...params} label='対象フィールド' variant='outlined' color='primary' />
          )}
        />
      </div>
    </div>
  );
};

const StyledComponent = styled(Component)`
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 1rem;
  > div {
    padding: 8px 8px 8px 16px;
    border-left: 2px solid #0002;
    > h3 {
      font-weight: 500;
      margin-bottom: 16px;
    }
  }
`;

export default StyledComponent;
