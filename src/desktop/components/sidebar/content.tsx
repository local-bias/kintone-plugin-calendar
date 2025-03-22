import { Suspense } from 'react';
import Categories from './categories';
import SidebarSearchInput from './search-input';
import SidebarDatePicker from './date-picker';

export default function SidebarContent() {
  // const toggle = useSetAtom(toggleSidebarExpandedAtom);
  // const isMobile = useIsMobile();

  return (
    <div className='space-y-6'>
      {/* <Button
        variant='outline'
        size='sm'
        onClick={toggle}
        className={cn('', {
          'fixed z-10 top-4 left-4': isMobile,
        })}
      >
        <PanelLeft className='w-5 h-5' />
      </Button> */}
      <SidebarSearchInput />
      <SidebarDatePicker />
      <div>
        <Suspense fallback={null}>
          <Categories />
        </Suspense>
      </div>
    </div>
  );
}
