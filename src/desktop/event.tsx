import React from 'react';
import { restoreStorage } from '@/common/plugin';
import { VIEW_ROOT_ID } from '@/common/static';
import { createRoot } from 'react-dom/client';

import App from './components';
import { listener } from '@/common/listener';
import { PLUGIN_ID } from '@/common/global';

listener.add(['app.record.index.show'], (event) => {
  const config = restoreStorage(PLUGIN_ID);

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
});
