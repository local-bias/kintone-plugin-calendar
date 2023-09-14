import '@/common/global';
import Launcher from '@/common/launcher';
import event from './event';
import './styles.css';

((PLUGIN_ID) => new Launcher(PLUGIN_ID).launch([event]))(kintone.$PLUGIN_ID);
