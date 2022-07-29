declare namespace kintone {
  namespace plugin {
    /** プラグインがアプリ単位で保存する設定情報🔌 */
    type Storage = {
      conditions: Condition[];
    };

    /** プラグインの制御単位の設定情報🔌 */
    type Condition = {
      viewId: string;
      initialView: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay';
      enablesAllDay: boolean;
      allDayOption: string;
      enablesNote: boolean;
      slotMaxTime: string;
      slotMinTime: string;
      calendarEvent: {
        titleField: string;
        startField: string;
        endField: string;
        allDayField: string;
        noteField: string;
      };
    };
  }
}
