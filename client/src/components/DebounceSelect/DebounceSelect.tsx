'use client'

import React, {useMemo, useRef, useState} from 'react';
import {Select, Spin} from 'antd';
import type {SelectProps} from 'antd';
import { debounce } from 'lodash';

export interface SelectValue {
  label: string;
  value: number;
}

export interface DebounceSelectProps<ValueType = any> extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
  fetchOptions: (search: string) => Promise<ValueType[]>;
  debounceTimeout?: number;
}

function DebounceSelect<ValueType extends {
  key?: string;
  label: React.ReactNode;
  value: string | number
} = any, >({fetchOptions, debounceTimeout = 500, ...props}: DebounceSelectProps<ValueType>) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<ValueType[]>([]);
  const fetchRef = useRef(0);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);

      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }

        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  return (
    <Select
      showSearch
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      {...props}
      options={options}
    />
  );
}

export default DebounceSelect;