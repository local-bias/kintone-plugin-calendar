import { commonUi, useTranslations } from './i18n';
import { mergeDeep } from 'remeda';
import { LANGUAGE } from './global';

const ui = mergeDeep(commonUi, {
  ja: {
    // Desktop - Loading
    'desktop.loading.default': '読み込み中',

    // Desktop - Calendar view types
    'desktop.calendar.viewType.month': '月',
    'desktop.calendar.viewType.week': '週',
    'desktop.calendar.viewType.fiveDay': '5日',
    'desktop.calendar.viewType.threeDay': '3日',
    'desktop.calendar.viewType.day': '日',
    'desktop.calendar.noTitle': '（タイトルなし）',

    // Desktop - Sidebar
    'desktop.sidebar.filterSchedule': '予定を絞り込む',
    'desktop.sidebar.category': 'カテゴリー',

    // Desktop - Fab
    'desktop.fab.addSchedule': 'スケジュールを追加する',

    // Desktop - Dialog
    'desktop.dialog.eventTitle': 'イベントのタイトル',
    'desktop.dialog.description': '説明',
    'desktop.dialog.startDate': '開始日',
    'desktop.dialog.startDateTime': '開始日時',
    'desktop.dialog.endDate': '終了日',
    'desktop.dialog.endDateTime': '終了日時',
    'desktop.dialog.category': 'カテゴリー',
    'desktop.dialog.allDay': '終日',

    // Desktop - Toast messages
    'desktop.toast.eventCopied': 'イベントのコピーしました',
    'desktop.toast.recordDeleted': 'レコードの削除が完了しました',

    // Desktop - Error messages
    'desktop.error.recordSaveFailed': 'レコードの保存に失敗しました: {0}',
    'desktop.error.recordFetchFailed': 'レコードの取得に失敗しました',
    'desktop.error.recordUpdateFailed': 'レコードの更新に失敗しました: {0}',
    'desktop.error.recordDeleteFailed': 'レコードの削除に失敗しました: {0}',
    'desktop.error.eventClickFailed': 'クリックしたイベントの取得に失敗しました',
    'desktop.error.cannotCopyNewEvent': '新規イベントをコピーすることはできません',
    'desktop.error.eventRecordNotFound':
      '対象イベントに紐づくレコード情報の取得に失敗しました、一覧を再表示した上で再度お試しください',
    'desktop.error.scheduleRecordNotFound':
      'スケジュールに紐づくレコードが存在しません、一覧を更新し、再度お試しください',
    'desktop.error.eventCopySuffix': ' (コピー)',

    // Config - Loading
    'config.loading.waitingForRender': '画面の描画を待機しています',
    'config.loading.fetchingSettings': '設定情報を取得しています',

    // Config - Sidebar
    'config.sidebar.notSet': '未設定',
    'config.sidebar.settingLabel': '設定{0}',

    // Config - Toast messages
    'config.toast.settingDeleted': '設定情報を削除しました',
    'config.toast.settingCopied': '設定情報をコピーしました',
    'config.toast.settingPasted': '設定情報を貼り付けました',
    'config.toast.settingInvalidFormat': '設定情報の形式が正しくありません',
    'config.toast.conditionDeleted': '設定を削除しました',
    'config.toast.settingSaved': '設定を保存しました',
    'config.toast.settingReset': '設定をリセットしました',
    'config.toast.settingImported': '設定情報をインポートしました',
    'config.toast.settingImportFailed':
      '設定情報のインポートに失敗しました、ファイルに誤りがないか確認してください',
    'config.toast.settingExported': 'プラグインの設定情報をエクスポートしました',
    'config.toast.settingExportFailed':
      'プラグインの設定情報のエクスポートに失敗しました。プラグイン開発者にお問い合わせください。',
    'config.toast.viewCreated': '一覧を作成しました',
    'config.toast.viewCreationFailed': '一覧の作成に失敗しました',

    // Config - Error messages
    'config.error.appIdNotFound': 'アプリIDが取得できませんでした',
    'config.error.rootElementNotFound': 'プラグインのHTMLに、ルート要素が存在しません。',
    'config.error.fieldInfoNotFound': 'アプリのフィールド情報が取得できませんでした',
    'config.error.viewInfoNotFound': 'アプリのビュー情報を取得できませんでした',

    // Config - Form section titles
    'config.section.viewSettings.title': 'テーブルを表示する一覧の設定',
    'config.section.viewSettings.description': 'カレンダーを表示する一覧を選択してください',
    'config.section.scheduleTitle.title': 'スケジュールのタイトル',
    'config.section.scheduleTitle.description':
      'スケジュールのタイトルとして使用するフィールドを選択してください',
    'config.section.scheduleTitle.description2':
      '使用できるフィールドタイプは、文字列１行フィールド、文字列複数行フィールド、リッチテキストです',
    'config.section.scheduleStart.title': 'スケジュールの開始日時',
    'config.section.scheduleStart.description':
      'スケジュールの開始日時として使用するフィールドを選択してください',
    'config.section.scheduleStart.description2':
      '「日付」フィールドを設定した場合は、無条件で終日扱いとなります',
    'config.section.scheduleEnd.title': 'スケジュールの終了日付',
    'config.section.scheduleEnd.description':
      'スケジュールの終了日付として使用するフィールドを選択してください',
    'config.section.scheduleEnd.description2':
      '「日付」フィールドを設定した場合は、無条件で終日扱いとなります',
    'config.section.allDay.title': '終日設定',
    'config.section.allDay.description': '時刻を指定せず、終日の予定を有効にします',
    'config.section.allDay.enableLabel': '終日設定を有効にする',
    'config.section.note.title': 'スケジュールの備考',
    'config.section.note.description':
      'カレンダーから編集することのできるスケジュールの備忘を有効にします',
    'config.section.note.description2':
      '使用できるフィールドタイプは、文字列１行フィールド、文字列複数行フィールド、リッチテキストです',
    'config.section.note.enableLabel': 'スケジュールの備考を有効にする',
    'config.section.advanced': '高度な設定',
    'config.section.initialView.title': '初期表示するカレンダーの種類',
    'config.section.initialView.description': '初期表示するカレンダーの種類を選択してください',
    'config.section.slotMinmax.title': '表示時間帯の設定',
    'config.section.slotMinmax.description': 'カレンダーに表示する時間帯の上限と下限を設定します。',
    'config.section.businessDays.title': '営業日の設定',
    'config.section.businessDays.description': 'カレンダーで営業日とする曜日を設定します',
    'config.section.businessDays.description2':
      'チェックを外した曜日は、カレンダー上でグレーアウトされます',
    'config.section.firstDay.title': '週の始まりの曜日',
    'config.section.firstDay.description': '1週間の始まりとする曜日を設定します',
    'config.section.firstDay.description2':
      'ここで設定した曜日が、週表示、月表示時の左端の曜日となります',
    'config.section.category.title': 'カテゴリー設定',
    'config.section.category.description':
      'カレンダーのカテゴリーとして使用するフィールドを設定します',
    'config.section.category.description2': 'カレンダーはカテゴリーに応じて色分けされます',
    'config.section.category.description3':
      '使用できるフィールドタイプは、チェックボックス、ラジオボタン、ドロップダウンです',
    'config.section.colors.title': 'スケジュールの色',
    'config.section.colors.description': 'カレンダーに登録するスケジュールの色を設定します。',
    'config.section.colors.description2':
      'カテゴリーを使用しない場合、スケジュールは必ず１つ目の色になります',

    // Config - Form labels
    'config.form.viewName': '一覧の名前',
    'config.form.calendarType': 'カレンダーの種類',
    'config.form.slotStart': '開始',
    'config.form.slotEnd': '終了',
    'config.form.hour': '時',
    'config.form.firstDay': '週の始まりの曜日',
    'config.form.colorLabel': '色{0}',
    'config.form.addColor': '色設定を追加する',
    'config.form.deleteColor': 'この色設定を削除する',
    'config.form.allDayValue': '終日とする値',
    'config.form.selectField': 'フィールドを選択してください',
    'config.form.createNewView': '一覧を新規作成',
    'config.form.calendarName': '📆 カレンダー',

    // Config - Initial view options
    'config.initialView.dayGridMonth': '日単位、１ヶ月のカレンダー',
    'config.initialView.timeGridWeek': '時間単位、１週間のカレンダー',
    'config.initialView.timeGridFiveDay': '時間単位、5日間のカレンダー',
    'config.initialView.timeGridThreeDay': '時間単位、3日のカレンダー',
    'config.initialView.timeGridDay': '時間単位、１日のカレンダー',

    // Config - Footer buttons
    'config.footer.save': '設定を保存',
    'config.footer.backToPluginList': 'プラグイン一覧へ戻る',
    'config.footer.backToPluginListShort': 'プラグイン一覧に戻る',

    // Common - Weekdays
    'common.weekday.sunday': '日曜日',
    'common.weekday.monday': '月曜日',
    'common.weekday.tuesday': '火曜日',
    'common.weekday.wednesday': '水曜日',
    'common.weekday.thursday': '木曜日',
    'common.weekday.friday': '金曜日',
    'common.weekday.saturday': '土曜日',

    // Common - Field select
    'common.field.codePrefix': 'コード: ',
    'common.field.targetField': '対象フィールド',
    'common.field.selectPlaceholder': 'フィールドを選択してください',

    // Common - Error
    'common.error.pluginError': 'プラグイン「{0}」の処理内でエラーが発生しました。',
  },
  en: {
    // Desktop - Loading
    'desktop.loading.default': 'Loading',

    // Desktop - Calendar view types
    'desktop.calendar.viewType.month': 'Month',
    'desktop.calendar.viewType.week': 'Week',
    'desktop.calendar.viewType.fiveDay': '5 Days',
    'desktop.calendar.viewType.threeDay': '3 Days',
    'desktop.calendar.viewType.day': 'Day',
    'desktop.calendar.noTitle': '(No Title)',

    // Desktop - Sidebar
    'desktop.sidebar.filterSchedule': 'Filter schedules',
    'desktop.sidebar.category': 'Category',

    // Desktop - Fab
    'desktop.fab.addSchedule': 'Add schedule',

    // Desktop - Dialog
    'desktop.dialog.eventTitle': 'Event title',
    'desktop.dialog.description': 'Description',
    'desktop.dialog.startDate': 'Start date',
    'desktop.dialog.startDateTime': 'Start date/time',
    'desktop.dialog.endDate': 'End date',
    'desktop.dialog.endDateTime': 'End date/time',
    'desktop.dialog.category': 'Category',
    'desktop.dialog.allDay': 'All day',

    // Desktop - Toast messages
    'desktop.toast.eventCopied': 'Event copied',
    'desktop.toast.recordDeleted': 'Record deleted successfully',

    // Desktop - Error messages
    'desktop.error.recordSaveFailed': 'Failed to save record: {0}',
    'desktop.error.recordFetchFailed': 'Failed to fetch records',
    'desktop.error.recordUpdateFailed': 'Failed to update record: {0}',
    'desktop.error.recordDeleteFailed': 'Failed to delete record: {0}',
    'desktop.error.eventClickFailed': 'Failed to get clicked event',
    'desktop.error.cannotCopyNewEvent': 'Cannot copy a new event',
    'desktop.error.eventRecordNotFound':
      'Failed to get record information for the target event. Please refresh the list and try again.',
    'desktop.error.scheduleRecordNotFound':
      'No record exists for this schedule. Please refresh the list and try again.',
    'desktop.error.eventCopySuffix': ' (Copy)',

    // Config - Loading
    'config.loading.waitingForRender': 'Waiting for screen to render',
    'config.loading.fetchingSettings': 'Loading settings',

    // Config - Sidebar
    'config.sidebar.notSet': 'Not set',
    'config.sidebar.settingLabel': 'Setting {0}',

    // Config - Toast messages
    'config.toast.settingDeleted': 'Setting deleted',
    'config.toast.settingCopied': 'Setting copied',
    'config.toast.settingPasted': 'Setting pasted',
    'config.toast.settingInvalidFormat': 'Invalid setting format',
    'config.toast.conditionDeleted': 'Condition deleted',
    'config.toast.settingSaved': 'Settings saved',
    'config.toast.settingReset': 'Settings reset',
    'config.toast.settingImported': 'Settings imported',
    'config.toast.settingImportFailed':
      'Failed to import settings. Please check the file for errors.',
    'config.toast.settingExported': 'Plugin settings exported',
    'config.toast.settingExportFailed':
      'Failed to export plugin settings. Please contact the plugin developer.',
    'config.toast.viewCreated': 'View created',
    'config.toast.viewCreationFailed': 'Failed to create view',

    // Config - Error messages
    'config.error.appIdNotFound': 'Could not get app ID',
    'config.error.rootElementNotFound': 'Root element does not exist in plugin HTML.',
    'config.error.fieldInfoNotFound': 'Could not get app field information',
    'config.error.viewInfoNotFound': 'Could not get app view information',

    // Config - Form section titles
    'config.section.viewSettings.title': 'View settings for displaying calendar',
    'config.section.viewSettings.description': 'Select the view to display the calendar',
    'config.section.scheduleTitle.title': 'Schedule title',
    'config.section.scheduleTitle.description': 'Select the field to use as the schedule title',
    'config.section.scheduleTitle.description2':
      'Available field types: Single line text, Multi-line text, Rich text',
    'config.section.scheduleStart.title': 'Schedule start date/time',
    'config.section.scheduleStart.description':
      'Select the field to use as the schedule start date/time',
    'config.section.scheduleStart.description2':
      'If a "Date" field is set, it will be treated as an all-day event',
    'config.section.scheduleEnd.title': 'Schedule end date',
    'config.section.scheduleEnd.description': 'Select the field to use as the schedule end date',
    'config.section.scheduleEnd.description2':
      'If a "Date" field is set, it will be treated as an all-day event',
    'config.section.allDay.title': 'All day setting',
    'config.section.allDay.description': 'Enable all-day events without specifying time',
    'config.section.allDay.enableLabel': 'Enable all day setting',
    'config.section.note.title': 'Schedule notes',
    'config.section.note.description': 'Enable schedule notes that can be edited from the calendar',
    'config.section.note.description2':
      'Available field types: Single line text, Multi-line text, Rich text',
    'config.section.note.enableLabel': 'Enable schedule notes',
    'config.section.advanced': 'Advanced settings',
    'config.section.initialView.title': 'Initial calendar view type',
    'config.section.initialView.description': 'Select the initial calendar view type',
    'config.section.slotMinmax.title': 'Display time range settings',
    'config.section.slotMinmax.description':
      'Set the upper and lower limits of time slots displayed on the calendar.',
    'config.section.businessDays.title': 'Business days settings',
    'config.section.businessDays.description':
      'Set the days of the week to be treated as business days',
    'config.section.businessDays.description2': 'Unchecked days will be grayed out on the calendar',
    'config.section.firstDay.title': 'First day of week',
    'config.section.firstDay.description': 'Set the day to start the week',
    'config.section.firstDay.description2':
      'This day will be the leftmost day in week and month views',
    'config.section.category.title': 'Category settings',
    'config.section.category.description': 'Set the field to use as calendar category',
    'config.section.category.description2': 'Calendar events will be color-coded by category',
    'config.section.category.description3':
      'Available field types: Checkbox, Radio button, Dropdown',
    'config.section.colors.title': 'Schedule colors',
    'config.section.colors.description': 'Set colors for calendar schedules.',
    'config.section.colors.description2':
      'If no category is used, schedules will always use the first color',

    // Config - Form labels
    'config.form.viewName': 'View name',
    'config.form.calendarType': 'Calendar type',
    'config.form.slotStart': 'Start',
    'config.form.slotEnd': 'End',
    'config.form.hour': '',
    'config.form.firstDay': 'First day of week',
    'config.form.colorLabel': 'Color {0}',
    'config.form.addColor': 'Add color setting',
    'config.form.deleteColor': 'Delete this color setting',
    'config.form.allDayValue': 'All day value',
    'config.form.selectField': 'Select a field',
    'config.form.createNewView': 'Create new view',
    'config.form.calendarName': '📆 Calendar',

    // Config - Initial view options
    'config.initialView.dayGridMonth': 'Day grid, 1 month calendar',
    'config.initialView.timeGridWeek': 'Time grid, 1 week calendar',
    'config.initialView.timeGridFiveDay': 'Time grid, 5 days calendar',
    'config.initialView.timeGridThreeDay': 'Time grid, 3 days calendar',
    'config.initialView.timeGridDay': 'Time grid, 1 day calendar',

    // Config - Footer buttons
    'config.footer.save': 'Save settings',
    'config.footer.backToPluginList': 'Back to plugin list',
    'config.footer.backToPluginListShort': 'Back to plugin list',

    // Common - Weekdays
    'common.weekday.sunday': 'Sunday',
    'common.weekday.monday': 'Monday',
    'common.weekday.tuesday': 'Tuesday',
    'common.weekday.wednesday': 'Wednesday',
    'common.weekday.thursday': 'Thursday',
    'common.weekday.friday': 'Friday',
    'common.weekday.saturday': 'Saturday',

    // Common - Field select
    'common.field.codePrefix': 'Code: ',
    'common.field.targetField': 'Target field',
    'common.field.selectPlaceholder': 'Select a field',

    // Common - Error
    'common.error.pluginError': 'An error occurred in the plugin "{0}".',
  },
  es: {
    // Desktop - Loading
    'desktop.loading.default': 'Cargando',

    // Desktop - Calendar view types
    'desktop.calendar.viewType.month': 'Mes',
    'desktop.calendar.viewType.week': 'Semana',
    'desktop.calendar.viewType.fiveDay': '5 días',
    'desktop.calendar.viewType.threeDay': '3 días',
    'desktop.calendar.viewType.day': 'Día',
    'desktop.calendar.noTitle': '(Sin título)',

    // Desktop - Sidebar
    'desktop.sidebar.filterSchedule': 'Filtrar horarios',
    'desktop.sidebar.category': 'Categoría',

    // Desktop - Fab
    'desktop.fab.addSchedule': 'Agregar horario',

    // Desktop - Dialog
    'desktop.dialog.eventTitle': 'Título del evento',
    'desktop.dialog.description': 'Descripción',
    'desktop.dialog.startDate': 'Fecha de inicio',
    'desktop.dialog.startDateTime': 'Fecha/hora de inicio',
    'desktop.dialog.endDate': 'Fecha de fin',
    'desktop.dialog.endDateTime': 'Fecha/hora de fin',
    'desktop.dialog.category': 'Categoría',
    'desktop.dialog.allDay': 'Todo el día',

    // Desktop - Toast messages
    'desktop.toast.eventCopied': 'Evento copiado',
    'desktop.toast.recordDeleted': 'Registro eliminado exitosamente',

    // Desktop - Error messages
    'desktop.error.recordSaveFailed': 'Error al guardar registro: {0}',
    'desktop.error.recordFetchFailed': 'Error al obtener registros',
    'desktop.error.recordUpdateFailed': 'Error al actualizar registro: {0}',
    'desktop.error.recordDeleteFailed': 'Error al eliminar registro: {0}',
    'desktop.error.eventClickFailed': 'Error al obtener evento seleccionado',
    'desktop.error.cannotCopyNewEvent': 'No se puede copiar un evento nuevo',
    'desktop.error.eventRecordNotFound':
      'Error al obtener información del registro. Por favor actualice la lista e intente de nuevo.',
    'desktop.error.scheduleRecordNotFound':
      'No existe un registro para este horario. Por favor actualice la lista e intente de nuevo.',
    'desktop.error.eventCopySuffix': ' (Copia)',

    // Config - Loading
    'config.loading.waitingForRender': 'Esperando renderizado de pantalla',
    'config.loading.fetchingSettings': 'Cargando configuración',

    // Config - Sidebar
    'config.sidebar.notSet': 'No configurado',
    'config.sidebar.settingLabel': 'Configuración {0}',

    // Config - Toast messages
    'config.toast.settingDeleted': 'Configuración eliminada',
    'config.toast.settingCopied': 'Configuración copiada',
    'config.toast.settingPasted': 'Configuración pegada',
    'config.toast.settingInvalidFormat': 'Formato de configuración inválido',
    'config.toast.conditionDeleted': 'Condición eliminada',
    'config.toast.settingSaved': 'Configuración guardada',
    'config.toast.settingReset': 'Configuración restablecida',
    'config.toast.settingImported': 'Configuración importada',
    'config.toast.settingImportFailed':
      'Error al importar configuración. Por favor verifique el archivo.',
    'config.toast.settingExported': 'Configuración del plugin exportada',
    'config.toast.settingExportFailed':
      'Error al exportar configuración. Por favor contacte al desarrollador.',
    'config.toast.viewCreated': 'Vista creada',
    'config.toast.viewCreationFailed': 'Error al crear vista',

    // Config - Error messages
    'config.error.appIdNotFound': 'No se pudo obtener el ID de la aplicación',
    'config.error.rootElementNotFound': 'El elemento raíz no existe en el HTML del plugin.',
    'config.error.fieldInfoNotFound': 'No se pudo obtener información de campos',
    'config.error.viewInfoNotFound': 'No se pudo obtener información de vistas',

    // Config - Form section titles
    'config.section.viewSettings.title': 'Configuración de vista para mostrar calendario',
    'config.section.viewSettings.description': 'Seleccione la vista para mostrar el calendario',
    'config.section.scheduleTitle.title': 'Título del horario',
    'config.section.scheduleTitle.description':
      'Seleccione el campo a usar como título del horario',
    'config.section.scheduleTitle.description2':
      'Tipos de campo disponibles: Texto de una línea, Texto multilínea, Texto enriquecido',
    'config.section.scheduleStart.title': 'Fecha/hora de inicio del horario',
    'config.section.scheduleStart.description':
      'Seleccione el campo a usar como fecha/hora de inicio',
    'config.section.scheduleStart.description2':
      'Si se configura un campo "Fecha", se tratará como evento de todo el día',
    'config.section.scheduleEnd.title': 'Fecha de fin del horario',
    'config.section.scheduleEnd.description': 'Seleccione el campo a usar como fecha de fin',
    'config.section.scheduleEnd.description2':
      'Si se configura un campo "Fecha", se tratará como evento de todo el día',
    'config.section.allDay.title': 'Configuración de todo el día',
    'config.section.allDay.description': 'Habilitar eventos de todo el día sin especificar hora',
    'config.section.allDay.enableLabel': 'Habilitar configuración de todo el día',
    'config.section.note.title': 'Notas del horario',
    'config.section.note.description': 'Habilitar notas del horario editables desde el calendario',
    'config.section.note.description2':
      'Tipos de campo disponibles: Texto de una línea, Texto multilínea, Texto enriquecido',
    'config.section.note.enableLabel': 'Habilitar notas del horario',
    'config.section.advanced': 'Configuración avanzada',
    'config.section.initialView.title': 'Tipo de vista inicial del calendario',
    'config.section.initialView.description': 'Seleccione el tipo de vista inicial del calendario',
    'config.section.slotMinmax.title': 'Configuración de rango de tiempo',
    'config.section.slotMinmax.description':
      'Configure los límites de tiempo mostrados en el calendario.',
    'config.section.businessDays.title': 'Configuración de días laborables',
    'config.section.businessDays.description':
      'Configure los días de la semana como días laborables',
    'config.section.businessDays.description2': 'Los días no marcados se mostrarán en gris',
    'config.section.firstDay.title': 'Primer día de la semana',
    'config.section.firstDay.description': 'Configure el día para comenzar la semana',
    'config.section.firstDay.description2':
      'Este día será el más a la izquierda en las vistas de semana y mes',
    'config.section.category.title': 'Configuración de categoría',
    'config.section.category.description':
      'Configure el campo a usar como categoría del calendario',
    'config.section.category.description2': 'Los eventos se colorearán por categoría',
    'config.section.category.description3':
      'Tipos de campo disponibles: Casilla de verificación, Botón de radio, Menú desplegable',
    'config.section.colors.title': 'Colores del horario',
    'config.section.colors.description': 'Configure los colores para los horarios del calendario.',
    'config.section.colors.description2':
      'Si no se usa categoría, los horarios siempre usarán el primer color',

    // Config - Form labels
    'config.form.viewName': 'Nombre de vista',
    'config.form.calendarType': 'Tipo de calendario',
    'config.form.slotStart': 'Inicio',
    'config.form.slotEnd': 'Fin',
    'config.form.hour': '',
    'config.form.firstDay': 'Primer día de la semana',
    'config.form.colorLabel': 'Color {0}',
    'config.form.addColor': 'Agregar configuración de color',
    'config.form.deleteColor': 'Eliminar esta configuración de color',
    'config.form.allDayValue': 'Valor de todo el día',
    'config.form.selectField': 'Seleccione un campo',
    'config.form.createNewView': 'Crear nueva vista',
    'config.form.calendarName': '📆 Calendario',

    // Config - Initial view options
    'config.initialView.dayGridMonth': 'Cuadrícula de días, calendario de 1 mes',
    'config.initialView.timeGridWeek': 'Cuadrícula de tiempo, calendario de 1 semana',
    'config.initialView.timeGridFiveDay': 'Cuadrícula de tiempo, calendario de 5 días',
    'config.initialView.timeGridThreeDay': 'Cuadrícula de tiempo, calendario de 3 días',
    'config.initialView.timeGridDay': 'Cuadrícula de tiempo, calendario de 1 día',

    // Config - Footer buttons
    'config.footer.save': 'Guardar configuración',
    'config.footer.backToPluginList': 'Volver a lista de plugins',
    'config.footer.backToPluginListShort': 'Volver a lista de plugins',

    // Common - Weekdays
    'common.weekday.sunday': 'Domingo',
    'common.weekday.monday': 'Lunes',
    'common.weekday.tuesday': 'Martes',
    'common.weekday.wednesday': 'Miércoles',
    'common.weekday.thursday': 'Jueves',
    'common.weekday.friday': 'Viernes',
    'common.weekday.saturday': 'Sábado',

    // Common - Field select
    'common.field.codePrefix': 'Código: ',
    'common.field.targetField': 'Campo objetivo',
    'common.field.selectPlaceholder': 'Seleccione un campo',

    // Common - Error
    'common.error.pluginError': 'Ocurrió un error en el plugin "{0}".',
  },
  zh: {
    // Desktop - Loading
    'desktop.loading.default': '加载中',

    // Desktop - Calendar view types
    'desktop.calendar.viewType.month': '月',
    'desktop.calendar.viewType.week': '周',
    'desktop.calendar.viewType.fiveDay': '5天',
    'desktop.calendar.viewType.threeDay': '3天',
    'desktop.calendar.viewType.day': '日',
    'desktop.calendar.noTitle': '（无标题）',

    // Desktop - Sidebar
    'desktop.sidebar.filterSchedule': '筛选日程',
    'desktop.sidebar.category': '类别',

    // Desktop - Fab
    'desktop.fab.addSchedule': '添加日程',

    // Desktop - Dialog
    'desktop.dialog.eventTitle': '事件标题',
    'desktop.dialog.description': '描述',
    'desktop.dialog.startDate': '开始日期',
    'desktop.dialog.startDateTime': '开始日期/时间',
    'desktop.dialog.endDate': '结束日期',
    'desktop.dialog.endDateTime': '结束日期/时间',
    'desktop.dialog.category': '类别',
    'desktop.dialog.allDay': '全天',

    // Desktop - Toast messages
    'desktop.toast.eventCopied': '事件已复制',
    'desktop.toast.recordDeleted': '记录删除成功',

    // Desktop - Error messages
    'desktop.error.recordSaveFailed': '保存记录失败: {0}',
    'desktop.error.recordFetchFailed': '获取记录失败',
    'desktop.error.recordUpdateFailed': '更新记录失败: {0}',
    'desktop.error.recordDeleteFailed': '删除记录失败: {0}',
    'desktop.error.eventClickFailed': '获取点击事件失败',
    'desktop.error.cannotCopyNewEvent': '无法复制新事件',
    'desktop.error.eventRecordNotFound': '获取事件记录信息失败，请刷新列表后重试。',
    'desktop.error.scheduleRecordNotFound': '此日程无对应记录，请刷新列表后重试。',
    'desktop.error.eventCopySuffix': '（副本）',

    // Config - Loading
    'config.loading.waitingForRender': '等待屏幕渲染',
    'config.loading.fetchingSettings': '加载设置',

    // Config - Sidebar
    'config.sidebar.notSet': '未设置',
    'config.sidebar.settingLabel': '设置 {0}',

    // Config - Toast messages
    'config.toast.settingDeleted': '设置已删除',
    'config.toast.settingCopied': '设置已复制',
    'config.toast.settingPasted': '设置已粘贴',
    'config.toast.settingInvalidFormat': '设置格式无效',
    'config.toast.conditionDeleted': '条件已删除',
    'config.toast.settingSaved': '设置已保存',
    'config.toast.settingReset': '设置已重置',
    'config.toast.settingImported': '设置已导入',
    'config.toast.settingImportFailed': '导入设置失败，请检查文件是否有误。',
    'config.toast.settingExported': '插件设置已导出',
    'config.toast.settingExportFailed': '导出插件设置失败，请联系插件开发者。',
    'config.toast.viewCreated': '视图已创建',
    'config.toast.viewCreationFailed': '创建视图失败',

    // Config - Error messages
    'config.error.appIdNotFound': '无法获取应用ID',
    'config.error.rootElementNotFound': '插件HTML中不存在根元素。',
    'config.error.fieldInfoNotFound': '无法获取应用字段信息',
    'config.error.viewInfoNotFound': '无法获取应用视图信息',

    // Config - Form section titles
    'config.section.viewSettings.title': '日历显示视图设置',
    'config.section.viewSettings.description': '选择要显示日历的视图',
    'config.section.scheduleTitle.title': '日程标题',
    'config.section.scheduleTitle.description': '选择用作日程标题的字段',
    'config.section.scheduleTitle.description2': '可用字段类型：单行文本、多行文本、富文本',
    'config.section.scheduleStart.title': '日程开始日期/时间',
    'config.section.scheduleStart.description': '选择用作日程开始日期/时间的字段',
    'config.section.scheduleStart.description2': '如果设置"日期"字段，将被视为全天事件',
    'config.section.scheduleEnd.title': '日程结束日期',
    'config.section.scheduleEnd.description': '选择用作日程结束日期的字段',
    'config.section.scheduleEnd.description2': '如果设置"日期"字段，将被视为全天事件',
    'config.section.allDay.title': '全天设置',
    'config.section.allDay.description': '启用不指定时间的全天事件',
    'config.section.allDay.enableLabel': '启用全天设置',
    'config.section.note.title': '日程备注',
    'config.section.note.description': '启用可从日历编辑的日程备注',
    'config.section.note.description2': '可用字段类型：单行文本、多行文本、富文本',
    'config.section.note.enableLabel': '启用日程备注',
    'config.section.advanced': '高级设置',
    'config.section.initialView.title': '初始日历视图类型',
    'config.section.initialView.description': '选择初始日历视图类型',
    'config.section.slotMinmax.title': '显示时间范围设置',
    'config.section.slotMinmax.description': '设置日历上显示的时间段上下限。',
    'config.section.businessDays.title': '工作日设置',
    'config.section.businessDays.description': '设置一周中哪些天为工作日',
    'config.section.businessDays.description2': '未勾选的日期将在日历上显示为灰色',
    'config.section.firstDay.title': '每周第一天',
    'config.section.firstDay.description': '设置每周的起始日',
    'config.section.firstDay.description2': '此日期将在周视图和月视图中显示在最左侧',
    'config.section.category.title': '类别设置',
    'config.section.category.description': '设置用作日历类别的字段',
    'config.section.category.description2': '日历事件将按类别着色',
    'config.section.category.description3': '可用字段类型：复选框、单选按钮、下拉菜单',
    'config.section.colors.title': '日程颜色',
    'config.section.colors.description': '设置日历日程的颜色。',
    'config.section.colors.description2': '如果不使用类别，日程将始终使用第一个颜色',

    // Config - Form labels
    'config.form.viewName': '视图名称',
    'config.form.calendarType': '日历类型',
    'config.form.slotStart': '开始',
    'config.form.slotEnd': '结束',
    'config.form.hour': '时',
    'config.form.firstDay': '每周第一天',
    'config.form.colorLabel': '颜色 {0}',
    'config.form.addColor': '添加颜色设置',
    'config.form.deleteColor': '删除此颜色设置',
    'config.form.allDayValue': '全天值',
    'config.form.selectField': '选择字段',
    'config.form.createNewView': '创建新视图',
    'config.form.calendarName': '📆 日历',

    // Config - Initial view options
    'config.initialView.dayGridMonth': '日网格，1个月日历',
    'config.initialView.timeGridWeek': '时间网格，1周日历',
    'config.initialView.timeGridFiveDay': '时间网格，5天日历',
    'config.initialView.timeGridThreeDay': '时间网格，3天日历',
    'config.initialView.timeGridDay': '时间网格，1天日历',

    // Config - Footer buttons
    'config.footer.save': '保存设置',
    'config.footer.backToPluginList': '返回插件列表',
    'config.footer.backToPluginListShort': '返回插件列表',

    // Common - Weekdays
    'common.weekday.sunday': '星期日',
    'common.weekday.monday': '星期一',
    'common.weekday.tuesday': '星期二',
    'common.weekday.wednesday': '星期三',
    'common.weekday.thursday': '星期四',
    'common.weekday.friday': '星期五',
    'common.weekday.saturday': '星期六',

    // Common - Field select
    'common.field.codePrefix': '代码：',
    'common.field.targetField': '目标字段',
    'common.field.selectPlaceholder': '选择字段',

    // Common - Error
    'common.error.pluginError': '插件"{0}"发生错误。',
  },
  'zh-TW': {
    // Desktop - Loading
    'desktop.loading.default': '載入中',

    // Desktop - Calendar view types
    'desktop.calendar.viewType.month': '月',
    'desktop.calendar.viewType.week': '週',
    'desktop.calendar.viewType.fiveDay': '5天',
    'desktop.calendar.viewType.threeDay': '3天',
    'desktop.calendar.viewType.day': '日',
    'desktop.calendar.noTitle': '（無標題）',

    // Desktop - Sidebar
    'desktop.sidebar.filterSchedule': '篩選行程',
    'desktop.sidebar.category': '類別',

    // Desktop - Fab
    'desktop.fab.addSchedule': '新增行程',

    // Desktop - Dialog
    'desktop.dialog.eventTitle': '事件標題',
    'desktop.dialog.description': '描述',
    'desktop.dialog.startDate': '開始日期',
    'desktop.dialog.startDateTime': '開始日期/時間',
    'desktop.dialog.endDate': '結束日期',
    'desktop.dialog.endDateTime': '結束日期/時間',
    'desktop.dialog.category': '類別',
    'desktop.dialog.allDay': '整天',

    // Desktop - Toast messages
    'desktop.toast.eventCopied': '事件已複製',
    'desktop.toast.recordDeleted': '記錄刪除成功',

    // Desktop - Error messages
    'desktop.error.recordSaveFailed': '儲存記錄失敗：{0}',
    'desktop.error.recordFetchFailed': '取得記錄失敗',
    'desktop.error.recordUpdateFailed': '更新記錄失敗：{0}',
    'desktop.error.recordDeleteFailed': '刪除記錄失敗：{0}',
    'desktop.error.eventClickFailed': '取得點擊事件失敗',
    'desktop.error.cannotCopyNewEvent': '無法複製新事件',
    'desktop.error.eventRecordNotFound': '取得事件記錄資訊失敗，請重新整理列表後再試。',
    'desktop.error.scheduleRecordNotFound': '此行程無對應記錄，請重新整理列表後再試。',
    'desktop.error.eventCopySuffix': '（副本）',

    // Config - Loading
    'config.loading.waitingForRender': '等待畫面渲染',
    'config.loading.fetchingSettings': '載入設定',

    // Config - Sidebar
    'config.sidebar.notSet': '未設定',
    'config.sidebar.settingLabel': '設定 {0}',

    // Config - Toast messages
    'config.toast.settingDeleted': '設定已刪除',
    'config.toast.settingCopied': '設定已複製',
    'config.toast.settingPasted': '設定已貼上',
    'config.toast.settingInvalidFormat': '設定格式無效',
    'config.toast.conditionDeleted': '條件已刪除',
    'config.toast.settingSaved': '設定已儲存',
    'config.toast.settingReset': '設定已重設',
    'config.toast.settingImported': '設定已匯入',
    'config.toast.settingImportFailed': '匯入設定失敗，請檢查檔案是否有誤。',
    'config.toast.settingExported': '外掛設定已匯出',
    'config.toast.settingExportFailed': '匯出外掛設定失敗，請聯繫外掛開發者。',
    'config.toast.viewCreated': '檢視已建立',
    'config.toast.viewCreationFailed': '建立檢視失敗',

    // Config - Error messages
    'config.error.appIdNotFound': '無法取得應用程式ID',
    'config.error.rootElementNotFound': '外掛HTML中不存在根元素。',
    'config.error.fieldInfoNotFound': '無法取得應用程式欄位資訊',
    'config.error.viewInfoNotFound': '無法取得應用程式檢視資訊',

    // Config - Form section titles
    'config.section.viewSettings.title': '行事曆顯示檢視設定',
    'config.section.viewSettings.description': '選擇要顯示行事曆的檢視',
    'config.section.scheduleTitle.title': '行程標題',
    'config.section.scheduleTitle.description': '選擇用作行程標題的欄位',
    'config.section.scheduleTitle.description2': '可用欄位類型：單行文字、多行文字、富文字',
    'config.section.scheduleStart.title': '行程開始日期/時間',
    'config.section.scheduleStart.description': '選擇用作行程開始日期/時間的欄位',
    'config.section.scheduleStart.description2': '如果設定「日期」欄位，將被視為整天事件',
    'config.section.scheduleEnd.title': '行程結束日期',
    'config.section.scheduleEnd.description': '選擇用作行程結束日期的欄位',
    'config.section.scheduleEnd.description2': '如果設定「日期」欄位，將被視為整天事件',
    'config.section.allDay.title': '整天設定',
    'config.section.allDay.description': '啟用不指定時間的整天事件',
    'config.section.allDay.enableLabel': '啟用整天設定',
    'config.section.note.title': '行程備註',
    'config.section.note.description': '啟用可從行事曆編輯的行程備註',
    'config.section.note.description2': '可用欄位類型：單行文字、多行文字、富文字',
    'config.section.note.enableLabel': '啟用行程備註',
    'config.section.advanced': '進階設定',
    'config.section.initialView.title': '初始行事曆檢視類型',
    'config.section.initialView.description': '選擇初始行事曆檢視類型',
    'config.section.slotMinmax.title': '顯示時間範圍設定',
    'config.section.slotMinmax.description': '設定行事曆上顯示的時段上下限。',
    'config.section.businessDays.title': '工作日設定',
    'config.section.businessDays.description': '設定一週中哪些天為工作日',
    'config.section.businessDays.description2': '未勾選的日期將在行事曆上顯示為灰色',
    'config.section.firstDay.title': '每週第一天',
    'config.section.firstDay.description': '設定每週的起始日',
    'config.section.firstDay.description2': '此日期將在週檢視和月檢視中顯示在最左側',
    'config.section.category.title': '類別設定',
    'config.section.category.description': '設定用作行事曆類別的欄位',
    'config.section.category.description2': '行事曆事件將按類別著色',
    'config.section.category.description3': '可用欄位類型：核取方塊、選項按鈕、下拉式選單',
    'config.section.colors.title': '行程顏色',
    'config.section.colors.description': '設定行事曆行程的顏色。',
    'config.section.colors.description2': '如果不使用類別，行程將始終使用第一個顏色',

    // Config - Form labels
    'config.form.viewName': '檢視名稱',
    'config.form.calendarType': '行事曆類型',
    'config.form.slotStart': '開始',
    'config.form.slotEnd': '結束',
    'config.form.hour': '時',
    'config.form.firstDay': '每週第一天',
    'config.form.colorLabel': '顏色 {0}',
    'config.form.addColor': '新增顏色設定',
    'config.form.deleteColor': '刪除此顏色設定',
    'config.form.allDayValue': '整天值',
    'config.form.selectField': '選擇欄位',
    'config.form.createNewView': '建立新檢視',
    'config.form.calendarName': '📆 行事曆',

    // Config - Initial view options
    'config.initialView.dayGridMonth': '日網格，1個月行事曆',
    'config.initialView.timeGridWeek': '時間網格，1週行事曆',
    'config.initialView.timeGridFiveDay': '時間網格，5天行事曆',
    'config.initialView.timeGridThreeDay': '時間網格，3天行事曆',
    'config.initialView.timeGridDay': '時間網格，1天行事曆',

    // Config - Footer buttons
    'config.footer.save': '儲存設定',
    'config.footer.backToPluginList': '返回外掛列表',
    'config.footer.backToPluginListShort': '返回外掛列表',

    // Common - Weekdays
    'common.weekday.sunday': '星期日',
    'common.weekday.monday': '星期一',
    'common.weekday.tuesday': '星期二',
    'common.weekday.wednesday': '星期三',
    'common.weekday.thursday': '星期四',
    'common.weekday.friday': '星期五',
    'common.weekday.saturday': '星期六',

    // Common - Field select
    'common.field.codePrefix': '代碼：',
    'common.field.targetField': '目標欄位',
    'common.field.selectPlaceholder': '選擇欄位',

    // Common - Error
    'common.error.pluginError': '外掛「{0}」發生錯誤。',
  },
} as const);

export const t = useTranslations({
  ui,
  lang: LANGUAGE as keyof typeof ui,
  defaultLang: 'ja',
});
