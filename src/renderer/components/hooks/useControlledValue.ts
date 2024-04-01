import { useState, useCallback } from "react";

interface UseControlledValueProps<T> {
  controlledValue: T | undefined;
  defaultValue: T;
  onChange?: (value: T) => void;
}

function useControlledValue<T>({
  controlledValue,
  defaultValue,
  onChange,
}: UseControlledValueProps<T>): [
  T,
  (newValue: T | ((prevValue: T) => T)) => void
] {
  const [value, setValue] = useState<T>(defaultValue);

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : value;

  const handleChange = useCallback(
    (newValue: T | ((prevValue: T) => T)) => {
      if (!isControlled) {
        setValue(newValue instanceof Function ? newValue(value) : newValue);
      }
      onChange?.(
        newValue instanceof Function ? newValue(currentValue) : newValue
      );
    },
    [isControlled, onChange, value, currentValue]
  );

  return [currentValue, handleChange];
}

export default useControlledValue;
