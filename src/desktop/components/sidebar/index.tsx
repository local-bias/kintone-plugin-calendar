import React, { FC, Suspense, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';

import Categories from './categories';
import { Drawer, Fab, Tooltip } from '@mui/material';

const Component: FC = () => {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((prev) => !prev);

  return (
    <div>
      <div className='fixed right-4 md:right-8 bottom-20 z-10'>
        <Fab variant='circular' size='large' color='primary' onClick={toggle}>
          <MenuIcon />
        </Fab>
      </div>
      <Drawer anchor='left' open={open} onClose={toggle} className='🐸'>
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
