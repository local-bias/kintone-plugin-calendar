import React, { ChangeEventHandler, FCX, Suspense, useEffect, useState } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import styled from '@emotion/styled';
import { Autocomplete, FormControlLabel, MenuItem, Switch, TextField } from '@mui/material';
import produce from 'immer';

import { kx } from '@type/kintone.api';
import {
  appFieldsState,
  checkboxFieldsState,
  dateTimeFieldsState,
  stringFieldsState,
} from '../../../states/kintone';
import { storageState } from '../../../states/plugin';
import ViewIdForm from './view-id';

type ContainerProps = { condition: kintone.plugin.Condition; index: number };

const Component: FCX<ContainerProps> = ({ className, condition, index }) => {
  const appFields = useRecoilValue(appFieldsState);
  const stringFields = useRecoilValue(stringFieldsState);
  const dateTimeFields = useRecoilValue(dateTimeFieldsState);
  const checkboxFields = useRecoilValue(checkboxFieldsState);
  const [allDayOptions, setAllDayOptions] = useState<string[]>([]);

  useEffect(() => {
    if (!condition.enablesAllDay) {
      return;
    }

    const foundField = checkboxFields.find(
      (field) => field.code === condition.calendarEvent.allDayField
    );
    if (!foundField) {
      return;
    }

    setAllDayOptions(Object.keys(foundField.options));
  }, [condition.calendarEvent.allDayField, condition.enablesAllDay]);

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

  const onEnablesAllDayChange = useRecoilCallback(
    ({ set }) =>
      (checked: boolean) => {
        set(storageState, (_, _storage = _!) =>
          produce(_storage, (draft) => {
            draft.conditions[index].enablesAllDay = checked;
          })
        );
      },
    []
  );

  const onAllDayFieldChange = useRecoilCallback(
    ({ set }) =>
      (field: kx.FieldProperty | null) => {
        if (!field) {
          return;
        }
        set(storageState, (_, _storage = _!) =>
          produce(_storage, (draft) => {
            draft.conditions[index].calendarEvent.allDayField = field.code;
          })
        );
      },
    []
  );

  const onEnablesNoteChange = useRecoilCallback(
    ({ set }) =>
      (checked: boolean) => {
        set(storageState, (_, _storage = _!) =>
          produce(_storage, (draft) => {
            draft.conditions[index].enablesNote = checked;
          })
        );
      },
    []
  );

  const onNoteFieldChange = useRecoilCallback(
    ({ set }) =>
      (field: kx.FieldProperty | null) => {
        if (!field) {
          return;
        }
        set(storageState, (_, _storage = _!) =>
          produce(_storage, (draft) => {
            draft.conditions[index].calendarEvent.noteField = field.code;
          })
        );
      },
    []
  );

  const onAllDayOptionChange: ChangeEventHandler<HTMLInputElement> = useRecoilCallback(
    ({ set }) =>
      (props) => {
        set(storageState, (_, _storage = _!) =>
          produce(_storage, (draft) => {
            draft.conditions[index].allDayOption = props.target.value;
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
          options={stringFields}
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
          options={dateTimeFields}
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
          options={dateTimeFields}
          onChange={(_, option) => onEndFieldChange(option)}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField {...params} label='対象フィールド' variant='outlined' color='primary' />
          )}
        />
      </div>
      <div>
        <h3>終日設定</h3>
        <FormControlLabel
          control={<Switch color='primary' checked={!!condition.enablesAllDay} />}
          onChange={(_, checked) => onEnablesAllDayChange(checked)}
          sx={{ marginBottom: '1rem' }}
          label='終日設定を有効にする'
        />
        {condition.enablesAllDay && (
          <>
            <Autocomplete
              value={appFields.find((field) => field.code === condition.calendarEvent.allDayField)}
              sx={{ width: '350px', marginBottom: '1rem' }}
              options={checkboxFields}
              onChange={(_, option) => onAllDayFieldChange(option)}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <TextField {...params} label='対象フィールド' variant='outlined' color='primary' />
              )}
            />
            <TextField
              label='終日とする値'
              select
              variant='outlined'
              color='primary'
              onChange={onAllDayOptionChange}
              sx={{ width: '350px' }}
              value={condition.allDayOption}
            >
              {allDayOptions.map((code, i) => (
                <MenuItem key={i} value={code}>
                  {code}
                </MenuItem>
              ))}
            </TextField>
          </>
        )}
      </div>
      <div>
        <h3>スケジュールの備考</h3>
        <FormControlLabel
          control={<Switch color='primary' checked={!!condition.enablesNote} />}
          onChange={(_, checked) => onEnablesNoteChange(checked)}
          sx={{ marginBottom: '1rem' }}
          label='スケジュールの備考を有効にする'
        />
        {condition.enablesNote && (
          <Autocomplete
            value={appFields.find((field) => field.code === condition.calendarEvent.noteField)}
            sx={{ width: '350px' }}
            options={stringFields}
            onChange={(_, option) => onNoteFieldChange(option)}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => (
              <TextField {...params} label='対象フィールド' variant='outlined' color='primary' />
            )}
          />
        )}
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
