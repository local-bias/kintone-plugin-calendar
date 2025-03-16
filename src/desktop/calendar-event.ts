/**
 * 📝 WIP: クラスの構想だけ
 */

/*
import { EventApi, EventInput } from '@fullcalendar/core';
import { kx } from '@type/kintone.api';
import { DateTime } from 'luxon';

type DateInput = Date | string | number | number[];

type ConstructorProps = {
  id: string;
  start: DateInput | null;
  end: DateInput | null;
  title: string | null;
  note: string;
  allDay: boolean;
};

export class PluginCalendarEvent {
  private _id: string;
  private _start: DateInput | null;
  private _end: DateInput | null;
  private _title: string | null;
  private _note: string;
  private _allDay: boolean;

  private constructor(props: ConstructorProps) {
    this._id = props.id;
    this._start = props.start;
    this._end = props.end;
    this._title = props.title;
    this._note = props.note;
    this._allDay = props.allDay;
  }

  public static fromEventApi(event: EventApi) {
    return new PluginCalendarEvent({
      id: event.id,
      start: event.start,
      end: event.end,
      title: event.title,
      allDay: event.allDay,
      note: '',
    });
  }

  public static fromEventInput(event: EventInput) {
    if (!event.id) {
      throw 'プラグインにおいて、各イベントのIDは必須です';
    }

    return new PluginCalendarEvent({
      id: event.id,
      start: event.start ?? null,
      end: event.end ?? null,
      title: event.title ?? null,
      allDay: event.allDay ?? false,
      note: '',
    });
  }

  public static fromKintoneRecord(condition: kintone.PluginCondition, record: kintoneAPI.RecordData) {
    const recordId = record.$id.value as string | undefined;
    if (!recordId) {
      throw 'レコードIDの取得に失敗しました';
    }

    const calendarEvent: Partial<ConstructorProps> = {
      id: recordId,
      start: record[condition.calendarEvent?.startField]?.value as string | null,
      end: record[condition.calendarEvent?.endField]?.value as string | null,
      title: record[condition.calendarEvent?.titleField]?.value as string | null,
      note: (record[condition.calendarEvent?.noteField]?.value ?? '') as string,
    };

    if (condition.enablesAllDay && condition.allDayOption) {
      const options = record[condition.calendarEvent.allDayField].value as string[];
      calendarEvent.allDay = options.includes(condition.allDayOption);
    } else {
      calendarEvent.allDay = false;
    }

    return new PluginCalendarEvent(calendarEvent as ConstructorProps);
  }

  public toKintoneRecord(condition: kintone.PluginCondition): kintoneAPI.RecordData {
    const { calendarEvent } = condition;
    const start = this._start ? DateTime.fromJSDate(this._start as Date).toISO() : null;
    const end = this._end ? DateTime.fromJSDate(this._end as Date).toISO() : null;

    const record: Record<string, any> = {};

    if (calendarEvent.titleField) {
      record[calendarEvent.titleField] = { value: this._title };
    }
    if (calendarEvent.startField) {
      record[calendarEvent.startField] = { value: start || '' };
    }
    if (calendarEvent.endField) {
      record[calendarEvent.endField] = { value: end || '' };
    }
    if (condition.enablesAllDay && condition.allDayOption && calendarEvent.allDayField) {
      record[calendarEvent.allDayField] = {
        value: this._allDay ? [condition.allDayOption] : [],
      };
    }
    if (condition.enablesNote && calendarEvent.noteField) {
      record[calendarEvent.noteField] = { value: this._note };
    }

    return record;
  }

  public set id(newId: string) {
    this._id = newId;
  }
}



*/
