import React, { FC, Suspense, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';

import Categories from './categories';
import { Drawer, Fab, Tooltip } from '@mui/material';

const Component: FC = () => {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((prev) => !prev);

  return (
    <div>
      <div className='fixed left-8 bottom-4 z-10'>
        <Tooltip title='サイドバーを表示'>
          <Fab variant='circular' size='large' color='primary' onClick={toggle}>
            <MenuIcon />
          </Fab>
        </Tooltip>
      </div>
      <Drawer anchor='left' open={open} onClose={toggle}>
        <div className='p-8'>
          <Suspense fallback={null}>
            <Categories />
          </Suspense>
        </div>
      </Drawer>
    </div>
  );
};

const Container: FC = () => {
  return <Component />;
};

export default Container;
