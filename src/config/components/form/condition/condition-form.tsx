import React, { ChangeEventHandler, FCX, Suspense, useEffect, useState } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import styled from '@emotion/styled';
import { Autocomplete, FormControlLabel, MenuItem, Switch, TextField } from '@mui/material';
import { produce } from 'immer';

import {
  appFieldsState,
  checkboxFieldsState,
  dateTimeFieldsState,
  selectableFieldsState,
  stringFieldsState,
} from '../../../states/kintone';
import { storageState } from '../../../states/plugin';
import ViewIdForm from './view-id';
import { kintoneAPI } from '@konomi-app/kintone-utilities';

type ContainerProps = { condition: kintone.plugin.Condition; index: number };

const Component: FCX<ContainerProps> = ({ className, condition, index }) => {
  const appFields = useRecoilValue(appFieldsState);
  const stringFields = useRecoilValue(stringFieldsState);
  const dateTimeFields = useRecoilValue(dateTimeFieldsState);
  const checkboxFields = useRecoilValue(checkboxFieldsState);
  const selectableFields = useRecoilValue(selectableFieldsState);
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
      (field: kintoneAPI.FieldProperty | null) => {
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
      (field: kintoneAPI.FieldProperty | null) => {
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
      (field: kintoneAPI.FieldProperty | null) => {
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
      (field: kintoneAPI.FieldProperty | null) => {
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

  const onCategoryFieldChange = useRecoilCallback(
    ({ set }) =>
      (field: kintoneAPI.FieldProperty | null) => {
        set(storageState, (_, _storage = _!) =>
          produce(_storage, (draft) => {
            draft.conditions[index].calendarEvent.categoryField = field ? field.code : '';
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
      (field: kintoneAPI.FieldProperty | null) => {
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

  const onSlotMinTimeChange: ChangeEventHandler<HTMLInputElement> = useRecoilCallback(
    ({ set }) =>
      (props) => {
        set(storageState, (_, _storage = _!) =>
          produce(_storage, (draft) => {
            draft.conditions[index].slotMinTime = `${props.target.value}:00:00`;
          })
        );
      },
    []
  );

  const onSlotMaxTimeChange: ChangeEventHandler<HTMLInputElement> = useRecoilCallback(
    ({ set }) =>
      (props) => {
        set(storageState, (_, _storage = _!) =>
          produce(_storage, (draft) => {
            draft.conditions[index].slotMaxTime = `${props.target.value}:00:00`;
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
            選択できるのは表示形式が「カスタマイズ」の一覧のみです。対象の一覧が選択肢に存在しない場合は、一度アプリを更新してください。
          </small>
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
                <MenuItem key={`allDayOptions-${code}`} value={code}>
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
      <div>
        <h3>表示時間帯の設定</h3>
        <TextField
          label='開始'
          select
          variant='outlined'
          color='primary'
          onChange={onSlotMinTimeChange}
          sx={{ width: '150px', marginRight: '1rem' }}
          value={(condition.slotMinTime || '0:').split(':')[0]}
        >
          {[
            '0',
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10',
            '11',
            '12',
            '13',
            '14',
            '15',
            '16',
            '17',
            '18',
            '19',
            '20',
            '21',
            '22',
            '23',
            '24',
          ].map((hour, i) => (
            <MenuItem key={`slotMinTime-${hour}`} value={hour}>
              {hour}時
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label='終了'
          select
          variant='outlined'
          color='primary'
          onChange={onSlotMaxTimeChange}
          sx={{ width: '150px' }}
          value={(condition.slotMaxTime || '24:').split(':')[0]}
        >
          {[
            '0',
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10',
            '11',
            '12',
            '13',
            '14',
            '15',
            '16',
            '17',
            '18',
            '19',
            '20',
            '21',
            '22',
            '23',
            '24',
          ].map((hour, i) => (
            <MenuItem key={i} value={hour}>
              {hour}時
            </MenuItem>
          ))}
        </TextField>
      </div>
      <div>
        <h3>カテゴリー設定</h3>
        <Autocomplete
          value={appFields.find((field) => field.code === condition.calendarEvent.categoryField)}
          sx={{ width: '350px' }}
          options={selectableFields}
          onChange={(_, option) => onCategoryFieldChange(option)}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField {...params} label='対象フィールド' variant='outlined' color='primary' />
          )}
        />
        <small>対象フィールド: チェックボックス、ドロップダウン、ラジオボタン</small>
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
