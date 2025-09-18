import { Form, Select, Input, Switch, InputNumber } from 'antd';
import { useEffect } from 'react';

import useLanguage from '@/locale/useLanguage';

import { currencyOptions, getCurrencySymbol } from '@/utils/currencyList';

export default function SettingsForm({ form, onValuesChange }) {
  const translate = useLanguage();

  const handleCurrencyChange = (currencyCode) => {
    // Automatically update the currency symbol when currency changes
    const symbol = getCurrencySymbol(currencyCode);
    if (form && form.setFieldsValue) {
      form.setFieldsValue({
        currency_symbol: symbol,
      });
    }
  };

  // Sync currency symbol when currency code changes
  useEffect(() => {
    if (form) {
      const currencyCode = form.getFieldValue('default_currency_code');
      if (currencyCode) {
        const symbol = getCurrencySymbol(currencyCode);
        const currentSymbol = form.getFieldValue('currency_symbol');
        if (currentSymbol !== symbol) {
          form.setFieldsValue({
            currency_symbol: symbol,
          });
        }
      }
    }
  }, [form]);

  // Additional effect to handle form field changes
  useEffect(() => {
    if (form) {
      const subscription = form.getFieldsValue();
      const currencyCode = subscription.default_currency_code;
      if (currencyCode) {
        const symbol = getCurrencySymbol(currencyCode);
        const currentSymbol = subscription.currency_symbol;
        if (currentSymbol !== symbol) {
          // Use setTimeout to avoid infinite loops
          setTimeout(() => {
            form.setFieldsValue({
              currency_symbol: symbol,
            });
          }, 0);
        }
      }
    }
  }, [form]);

  // Handle form values change to keep currency symbol in sync
  const handleValuesChange = (changedValues, allValues) => {
    if (changedValues.default_currency_code) {
      const symbol = getCurrencySymbol(changedValues.default_currency_code);
      form.setFieldsValue({
        currency_symbol: symbol,
      });
    }
    // Call parent's onValuesChange if provided
    if (onValuesChange) {
      onValuesChange(changedValues, allValues);
    }
  };

  return (
    <div>
      <Form.Item
        label={translate('Currency')}
        name="default_currency_code"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? '').toLowerCase().startsWith((optionB?.label ?? '').toLowerCase())
          }
          options={currencyOptions()}
          onChange={handleCurrencyChange}
        ></Select>
      </Form.Item>
      <Form.Item
        label={translate('Currency Symbol')}
        name="currency_symbol"
        rules={[
          {
            required: true,
            message: translate('Please enter a currency symbol'),
          },
          {
            max: 3,
            message: translate('Currency symbol should not exceed 3 characters'),
          },
        ]}
      >
        <Input maxLength={3} />
      </Form.Item>

      <Form.Item
        label={translate('Currency Position')}
        name="currency_position"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select>
          <Select.Option value="before">{translate('before')}</Select.Option>
          <Select.Option value="after">{translate('after')}</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
        label={translate('Decimal Separator')}
        name="decimal_sep"
        rules={[
          {
            required: true,
            message: translate('Please enter a decimal separator'),
          },
          {
            max: 1,
            message: translate('Decimal separator should be a single character'),
          },
        ]}
      >
        <Input autoComplete="off" maxLength={1} />
      </Form.Item>
      <Form.Item
        label={translate('Thousand Separator')}
        name="thousand_sep"
        rules={[
          {
            required: true,
            message: translate('Please enter a thousand separator'),
          },
          {
            max: 1,
            message: translate('Thousand separator should be a single character'),
          },
        ]}
      >
        <Input autoComplete="off" maxLength={1} />
      </Form.Item>
      <Form.Item
        label={translate('Cent precision')}
        name="cent_precision"
        rules={[
          {
            required: true,
            message: translate('Please enter cent precision'),
          },
          {
            type: 'number',
            min: 0,
            max: 4,
            message: translate('Cent precision must be between 0 and 4'),
          },
        ]}
      >
        <InputNumber min={0} max={4} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        label={translate('Zero Format')}
        name="zero_format"
        rules={[
          {
            required: true,
          },
        ]}
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>
    </div>
  );
}
