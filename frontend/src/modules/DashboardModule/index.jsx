import { useEffect, useState, useMemo, useCallback } from 'react';

import { Tag, Row, Col } from 'antd';
import useLanguage from '@/locale/useLanguage';

import { useMoney } from '@/settings';

import { request } from '@/request';
import useFetch from '@/hooks/useFetch';
import useOnFetch from '@/hooks/useOnFetch';

import RecentTable from './components/RecentTable';

import SummaryCard from './components/SummaryCard';
import PreviewCard from './components/PreviewCard';
import CustomerPreviewCard from './components/CustomerPreviewCard';

import { selectMoneyFormat } from '@/redux/settings/selectors';
import { useSelector } from 'react-redux';

export default function DashboardModule() {
  const translate = useLanguage();
  const { moneyFormatter } = useMoney();
  const money_format_settings = useSelector(selectMoneyFormat);

  // Memoize the stats data function to prevent unnecessary re-creation
  const getStatsData = useCallback(async ({ entity, currency }) => {
    return await request.summary({
      entity,
      options: { currency },
    });
  }, []);

  // Memoize client fetch function
  const fetchClientData = useCallback(() => {
    return request.summary({ entity: 'client' });
  }, []);

  const {
    result: invoiceResult,
    isLoading: invoiceLoading,
    onFetch: fetchInvoicesStats,
  } = useOnFetch();

  const { result: quoteResult, isLoading: quoteLoading, onFetch: fetchQuotesStats } = useOnFetch();

  const {
    result: paymentResult,
    isLoading: paymentLoading,
    onFetch: fetchPayemntsStats,
  } = useOnFetch();

  const { result: clientResult, isLoading: clientLoading } = useFetch(fetchClientData);

  useEffect(() => {
    const currency = money_format_settings?.default_currency_code || 'USD';
    
    // Fetch all stats data in parallel for better performance
    const fetchAllStats = async () => {
      try {
        // Execute all API calls in parallel
        await Promise.all([
          fetchInvoicesStats(getStatsData({ entity: 'invoice', currency })),
          fetchQuotesStats(getStatsData({ entity: 'quote', currency })),
          fetchPayemntsStats(getStatsData({ entity: 'payment', currency }))
        ]);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchAllStats();
  }, [money_format_settings?.default_currency_code, getStatsData, fetchInvoicesStats, fetchQuotesStats, fetchPayemntsStats]);

  // Memoize dataTableColumns to prevent unnecessary re-creation
  const dataTableColumns = useMemo(() => [
    {
      title: translate('number'),
      dataIndex: 'number',
    },
    {
      title: translate('Client'),
      dataIndex: ['client', 'name'],
    },
    {
      title: translate('Total'),
      dataIndex: 'total',
      onCell: () => ({
        style: {
          textAlign: 'right',
          whiteSpace: 'nowrap',
          direction: 'ltr',
        },
      }),
      render: (total, record) => moneyFormatter({ amount: total, currency_code: record.currency }),
    },
    {
      title: translate('Status'),
      dataIndex: 'status',
    },
  ], [translate, moneyFormatter]);

  // Memoize entityData to prevent unnecessary re-creation
  const entityData = useMemo(() => [
    {
      result: invoiceResult,
      isLoading: invoiceLoading,
      entity: 'invoice',
      title: translate('Invoices'),
    },
    {
      result: quoteResult,
      isLoading: quoteLoading,
      entity: 'quote',
      title: translate('quote'),
    },
  ], [invoiceResult, invoiceLoading, quoteResult, quoteLoading, translate]);

  // Memoize statisticCards to prevent unnecessary re-renders
  const statisticCards = useMemo(() => {
    return entityData.map((data, index) => {
      const { result, entity, isLoading, title } = data;

      return (
        <PreviewCard
          key={`${entity}-${index}`} // More stable key
          title={title}
          isLoading={isLoading}
          entity={entity}
          statistics={
            !isLoading &&
            result?.performance?.map((item) => ({
              tag: item?.status,
              color: 'blue',
              value: item?.percentage,
            }))
          }
        />
      );
    });
  }, [entityData]);

  // Always render dashboard - no need to wait for money_format_settings
  return (
    <>
      <Row gutter={[32, 32]}>
        <SummaryCard
          title={translate('Invoices')}
          prefix={translate('This month')}
          isLoading={invoiceLoading}
          data={invoiceResult?.total}
        />
        <SummaryCard
          title={translate('Quote')}
          prefix={translate('This month')}
          isLoading={quoteLoading}
          data={quoteResult?.total}
        />
        <SummaryCard
          title={translate('paid')}
          prefix={translate('This month')}
          isLoading={paymentLoading}
          data={paymentResult?.total}
        />
        <SummaryCard
          title={translate('Unpaid')}
          prefix={translate('Not Paid')}
          isLoading={invoiceLoading}
          data={invoiceResult?.total_undue}
        />
      </Row>
      <div className="space30"></div>
      <Row gutter={[32, 32]}>
        <Col className="gutter-row w-full" sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 18 }}>
          <div className="whiteBox shadow" style={{ height: 458 }}>
            <Row className="pad20" gutter={[0, 0]}>
              {statisticCards}
            </Row>
          </div>
        </Col>
        <Col className="gutter-row w-full" sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 6 }}>
          <CustomerPreviewCard
            isLoading={clientLoading}
            activeCustomer={clientResult?.active}
            newCustomer={clientResult?.new}
          />
        </Col>
      </Row>
      <div className="space30"></div>
      <Row gutter={[32, 32]}>
        <Col className="gutter-row w-full" sm={{ span: 24 }} lg={{ span: 12 }}>
          <div className="whiteBox shadow pad20" style={{ height: '100%' }}>
            <h3 style={{ color: '#22075e', marginBottom: 5, padding: '0 20px 20px' }}>
              {translate('Recent Invoices')}
            </h3>
            <RecentTable entity={'invoice'} dataTableColumns={dataTableColumns} />
          </div>
        </Col>
        <Col className="gutter-row w-full" sm={{ span: 24 }} lg={{ span: 12 }}>
          <div className="whiteBox shadow pad20" style={{ height: '100%' }}>
            <h3 style={{ color: '#22075e', marginBottom: 5, padding: '0 20px 20px' }}>
              {translate('Recent Quotes')}
            </h3>
            <RecentTable entity={'quote'} dataTableColumns={dataTableColumns} />
          </div>
        </Col>
      </Row>
    </>
  );
}
