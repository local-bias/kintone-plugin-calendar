import { useIsMobile } from '@/desktop/hooks/use-mobile';
import { sidebarExpandedAtom } from '@/desktop/states/sidebar';
import { cn } from '@/lib/utils';
import { useAtomValue } from 'jotai';
import SidebarContent from './content';

export default function CalendarSidebar() {
  const isMobile = useIsMobile();
  const expanded = useAtomValue(sidebarExpandedAtom);

  return (
    <div
      className={cn('border-r w-8 bg-white', {
        hidden: isMobile,
        'w-64': expanded,
      })}
    >
      <div
        className={cn('p-4 sticky top-12 min-h-[calc(100svh-240px)]', {
          'top-0': isMobile,
        })}
      >
        <SidebarContent />
      </div>
    </div>
  );
}
