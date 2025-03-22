import { Fab } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useSetAtom } from 'jotai';
import { toggleSidebarExpandedAtom } from '@/desktop/states/sidebar';

export default function Fabs() {
  const toggle = useSetAtom(toggleSidebarExpandedAtom);
  return (
    <div className='!fixed right-4 md:right-8 bottom-20 z-10'>
      <Fab variant='circular' size='large' color='primary' onClick={toggle}>
        <MenuIcon />
      </Fab>
    </div>
  );
}
