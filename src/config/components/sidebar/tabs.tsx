import { Tab, Skeleton } from '@mui/material';
import React, { FC, Suspense } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { PluginConditionTabs } from '@konomi-app/kintone-utilities-react';
import { conditionsState, tabIndexState } from '../../states/plugin';
import { customViewsState } from '@/config/states/kintone';
import { PluginCondition } from '@/schema/plugin-config';

const TabLabel: FC<{ condition: PluginCondition }> = ({ condition }) => {
  const allViews = useRecoilValue(customViewsState);

  const view = Object.values(allViews).find((view) => view.id === condition.viewId);

  if (!view) {
    return null;
  }
  return <>({view.name})</>;
};

const Component: FC = () => {
  const tabIndex = useRecoilValue(tabIndexState);
  const conditions = useRecoilValue(conditionsState);

  const onTabChange = useRecoilCallback(
    ({ set }) =>
      (_: unknown, index: number) => {
        set(tabIndexState, index);
      },
    []
  );

  return (
    <PluginConditionTabs tabIndex={tabIndex} onChange={onTabChange}>
      {conditions.map((condition, i) => (
        <Tab
          label={
            <>
              設定{i + 1}
              <Suspense fallback={<Skeleton variant='text' />}>
                <TabLabel condition={condition} />
              </Suspense>
            </>
          }
          key={i}
        />
      ))}
    </PluginConditionTabs>
  );
};

export default Component;
