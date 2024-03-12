import { Alert, AlertTitle, SelectChangeEvent } from '@mui/material';
import { Parameter, Value } from '@scrrap/core';
import { ChangeEvent, SyntheticEvent, useCallback } from 'react';

import formatDate from 'date-fns/format';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

import { debounce } from 'lodash';
import CheckboxSelect from './CheckboxSelect';
import DateInput from './DateInput';
import Explanation from './Explanation';
import NumberInput from './NumberInput';
import RadioSelect from './RadioSelect';
import Select from './Select';
import Slider from './Slider';
import TextField from './TextField';

const fixDateType = (value: string) => {
  if (String(value) === value) {
    if (Date.parse(value) > 0) {
      return new Date(value);
    }
  }
  return value;
};

const checkDate = (value: any) => {
  if (value) {
    if (value instanceof Date) return formatDate(value, 'yyyy-MM-dd');
    if (!isNaN(value))
      return formatDate(
        new Date(Math.round((value - 25569) * 86400 * 1000)),
        'yyyy-MM-dd',
      );
  }
  return null;
};

const checkPossibleValues = (parameter: Parameter) => {
  if (
    !parameter.possibleValues ||
    typeof parameter.possibleValues === 'undefined' ||
    parameter.possibleValues.length === 0
  ) {
    throw new Error('Possible values vide');
  }
  if (!Array.isArray(parameter.possibleValues)) {
    throw new Error("Possible values n'est pas une liste de valeur");
  }
  const dedupedPossibleValues = Array.from(new Set(parameter.possibleValues));
  if (parameter.possibleValues.length !== dedupedPossibleValues.length) {
    throw new Error(
      `Duplicates in possible values : ${parameter.possibleValues.join(', ')}`,
    );
  }
  return null;
};

interface ParameterFactoryProps {
  autofocus: boolean;
  parameter: Parameter;
  onUpdateParameter: (index: number, value: Value) => void;
  debounced?: boolean;
}

