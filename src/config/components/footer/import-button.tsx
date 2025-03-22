import { migrateConfig } from '@/lib/plugin';
import { onFileLoad } from '@konomi-app/kintone-utilities';
import { PluginConfigImportButton } from '@konomi-app/kintone-utilities-react';
import { atom, useSetAtom } from 'jotai';
import { enqueueSnackbar } from 'notistack';
import React, { FC, memo } from 'react';
import { pluginConfigAtom } from '../../states/plugin';

const handleImportPluginConfigAtom = atom(
  null,
  async (_, set, event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const { files } = event.target;
      if (!files?.length) {
        return;
      }
      const [file] = Array.from(files);
      const fileEvent = await onFileLoad(file);
      const text = (fileEvent.target?.result ?? '') as string;
      set(pluginConfigAtom, migrateConfig(JSON.parse(text)));
      enqueueSnackbar('設定情報をインポートしました', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(
        '設定情報のインポートに失敗しました、ファイルに誤りがないか確認してください',
        { variant: 'error' }
      );
      throw error;
    }
  }
);

const Component: FC = () => {
  const onChange = useSetAtom(handleImportPluginConfigAtom);
  return <PluginConfigImportButton onImportButtonClick={onChange} loading={false} />;
};

export default memo(Component);
