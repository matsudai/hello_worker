import React from 'react';
import './FileHeaderMapper.css';

interface Props {
  header: string[];
}

const FileHeaderMapper: React.FC<Props> = ({ header }: Props) => {
  return (
    <div className="FilePreview">
      {header}
    </div>
  );
};

export default FileHeaderMapper;
