import React from 'react';
import './WorkRecordEditorField.css';

interface Props {
  value: string;
  suggestionListKey: string;
  isFocussed: boolean;
  setFieldValue: (fieldValue: string) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const WorkRecordEditorField: React.FC<Props> = (props: Props) => {
  const ref = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (props.isFocussed && ref.current) {
      ref.current.focus();
    }
  });

  const onChangeFieldValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    props.setFieldValue(inputValue);
  };

  return (
    <div>
      <input type="text" value={props.value} onChange={onChangeFieldValue} onKeyDown={props.onKeyDown} list={props.suggestionListKey} ref={ref} />
    </div>
  );
};

export default WorkRecordEditorField;
