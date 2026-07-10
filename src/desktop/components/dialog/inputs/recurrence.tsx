import { calendarDateInputToDateTime } from '@/desktop/date-conversion';
import {
  buildRRuleString,
  parseRRuleString,
  RecurrenceEndCondition,
  RecurrenceFormState,
  RecurrenceFrequency,
  RecurrenceMonthlyMode,
} from '@/desktop/recurrence';
import { dialogEventAtom } from '@/desktop/states/dialog';
import { loginUserAtom, pluginConditionAtom } from '@/desktop/states/kintone';
import { DatePicker } from '@/lib/components/date-picker';
import { WEEK_DAYS } from '@/lib/calendar';
import { t } from '@/lib/i18n-plugin';
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Radio,
  RadioGroup,
  Switch,
  TextField,
} from '@mui/material';
import { produce } from 'immer';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { DateTime } from 'luxon';
import { FC } from 'react';

const DEFAULT_FORM: RecurrenceFormState = {
  freq: 'WEEKLY',
  interval: 1,
  byweekday: [],
  monthlyMode: 'dayOfMonth',
  end: { type: 'never' },
};

/** 現在の`dialogEventAtom`の繰り返し設定(無ければ既定値)に`updater`を適用し、
 *  再構築したRRULE文字列を書き戻す。`exceptions`は既存のものを維持する。 */
const handleFormChangeAtom = atom(
  null,
  (get, set, updater: (form: RecurrenceFormState) => RecurrenceFormState) => {
    const event = get(dialogEventAtom);
    if (!event.start) return;
    const { timezone } = get(loginUserAtom);
    const startDt = calendarDateInputToDateTime(event.start, timezone);

    const recurrence = event.extendedProps?.recurrence;
    const currentForm = recurrence?.kind === 'master' ? parseRRuleString(recurrence.rrule) : DEFAULT_FORM;
    const nextForm = updater(currentForm);
    const rrule = buildRRuleString(nextForm, startDt);

    set(dialogEventAtom, (current) =>
      produce(current, (draft) => {
        const exceptions =
          draft.extendedProps?.recurrence?.kind === 'master' ? draft.extendedProps.recurrence.exceptions : [];
        draft.extendedProps = { recurrence: { kind: 'master', rrule, exceptions } };
      })
    );
  }
);

const handleToggleAtom = atom(null, (get, set, checked: boolean) => {
  if (!checked) {
    set(dialogEventAtom, (current) => produce(current, (draft) => {
      draft.extendedProps = undefined;
    }));
    return;
  }
  set(handleFormChangeAtom, () => DEFAULT_FORM);
});

