import { Dropdown, Table } from 'antd';
import { useMemo, useCallback } from 'react';

import { request } from '@/request';
import useFetch from '@/hooks/useFetch';

import { EllipsisOutlined, EyeOutlined, EditOutlined, FilePdfOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { erp } from '@/redux/erp/actions';
import useLanguage from '@/locale/useLanguage';
import { useNavigate } from 'react-router-dom';
import { DOWNLOAD_BASE_URL } from '@/config/serverApiConfig';

export default function RecentTable({ entity, dataTableColumns }) {
  const translate = useLanguage();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Memoize items to prevent unnecessary re-creation
  const items = useMemo(() => [
    {
      label: translate('Show'),
      key: 'read',
      icon: <EyeOutlined />,
    },
    {
      label: translate('Edit'),
      key: 'edit',
      icon: <EditOutlined />,
    },
    {
      label: translate('Download'),
      key: 'download',
      icon: <FilePdfOutlined />,
    },
  ], [translate]);

  // Memoize handlers to prevent unnecessary re-creation
  const handleRead = useCallback((record) => {
    dispatch(erp.currentItem({ data: record }));
    navigate(`/${entity}/read/${record._id}`);
  }, [dispatch, navigate, entity]);

  const handleEdit = useCallback((record) => {
    dispatch(erp.currentAction({ actionType: 'update', data: record }));
    navigate(`/${entity}/update/${record._id}`);
  }, [dispatch, navigate, entity]);

  const handleDownload = useCallback((record) => {
    window.open(`${DOWNLOAD_BASE_URL}${entity}/${entity}-${record._id}.pdf`, '_blank');
  }, [entity]);

  // Memoize table columns to prevent unnecessary re-creation
  const tableColumns = useMemo(() => [
    ...dataTableColumns,
    {
      title: '',
      key: 'action',
      render: (_, record) => (
        <Dropdown
          menu={{
            items,
            onClick: ({ key }) => {
              switch (key) {
                case 'read':
                  handleRead(record);
                  break;
                case 'edit':
                  handleEdit(record);
                  break;
                case 'download':
                  handleDownload(record);
                  break;
                default:
                  break;
              }
            },
          }}
          trigger={['click']}
        >
          <EllipsisOutlined
            style={{ cursor: 'pointer', fontSize: '24px' }}
            onClick={(e) => e.preventDefault()}
          />
        </Dropdown>
      ),
    },
  ], [dataTableColumns, items, handleRead, handleEdit, handleDownload]);

  // Memoize fetch function with limit for better performance
  const asyncList = useCallback(() => {
    return request.list({ 
      entity, 
      options: { 
        items: 5, // Only fetch 5 items for recent table
        page: 1 
      } 
    });
  }, [entity]);

  const { result, isLoading, isSuccess } = useFetch(asyncList);

  // Memoize filtered data
  const tableData = useMemo(() => {
    if (isSuccess && result) {
      return Array.isArray(result) ? result.slice(0, 5) : (result.result || []).slice(0, 5);
    }
    return [];
  }, [isSuccess, result]);

  return (
    <Table
      columns={tableColumns}
      rowKey={(item) => item._id}
      dataSource={tableData}
      pagination={false}
      loading={isLoading}
      scroll={{ x: true }}
      size="small" // Use smaller size for better performance
    />
  );
}
