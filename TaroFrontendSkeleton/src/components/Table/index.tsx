import { View, Text, ScrollView } from '@tarojs/components'
import { ReactNode } from 'react'
import './index.scss'

export interface TableColumn {
  title: string
  key: string
  render?: (value: any, record: any, index: number) => ReactNode
}

export interface TableProps {
  columns: TableColumn[]
  dataSource: any[]
  onRowClick?: (record: any, index: number) => void
  loading?: boolean
}

const Table: React.FC<TableProps> = ({ columns, dataSource, onRowClick, loading = false }) => {
  return (
    <View className='table-container'>
      {loading && (
        <View className='table-loading'>
          <Text>加载中...</Text>
        </View>
      )}
      <View className='table-header'>
        {columns.map((column, index) => (
          <View key={column.key || index} className='table-cell table-header-cell'>
            <Text>{column.title}</Text>
          </View>
        ))}
      </View>
      <ScrollView scrollY className='table-body'>
        {dataSource.length === 0 ? (
          <View className='table-empty'>
            <Text>暂无数据</Text>
          </View>
        ) : (
          dataSource.map((record, rowIndex) => (
            <View
              key={rowIndex}
              className='table-row'
              onClick={() => onRowClick && onRowClick(record, rowIndex)}
            >
              {columns.map((column, colIndex) => (
                <View key={column.key || colIndex} className='table-cell'>
                  {column.render
                    ? column.render(record[column.key], record, rowIndex)
                    : <Text>{record[column.key]}</Text>}
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  )
}

export default Table 