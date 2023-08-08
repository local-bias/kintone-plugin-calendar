import React from 'react';
import { restoreStorage } from '@/common/plugin';
import { VIEW_ROOT_ID } from '@/common/static';
import { createRoot } from 'react-dom/client';

import App from './components';

const events: launcher.Events = ['app.record.index.show'];

const action: launcher.Action = async (event, pluginId) => {
  const config = restoreStorage(pluginId);

  const root = document.getElementById(VIEW_ROOT_ID);
  if (!root) {
    return event;
  }

  const found = config.conditions.find((condition) => Number(condition.viewId) === event.viewId);
  if (!found) {
    return event;
  }

  createRoot(root).render(<App condition={found} />);

  return event;
};

export default { events, action };
