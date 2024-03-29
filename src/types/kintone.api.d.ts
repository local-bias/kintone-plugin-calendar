import {
  App as DefaultApp,
  Record as DefaultRecord,
  Layout as DefaultLayout,
} from '@kintone/rest-api-client/lib/src/client/types';
import {
  OneOf as DefaultFieldProperty,
  CheckBox as DefaultCheckBox,
  Dropdown as DefaultDropdown,
  RadioButton as DefaultRadioButton,
} from '@kintone/rest-api-client/lib/src/KintoneFields/types/property';
import {
  OneOf as DefaultField,
  Creator as DefaultCreator,
  UserSelect as DefaultUserSelect,
} from '@kintone/rest-api-client/lib/src/KintoneFields/types/field';
import {
  OneOf as DefaultLayoutField,
  Label as DefaultLayoutLabel,
} from '@kintone/rest-api-client/lib/src/KintoneFields/types/fieldLayout';

declare namespace kx {
  type App = DefaultApp;
  type Field = DefaultField;
  type FieldProperty = DefaultFieldProperty;
  type FieldPropertyType = FieldProperty['type'];

  type FieldProperties = Record<string, FieldProperty>;
  type FieldEntry = [string, FieldProperty];

  type RecordData = DefaultRecord;

  type Layout = DefaultLayout;
  type LayoutField = DefaultLayoutField;

  namespace property {
    type CheckBox = DefaultCheckBox;
    type Dropdown = DefaultDropdown;
    type RadioButton = DefaultRadioButton;
  }

  namespace field {
    type Creator = DefaultCreator;
    type UserSelect = DefaultUserSelect;
    type UserEntity = Creator['value'];
  }

  namespace layout {
    type Label = DefaultLayoutLabel;
  }

  namespace response {
    type App = { readonly app?: DefaultApp; readonly fields?: FieldProperties };
  }
}
