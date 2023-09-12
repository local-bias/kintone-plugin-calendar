import Launcher from '@/common/launcher';
import './styles.css';

import event from './event';

((PLUGIN_ID) => new Launcher(PLUGIN_ID).launch([event]))(kintone.$PLUGIN_ID);
