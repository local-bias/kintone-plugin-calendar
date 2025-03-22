import { PLUGIN_NAME } from '@/lib/static';
import { PluginConfigExportButton } from '@konomi-app/kintone-utilities-react';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { enqueueSnackbar } from 'notistack';
import { FC, memo } from 'react';
import { loadingAtom, loadingCountAtom, pluginConfigAtom } from '../../states/plugin';

const handleExportPluginConfigAtom = atom(null, (get, set) => {
  try {
    set(loadingCountAtom, (c) => c + 1);
    const storage = get(pluginConfigAtom);
    const blob = new Blob([JSON.stringify(storage, null)], {
      type: 'application/json',
    });
    const url = (window.URL || window.webkitURL).createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${PLUGIN_NAME}-config.json`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    enqueueSnackbar('プラグインの設定情報をエクスポートしました', { variant: 'success' });
  } catch (error) {
    enqueueSnackbar(
      'プラグインの設定情報のエクスポートに失敗しました。プラグイン開発者にお問い合わせください。',
      { variant: 'error' }
    );
    throw error;
  } finally {
    set(loadingCountAtom, (c) => c - 1);
  }
});

const Component: FC = () => {
  const loading = useAtomValue(loadingAtom);
  const onClick = useSetAtom(handleExportPluginConfigAtom);
  return <PluginConfigExportButton loading={loading} onExportButtonClick={onClick} />;
};

export default memo(Component);
