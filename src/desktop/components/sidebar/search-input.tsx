import { handleSearchInputChangeAtom, searchInputAtom } from '@/desktop/states/calendar';
import { TextField } from '@mui/material';
import { useAtomValue, useSetAtom } from 'jotai';

export default function SidebarSearchInput() {
  const text = useAtomValue(searchInputAtom);
  const onChange = useSetAtom(handleSearchInputChangeAtom);

  return (
    <TextField
      variant='outlined'
      fullWidth
      label='予定を絞り込む'
      size='small'
      value={text}
      onChange={onChange}
    />
  );
}