const ParameterFactory = ({
  autofocus,
  parameter,
  onUpdateParameter,
  debounced = false,
}: ParameterFactoryProps) => {
  const focusUsernameInputField = (input: HTMLInputElement) => {
    if (input && autofocus) {
      setTimeout(() => {
        input.focus();
      }, 100);
    }
  };

  const handleRadioSelectChanged = (
    event: ChangeEvent<HTMLInputElement>,
    value: string,
  ) => {
    onUpdateParameter(parameter.index, value);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedHandleNumberChanged = useCallback(
    debounce(
      (event: SyntheticEvent, value: number | undefined) => {
        handleNumberChanged(event, value);
      },
      500,
      { trailing: true, maxWait: 3000 },
    ),
    [],
  );
  const handleNumberChanged = (
    event: SyntheticEvent,
    value: number | undefined,
  ) => {
    if (value) {
      if (parameter.min && value < parameter.min) {
        value = parameter.min;
      }
      if (parameter.max && value > parameter.max) {
        value = parameter.max;
      }
    }
    onUpdateParameter(parameter.index, value);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedHandleTextChanged = useCallback(
    debounce(
      (event: ChangeEvent<HTMLInputElement>) => {
        handleTextChanged(event);
      },
      500,
      { trailing: true, maxWait: 3000 },
    ),
    [],
  );
  const handleTextChanged = (event: ChangeEvent<HTMLInputElement>) => {
    const fixedValue =
      parameter.type === 'date'
        ? fixDateType(event.target.value)
        : event.target.value;
    onUpdateParameter(parameter.index, fixedValue);
  };

  const handleSelectChanged = (event: SelectChangeEvent<unknown>) => {
    onUpdateParameter(parameter.index, event.target.value as string);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedHandleSliderChanged = useCallback(
    debounce(
      (event: Event, value: number | number[], activeThumb: number) => {
        handleSliderChanged(event, value, activeThumb);
      },
      500,
      { trailing: true, maxWait: 3000 },
    ),
    [],
  );
  const handleSliderChanged = (
    event: Event,
    value: number | number[],
    activeThumb: number,
  ) => {
    if (Array.isArray(value)) {
      return;
    }
    onUpdateParameter(parameter.index, value);
  };

  const handleCheckboxGroupChanged = (
    event: ChangeEvent<HTMLInputElement>,
    values: string[],
  ) => {
    onUpdateParameter(parameter.index, values);
  };

  switch (parameter.type?.trim()) {
    case 'radio': {
      checkPossibleValues(parameter);
      return (
        <RadioSelect
          possibleValues={parameter.possibleValues || []}
          onChange={handleRadioSelectChanged}
          defaultValue={parameter.value || parameter.initialValue}
        />
      );
    }
    case 'number': {
      let defaultValue = null;
      if (typeof parameter.initialValue === 'number') {
        defaultValue = parameter.initialValue;
      }
      if (
        typeof parameter.value === 'number' ||
        (typeof parameter.value === 'string' && parameter.value.length > 0)
      ) {
        defaultValue = parameter.value;
      }
      return (
        <NumberInput
          onChange={
            debounced ? debouncedHandleNumberChanged : handleNumberChanged
          }
          unit={parameter.unit}
          defaultValue={defaultValue}
          inputProps={{
            min: parameter.min,
            max: parameter.max,
            step: parameter.step,
          }}
        />
      );
    }
    case 'list': {
      checkPossibleValues(parameter);
      return (
        <Select
          possibleValues={parameter.possibleValues || []}
          onChange={handleSelectChanged}
          defaultValue={parameter.value || parameter.initialValue}
        />
      );
    }
    case 'date': {
      return (
        <DateInput
          defaultValue={
            checkDate(parameter.value) || checkDate(parameter.initialValue)
          }
          onChange={debounced ? debouncedHandleTextChanged : handleTextChanged}
        />
      );
    }
    case 'text': {
      return (
        <TextField
          inputRef={focusUsernameInputField}
          defaultValue={parameter.value || parameter.initialValue}
          onChange={debounced ? debouncedHandleTextChanged : handleTextChanged}
        />
      );
    }
    case 'explanation': {
      return <Explanation value={(parameter.value as string) || ''} />;
    }
    case 'cursor': {
      let defaultValue = 0;
      if (parameter.min) {
        defaultValue = parameter.min;
      }
      if (parameter.initialValue) {
        defaultValue = parseInt(parameter.initialValue.toString());
      }
      if (parameter.value) {
        defaultValue = parseInt(parameter.value.toString());
      }

      return (
        <Slider
          min={parameter.min}
          max={parameter.max}
          step={parameter.step}
          onChange={
            debounced ? debouncedHandleSliderChanged : handleSliderChanged
          }
          defaultValue={defaultValue}
          unit={parameter.unit}
        />
      );
    }
    case 'checkbox': {
      checkPossibleValues(parameter);
      let defaultValue: string[] = [];
      if (parameter.initialValue) {
        if (Array.isArray(parameter.initialValue)) {
          defaultValue = parameter.initialValue.map((v: string) => v.trim());
        } else {
          defaultValue = [parameter.initialValue.toString()];
        }
      }

      if (parameter.value) {
        if (Array.isArray(parameter.value)) {
          defaultValue = parameter.value.map((v: string) => v.trim());
        } else {
          defaultValue = [parameter.value.toString()];
        }
      }

      let possibleValues: string[] = [];
      if (parameter.possibleValues) {
        possibleValues = parameter.possibleValues.map((v: string) => v.trim());
      }

      return (
        <CheckboxSelect
          possibleValues={possibleValues}
          onChange={handleCheckboxGroupChanged}
          defaultValue={defaultValue}
        />
      );
    }
  }

  return <div>{parameter.type}</div>;
};

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <Alert severity="error">
      <AlertTitle>Problème de paramétrage</AlertTitle>
      {error.message}
    </Alert>
  );
};

const SafeParameterFactory = (props: ParameterFactoryProps) => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <ParameterFactory {...props} />
  </ErrorBoundary>
);

export default SafeParameterFactory;