const RecurrenceFormInputs: FC<{ form: RecurrenceFormState }> = ({ form }) => {
  const onChange = useSetAtom(handleFormChangeAtom);

  return (
    <div className='grid gap-3 pl-3 border-l-2 border-l-foreground/20'>
      <div className='flex items-center gap-2'>
        <TextField
          select
          size='small'
          label={t('desktop.dialog.recurrence.frequency')}
          value={form.freq}
          onChange={(e) => onChange((f) => ({ ...f, freq: e.target.value as RecurrenceFrequency }))}
          sx={{ minWidth: 140 }}
        >
          <MenuItem value='DAILY'>{t('desktop.dialog.recurrence.frequency.daily')}</MenuItem>
          <MenuItem value='WEEKLY'>{t('desktop.dialog.recurrence.frequency.weekly')}</MenuItem>
          <MenuItem value='MONTHLY'>{t('desktop.dialog.recurrence.frequency.monthly')}</MenuItem>
          <MenuItem value='YEARLY'>{t('desktop.dialog.recurrence.frequency.yearly')}</MenuItem>
        </TextField>
        <TextField
          type='number'
          size='small'
          label={t('desktop.dialog.recurrence.interval')}
          value={form.interval}
          slotProps={{ htmlInput: { min: 1 } }}
          onChange={(e) =>
            onChange((f) => ({ ...f, interval: Math.max(1, Number(e.target.value) || 1) }))
          }
          sx={{ width: 100 }}
        />
      </div>

      {form.freq === 'WEEKLY' && (
        <FormGroup row>
          {WEEK_DAYS.map(({ label, value }) => (
            <FormControlLabel
              key={value}
              control={
                <Checkbox
                  size='small'
                  checked={form.byweekday.includes(value)}
                  onChange={(_, checked) =>
                    onChange((f) => ({
                      ...f,
                      byweekday: checked
                        ? [...f.byweekday, value]
                        : f.byweekday.filter((v) => v !== value),
                    }))
                  }
                />
              }
              label={label}
            />
          ))}
        </FormGroup>
      )}

      {form.freq === 'MONTHLY' && (
        <RadioGroup
          value={form.monthlyMode}
          onChange={(e) =>
            onChange((f) => ({ ...f, monthlyMode: e.target.value as RecurrenceMonthlyMode }))
          }
        >
          <FormControlLabel
            value='dayOfMonth'
            control={<Radio size='small' />}
            label={t('desktop.dialog.recurrence.monthlyMode.dayOfMonth')}
          />
          <FormControlLabel
            value='weekdayOfMonth'
            control={<Radio size='small' />}
            label={t('desktop.dialog.recurrence.monthlyMode.weekdayOfMonth')}
          />
        </RadioGroup>
      )}

      <RadioGroup
        value={form.end.type}
        onChange={(e) => {
          const type = e.target.value as RecurrenceEndCondition['type'];
          onChange((f) => ({
            ...f,
            end:
              type === 'never'
                ? { type: 'never' }
                : type === 'onDate'
                  ? { type: 'onDate', date: DateTime.now().plus({ months: 1 }).toFormat('yyyy-MM-dd') }
                  : { type: 'afterCount', count: 10 },
          }));
        }}
      >
        <FormControlLabel
          value='never'
          control={<Radio size='small' />}
          label={t('desktop.dialog.recurrence.end.never')}
        />
        <div className='flex items-center gap-2'>
          <FormControlLabel
            value='onDate'
            control={<Radio size='small' />}
            label={t('desktop.dialog.recurrence.end.onDate')}
          />
          {form.end.type === 'onDate' && (
            <DatePicker
              value={DateTime.fromISO(form.end.date)}
              onChange={(date) => {
                if (!(date instanceof DateTime)) return;
                onChange((f) => ({ ...f, end: { type: 'onDate', date: date.toFormat('yyyy-MM-dd') } }));
              }}
            />
          )}
        </div>
        <div className='flex items-center gap-2'>
          <FormControlLabel
            value='afterCount'
            control={<Radio size='small' />}
            label={t('desktop.dialog.recurrence.end.afterCount')}
          />
          {form.end.type === 'afterCount' && (
            <TextField
              type='number'
              size='small'
              value={form.end.count}
              slotProps={{ htmlInput: { min: 1 } }}
              onChange={(e) =>
                onChange((f) => ({
                  ...f,
                  end: { type: 'afterCount', count: Math.max(1, Number(e.target.value) || 1) },
                }))
              }
              sx={{ width: 80 }}
            />
          )}
        </div>
      </RadioGroup>
    </div>
  );
};

const Component: FC = () => {
  const pluginCondition = useAtomValue(pluginConditionAtom);
  const event = useAtomValue(dialogEventAtom);
  const onToggle = useSetAtom(handleToggleAtom);

  const recurrence = event.extendedProps?.recurrence;

  // 分離済みの1回(override)は繰り返し設定の対象外
  if (!pluginCondition?.enablesRecurrence || recurrence?.kind === 'override') {
    return null;
  }

  const isMaster = recurrence?.kind === 'master';
  const form = recurrence?.kind === 'master' ? parseRRuleString(recurrence.rrule) : DEFAULT_FORM;

  return (
    <div className='grid gap-2'>
      <FormControlLabel
        control={<Switch checked={isMaster} onChange={(_, checked) => onToggle(checked)} />}
        label={t('desktop.dialog.recurrence.enable')}
      />
      {isMaster && <RecurrenceFormInputs form={form} />}
    </div>
  );
};

export default Component;
