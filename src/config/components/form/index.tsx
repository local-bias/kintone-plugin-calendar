import React, { FC } from 'react';
import DeleteButton from './condition-delete-button';
import {
  PluginFormDescription,
  PluginFormSection,
  PluginFormTitle,
  RecoilSwitch,
} from '@konomi-app/kintone-utilities-react';
import { enablesAllDayState, enablesNoteState } from '@/config/states/plugin';
import FormScheduleTitle from './form-schedule-title';
import FormScheduleStart from './form-schedule-start';
import FormScheduleEnd from './form-schedule-end';
import FormAllday from './form-allday';
import FormNote from './form-note';
import FormSlotMinmax from './form-slot-minmax';
import FormCategory from './form-category';
import FormView from './form-view';
import FormInitialView from './form-initial-view';

const Component: FC = () => (
  <div className='p-4'>
    <PluginFormSection>
      <PluginFormTitle>テーブルを表示する一覧の設定</PluginFormTitle>
      <PluginFormDescription last>カレンダーを表示する一覧を選択してください</PluginFormDescription>
      <FormView />
    </PluginFormSection>
    <PluginFormSection>
      <PluginFormTitle>スケジュールのタイトル</PluginFormTitle>
      <PluginFormDescription>
        スケジュールのタイトルとして使用するフィールドを選択してください
      </PluginFormDescription>
      <PluginFormDescription last>
        使用できるフィールドタイプは、文字列１行フィールド、文字列複数行フィールド、リッチテキストです
      </PluginFormDescription>
      <FormScheduleTitle />
    </PluginFormSection>
    <PluginFormSection>
      <PluginFormTitle>スケジュールの開始日時</PluginFormTitle>
      <PluginFormDescription>
        スケジュールの開始日時として使用するフィールドを選択してください
      </PluginFormDescription>
      <PluginFormDescription last>
        「日付」フィールドを設定した場合は、無条件で終日扱いとなります
      </PluginFormDescription>
      <FormScheduleStart />
    </PluginFormSection>
    <PluginFormSection>
      <PluginFormTitle>スケジュールの終了日付</PluginFormTitle>
      <PluginFormDescription>
        スケジュールの終了日付として使用するフィールドを選択してください
      </PluginFormDescription>
      <PluginFormDescription last>
        「日付」フィールドを設定した場合は、無条件で終日扱いとなります
      </PluginFormDescription>
      <FormScheduleEnd />
    </PluginFormSection>
    <PluginFormSection>
      <PluginFormTitle>終日設定</PluginFormTitle>
      <PluginFormDescription last>時刻を指定せず、終日の予定を有効にします</PluginFormDescription>
      <RecoilSwitch state={enablesAllDayState} label='終日設定を有効にする' />
      <FormAllday />
    </PluginFormSection>
    <PluginFormSection>
      <PluginFormTitle>スケジュールの備考</PluginFormTitle>
      <PluginFormDescription>
        カレンダーから編集することのできるスケジュールの備忘を有効にします
      </PluginFormDescription>
      <PluginFormDescription last>
        使用できるフィールドタイプは、文字列１行フィールド、文字列複数行フィールド、リッチテキストです
      </PluginFormDescription>
      <RecoilSwitch state={enablesNoteState} label='スケジュールの備考を有効にする' />
      <FormNote />
    </PluginFormSection>
    <details className='mt-8'>
      <summary className='font-bold text-lg mb-4 cursor-pointer'>高度な設定</summary>
      <PluginFormSection>
        <PluginFormTitle>初期表示するカレンダーの種類</PluginFormTitle>
        <PluginFormDescription last>
          初期表示するカレンダーの種類を選択してください
        </PluginFormDescription>
        <FormInitialView />
      </PluginFormSection>
      <PluginFormSection>
        <PluginFormTitle>表示時間帯の設定</PluginFormTitle>
        <PluginFormDescription last>
          カレンダーに表示する時間帯の上限と下限を設定します。
        </PluginFormDescription>
        <FormSlotMinmax />
      </PluginFormSection>
      <PluginFormSection>
        <PluginFormTitle>カテゴリー設定</PluginFormTitle>
        <PluginFormDescription>
          カレンダーのカテゴリーとして使用するフィールドを設定します
        </PluginFormDescription>
        <PluginFormDescription>カレンダーはカテゴリーに応じて色分けされます</PluginFormDescription>
        <PluginFormDescription last>
          使用できるフィールドタイプは、チェックボックス、ラジオボタン、ドロップダウンです
        </PluginFormDescription>
        <FormCategory />
      </PluginFormSection>
    </details>
    <DeleteButton />
  </div>
);

export default Component;
