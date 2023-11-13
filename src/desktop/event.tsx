import React from 'react';
import { restorePluginConfig } from '@/lib/plugin';
import { VIEW_ROOT_ID } from '@/lib/static';
import { createRoot } from 'react-dom/client';

import App from './components';
import { listener } from '@/lib/listener';

listener.add(['app.record.index.show'], (event) => {
  const config = restorePluginConfig();

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
